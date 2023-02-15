
# 🦧 Conclusion of section 11

About cookies and session

## Set Cookie 
This example is about how to create cookie. 
```
postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true')
  res.redirect("/");
};
```

## Get Cookie 
This example is about to get cookie and format to array
```
(req) => {
  return req
    .get("Cookie")
    .split(";")
    .map((res) => {
      const itemcookie = res.split("=");
      return {
        value: itemcookie[1],
        key: itemcookie[0],
      };
    });
}
```

## Setup For Using Session In The App
First you must install package express-session 
```
npm install express-session
```
and use the package to project
```
const session = require('express-session')
const express = require("express");

const app = express();

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false }))
```

## Set Session And Get Session 
after you setup the package, this is how to set the session. 
```
postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
    req.session.user = user;
    
    req.session.save(err => {
      res.redirect("/");
  })
};
```
and this is for get the session 
```
getLogin = (req, res, next) => {
  const isAuthenticated = req.session.isLoggedIn;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated,
  });
};
```