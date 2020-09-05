const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const createIfNotExist = require("create-if-not-exist");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "../db/db.json");

createIfNotExist(dbPath, "");
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
    const list = {
      ...req.body,
      id: uuid(),
      items: req.body.items.map((item) => ({ ...item, id: uuid() })),
    };

    db.get("lists").push(list).write();
    res.json(list);
  });

  app.get("/list/:id", (req, res) => {
    const id = req.params.id;
    const list = db.get("lists").find({ id }).value();

    if (!list) {
      res.status(404).end();
      return;
    }

    res.json(list);
  });

  app.delete("/list/:id", (req, res) => {
    const id = req.params.id;
    const list = db.get("lists").find({ id }).value();

    if (!list) {
      res.status(404).end();
      return;
    }

    db.get("lists").remove({ id }).write();
    res.end();
  });

  app.put("/list/:id", (req, res) => {
    const id = req.params.id;
    const lists = db.get("lists");
    const listId = db.get("lists").findIndex({ id }).value();

    const list = {
      ...req.body,
      id: id,
      items: req.body.items.map((item) => ({ ...item, id: uuid() })),
    };

    if (listId === -1) {
      db.get("lists").push(list).write();
      res.json(list);
      return;
    }

    lists.splice(lists.findIndex({ id }), 1, list).write();
    res.json(list);
  });

  app.patch("/list/:id", (req, res) => {
    const id = req.params.id;
    const list = db.get("lists").find({ id }).value();

    if (!list) {
      res.status(404).end();
      return;
    }

    db.get("lists").find({ id }).assign(req.body).write();
    res.end();
  });
});
