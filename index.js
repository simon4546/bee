const express = require('express');
let cashUtil = require("./cash")
const webapp = express()
const port = 3000
webapp.use(express.json()) // for parsing application/json
webapp.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

webapp.use(express.static('static'))
webapp.get('/hosts', (req, res) => {
    let hosts = require("./hosts")
    let _hosts = hosts.map((item, idx) => {
        return { "id": idx + 1, host: item }
    })
    let result = { "code": 0, "msg": "", "count": hosts.length, "data": _hosts }
    res.json(result)
})
webapp.get('/address', (req, res) => {
    let host = req.body.host;
    cashUtil.getAddress(host).then((data) => {
        res.json(data.length)
    }).catch((ex) => {
        res.status(503).end()
    })
})
webapp.post('/chequebook', (req, res) => {
    let host = req.body.host;
    cashUtil.getPeers(host).then((data) => {
        res.json(data.length)
    }).catch((ex) => {
        res.status(503).end()
    })
})
webapp.post('/find', (req, res) => {
    let host = req.body.host;
    cashUtil.getPeers(host).then((data) => {
        res.json(data.length)
    }).catch((ex) => {
        res.status(503).end()
    })
})
webapp.post('/check', (req, res) => {
    let host = req.body.host;
    cashUtil.cashoutOne(host).then((data) => {
        res.json(data)
    }).catch((ex) => {
        res.status(503).end()
    })
})

webapp.post('/check',async (req, res) => {
    let hosts = require("./hosts");
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let address=await cashUtil.getAddress(element)
        console.log(element,address)
    }
})


webapp.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})