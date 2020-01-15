FROM com.ngw/node_oracledb:1.0

RUN mkdir -p /broadcastx
WORKDIR /broadcastx
COPY ./ /broadcastx
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm","start"]
