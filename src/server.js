const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const createIfNotExist = require("create-if-not-exist");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const logger = require("./logger.js");
const router = require("./router.js");

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "../db/db.json");

createIfNotExist(dbPath, "");
const adapter = new FileAsync(dbPath);

app.use(logger);
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

low(adapter).then((db) => {
  db.defaults({ lists: [] }).write();

  app.use("/api", router(db));
});
