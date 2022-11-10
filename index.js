const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express=require('express');
const app=express();
require('dotenv').config();
const cors=require('cors');
const jwt=require('jsonwebtoken');
const port=process.env.PORT||5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mjqzqbo.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function veriifyJWT(req,res,next){
    const authheader=req.headers.authorization;
    if(!authheader){
       return res.status(401).send({message:'unauthorized access'})
    }
    const token=authheader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
        if(err){
          return  res.status(403).send({message:'unauthorized access'})
        }
        req.decoded=decoded;
        next();
    })
}
async function run(){
    try{
    const serviceCollection=client.db('weddingPhotographer').collection('services');
    const reviewCollection=client.db('weddingPhotographer').collection('reviews');
    app.post('/jwt',(req,res)=>{
        const user=req.body;
        const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
        res.send({token});
    })
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
    app.post('/myreviews',async(req,res)=>{
        const review=req.body;
        const result=await  reviewCollection.insertOne(review);
       res.send(result);
    })
    app.get('/myreviews',async(req,res)=>{
    //     const decoded=req.decoded;
    // console.log('inside orders api',decoded)
    // if(decoded.user!==req.query._id){
    //   return res.status(403).send({message:'unauthorized message'})
    // }
        let query={};
        if(req.query.email){
            query={
                email:req.query.email,
            
            }   
        }
    const cursor= reviewCollection.find(query);
    const reviews=await cursor.toArray();
    res.send(reviews)
    })
    app.get('/myreviews/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const myreview=await reviewCollection.findOne(query);
        res.send(myreview);
    })
    app.put('/myreviews/:id',async(req,res)=>{
        const id =req.params.id;
        const filter={_id:ObjectId(id)};
        const review=req.body;
        const option={upsert:true};
        const updatedReview={
            $set:{
                photoUrl:review.photourl,
             customer:review.customer,
            message:review.message,
            }
        }
        const result=await reviewCollection.updateOne(filter,updatedReview,option);
        res.send(result)
        
    })

    app.delete('/myreviews/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const result=await reviewCollection.deleteOne(query);
        res.send(result)
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
    console.log(`photgrapher port running on port ${port}`)
})