const express = require("express");
const router = express.Router();
const Base64Model = require("../models/BaseSchema.js");

router.get("/", async (req, res) => {
  try {
    const uploadedPost = await Base64Model.find({});
    res.send(uploadedPost);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", (req, res) => {
  const newCron = new Base64Model({
    Base64: req.body.Base64,
    Comment: req.body.Comment,
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
