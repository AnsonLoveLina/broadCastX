ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'broadcastx'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'broadcastx'@'%';
create database database1;
use database1;
create table if not exists stuffHistory(
   `id` VARCHAR(40) NOT NULL,
   `source` VARCHAR(100) NOT NULL,
   `sourceCreateTime` DATETIME,
   `target` VARCHAR(100) NOT NULL,
   `targetType` VARCHAR(40) NOT NULL,
   `targetCreateTime` DATETIME,
   `roomName` VARCHAR(100) NOT NULL,
   `eventName` VARCHAR(40) NOT NULL,
   `context` TEXT NOT NULL,
   PRIMARY KEY ( `id` )
);
