
# 🦧 Catatan section 14 "Validasi"

Pada express.js untuk memvalidsai sebuah inputan kita bisa memanfaatkan package "express-validator". untuk membuat sebuah validasi pertama kita perlu mengimport packagenya.

routes/auth.js
```
const { body } = require("express-validator");
```

Mendestruct properti body, karena kita akan memvalidasi body dari sebuah request. untuk membuat validasi kita perlu mengconfigurasi middleware dari routes yang akan di daftarkan validasi. contoh kode untuk mendaftarkan validasinya adalah seperti ini.

routes/auth.js
```
router.post("/signup", body("email").isEmail(), authController.postSignup);
```
Kode diatas untuk  memvalidasi email agar formatnya benar.

Selanjutnya adalah membuat kondisi jika form tidak valid, berikut adalah contoh kodenya.

controllers/auth.js
```
Function: postSignup

const errorResult = validationResult(req);

if (!errorResult.isEmpty()) {
  console.log(errorResult.array());

  return res.status(422).render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
  });
} else {
  ...
}
```