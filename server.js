const http = require('http');
const fs = require('fs');
const Url = require('url-parse');

http.createServer((request, response) => {
  if (request.url === '/favicon.ico') return;

  const url = new Url(request.url, true);
  const name = url.query.name;
  const age = url.query.age;

  const person = {
    name,
    age,
  };

  fs.writeFileSync('db.json', JSON.stringify([person]));

  let file = fs.readFileSync('index.html', { encoding: "UTF-8" })
  file = file.replace("%name%", name);

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(file);
  response.end();
}).listen(8080);

console.log("Listening...");