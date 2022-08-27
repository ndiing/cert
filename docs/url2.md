## URL2()

### Syntax
```
URL2(url,base)
```

### Parameters
<dl>
    <dt><code>url</code></dt>
    <dt><code>base</code></dt>
</dl>

### Return value

<dl>
    <dt>None <code>undefined</code></dt>
</dl>

### Examples
```js
// Usage// Parse URLvar url = new URL2('https://www.google.com/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url')// console.log(url)// URL2 {//     href: 'https://www.google.com/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url',//     protocol: 'https:',//     scheme: 'https',//     authority: '//www.google.com',//     host: 'www.google.com',//     pathname: '/search',//     search: '?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8',//     query: 'q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8',//     hash: '#new+url',//     fragment: 'new+url',//     hostname: 'www.google.com',//     port: 443,//     origin: 'https://www.google.com',//     searchParams: URLSearchParams2 {//         q: 'new+url',//         oq: 'new+URL',//         aqs: 'chrome.0.69i59j0i512l9.1448j0j4',//         sourceid: 'chrome',//         ie: 'UTF-8'//     },//     path: '/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url'// }// Without origin, fallback to localvar url = new URL2('/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url')// console.log(url)// URL2 {//     href: 'http://localhost/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url',//     protocol: 'http:',//     scheme: 'http',//     authority: '//localhost',//     host: 'localhost',//     pathname: '/search',//     search: '?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8',//     query: 'q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8',//     hash: '#new+url',//     fragment: 'new+url',//     hostname: 'localhost',//     port: 80,//     origin: 'http://localhost',//     searchParams: URLSearchParams2 {//         q: 'new+url',//         oq: 'new+URL',//         aqs: 'chrome.0.69i59j0i512l9.1448j0j4',//         sourceid: 'chrome',//         ie: 'UTF-8'//     },//     path: '/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url'// }
```


### See also
- [[Uniform Resource Identifier (URI): Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986)]([Uniform Resource Identifier (URI): Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986))

