const http = require('http');
const fs = require('fs');
const Url = require('url-parse');

function renderHistory(history) {
  return history.reduce((html, {name, message}) => {
    html += `
      <div class="message">
        <span class="message-author">${name}: </span>
        <span class="message-text">${message}</span>
      </div>
    `;
    return html;
  }, '');
}

http.createServer((request, response) => {
  if (request.url === '/favicon.ico') return;

  const url = new Url(request.url, true);
  const name = url.query.name || '';
  const message = url.query.message || '';

  const historyEvent = {
    name,
    message,
  };

  const history = JSON.parse(fs.readFileSync('history.json')) || [];

  if (name !== '' && message !== '') {
    history.push(historyEvent);
    fs.writeFileSync('history.json', JSON.stringify(history));
  }

  let file = fs.readFileSync('index.html', { encoding: "UTF-8" })
  file = file.replace("%name%", name);
  file = file.replace("%messeges%", renderHistory(history));

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(file);
  response.end();
}).listen(8080);

console.log("Listening...");