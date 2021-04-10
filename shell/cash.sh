#!/bin/bash
cat ./hostlist.txt | while read i
do
    USER=$1
    IP=`echo $i | awk '{print $1}'`
    echo "try $IP"
    (ssh $USER@$IP "wget -O cashout.sh https://raw.githubusercontent.com/simon4546/bee/master/cashout.sh?token=ABVOP357GHRY5XKNWVRZJGTAOETUQ;chmod +x cashout.sh;bash ./cashout.sh cashout-all;" &)  2>> log.txt
    #注意一定要在最后面加&符号，否则就是串行执行，不能体现并行。
    #将错误重定向到日志文件中
 
    if [ $? -ne 0 ];then
        echo "$IP执行过程中出现异常"
    fi
done