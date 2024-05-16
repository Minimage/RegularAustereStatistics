// cronRoute.js
const express = require("express");
const router = express.Router();
const cronModel = require("../models/cronSchema");

router.get("/", (req, res) => {
  cronModel
    .find()
    .then((data) => {
      res.json(data); // Send JSON response with data
    })
    .catch((err) => {
      res.status(500).json({ error: err.message }); // Send error response
    });
});

router.post("/", (req, res) => {
  const newCron = new cronModel({
    name: req.body.name,
    cron: req.body.cron,
    myDate: req.body.myDate,
  });

  newCron
    .save()
    .then((data) => {
      res.status(201).json(data); // Send JSON response with data
    })
    .catch((err) => {
      res.status(500).json({ error: err.message }); // Send error response
    });
});

module.exports = router;
