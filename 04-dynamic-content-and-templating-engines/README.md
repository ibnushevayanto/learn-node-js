
# 🦧 Conclusion of section 4

| Name| Example Code / The Code | Description |
| -   | - | - |
| Set default file format for file | app.set("view engine", "pug"); | | 
| Set default folder for views | app.set("views", "views"); | |

Whenever you want to sendFile with templating engine, you need change code sendFile to this. \
example code:
```
router.get("/", (req, res, next) => {
  res.render("shop", { title: 'Hello' });
});
```
``you can send payload to views``

## Pug
### Setup and use templating engine pug
Installation
```
npm install --save pug
```
Set default file format for file and set default folder root for views, the code at above of this pages. \
``Write code for set default in app.js``

## Express Handlebars
### Setup and use templating engine handlebars
Installation
```
npm install --save express-handlebars@3.0.0
```
Add this code in root of file.
```
app.engine("hbs", expressHbs());
```

Set default file format for file and set default folder root for views, the code at above of this pages. \
``Write code for set default in app.js``  \

if you want to add custom layouts in handlebars add params like this
```

```