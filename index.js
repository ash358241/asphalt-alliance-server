const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

const port = 8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  const entryCollection = client.db("asphaltAlliance").collection("entries");

  //insert entry into database
  app.post('/addEntry', (req, res) => {
    const entry = req.body;
    console.log(entry);
    entryCollection.insertOne(entry)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
})

  //read entries from database
  app.get("/entries", (req, res) => {
    entryCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(err);
    });
  });

     //read individual entry from database
     app.get('/entry/:entryId', (req, res) => {
      entryCollection.find({_id:ObjectId(req.params.entryId)})
      .toArray((err, entries) => {
          res.send(entries[0]);
      })
  })


});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
