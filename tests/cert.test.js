const { generateCertsForHostname, generateRootCA } = require("../src/cert")

describe('cert',() => {
    test('test', () => {
        const root = generateRootCA()
        // console.log(root)

        const host = generateCertsForHostname('localhost',{
            cert:root.certificate,
            key:root.privateKey,
        })
        // console.log(host)
    })
})