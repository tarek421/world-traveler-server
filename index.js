const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

const userName = process.env.DB_USER;
const DataBaseName = process.env.DB_NAME;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${userName}:${password}@cluster0.g7gsq.mongodb.net/${DataBaseName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!')
})


client.connect(err => {
  const collection = client.db("tourGuide").collection("services");
  console.log(err);


  app.post('/addServices', (req, res) => {
    const NewDestination = req.body;
    console.log('adding new services: ', NewDestination)
    collection.insertOne(NewDestination)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/services', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/services/:_id', (req, res) => {
    collection.find({ _id:ObjectId(req.params._id)})
      .toArray((err, items) => {
        res.send(items[0]);
        
      })
  })

});


client.connect(err => {
  const collection = client.db("tourGuide").collection("order");
  console.log(err);

  app.post('/addOrder', (req, res) => {
    const NewOrder = req.body;
    console.log('adding new order: ', NewOrder)
    collection.insertOne(NewOrder)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/order', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

});

app.listen(port)