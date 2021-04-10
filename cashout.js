var Client = require('ssh2').Client;
let vpss = [
    ['104.238.181.215', '*#Forke110'],
    ['104.207.149.81', '*#Forke110'],
    ['140.82.49.69', '*#Forke110'],
    ['140.82.51.69', '*#Forke110'],
    ['144.202.111.164', '*#Forke110'],
    ['148.251.228.83', '*#Forke110'],
    ['148.251.228.84', '*#Forke110'],
    ['148.251.228.87', '*#Forke110'],
    ['148.251.228.88', '*#Forke110'],
]
runCash(vpss[0][0],vpss[0][1]);
function runCash(ip,pass){
    var conn = new Client();
    conn.on('ready', function() {
      console.log('Client :: ready');
      conn.exec('apt install -y jq;wget -O cashout.sh https://gist.githubusercontent.com/simon4546/398ec60171eaf15017e31ca1f16e1a28/raw/3d20be4f50617507703600447c4d3c55d400a37a/cash.sh; chmod a+x cashout.sh;./cashout.sh cashout-all', function(err, stream) {
        if (err) throw err;
        stream.on('close', function(code, signal) {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
        }).on('data', function(data) {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
        });
      });
    }).connect({
      host: ip,
      port: 22,
      username: 'root',
      password: pass
    });
}
