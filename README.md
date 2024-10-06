## Functions

<dl>
<dt><a href="#generateRootCA">generateRootCA([commonName])</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan sertifikat Certificate Authority (CA) root.</p>
</dd>
<dt><a href="#generateCertsForHostname">generateCertsForHostname(domain, rootCAConfig)</a> ⇒ <code>Object</code></dt>
<dd><p>Menghasilkan sertifikat untuk hostname yang ditentukan menggunakan konfigurasi CA root.</p>
</dd>
</dl>

<a name="generateRootCA"></a>

## generateRootCA([commonName]) ⇒ <code>Object</code>
Menghasilkan sertifikat Certificate Authority (CA) root.

**Kind**: global function  
**Returns**: <code>Object</code> - Objek yang berisi kunci privat, kunci publik, dan sertifikat dalam format PEM.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [commonName] | <code>string</code> | <code>&quot;\&quot;CertManager\&quot;&quot;</code> | Nama umum untuk sertifikat CA. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Kunci privat CA dalam format PEM. |
| publicKey | <code>string</code> | Kunci publik CA dalam format PEM. |
| certificate | <code>string</code> | Sertifikat CA dalam format PEM. |

<a name="generateCertsForHostname"></a>

## generateCertsForHostname(domain, rootCAConfig) ⇒ <code>Object</code>
Menghasilkan sertifikat untuk hostname yang ditentukan menggunakan konfigurasi CA root.

**Kind**: global function  
**Returns**: <code>Object</code> - Objek yang berisi kunci privat, kunci publik, dan sertifikat dalam format PEM.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | Nama domain untuk sertifikat yang dihasilkan. |
| rootCAConfig | <code>Object</code> | Objek konfigurasi untuk CA root. |
| rootCAConfig.cert | <code>string</code> | Sertifikat CA dalam format PEM. |
| rootCAConfig.key | <code>string</code> | Kunci privat CA dalam format PEM. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Kunci privat sertifikat domain dalam format PEM. |
| publicKey | <code>string</code> | Kunci publik sertifikat domain dalam format PEM. |
| certificate | <code>string</code> | Sertifikat domain dalam format PEM. |

