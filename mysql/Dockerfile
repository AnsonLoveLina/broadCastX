#docker image of disconf mysql
# VERSION 1.0
# Author: zy

FROM mysql

#作者
MAINTAINER zy <326236882@qq.com>

#定义工作目录
ENV WORK_PATH /home/docker/disconf/mysql/work

#定义容器自动执行的目录
ENV AUTO_RUN_DIR /docker-entrypoint-initdb.d

#定义shell文件名
ENV INSTALL_DATA_SHELL install-data.sh

#创建文件夹
RUN mkdir -p $WORK_PATH

#把数据库初始化数据的文件复制到工作目录下
COPY ./sql $WORK_PATH/

#把要执行的shell文件放到/docker-entrypoint-initdb.d/目录下
COPY ./$INSTALL_DATA_SHELL $AUTO_RUN_DIR/

#给执行文件增加可执行权限
RUN chmod a+x $AUTO_RUN_DIR/$INSTALL_DATA_SHELL

#CMD ["sh", "/docker-entrypoint-initdb.d/docker-entrypoint.sh"]