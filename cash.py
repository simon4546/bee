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
            if len(err_list) > 0:
                print('ERROR:' + err_list[0])
                exit()
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
        ['149.28.213.186', '*#Forke110'],
        ['149.28.223.65', '*#Forke110'],
        ['168.119.82.33', '*#Forke110'],
        ['168.119.82.34', '*#Forke110'],
        ['168.119.82.35', '*#Forke110'],
        ['176.9.230.97', '*#Forke110'],
        ['178.63.203.145', '*#Forke110'],
        ['178.63.203.146', '*#Forke110'],
        ['178.63.230.178', '*#Forke110'],
        ['178.63.230.182', '*#Forke110'],
        ['192.151.224.130', '*#Forke110'],
        ['192.151.224.131', '*#Forke110'],
        ['192.151.224.132', '*#Forke110'],
        ['192.151.224.133', '*#Forke110'],
        ['192.151.224.134', '*#Forke110'],
        ['192.151.224.135', '*#Forke110'],
        ['192.151.224.136', '*#Forke110'],
        ['192.151.224.137', '*#Forke110'],
        ['192.151.224.138', '*#Forke110'],
        ['192.151.224.139', '*#Forke110'],
        ['192.151.224.140', '*#Forke110'],
        ['192.151.224.141', '*#Forke110'],
        ['192.151.224.142', '*#Forke110'],
        ['192.151.224.143', '*#Forke110'],
        ['192.151.224.144', '*#Forke110'],
        ['192.151.224.145', '*#Forke110'],
        ['192.151.224.146', '*#Forke110'],
        ['192.151.224.147', '*#Forke110'],
        ['192.151.224.148', '*#Forke110'],
        ['192.151.224.149', '*#Forke110'],
        ['192.151.224.150', '*#Forke110'],
        ['192.151.224.151', '*#Forke110'],
        ['192.151.224.152', '*#Forke110'],
        ['192.151.224.153', '*#Forke110'],
        ['192.151.224.154', '*#Forke110'],
        ['192.151.224.155', '*#Forke110'],
        ['192.151.224.156', '*#Forke110'],
        ['192.151.224.157', '*#Forke110'],
        ['192.151.224.158', '*#Forke110'],
        ['192.151.224.159', '*#Forke110'],
        ['45.32.133.69', '*#Forke110'],
        ['45.32.138.72', '*#Forke110'],
        ['45.32.140.34', '*#Forke110'],
        ['45.63.94.8', '*#Forke110'],
        ['45.77.0.150', '*#Forke110'],
        ['45.77.188.111', '*#Forke110'],
        ['66.42.37.214', '*#Forke110'],
        ['78.47.212.163', '*#Forke110'],
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
