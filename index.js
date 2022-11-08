const { MongoClient, ServerApiVersion } = require('mongodb');
const express=require('express');
const app=express();
require('dotenv').config();
const cors=require('cors');
const port=process.env.PORT||5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mjqzqbo.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
    const serviceCollection=client.db('weddingPhotographer').collection('services');
    app.get('/services',async(req,res)=>{
        const query={};
        const cursor=serviceCollection.find(query).limit(3);
        const services=await cursor.toArray();
        res.send(services)
    })
    app.get('/services2',async(req,res)=>{
        const query={};
        const cursor=serviceCollection.find(query);
        const services2=await cursor.toArray();
        res.send(services2)
    })

    }
    finally{

    }
}
run().catch(err=>console.error(err))

app.get('/',(req,res)=>{
    res.send('photographer api running')
})
app.listen(port,()=>{
    console.log(`photgrapher port running on port${port}`)
})