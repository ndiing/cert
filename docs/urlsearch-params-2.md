## URLSearchParams2()

### Syntax
```
URLSearchParams2(init)
```

### Parameters
<dl>
    <dt><code>init</code></dt>
</dl>

### Return value

<dl>
    <dt>None <code>undefined</code></dt>
</dl>

### Examples
```js
// Usage// Normal usevar searchParams=new URLSearchParams2('q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8')// console.log(searchParams)// URLSearchParams2 {//     q: 'new+url',//     oq: 'new+URL',//     aqs: 'chrome.0.69i59j0i512l9.1448j0j4',//     sourceid: 'chrome',//     ie: 'UTF-8'// }// Parse from URLvar searchParams=new URLSearchParams2('https://www.google.com/search?q=new+url&oq=new+URL&aqs=chrome.0.69i59j0i512l9.1448j0j4&sourceid=chrome&ie=UTF-8#new+url')// console.log(searchParams)// URLSearchParams2 {//     q: 'new+url',//     oq: 'new+URL',//     aqs: 'chrome.0.69i59j0i512l9.1448j0j4',//     sourceid: 'chrome',//     ie: 'UTF-8'// }// result are the same
```



