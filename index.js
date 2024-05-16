// index.js

const { fetchDataAndCheckDates } = require("./utils/api");
const { IgApiClient } = require("instagram-private-api");
const Base64Model = require("./models/BaseSchema.js");
const { convertPngToJpeg } = require("./Base64.js");
const request = require("request-promise-native");
const base64 = require("./routes/Base64Route.js");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const cron = require("node-cron");
const sharp = require("sharp");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use("/base64", base64);

// Your MongoDB connection
mongoose.connect(process.env.DB_URL).then(() => {
  console.log("Connected to MongoDB");
});

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);
ig.state.proxyUrl = process.env.IG_PROXY;

//Uncoment later when IG goes back online
(async () => {
  const auth = await ig.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD,
  );
  console.log(JSON.stringify(auth));
})();

app.get("/Base64", async (req, res) => {
  try {
    const uploadedPost = await Base64Model.find({});
    res.send(uploadedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/convert", async (req, res) => {
  const { imageUrl, Comment, myDate } = req.body;

  try {
    // Convert PNG to JPEG
    const jpegBase64String = await convertPngToJpeg(imageUrl);

    // Save Base64 string and comment to MongoDB
    const newBase64 = new Base64Model({
      Base64: jpegBase64String,
      Comment,
      myDate,
    });
    const uploadedPost = await newBase64.save();
    res.send(uploadedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Connected to DB and listening on port 3000");

      // Schedule cron job to run at 3:20 pm New York time
      cron.schedule(
        "31 16 * * *",
        () => {
          console.log("Running cron job...");
          fetchDataAndCheckDates();
        },
        {
          timezone: "America/New_York",
        },
      );
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
