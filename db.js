const spicedPg = require("spiced-pg");

const dbUrl =
  process.env.DATABASE_URL ||
  `postgres:postgres:postgres@localhost:5432/wintergreen-imageboard`;
const db = spicedPg(dbUrl);

exports.getImages = function getImages() {
  let q = "SELECT * FROM images ORDER BY id DESC";
  return db.query(q);
};

exports.uploadImg = function uploadImg(title, description, username, url) {
  let q =
    "INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING *";
  let params = [title, description, username, url];

  return db.query(q, params);
};

exports.getImgById = function getImgById(id) {
  let q = "SELECT * FROM images WHERE id=$1";
  let params = [id];

  return db.query(q, params);
};

exports.insertComment = function insertComment(comment, username, imgID) {
  let q =
    "INSERT INTO images(comment, username, img_id) VALUES ($1, $2, $3) RETURNING *";
  let params = [comment, username, imgID];

  return db.query(q, params);
};

exports.getComments = function getComments(imgID) {
  let q = "SELECT comment FROM comments WHERE id=$1";
  let params = [imgID];

  return db.query(q, params);
};
