# Web Scraper

This project was generated with nodejs v10.16.3 to scrap title and description from domains and generate output as CSV file.

Move to project folder

## Install dependencies Client
Run: npm install

## Start
Run: node client.js <filePath> <targetIp>

##### *Replace filepath input file and targetIp with server url*

# Server
## Install Dependencies
Run: npm install

## Start
Run: nohup node index.js >> server.log &
logs: tail -f server.log

## Stop
Run: ps -ax|grep 'node index.js'
Run: kill -9 <pid>
