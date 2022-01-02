const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vw8cq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority1`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        const database = client.db('Foodmart');
        const usercollection = database.collection('user');
        const foodcollection = database.collection('food');
        const reviewcollection = database.collection('review');
        const ordercollection = database.collection('order');


        // GET Admin API
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const getEmail = { email: email };
            const user = await usercollection.findOne(getEmail);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // POST User API
        app.post('/user', async(req,res)=>{
            const user = req.body;
            const result = await usercollection.insertOne(user);
            console.log(result)
            res.json('result');
        })

        //PUT User API
        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usercollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // PUT Admin API
        app.put('/user/admin', async (req, res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const options = { upsert: true };
            const updateDoc = {
                $set : {role: user.role}
            }
            const result = await usercollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })


        // GET Food API
        app.get('/food', async (req, res) => {
            const getdata = foodcollection.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single Food API
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const getId = { _id: ObjectId(id) };
            const showId = await foodcollection.findOne(getId);
            res.json(showId);
        })


        // POST Food API
        app.post('/food', async (req, res) => {
            const add = req.body;
            const result = await foodcollection.insertOne(add);
            console.log(result);
            res.json(result);
        }) 

        // DELETE Food API
        app.delete('/food/:id', async(req, res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const deleteId = await foodcollection.deleteOne(getId);
            res.json(deleteId);
        })

        // GET Review API
        app.get('/review', async (req, res) => {
            const getdata = reviewcollection.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // POST Review API
        app.post('/review', async (req, res) => {
            const add = req.body;
            const result = await reviewcollection.insertOne(add);
            console.log(result);
            res.json(result);
        }) 

        // GET ORDER API
        app.get('/order', async (req, res) => {
            const getdata = ordercollection.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single ORDER API
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const getId = { _id: ObjectId(id) };
            const showId = await ordercollection.findOne(getId);
            res.json(showId);
        })

        // POST ORDER API

        app.post('/order', async (req, res) => {
            const add = req.body;
            const result = await ordercollection.insertOne(add);
            console.log(result);
            res.json(result);
        })
        
        //UPDATE ORDER API
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const update = {
                $set: {
                    name: updatedOrder.name, email: updatedOrder.email, title: updatedOrder.title, mobile: updatedOrder.mobile, price: updatedOrder.price, address: updatedOrder.address, status: updatedOrder.status 
                },
            };
            const result = await ordercollection.updateOne(filter, update, options);
            res.json(result);
        })

        // DELETE ORDER API
        app.delete('/order/:id', async(req, res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const deleteId = await ordercollection.deleteOne(getId);
            res.json(deleteId);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Server...')
})
app.listen(port, () => {
    console.log("Running port", port)
})






