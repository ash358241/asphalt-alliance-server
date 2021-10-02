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
  const feedbackCollection = client.db("asphaltAlliance").collection("feedbacks");

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

  // read specific entry from database
app.get('/specificEntry', (req, res) => {
    let queryEmail = req.query.email;
    console.log(queryEmail)
    entryCollection.find({ email: queryEmail })
      .toArray((err, specificEntry) => {
        res.send(specificEntry);
      })
  })

  // insert feedback into to database
 app.post('/addFeedback', (req, res) => {
  const feedback = req.body;
  console.log(feedback);
  feedbackCollection.insertOne(feedback)
      .then((result) => {
          res.send(result.insertedCount > 0)
      })
})

   // read feedbacks from database
 app.get('/feedbacks', (req, res) => {
  feedbackCollection.find({}) 
      .toArray((err, documents) => {
          res.send(documents);
          // console.log(err);
      })
})

  // delete specific entry from database
  app.delete("/deleteEntry/:id", (req, res) => {
    entryCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        // console.log(result.deletedCount)
        res.send(result.deletedCount > 0);
 
      })
  })
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
