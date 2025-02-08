const http = require('http');
let url = require('url');
const dt = require('./modules/utils');

let dictionary = [];
let currentReq = 0;

http.createServer(function (req, res) {

  console.log("The server received a request");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
}

    if (req.url === '/') {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Server is running...");
      return;
    }

    if (req.url === '/api/definitions/') {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Server is running...");
      return;
    }

    if (req.url === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }

  if(req.method === "POST" && req.url === '/api/definitions/') {

    
      currentReq++;

      let body = "";

      // on data, build body by chunks
      req.on("data", function(chunk) {
        body += chunk;
      });

      // when incoming data is done, parse body
      req.on("end", () => {
        try {
            let data = JSON.parse(body);
            let word = data.word || "Unknown";
            let definition = data.definition || "unknown";

            let valid = validateInput(word);
            if(!valid) {
              res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
              res.end("Invalid input");
            } 

            valid = validateInput(definition);
            if(!valid) {
              res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
              res.end("Invalid input");
            } 

            let added = addToDict(data);

            console.log(added);
            console.log(dictionary);

            res.writeHead(200, { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" });
            res.end(added);
        } catch (error) {
            res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
            res.end("Invalid JSON");
        }
    });
  }

  if(req.method === "GET" && req.url.startsWith('/api/definitions/')) {

    currentReq++;
  
    let q = url.parse(req.url, true);
    let qdata = q.query;
    console.log(qdata.word);

    let valid = validateInput(qdata.word);
    if(!valid) {
      res.writeHead(400, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
      res.end("Invalid input");
    }

    let desc = checkDict(qdata.word);

    res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
    res.end(desc);
    
  }

}).listen(process.env.PORT || 8888);


let addToDict = (word) => {
  for(let i = 0; i < dictionary.length; i++) {
    if(dictionary[i].word === word.word) {
      dictionary[i].definition = word.definition;
      return "Word Already Exists. Definition changed.";
    }
  }
  dictionary.push(word);
  let responseMessage = `Request # ${currentReq} updated on ${dt.getDate()}
  <br><br>Words in dictionary ${dictionary.length}
  <br><br>New entry recorded:
  <br><br>"${word.word} : ${word.definition}"`;
  return responseMessage;
}

let checkDict = (word) => {
  for(let i = 0; i < dictionary.length; i++) {
    if(dictionary[i].word === word) {
      return dictionary[i].definition;
    }
  }
  let responseMessage = `Request # ${currentReq}, word '${word}' not found!`;
  return responseMessage;
}

let validateInput = (str) => {

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