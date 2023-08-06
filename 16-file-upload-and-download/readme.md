
# 🦧 Catatan section 16 "File upload and download"

Sebelum membuat fitur untuk upload file pada node js. kita perlu mengubah content type dari request dengan cara 

app.js line 38
```
app.use(bodyParser.urlencoded({ extended: false }));
```

fungsi dari kode diatas untuk mengubah body yang dikirim agar bisa menerima form-data. form-data support untuk mengirim sebuah file.

==
## Menggunakan Package Multer

selanjutnya menggunakan package "multer". multer berfungsi untuk menparse file incoming request.

pertama kita perlu mengkonfigurasi filestroage dari multer

app.js line 29
```
const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images");
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
```
destination adalah setingan untuk mengatur lokasi folder untuk menyimpan gambar yang diupload

sedangkan filename untuk mengatur nama file yang diupload oleh file

variabel fileStorage ini akan digunakan dalam properti settingan konfigurasi multer yaitu properti "storage"

app.js line 41
```
app.use(
  multer({
    storage: fileStorage,
    fileFilter(req, file, cb) {
      if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }).single("foto")
);
```
fileFilter untuk memvalidasi file apa saja yang bisa diupload dalam payload "foto"

==
## Catatan mengenai menyimpan file ke database

kita tidak perlu menyimpan file kedalam database, karena ukuran file yang besar dapat membuat database menjadi lambat. Sebagai gantinya kita cuma perlu menyimpan path dari file tersebut disimpan.

contoh kode ada pada file controllers/admin.js
di function *postAddProduct* dan *postEditProduct*

==
## Gambar tidak dapat muncul

gambar yang tidak muncul dikarenakan masih meminta gambar ke path yang salah. kita perlu membuat folder images store menjadi static agar file bisa diakses dan diload ke webpage

file app.js line 40
```
app.use('/images', express.static(path.join(__dirname, "images")));
```

==
## Kode download file ada pada shop.js line 232

==
## Kode untuk menggenerate file pdf ada pada shop.js line 206

== 
## Kode untuk hapus file ada pada controller admin function postEditProduct / postDeleteProduct

