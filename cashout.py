import urllib.request
import urllib.parse
import json
import time

DEBUG_API='http://localhost:1635'

def get(url):
    f = urllib.request.urlopen(url)
    return json.loads(f.read().decode('utf-8'))

def post(url,data):
    f = urllib.request.urlopen(url,data)
    return json.loads(f.read().decode('utf-8'))


def getPeers():
    peers=[]
    result=get(DEBUG_API+'/chequebook/cheque')
    lastcheques=result['lastcheques']
    lastcheques=list(filter(lambda x : x['lastreceived']!=None, lastcheques))
    peers=[x['peer'] for x in lastcheques]
    return peers

def getUncashedAmount(peer):
    cumulativePayout=getCumulativePayout(peer)
    print('cumulativePayout',cumulativePayout)
    if cumulativePayout==0 or cumulativePayout==None:
        return
    cashedPayout=getLastCashedPayout(peer)
    print('cashedPayout',cashedPayout)
    uncashedAmount=cumulativePayout-cashedPayout
    return uncashedAmount

def getLastCashedPayout(peer):
    result=get(DEBUG_API+"/chequebook/cashout/"+peer)
    return result['cumulativePayout']

def getCumulativePayout(peer):
    result=get(DEBUG_API+"/chequebook/cheque/"+peer)
    return result['lastreceived']['payout']


def cashout(peer):
    txHash=post(DEBUG_API+"/chequebook/cashout/"+peer) 
    txHash=txHash['transactionHash']
    print('cashing out cheque for '+peer+' in transaction '+txHash)
    result=get(DEBUG_API+"/chequebook/cashout/"+peer)
    result=result['result']
    while result ==None:
        time.sleep(5)
        result=get(DEBUG_API+"/chequebook/cashout/"+peer)
        result=result['result']
    
def cashoutAll():
    peerlist=getPeers()
    for p in peerlist:
        uncashedAmount=getUncashedAmount(p)
        print(p,uncashedAmount)
        if uncashedAmount > 5000:
            cashout(p)


cashoutAll()
# cashout('2e375b65ddff2ae0823d76b073d0b6af8075a36ba35397115bf522bdfc90c618')
#   curl -s "$DEBUG_API/chequebook/cheque" | jq -r '.lastcheques | .[].peer'
