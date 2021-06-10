const express = require("express");
const app = express();
const { foodBlockchain, CryptoBlock } = require("./blockchain");
const recSys = require("./recommendation-system");

let lastRecommendation = {};

recSys.firstTimeSetUp();
//so that express can parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!\nThis is a server for GotYums app.");
});

app.post("/", (req, res) => {
  //gets the date and time of when the request is recieved
  const date = new Date();
  const { customer, food, restaurant } = req.body;

  foodBlockchain.addNewBlock(
    new CryptoBlock(
      foodBlockchain.blockchain.length,
      `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      {
        customer,
        food,
        restaurant,
      }
    )
  );
  lastRecommendation = recSys.getSimilarFood(food);
  res.send({ Ok: "recieved" });
});

app.post("/last-data", (req, res) => {
  res.send({
    "latest-block": foodBlockchain.obtainLatestBlock(),
    recommendations: lastRecommendation,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on http://localhost:3000");
});
