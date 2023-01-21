# 🦧 Conclusion of section 2

| Name| Code | Description |
| -   | - | - |
| Make the folder an NPM Project | npm init | |
| Create custom comand in npm project | "start": "node app.js" | write this code in package.json. Inside scripts property. And to run it, just type ``npm run start`` |
| Restarting code automaticallly in debug mode| | [Check this link](https://www.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11563042#questions) |
| Debugging node js app in vscode article | | [Check this link](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)|

## Use Nodemon in Node.js Project
Why Use Nodemon?. nodemon makes our nodejs project generated automaticallly.
- Install Nodemon
``` 
npm install nodemon --save-dev
```
``--save-dev`` made package just installed in development mode, not prodcution mode

- Using nodemon 
replace node to nodemon in "start" script package.json. \
\
before
```
"start": "node app.js"
```
after
```
"start": "nodemon app.js"
```

