const http = require('http');
let url = require('url');
const dt = require('./modules/utils');
const userMessages = require('./lang/en/en.js');

class Server {

  constructor() {
    this.dictionary = [];
    this.currentReq = 0; 
  }


  handlePost(req, res) {
    this.currentReq++;
    
          let body = "";
    
          // on data, build body by chunks
          req.on("data", (chunk) => {
            body += chunk;
          });
    
          // when incoming data is done, parse body
          req.on("end", () => {
          
            try {
                let data = JSON.parse(body);
                let word = data.word;
                let definition = data.definition;

                console.log(data);
    
                let valid = this.validateInput(word);
                if(!valid) {
                  res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
                  res.end(userMessages.invalidWord);
                  return;
                } 
    
                valid = this.validateInput(definition);
                if(!valid) {
                  res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
                  res.end(userMessages.invalidDef);
                  return;
                } 
    
                let added = this.addToDict(data);
    
                console.log(added);
    
                console.log(this.dictionary);
    
                res.writeHead(200, { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" });
                res.end(added);
            } catch (error) {
              console.error("Error parsing JSON or processing data:", error);
                res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
                res.end(userMessages.invalidJSON);
            }
        });
  }

  handleGet(req, res) {
    this.currentReq++;
        
          let q = url.parse(req.url, true);
          let qdata = q.query;
          console.log(qdata.word);
    
          let valid = this.validateInput(qdata.word);
          if(!valid) {
            res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
            res.end(userMessages.invalidWord);
            return;
          }
    
          let desc = this.checkDict(qdata.word);
          console.log(desc);
    
          res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
          res.end(desc);
  }


  start() {
    http.createServer((req, res) => {

      console.log("The server received a request");
    
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        return res.end();
    }
        console.log("Method:", req.method);
        console.log("URL:", req.url);
    
      if(req.method === "POST" && req.url === '/api/definitions/') {
          this.handlePost(req, res);
          
      } else if(req.method === "GET" && req.url.startsWith('/api/definitions/')) {
          this.handleGet(req, res);
          
      } else {
          res.writeHead(404, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
          res.end(userMessages.pageNotFound);
      }
    
    
    }).listen(8888);
  }


  addToDict = (word) => {
    for(let i = 0; i < this.dictionary.length; i++) {
      if(this.dictionary[i].word === word.word) {
        this.dictionary[i].definition = word.definition;
        return userMessages.wordExists;
      }
    }
    this.dictionary.push(word);
    return userMessages.entryAdded(this.currentReq, dt.getDate(), this.dictionary.length, word.word, word.definition);
  }
  
  checkDict = (word) => {
    for(let i = 0; i < this.dictionary.length; i++) {
      if(this.dictionary[i].word === word) {
        return this.dictionary[i].definition;
      }
    }
    return userMessages.wordNotFound(this.currentReq, word);
  }
  
  validateInput = (str) => {
  
    if(!str) {
      return false;
    }
  
    let numbers = "0123456789";
  
    if(str.length === 0) {
        return false;
    }
    
    if(str.trim().length === 0) {
        return false;
    }
  
    for(let i = 0; i < str.length; i++) {
        if(numbers.indexOf(str[i]) !== -1) {
            return false;
        }
    }
  
    return true;
  }

}

let app = new Server();
app.start();