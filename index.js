const express = require("express");
	const app = express();
	require ('dotenv').config();
	const cors = require('cors');
	const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
	const port = process.env.PORT || 5000;

	app.use(
		cors({
			origin: ['http://localhost:5173', 'https://my-foodish.web.app', 'https://my-foodish.firebaseapp.com'],
			credentials: true,
		}),
	)
	app.use(express.json());


	const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdbwfxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
			const foodCollection = client.db('coolinaryDB').collection('food')
			
	
			app.get('/food', async(req, res)=>{
			  const result = await foodCollection.find().toArray()
			  res.send(result)
		  })
	
			// single page details
			app.get('/details/:id', async(req, res)=>{
			  const id = req.params.id
			  const query = {_id: new ObjectId(id)}
			  const result = await foodCollection.findOne(query)
			  res.send(result)
			})

	
	
			// send data for all food pages 
			app.get('/allfood', async(req, res)=>{
				const filter = req.query.filter
				const sort = req.query.sort
				const search = req.query.search
				let query ={}
	
				if(search){
					query ={
						food_name : {$regex: search, $options: 'i'}
					  }
				}

				if(filter) query.category = filter
				let options ={}
				if(sort) options = {sort: {price:sort === 'asc'?1:-1 }}
				const result = await foodCollection.find(query, options).toArray()
				res.send(result)
			})
	
	
	
	
	
		  // await client.db("admin").command({ ping: 1 });
		  console.log("Pinged your deployment. You successfully connected to MongoDB!");
		} finally {
	
		}
	  }
	  run().catch(console.dir);
	
	
	app.get('/', (req, res)=>{
		res.send('This is server side of foodish')
	})
	
	
	app.listen(port, ()=>{
		console.log(`coolinay cafe server link http://localhost:${port}`)
	})

