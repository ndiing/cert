const forge = require("node-forge");

const Util = {
    isIpDomain: function (domain = "") {
        const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;
        return ipReg.test(domain);
    },
};

let defaultAttrs = [
    { name: "countryName", value: "ID" },
    { name: "organizationName", value: "Ndiing" },
    { shortName: "ST", value: "JT" },
    { shortName: "OU", value: "Ndiing" },
];

function getExtensionSAN(domain = "") {
    const isIpDomain = Util.isIpDomain(domain);
    if (isIpDomain) {
        return { name: "subjectAltName", altNames: [{ type: 7, ip: domain }] };
    } else {
        return { name: "subjectAltName", altNames: [{ type: 2, value: domain }] };
    }
}

function getKeysAndCert(serialNumber) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = serialNumber || Math.floor(Math.random() * 100000) + "";
    var now = Date.now();
    cert.validity.notBefore = new Date(now - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now + 824 * 24 * 60 * 60 * 1000);
    return { keys, cert };
}

/**
 * Menghasilkan sertifikat Certificate Authority (CA) root.
 *
 * @param {string} [commonName="CertManager"] - Nama umum untuk sertifikat CA.
 * @returns {Object} Objek yang berisi kunci privat, kunci publik, dan sertifikat dalam format PEM.
 * @property {string} privateKey - Kunci privat CA dalam format PEM.
 * @property {string} publicKey - Kunci publik CA dalam format PEM.
 * @property {string} certificate - Sertifikat CA dalam format PEM.
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
    return { privateKey: forge.pki.privateKeyToPem(keys.privateKey), publicKey: forge.pki.publicKeyToPem(keys.publicKey), certificate: forge.pki.certificateToPem(cert) };
}

/**
 * Menghasilkan sertifikat untuk hostname yang ditentukan menggunakan konfigurasi CA root.
 *
 * @param {string} domain - Nama domain untuk sertifikat yang dihasilkan.
 * @param {Object} rootCAConfig - Objek konfigurasi untuk CA root.
 * @param {string} rootCAConfig.cert - Sertifikat CA dalam format PEM.
 * @param {string} rootCAConfig.key - Kunci privat CA dalam format PEM.
 * @returns {Object} Objek yang berisi kunci privat, kunci publik, dan sertifikat dalam format PEM.
 * @property {string} privateKey - Kunci privat sertifikat domain dalam format PEM.
 * @property {string} publicKey - Kunci publik sertifikat domain dalam format PEM.
 * @property {string} certificate - Sertifikat domain dalam format PEM.
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
    return { privateKey: forge.pki.privateKeyToPem(keys.privateKey), publicKey: forge.pki.publicKeyToPem(keys.publicKey), certificate: forge.pki.certificateToPem(cert) };
}

function setDefaultAttrs(attrs) {
    defaultAttrs = attrs;
}

module.exports = { getExtensionSAN, getKeysAndCert, generateRootCA, generateCertsForHostname, setDefaultAttrs };

// {
//     const root = generateRootCA()
//     const host = generateCertsForHostname('localhost',{
//         key:root.privateKey,
//         cert:root.certificate
//     })
//     console.log(root)
//     console.log(host)
// }
