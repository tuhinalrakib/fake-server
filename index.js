const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
    res.send('Hobby Hub')
})

// Connect MongoDb HERE

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.gnlwsvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

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
    await client.connect();

    const userCollection = client.db("fakeDb").collection("users")
    const groupCollection = client.db("fakeDb").collection("groups")

    // User Related APIs
    app.post("/users", async(req,res)=>{
        const newUser = req.body 
        const result = await userCollection.insertOne(newUser)
        res.send(result)
    })

    app.get("/users", async (req,res)=>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })

    

    // Group Relatede APIs
    app.post("/groups", async (req,res)=>{
        const newGroup = req.body 
        const result = await groupCollection.insertOne(newGroup)
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


app.listen(port, ()=>{
    console.log(`App listening from port: ${port}`)
})