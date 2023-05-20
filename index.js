const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

// middleware 
app.use(cors())
app.use(express.json())


// mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9nxh9h.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
   
    const galleryCollection = client.db('toysDB').collection('galleries');
    const recerCollection = client.db('toysDB').collection('racer');
    const turboBlazeCollection = client.db('toysDB').collection('turboBlaze');
    const allToys = client.db('toysDB').collection('toysCollections')
  
    // get galleries image
    app.get('/gallery', async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get TurbochargedThrillers by category
    app.get('/TurboThrillers', async(req,res)=>{
      const result = await recerCollection.findOne({category: 'TurbochargedThrillers'});
      res.send(result)
    })

    // get recerCollection By id 
    app.get('/singleRacer/:id', async(req,res)=> {
        const id = req.params.id 
        const category = await recerCollection.findOne({ "products.id": id });
        if (category) {
          const product = category.products.find((item) => item.id === id);
          if (product) {
            res.send(product)
          } else {
            res.status(404).json({ message: 'Product not found' });
          }
        }
      
    })

    // get RacerSpeedy category
    app.get('/RacerSpeedy', async(req,res)=>{
      const result = await recerCollection.findOne({category: 'RacerSpeedy'});
      res.send(result)
    })
    // get SpeedDemonSeries category
    app.get('/SpeedDemon', async(req,res)=>{
      const result = await recerCollection.findOne({category: 'SpeedDemonSeries'});
      res.send(result)
    })

    // get TurboBoosters category
    app.get('/turboBooster', async(req,res)=>{
      const result = await turboBlazeCollection.findOne({category: 'TurboBoosters'});
      res.send(result)
    })

    // insert a toy to db 

    app.post('/addtoy', async (req, res) => {
      const toyData = req.body;
    
      if (!toyData) {
        return res.status(404).send({ message: 'Body Data Not Found' });
      }
    
      try {
        const result = await allToys.insertOne(toyData);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error inserting toy data' });
      }
    });

    // get all toys from db

    app.get('/alltoys', async(req,res)=>{

      const cursor =  allToys.find()
      const result = await cursor.toArray()
      res.send(result)
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
  res.send('Toy-server is running ')
})

app.listen(port, () => {
  console.log(`toy-server is running on port ${port}`)
})