const spicedPg = require("spiced-pg");

const dbUrl =
  process.env.DATABASE_URL ||
  `postgres:postgres:postgres@localhost:5432/wintergreen-imageboard`;
const db = spicedPg(dbUrl);

exports.getImages = () => {
  let q = "SELECT * FROM images";
  return db.query(q);
};
