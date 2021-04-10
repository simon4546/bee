#!/bin/bash
function password() {
    cat ./hostlist.txt | while read i
    do
        USER=$1
        IP=`echo $i | awk '{print $1}'`
        echo "try $IP"
        (ssh $USER@$IP "cat /data/bee/password;cat /var/lib/bee/password;" & )  1>> passwd.txt
        if [ $? -ne 0 ];then
            echo "$IP执行过程中出现异常"
        fi
    done
}
function cashOut() {
    cat ./hostlist.txt | while read i
    do
        USER=$1
        IP=`echo $i | awk '{print $1}'`
        echo "try $IP"
        (ssh $USER@$IP "wget -O cashout.sh https://raw.githubusercontent.com/simon4546/bee/master/cashout.sh;chmod +x cashout.sh;bash ./cashout.sh cashout-all;" &)  2>> log.txt
        #注意一定要在最后面加&符号，否则就是串行执行，不能体现并行。
        #将错误重定向到日志文件中
    
        if [ $? -ne 0 ];then
            echo "$IP执行过程中出现异常"
        fi
    done
}

case $1 in
cashout)
  cashOut $2
  ;;
password)
  password $2
  ;;
esac
