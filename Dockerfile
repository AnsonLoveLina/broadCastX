FROM node
RUN mkdir -p /broadcastx
WORKDIR /broadcastx
COPY ./ /broadcastx
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm","start"]
