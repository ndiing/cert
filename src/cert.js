const forge = require("node-forge");

let defaultAttrs = [
    { name: "countryName", value: "US" },
    { shortName: "ST", value: "California" },
    { name: "organizationName", value: "My Company Inc" },
    { shortName: "OU", value: "Engineering" },
];

function isIpDomain(domain = "") {
    const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;
    return ipReg.test(domain);
}

function getExtensionSAN(domain = "") {
    const isIp = isIpDomain(domain);
    if (isIp) {
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
    
    const now = Date.now();
    
    cert.validity.notBefore = new Date(now - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now + 824 * 24 * 60 * 60 * 1000);
    
    return { keys, cert };
}

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

module.exports = { generateRootCA, generateCertsForHostname };
