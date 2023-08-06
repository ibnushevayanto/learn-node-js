
# 🦧 Conclusion of section 12

This course is about adding real authentication in the app. and : 
- add package csurf in the express project for to avoid csrf attack 
- encypt and decrypt with bcryptjsjs
- Global variable for rendering view 

## Encrypt The Plain Text 

First we need install package called bcryptjs
```
npm install bcryptjs --save 
```
And use the package on the file project
```
const bcryptjs = require('bacryptjs')
```
Next we use encypt the password 
```
bcryptjs.hash(password, 12) // return a promise 
```

## Decrypt The Plain Text
this is how to decrypt text using bcryptjs 
```
bcryptjs.compare(password, user.password)
```
first parameter is text of password, and second parameter is encrypted password

## Create Global Variable When Render A View 
```
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
}) 
```

## Send The Email
In this project i am use nodemailer for send the email, the code available in the auth controller