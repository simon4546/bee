# -*- coding: utf-8 -*-
#!/usr/bin/python
import paramiko
import threading
import sys


def ssh2(ip, username, passwd, cmd):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, 22, username, passwd, timeout=300)
        for m in cmd:
            stdin, stdout, stderr = ssh.exec_command(m)
            err_list = stderr.readlines()
            # if len(err_list) > 0:
            #     print('ERROR:' + err_list[0])
            #     exit()
#           stdin.write("Y")   #简单交互，输入 ‘Y’
            out = stdout.readlines()
            # 屏幕输出
            for o in out:
                print(o)
        print('%s %s\tOK\n' % (ip, out))
        ssh.close()
    except:
        print('%s\tError\n' % (ip))


if __name__ == '__main__':
    command = sys.argv[1]
    vpss = [
        ['104.207.149.81', '*#Forke110'],
        ['104.238.181.215', '*#Forke110'],
        ['140.82.49.69', '*#Forke110'],
        ['140.82.51.69', '*#Forke110'],
        ['144.202.111.164', '*#Forke110'],
        ['148.251.228.83', '*#Forke110'],
        ['148.251.228.84', '*#Forke110'],
        ['148.251.228.87', '*#Forke110'],
        ['148.251.228.88', '*#Forke110'],
       
    ]

    cmd = [
        'apt install -y jq',
        'wget -O cashout.sh https://gist.githubusercontent.com/simon4546/398ec60171eaf15017e31ca1f16e1a28/raw/3d20be4f50617507703600447c4d3c55d400a37a/cash.sh',
        'chmod a+x cashout.sh',
        './cashout.sh cashout-all'
    ]

    print("Begin......")
    for vps in vpss:
        username = 'root'
        passwd = vps[1]
        a = threading.Thread(target=ssh2, args=(
            vps[0], username, passwd, cmd))
        a.start()


##stdin, stdout, stderr = ssh.exec_command('sudo -S %s\n' % cmd )
##stdin.write('%s\r\n' % password)
# stdin.flush()
# print "------------------------"
# print stdout.readlines()
# print stderr.read()
