const express = require("express");
const app = express();
const { foodBlockchain, CryptoBlock } = require("./blockchain");
const recSys = require("./recommendation-system");

let lastRecommendation = {};

recSys.firstTimeSetUp();
//so that express can parse JSON requests
app.use(express.json());

app.post("/", (req, res) => {
  //gets the date and time of when the request is recieved
  const date = new Date();
  console.log(req.body);

  foodBlockchain.addNewBlock(
    new CryptoBlock(
      foodBlockchain.blockchain.length,
      `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      {
        customer: req.body.username,
        quantity: 50,
      }
    )
  );
  lastRecommendation = recSys.getSimilarFood(req.body.foodId);
  res.send({ Ok: "recieved" });
});

app.post("/last-data", (req, res) => {
  res.send({
    "latest-block": foodBlockchain.obtainLatestBlock(),
    recommendations: lastRecommendation,
  });
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
