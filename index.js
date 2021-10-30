const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// uri and mongo client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mas8d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // connect with mongo
    await client.connect();
    const database = client.db("transcrew");
    const serviceCollection = database.collection("services");

    // get all services bye GET Method
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // POST services
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);

      res.json(result);
    });
  } finally {
    // client.close();
  }
}
run().catch(console.dir());
app.get("/", (req, res) => {
  res.send("Transcrew server is running");
  console.log("transcrew server is running");
});

app.listen(port, () => {
  console.log(`Server is running at port : http://localhost:${port}`);
});
