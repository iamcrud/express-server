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
    const list = {
      ...req.body,
      id: uuid(),
      items: req.body.items.map((item) => ({ ...item, id: uuid() })),
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
    const lists = db.get("lists");
    const listId = lists.findIndex({ id }).value();

    const list = {
      ...req.body,
      items: req.body.items.map((item) => ({
        id: item.isNew ? uuid() : item.id,
        content: item.content,
      })),
    };

    if (listId === -1) {
      db.get("lists").push(list).write();
      res.json(list);
      return;
    }

    lists.splice(listId, 1, list).write();
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
