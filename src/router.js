const express = require("express");
const { v4: uuid } = require("uuid");

module.exports = function (db) {
  const router = express.Router();

  const lists = router.route("/lists");
  const list = router.route("/lists/:id");

  lists.get((req, res) => {
    const lists = db.get("lists");
    res.json(lists.value());
  });

  lists.post((req, res) => {
    const { title, items } = req.body;

    const list = {
      id: uuid(),
      title: title,
      items: items.map((item) => ({
        id: uuid(),
        content: item.content,
      })),
    };

    db.get("lists").push(list).write();
    res.json(list);
  });

  list.get((req, res) => {
    const id = req.params.id;
    const list = db.get("lists").find({ id }).value();

    if (!list) {
      res.status(404).end();
      return;
    }

    res.json(list);
  });

  list.put((req, res) => {
    const id = req.params.id;
    const { title, items } = req.body;

    const lists = db.get("lists");
    const listIndex = lists.findIndex({ id }).value();

    const list = {
      id: id,
      title: title,
      items: items.map((item) => ({
        id: item.isNew ? uuid() : item.id,
        content: item.content,
      })),
    };

    if (listIndex === -1) {
      db.get("lists").push(list).write();
      res.json(list);
      return;
    }

    lists.splice(listIndex, 1, list).write();
    res.json(list);
  });

  list.delete((req, res) => {
    const id = req.params.id;
    const list = db.get("lists").find({ id }).value();

    if (!list) {
      res.status(404).end();
      return;
    }

    db.get("lists").remove({ id }).write();
    res.end();
  });

  return router;
};
