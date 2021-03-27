const axios = require('axios');
const axiosRetry = require('axios-retry');
var Promise = require("bluebird");
axios.defaults.timeout = 5000;
const fs = require('fs');
let rawdata = fs.readFileSync('hosts.json');
let urls = JSON.parse(rawdata);
// let urls = require("./hosts")

axiosRetry(axios, {
    retries: 3, // number of retries
    shouldResetTimeout:true,
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`);
      return retryCount * 1000; // time interval between retries
    },
    retryCondition: (error) => {
      // if retry condition is not specified, by default idempotent requests are retried
      return !error.response || error.response.status === 503;
    },
  });

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

async function getPeers(url) {
    try {
        response = await axios.get(`${url}/chequebook/cheque`)
        // console.log(response.data)
        let peers = response.data.lastcheques.map((item, idx) => {
            return item.peer
        })
        return peers
    } catch (ex) {
        console.error(ex)
    }
}

async function getAddress(url) {
    try {
        response = await axios.get(`${url}/addresses`)
        return response.data.ethereum
    } catch (ex) {
        console.log(ex);
        return ex
    }
}
async function getCumulativePayout(url, peer) {
    try {
        response = await axios.get(`${url}/chequebook/cheque/${peer}`)
        // console.log(response.data)
        if (!response.data.lastreceived) return 0;
        let peerspayed = response.data.lastreceived.payout || 0
        return peerspayed
    } catch (ex) {
        console.log(ex)
        return 0
    }
}
async function getLastCashedPayout(url, peer) {
    try {
        response = await axios.get(`${url}/chequebook/cashout/${peer}`)
        // console.log('asdfasdf', response.data)
        // console.log(response.data.cumulativePayout)
        if (!response.data.cumulativePayout) return 0;
        let peerspayed = response.data.cumulativePayout || 0
        return peerspayed
    } catch (ex) {
        // console.log(`${url}/chequebook/cashout/${peer}`, ex)
        return 0
    }
}

async function cashout(url, peer) {
    try {
        // console.log(`${url}/chequebook/cashout/${peer}`)
        response = await axios.post(`${url}/chequebook/cashout/${peer}`)
        if (!response.data.transactionHash) return 0;
        let peerspayed = response.data.transactionHash || 0
        return peerspayed
    } catch (ex) {
        // console.log(ex)
        return 0
    }
}
async function cashoutOne(url){
    let jsonresult={};
    let peers = await getPeers(url);
    jsonresult.peers=peers
    let total = await Promise.map(peers, async function (item, idx) {
        let value = await getCumulativePayout(url, item)
        return value
    });
    let payed = await Promise.map(peers, async function (item, idx) {
        let value = await getLastCashedPayout(url, item)
        return value
    });
    let needtoPay = total.map(function (item, index) {
        return item - payed[index];
    })
    let needtoPayCount = needtoPay.filter((item, idx) => {
        return item >0
    })
    let allinone = needtoPay.reduce((total, num) => {
        return total + num;
    });
    console.log("resultcheque::url:", url, 'chequ count', needtoPayCount.length, "total:", allinone / 10000000000000000);
    let result = peers.map(function (item, idx) {
        if (needtoPay[idx] > 0) {
            return [item, needtoPay[idx]]
        }
    })
    result = result.filter((item, idx) => {
        return item != undefined
    })
    // console.log(peers = total, payed, needtoPay)
    // console.log(result)
    if (result.length < 1) {
        console.log("no cheque need to cash")
        return jsonresult
    }
    jsonresult.hash=[]
    for (let index1 = 0; index1 < result.length; index1++) {
        const item = result[index1];
        console.log(`do ${item[0]}`);
        let hash = await cashout(url, item[0])
        console.log(`hash ${hash}`);
        jsonresult.hash.push(hash)
    }

    return jsonresult
}
async function cashoutall() {
    for (let index = 0; index < urls.length; index++) {
        await sleep(200);
        const url = urls[index][0];
        let peers = await getPeers(url)
        let total = await Promise.map(peers, async function (item, idx) {
            let value = await getCumulativePayout(url, item)
            return value
        });
        let payed = await Promise.map(peers, async function (item, idx) {
            let value = await getLastCashedPayout(url, item)
            return value
        });
        let needtoPay = total.map(function (item, index) {
            return item - payed[index];
        })
        let needtoPayCount = needtoPay.filter((item, idx) => {
            return item >0
        })
        let allinone = needtoPay.reduce((total, num) => {
            return total + num;
        });
        console.log("resultcheque::url:", url, 'chequ count', needtoPayCount.length, "total:", allinone / 10000000000000000);
        let result = peers.map(function (item, idx) {
            if (needtoPay[idx] > 0) {
                return [item, needtoPay[idx]]
            }
        })
        result = result.filter((item, idx) => {
            return item != undefined
        })
        // console.log(peers = total, payed, needtoPay)
        // console.log(result)
        if (result.length < 1) {
            console.log("no cheque need to cash")
            continue
        }
        for (let index1 = 0; index1 < result.length; index1++) {
            const item = result[index1];
            console.log(`do ${item[0]}`);
            let hash = await cashout(url, item[0])
            console.log(`hash ${hash}`);
        }
        
    }
}

async function address() {
    for (let index = 0; index < urls.length; index++) {
        const url = urls[index][0];
        let address = await getAddress(url);
        if (Object.prototype.toString.call(address) != '[object Error]') {
            console.log(url, address)
        } else {
            console.log(url, 'error')
        }
        await sleep(200);
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports={
    cashoutOne:cashoutOne,
    getPeers:getPeers,
    getAddress:getAddress
}
// (async function () {
//     // await address();
//     await cashoutall();
// })();