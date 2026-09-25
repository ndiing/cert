# @ndiinginc/cert

Utility ringan untuk generate Root CA dan sertifikat SSL/TLS per-hostname secara dinamis, dibangun di atas [`node-forge`](https://github.com/digitalbazaar/forge). Cocok untuk kebutuhan MITM proxy, dev server HTTPS lokal, atau tooling yang butuh generate sertifikat on-the-fly.

## Instalasi

```bash
npm install @ndiinginc/cert
```

## Fitur

- Generate Root CA (self-signed) lengkap dengan private key, public key, dan sertifikat dalam format PEM.
- Generate sertifikat leaf untuk suatu hostname/domain, ditandatangani oleh Root CA.
- Deteksi otomatis apakah target berupa IP address atau domain name, lalu set `subjectAltName` (SAN) yang sesuai (`type: 7` untuk IP, `type: 2` untuk DNS name).
- Serial number sertifikat leaf dihasilkan secara deterministik dari MD5 hash domain, sehingga sertifikat untuk domain yang sama konsisten.
- Masa berlaku sertifikat: `notBefore` mundur 1 hari dari sekarang, `notAfter` maju 824 hari (sesuai batas maksimum umum browser modern).

## Penggunaan

### 1. Generate Root CA

```js
const { generateRootCA } = require("@ndiinginc/cert");

const rootCA = generateRootCA("My Root CA");
// rootCA.privateKey  -> PEM string
// rootCA.publicKey   -> PEM string
// rootCA.certificate -> PEM string
```

Root CA ini perlu di-*install/trust* di sistem/browser client agar sertifikat leaf yang ditandatangani olehnya dianggap valid.

### 2. Generate sertifikat untuk hostname

```js
const { generateCertsForHostname } = require("@ndiinginc/cert");

const rootCA = generateRootCA("My Root CA");

const leafCert = generateCertsForHostname("example.com", {
    cert: rootCA.certificate,
    key: rootCA.privateKey,
});

// leafCert.privateKey  -> PEM string
// leafCert.publicKey   -> PEM string
// leafCert.certificate -> PEM string
```

Fungsi ini juga menerima IP address sebagai target:

```js
const leafCert = generateCertsForHostname("192.168.1.10", {
    cert: rootCA.certificate,
    key: rootCA.privateKey,
});
```

### 3. Contoh pemakaian dengan HTTPS server

```js
const https = require("https");
const { generateRootCA, generateCertsForHostname } = require("@ndiinginc/cert");

const rootCA = generateRootCA();
const { privateKey, certificate } = generateCertsForHostname("localhost", {
    cert: rootCA.certificate,
    key: rootCA.privateKey,
});

https.createServer({ key: privateKey, cert: certificate }, (req, res) => {
    res.end("Hello over HTTPS");
}).listen(443);
```

## API

### `generateRootCA(commonName?: string)`

Membuat sertifikat Root CA self-signed.

| Parameter     | Tipe   | Default        | Keterangan                     |
|---------------|--------|----------------|---------------------------------|
| `commonName`  | string | `"CertManager"`| Common Name (CN) untuk Root CA |

**Return** `{ privateKey, publicKey, certificate }` — semua dalam format PEM string.

### `generateCertsForHostname(domain: string, rootCAConfig: { cert: string, key: string })`

Membuat sertifikat leaf untuk sebuah domain atau IP, ditandatangani oleh Root CA yang diberikan.

| Parameter           | Tipe   | Keterangan                                  |
|---------------------|--------|----------------------------------------------|
| `domain`            | string | Hostname atau IP address                     |
| `rootCAConfig.cert` | string | Sertifikat Root CA (PEM)                      |
| `rootCAConfig.key`  | string | Private key Root CA (PEM)                     |

**Return** `{ privateKey, publicKey, certificate }` — semua dalam format PEM string.

## Detail Subject

Sertifikat yang dihasilkan (baik Root CA maupun leaf) menggunakan atribut subject default berikut, ditambah `commonName` sesuai parameter:

```js
[
  { name: "countryName", value: "US" },
  { shortName: "ST", value: "California" },
  { name: "organizationName", value: "My Company Inc" },
  { shortName: "OU", value: "Engineering" },
]
```

Sesuaikan nilai-nilai ini di source jika dibutuhkan branding/identitas organisasi yang berbeda.

## Dependencies

- [`node-forge`](https://www.npmjs.com/package/node-forge)

## Lisensi

MIT
