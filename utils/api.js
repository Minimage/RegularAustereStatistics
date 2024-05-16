const { IgApiClient } = require("instagram-private-api");
const sharp = require("sharp");
const axios = require("axios");

let storage = [];

const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://f8830aee-60cd-4f53-9934-555fe09ec6fa-00-1buvwlgzh5ntr.worf.replit.dev/base64",
    );
    return response.data;
  } catch (error) {
    console.error("Error making API call:", error);
    return [];
  }
};

const fetchDataAndCheckDates = async () => {
  const apiData = await fetchData();
  if (apiData.length > 0) {
    storage = apiData;
    checkDates();
  } else {
    console.log("No data retrieved from the API.");
  }
};

const checkDates = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;

  // Login to Instagram
  const auth = await ig.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD,
  );
  console.log(JSON.stringify(auth));

  // Get current date in New York time zone
  const currentDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
  )
    .toISOString()
    .split("T")[0];

  // Iterate over storage items
  for (const item of storage) {
    const itemDate = item.myDate.split("T")[0];
    if (itemDate === currentDate) {
      try {
        // Convert base64 string to buffer
        const imageBuffer = await sharp(Buffer.from(item.Base64, "base64"))
          .jpeg()
          .toBuffer();

        // Publish photo to Instagram
        const publishResult = await ig.publish.photo({
          file: imageBuffer,
          caption: item.Comment,
        });

        console.log("Photo published successfully:", publishResult);
      } catch (error) {
        console.error("Error publishing photo to Instagram:", error);
      }
    } else {
      console.log("The given date is not the current date.");
    }
  }
};

module.exports = { fetchDataAndCheckDates };
