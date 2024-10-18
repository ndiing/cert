<a name="module_cert"></a>

## cert

* [cert](#module_cert)
    * [.defaultAttrs](#module_cert.defaultAttrs) : <code>Array.&lt;Object&gt;</code>
    * [.getExtensionSAN(domain)](#module_cert.getExtensionSAN) ⇒ <code>Object</code>
    * [.getKeysAndCert([serialNumber])](#module_cert.getKeysAndCert) ⇒ <code>Object</code>
    * [.generateRootCA([commonName])](#module_cert.generateRootCA) ⇒ <code>Object</code>
    * [.generateCertsForHostname(domain, rootCAConfig)](#module_cert.generateCertsForHostname) ⇒ <code>Object</code>
    * [.setDefaultAttrs(attrs)](#module_cert.setDefaultAttrs)
    * [.getCertsForHostname(domain)](#module_cert.getCertsForHostname) ⇒ <code>Object</code>

<a name="module_cert.defaultAttrs"></a>

### cert.defaultAttrs : <code>Array.&lt;Object&gt;</code>
Atribut default yang digunakan untuk sertifikat.

**Kind**: static property of [<code>cert</code>](#module_cert)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nama atribut. |
| value | <code>string</code> | Nilai atribut. |
| [shortName] | <code>string</code> | Nama pendek atribut (opsional). |

<a name="module_cert.getExtensionSAN"></a>

### cert.getExtensionSAN(domain) ⇒ <code>Object</code>
Mengambil ekstensi Subject Alternative Name (SAN) berdasarkan domain.

**Kind**: static method of [<code>cert</code>](#module_cert)  
**Returns**: <code>Object</code> - - Objek yang berisi nama dan alternatif nama.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | Domain yang akan digunakan. |

<a name="module_cert.getKeysAndCert"></a>

### cert.getKeysAndCert([serialNumber]) ⇒ <code>Object</code>
Menghasilkan pasangan kunci dan sertifikat.

**Kind**: static method of [<code>cert</code>](#module_cert)  
**Returns**: <code>Object</code> - - Objek yang berisi kunci dan sertifikat.  

| Param | Type | Description |
| --- | --- | --- |
| [serialNumber] | <code>string</code> | Nomor seri untuk sertifikat. |

<a name="module_cert.generateRootCA"></a>

### cert.generateRootCA([commonName]) ⇒ <code>Object</code>
Menghasilkan Root Certificate Authority (CA).

**Kind**: static method of [<code>cert</code>](#module_cert)  
**Returns**: <code>Object</code> - - Objek yang berisi kunci privat, kunci publik, dan sertifikat.  

| Param | Type | Description |
| --- | --- | --- |
| [commonName] | <code>string</code> | Nama umum untuk sertifikat. |

<a name="module_cert.generateCertsForHostname"></a>

### cert.generateCertsForHostname(domain, rootCAConfig) ⇒ <code>Object</code>
Menghasilkan sertifikat untuk hostname tertentu.

**Kind**: static method of [<code>cert</code>](#module_cert)  
**Returns**: <code>Object</code> - - Objek yang berisi kunci privat, kunci publik, dan sertifikat.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | Nama domain untuk sertifikat. |
| rootCAConfig | <code>Object</code> | Konfigurasi Root CA. |

<a name="module_cert.setDefaultAttrs"></a>

### cert.setDefaultAttrs(attrs)
Mengatur atribut default.

**Kind**: static method of [<code>cert</code>](#module_cert)  

| Param | Type | Description |
| --- | --- | --- |
| attrs | <code>Array.&lt;Object&gt;</code> | Array atribut yang ingin disetel sebagai default. |

<a name="module_cert.getCertsForHostname"></a>

### cert.getCertsForHostname(domain) ⇒ <code>Object</code>
Mengambil sertifikat untuk hostname tertentu.

**Kind**: static method of [<code>cert</code>](#module_cert)  
**Returns**: <code>Object</code> - - Objek yang berisi kunci privat dan sertifikat.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | Nama domain untuk sertifikat. |

