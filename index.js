const express = require('express');
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.Mongo_Id}:${process.env.Mongo_Pass}@cluster0.bitxn0d.mongodb.net/?retryWrites=true&w=majority`;

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
        const database = client.db('toysDB').collection('toys')
        // const indexKeys = { toyName: 1 }
        // const indexOptions = { name: 'toy_name' }
        // const index = await database.createIndex(indexKeys, indexOptions)

        app.post('/toys', async (req, res) => {

            const body = req.body
            const result = await database.insertOne(body);
            res.send(result)
        })
        app.get('/toys', async (req, res) => {
            const result = database.find().limit(20)
            const toArray = await result.toArray()
            res.send(toArray)
        })
        app.get('/category/:text', async (req, res) => {
            const ctg = req.params.text
            const result = await database.find({ category: { $eq: ctg } })
            const toArray = await result.toArray()
            res.send(toArray)
        })
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const delet = await database.deleteOne(quary)
            res.send(delet)
        })
        app.get('/toys/:text', async (req, res) => {
            const text = req.params.text
            const result = await database.find({ toyName: { $regex: text, $options: "i" } }).limit(20)
            const toArray = await result.toArray()
            res.send(toArray)
        })
        app.get('/my_toys', async (req, res) => {
            const { email } = req.query

            const { num } = req.query

            if (+num === -1 || +num === 1) {
                const result = await database.find({ email: { $eq: email } }).sort({ price: +num })
                const toArray = await result.toArray()
                res.send(toArray)
            }
            else {
                const data = await database.find({ email: { $eq: email } })
                const toArray = await data.toArray()
                res.send(toArray)
            }


        })
        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const body = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: body
            };
            const result = await database.updateOne(quary, updateDoc, options)
            res.send(result)

        })
        app.get('/toy_details/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await database.findOne(quary)
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
    res.send('assaingment 11')
})

app.listen(port)
