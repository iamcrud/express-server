const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "../db/db.json");
const adapter = new FileAsync(dbPath);

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

low(adapter).then((db) => {
  db.defaults({ lists: [] }).write();

  app.get("/lists", (req, res) => {
    const lists = db.get("lists");
    res.json(lists.value());
  });

  app.post("/lists", (req, res) => {
    db.get("lists").push(req.body).write();
    res.end();
  });

  app.get("/list/:id", (req, res) => {
    const id = req.params.id;
    const list = db.get("lists").find({ id });
    res.json(list.value());
  });

  app.delete("/list/:id", (req, res) => {
    const id = req.params.id;
    db.get("lists").remove({ id }).write();
    res.end();
  });

  app.put("/list/:id", (req, res) => {
    const id = req.params.id;
    const lists = db.get("lists");
    lists.splice(lists.findIndex({ id }), 1, req.body).write();
    res.end();
  });

  app.patch("/list/:id", (req, res) => {
    const id = req.params.id;
    db.get("lists").find({ id }).assign(req.body).write();
    res.end();
  });
});
