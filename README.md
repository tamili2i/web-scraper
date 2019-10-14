# Web Scraper

This project was generated with nodejs v10.16.3 to scrap title and description from domains and generate output as CSV file.

Move to project folder

## Install dependencies Client
Run: npm install

## Start
Run: node client.js \<filePath\> \<targetIp\>

##### *Replace filepath input file and targetIp with server url*

# Server
## Install Dependencies
Run: npm install

## Start
Run: nohup node index.js >> server.log 2>&1 & echo $! > job_pid.txt

logs: tail -f server.log

## Stop

Run: kill -9 `cat job_pid.txt`


# Location Iq
Run: node locationiq.js \<inputFile\> \<headerFlag\>
Eg: node locationiq.js \home\dell\input.csv header=address
