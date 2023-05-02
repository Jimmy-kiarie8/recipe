const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:8100",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const server = http.createServer(app);

const uri = process.env.MONGODB_URI;
const Data = require("./models/data.js");
connect();

// start the server
server.listen(8080, () => {
  console.log("Server started on port 8080");
});

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log(
      "🚀 ~ file: index.js:73 ~ connect ~ Connected:",
      "Connected to mongo db"
    );
  } catch (error) {
    console.log("🚀 ~ file: index.js:74 ~ connect ~ error:", error);
  }
}

app.post("/api/points", (req, res) => {
  const points = req.body.amount;
  console.log("🚀 ~ file: index.js:43 ~ app.post ~ points:", points)
  const type = req.body.type;
  console.log("🚀 ~ file: index.js:44 ~ app.post ~ type:", type)
  const uid = req.body.uid;
  console.log("🚀 ~ file: index.js:45 ~ app.post ~ uid:", uid)

  // Your code to handle the data

  const newData = new Data({
    uid: uid,
    points: points,
    type: type,
  });

  Data.findOneAndUpdate(
    { uid },
    { $inc: { points: points } },
    { upsert: true, new: true }
  )
    .then((doc) => {
      console.log("Record updated or created:", doc);
    })
    .catch((err) => {
      console.error(err);
    });

  return true;
});

app.get("/api/points/:uid", (req, res) => {
  const { uid } = req.params;

  Data.findOne({ uid })
    .then((doc) => {
      if (doc) {
        res.json(doc);
      } else {
        console.log(1);
        res.status(404).send("Record not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server error");
    });
});

// Define API endpoint to decrement points for a document
app.patch("/api/points/:id", (req, res) => {
  const uid = req.params.id;
  const pointsToDecrement = req.body.points;

  // Find the document by UID and decrement the points
  Data.findOneAndUpdate({ uid }, { $inc: { points: -pointsToDecrement } }, { new: true })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

async function getPoints() {}
