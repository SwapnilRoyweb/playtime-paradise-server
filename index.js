const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
// app.use(cors());
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ad0f77m.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((error)=>{
      if(error){
        console.log(error)
        return;
      }
    });

    const toysCollection = client.db('PlaytimeParadise').collection('toys');

    app.post('/toys', async (req, res) => {
      const toy = req.body;
      // console.log(toy);
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    })

    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await toysCollection.findOne(query);
      res.send(result);
    })

    app.get('/myToys', async (req, res) => {
      let query = {};
      if (req.query.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail };
      }
      // console.log(req.query);
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/monkey', async (req, res) => {
      const query = {subCategory: req.query.subCategory};

      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })

    app.put('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedToy = req.body;
      console.log(updatedToy);

      const option = {upsert: true};

      const updateDoc = {
        $set: {
          toyName: updatedToy.toyName,
          toyPicture: updatedToy.toyPicture,
          sellerName: updatedToy.sellerName,
          sellerEmail: updatedToy.sellerEmail,
          subCategory: updatedToy.subCategory,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          description: updatedToy.description
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};

      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Playtime Paradise server running')
})

app.listen(port, () => {
  console.log(`Playtime Paradise server is running on port: ${port}`);
})