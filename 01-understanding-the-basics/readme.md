# 🦧 Conclusion of section 1

## Create server in node js
example code
```
const http = require("http");

const server = http.createServer((req, res) => {
  ...
})

server.listen(3000)
```

## Write server response and other
`` Write this code inside createServer ``
| Name| Code | Description |
| -   | - | - |
| Get the method request | req.method | |
| Get the url request | req.url | |
| Get the headers reqyest | req.headers | example: `` res.write('<h1>Hello World</h1>') `` |
| Write a response body | res.write(STRING) | |
| Write a response header | res.setHeader(STRING_NAME_HEADER, STRING_VALUE_HEADERS); | example: `` res.write('<h1>Hello World</h1>') `` |
| Stop and showing the body response | res.end() | Always add this code in the end of your code |
| Exit server | proccess.exit() | Exit and stop the service of server. you can not import module of process, process is global variable |
| Request listener | req.on(STRING, FUNCTION) | example: `` req.on("data", (chunk) => { ... } ) `` | 

## Make a simple route system in node js
``Note: enter this code inside the createServer``
```
const { url, method } = req;

if (url === "/") {
  ...
  return res.end()
} else if (url === "/message" && method === "POST") {
  ...
  return res.end()
}
...
return res.end()
```
``Note: Always return in the createServer function, so as the code not infinite loop``

- Write file with fs module
import the module
```
const fs = require("fs");
```

example code using writeFile. ``enter this code inside the createServer function parameter``
```
fs.writeFile("message.txt", message, (err) => {
  res.setHeader("Location", "/");
  res.statusCode = 302;
  return res.end();
});
```
## How to get body params in POST method route

```
const body = [];
req.on("data", (chunk) => {
  console.log(chunk);
  body.push(chunk); // * Return Chunk Example: <Buffer 6d 65 73 />
});
req.on("end", () => {
  const parsedBody = Buffer.concat(body).toString(); // * message = the value message
  const message = parsedBody.split("=")[1]; // * Return then value message
  ...
});

```

## Export code in node js
if only one value exported, `` like export default in javascript ``
```
module.exports = requestHandler
```
if multiple value exported
```
module.exports = {
  handler: requestHandler,
  name: 'Ibnu'
}
```
OR
```
export.handler = requestHandler 
export.name = 'Ibnu'
```