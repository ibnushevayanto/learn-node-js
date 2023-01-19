const fs = require("fs");

const requestHandler = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  console.log(req.url, req.method, req.headers);
  const { url, method } = req;

  if (url === "/") {
    res.write(`
        <html>
          <title>Enter a message</title>
          <body>
              <form action="/message" method="POST">
                  <input type="text" name="message">
                  <button>Add</button>
              </form>
          </body>
      </html>
        `);
    return res.end();
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk); // Return Chunk Example: <Buffer 6d 65 73 />
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // message = the value message
      const message = parsedBody.split("=")[1]; // Return then value message
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.write(`
    <html>
      <title>My first page</title>
      <body>
          <h1>Failed to create a file</h1>
      </body>
    </html>
    `);
  res.end();
};

module.exports = requestHandler;
