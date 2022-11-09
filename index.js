const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const reviewCollection=client.db('weddingPhotographer').collection('reviews');
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
    app.get('/services/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const service=await serviceCollection.findOne(query);
        res.send(service);
    })
    app.post('/services',async(req,res)=>{
        const service=req.body;
        const result=await serviceCollection.insertOne(service);
        res.send(service);
    })
    app.post('/reviews',async(req,res)=>{
        const review=req.body;
        const result=await reviewCollection.insertOne(review);
       res.send(result);
    })
    
    app.get('/reviews',async(req,res)=>{
        let query={};
        if(req.query.email){
            query={
                email:req.query.email,
            
            }
           
        }
    const cursor=reviewCollection.find(query);
    const reviews=await cursor.toArray();
    res.send(reviews)
    
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