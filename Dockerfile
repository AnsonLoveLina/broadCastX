FROM oraclelinux:7-slim

RUN  yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
     yum-config-manager --disable ol7_developer_EPEL --enable ol7_oracle_instantclient && \
     yum -y install nodejs oracle-instantclient19.3-basiclite && \
     rm -rf /var/cache/yum

RUN mkdir -p /broadcastx
WORKDIR /broadcastx
COPY ./ /broadcastx
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm","start"]
