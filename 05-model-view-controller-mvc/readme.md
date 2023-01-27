
# 🦧 Conclusion of section 5

MVC (Model View Controller) \
\
Model \
```models is a part of your code that is responsible for representing your data in your code and allowing you to work with data. so things like saving data, fetching data to or from a file.``` 

View \
```responsible for rendering the right content in our html documents and sending that back to user. ``` 

Controller  \
```are connecting point between the models and your views```

## Trick 1 - How To Handle Asynchronous Function In NodeJS

in the product model, we have a function for getting file and reserve the content. this is example for handle asynchronous function. \
\
models/product.js
```
class Product {
  ...
  static fetchAll(cb) {
    const p = path.join(basepath, "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });

  }
}
```

and we can use the function like this. \
```
Product.fetchAll((products) => {
  console.log(products)
  ...
}
```

