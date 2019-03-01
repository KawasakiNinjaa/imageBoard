// server summoning
// this is our server
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = require("./db");
const s3 = require("./s3");
app.use(express.static("./public"));
app.use(bodyParser.json());

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
  console.log("req.file ", req.file);
  console.log("req.body ", req.body);
  // If nothing went wrong the file is already in the uploads directory

  if (req.file) {
    //INSERT -- title, description, username, s3URL + filename
    //for the image to appear on the page we need to change the array
    let imgUrl = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    let title = req.body.title;
    let description = req.body.description;
    let userName = req.body.username;

    db.uploadImg(title, description, userName, imgUrl).then(results => {
      res.json(results.rows);
      // title: title,
      // description: description,
      // username: userName,
      // url: imgUrl
    });
  } else {
    res.json({
      success: false
    });
  }
});

app.get("/images", (req, res) => {
  db.getImages().then(results => {
    res.json(results.rows);
  });
});

app.get("/single/image/:id", (req, res) => {
  console.log("hola");
  console.log("id: ", req.params.id);
  db.getImgById(req.params.id)
    .then(results => {
      console.log("results in single-image: ", results.rows);
      res.json(results.rows);
    })
    .catch(err => {
      console.log("err; ", err);
    });
});

app.get("/loadmore/:id", (req, res) => {
  db.loadMore(req.params.id).then(results => {
    console.log("results in loadmore: ", results.rows);
    res.json(results.rows);
  });
});

app.post("/insert-comment", (req, res) => {
  let userComment = req.body.usercomment;
  let userName = req.body.username;
  let imgID = req.body.id;
  console.log("body; ", req.body);
  db.insertComment(userComment, userName, imgID)
    .then(results => {
      console.log("results in insertComment: ", results);
      res.json(results);
    })
    .catch(err => {
      console.log("error in insert-comment: ", err);
    });
});

app.get("/get-comments/:id", (req, res) => {
  console.log("id in get-comments: ", req.params.id);

  db.getComments(req.params.id)
    .then(results => {
      console.log("results in getComments: ", results);
      res.json(results);
    })
    .catch(err => {
      console.log("error in get-comments: ", err);
    });
});

app.listen(8080, () => {
  console.log("LISTENING AF");
});
