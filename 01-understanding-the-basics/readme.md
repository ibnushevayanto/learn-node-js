# What I Get In Section One

- **Setup basic server node**
  app.js

```http
const http = require("http");
const server = http.createServer((req, res) => {
  console.log(req);
});
server.listen(3000);
```

- **Run javascript file with node js**

```http
node app.js
```
