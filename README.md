# Web Scraper

This project was generated with nodejs v10.16.3 to scrap title and description from domains and generate output as CSV file.

Move to project folder

##Install dependencies Client
Run: npm install

##Start
Run: node client.js <filePath> 

**Replace filepath input file

#Server
##Install Dependencies
Run: npm install

##Start
Run: nohup node index.js >> server.log
logs: tail -f server.log

##Stop
Run: ps -ax|grep nohub
Run: kill -9 <pid>