const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5044;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvc5ptn.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect()
.then(() => {
  console.log('connected')
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    



    const roomCollection = client.db('hotel').collection('rooms');
    const bookingCollection = client.db('hotel').collection('booking');
    const feedbackCollection = client.db('hotel').collection('feedback');
    
    
    app.post('/feedbacks', async ( req, res) => {
      const feedback = req.body
      const result = await feedbackCollection.insertOne(feedback)
      res.send(result)
    })

    app.get('/feedbacks', async( req, res) => {
      const result = await feedbackCollection.find().toArray()
      res.send(result)
    })
    


    app.get('/rooms', async(req, res)=>{
      const filter =req.query
      const query ={}
      const options ={
        sort: {
          price: filter.sort ==='asc'? 1 : -1
        }
      }
      const cursor = roomCollection.find(query, options);
      const result = await cursor.toArray();
        res.send(result); 
    })


   

    app.get('/rooms/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }

        const options = {
          projection: { service_id:1, title:1, img:1, description:1, price:1,  }
        }

        const result = await roomCollection.findOne(query, options);
        res.send(result);
    })

    app.post('/bookings', async (req, res) =>{
      const booking = req.body
      const result = await bookingCollection.insertOne(booking)
      res.send(result)
    })
  
    app.get('/bookings', async ( req, res ) => {
      
      const result = await bookingCollection.find().toArray()
      res.send(result)
    })


    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/bookings/:id', async ( req, res) => {
      const id = req.params.id;
      const booking = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const bookingUpdate = {
        $set:{
          date: booking.date
        }
      }
      const result = await bookingCollection.updateOne(filter, bookingUpdate, options)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('wonderful hotel')
})

app.listen(port, () => {
    console.log(`welcome to the hotel ${port}`)
})