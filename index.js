const forge = require("node-forge");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const Util = {
    isIpDomain: function (domain = "") {
        const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;
        return ipReg.test(domain);
    },
};

/**
 * @module cert
 */

/**
 * Atribut default yang digunakan untuk sertifikat.
 * @memberof module:cert
 * @type {Array<Object>}
 * @property {string} name - Nama atribut.
 * @property {string} value - Nilai atribut.
 * @property {string} [shortName] - Nama pendek atribut (opsional).
 */
let defaultAttrs = [
    { name: "countryName", value: "ID" },
    { name: "organizationName", value: "Ndiing" },
    { shortName: "ST", value: "JT" },
    { shortName: "OU", value: "Ndiing" },
];

/**
 * Mengambil ekstensi Subject Alternative Name (SAN) berdasarkan domain.
 * @memberof module:cert
 * @param {string} domain - Domain yang akan digunakan.
 * @returns {Object} - Objek yang berisi nama dan alternatif nama.
 */
function getExtensionSAN(domain = "") {
    const isIpDomain = Util.isIpDomain(domain);
    if (isIpDomain) {
        return {
            name: "subjectAltName",
            altNames: [{ type: 7, ip: domain }],
        };
    } else {
        return {
            name: "subjectAltName",
            altNames: [{ type: 2, value: domain }],
        };
    }
}

/**
 * Menghasilkan pasangan kunci dan sertifikat.
 * @memberof module:cert
 * @param {string} [serialNumber] - Nomor seri untuk sertifikat.
 * @returns {Object} - Objek yang berisi kunci dan sertifikat.
 */
function getKeysAndCert(serialNumber) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = serialNumber || Math.floor(Math.random() * 100000) + "";

    var now = Date.now();
    cert.validity.notBefore = new Date(now - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now + 824 * 24 * 60 * 60 * 1000);

    return {
        keys,
        cert,
    };
}

/**
 * Menghasilkan Root Certificate Authority (CA).
 * @memberof module:cert
 * @param {string} [commonName] - Nama umum untuk sertifikat.
 * @returns {Object} - Objek yang berisi kunci privat, kunci publik, dan sertifikat.
 */
function generateRootCA(commonName) {
    const keysAndCert = getKeysAndCert();

    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;

    commonName = commonName || "CertManager";
    const attrs = defaultAttrs.concat([{ name: "commonName", value: commonName }]);

    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{ name: "basicConstraints", cA: true }]);
    cert.sign(keys.privateKey, forge.md.sha256.create());

    return {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert),
    };
}

/**
 * Menghasilkan sertifikat untuk hostname tertentu.
 * @memberof module:cert
 * @param {string} domain - Nama domain untuk sertifikat.
 * @param {Object} rootCAConfig - Konfigurasi Root CA.
 * @returns {Object} - Objek yang berisi kunci privat, kunci publik, dan sertifikat.
 */
function generateCertsForHostname(domain, rootCAConfig) {
    const md = forge.md.md5.create();
    md.update(domain);

    const keysAndCert = getKeysAndCert(md.digest().toHex());

    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;

    const caCert = forge.pki.certificateFromPem(rootCAConfig.cert);
    const caKey = forge.pki.privateKeyFromPem(rootCAConfig.key);

    cert.setIssuer(caCert.subject.attributes);

    const attrs = defaultAttrs.concat([{ name: "commonName", value: domain }]);
    const extensions = [{ name: "basicConstraints", cA: false }, getExtensionSAN(domain)];

    cert.setSubject(attrs);
    cert.setExtensions(extensions);
    cert.sign(caKey, forge.md.sha256.create());

    return {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert),
    };
}

/**
 * Mengatur atribut default.
 * @memberof module:cert
 * @param {Array<Object>} attrs - Array atribut yang ingin disetel sebagai default.
 */
function setDefaultAttrs(attrs) {
    defaultAttrs = attrs;
}

/**
 * Mengambil sertifikat untuk hostname tertentu.
 * @memberof module:cert
 * @param {string} domain - Nama domain untuk sertifikat.
 * @returns {Object} - Objek yang berisi kunci privat dan sertifikat.
 */
function getCertsForHostname(domain) {
    let key, cert;

    const dirname = path.join(process.cwd());

    try {
        key = fs.readFileSync(path.join(dirname, "host.key"));
        cert = fs.readFileSync(path.join(dirname, "host.crt"));
    } catch (error) {
        const root = generateRootCA();

        fs.writeFileSync(path.join(dirname, "root.key"), root.privateKey);
        fs.writeFileSync(path.join(dirname, "root.crt"), root.certificate);

        execSync(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c cd ${dirname} && certutil -enterprise -addstore -f root ${path.join(dirname, "root.crt")}'"`, { shell: true });

        const host = generateCertsForHostname(domain, {
            key: root.privateKey,
            cert: root.certificate,
        });

        key = host.privateKey;
        cert = host.certificate;

        fs.writeFileSync(path.join(dirname, "host.key"), key);
        fs.writeFileSync(path.join(dirname, "host.crt"), cert);
    }

    return { key, cert };
}

module.exports = {
    setDefaultAttrs,
    getExtensionSAN,
    getKeysAndCert,
    generateRootCA,
    generateCertsForHostname,
    getCertsForHostname,
};

// console.log(getCertsForHostname('localhost'))
