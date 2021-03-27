const express = require('express');
let cashUtil = require("./cash");
const fs = require('fs');
var async = require("async");
var compression = require('compression')

const webapp = express()
const port = 3000
webapp.use(compression());
webapp.use(express.json()) // for parsing application/json
webapp.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

webapp.use(express.static('static'))
webapp.get('/hosts', (req, res) => {
    // let hosts = require("./hosts")
    console.log("拉取列表")
    let rawdata = fs.readFileSync('hosts.json');
    let hosts = JSON.parse(rawdata);
    let _hosts = hosts.map((item, idx) => {
        return { "id": idx + 1, host: item[0],addr:item[1] }
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
    console.log(`查询节点${host}`)
    cashUtil.getPeers(host).then((data) => {
        res.json(data.length)
    }).catch((ex) => {
        res.status(503).end()
    })
})
webapp.post('/check', (req, res) => {
    let host = req.body.host;
    console.log(`兑换支票${host}`);
    cashUtil.cashoutOne(host).then((data) => {
        res.json(data)
    }).catch((ex) => {
        res.status(503).end()
    })
})

// webapp.post('/address', async (req, res) => {
//     let hosts = require("./hosts");
//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
//         let address = await cashUtil.getAddress(element)
//         console.log(element, address)
//     }
// });

// (async () => {
//     let hosts = require("./hosts");
//     async.eachLimit(hosts, 5,async function (item) {
//         let address = await cashUtil.getAddress(item)
//         var res=[]
//         if (Object.prototype.toString.call(address)=="[object Error]") {
//             res=[item, 'error']
//         }else{
//             res=[item, address]
//         }
//         console.log(res)
//         return res
//     }, function (err,results) {
//         if (err) {
//             console.log('A file failed to process');
//         } else {
//             console.log('All files have been processed successfully');
//         }
//         console.log(results)
//     });

//     // for (let index = 0; index < hosts.length; index++) {
//     //     const element = hosts[index];
//     //     let address = await cashUtil.getAddress(element)
//     //     if (Object.prototype.toString.call(address)=="[object Error]") {
//     //         console.log(element, 'error')
//     //     }else{
//     //         console.log(element, address)
//     //     }
        
//     // }
// })()

webapp.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})