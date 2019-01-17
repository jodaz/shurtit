//------ IMPORTS ------//
const express    = require('express'),
			app        = express(),
			mongo      = require('mongodb').MongoClient,
			path       = require('path'),
			assert     = require('assert'),
			cors       = require('cors'),
			bodyParser = require('body-parser'),
			postUrlController = require('./controllers/postController.js'),
			getUrlController  = require('./controllers/getController.js');

require('dotenv').config(); // Set enviroment variables

//------ MIDDLEWARES ------//
// Set pug as templating engine
app.set('view engine', 'pug');
app.use("/public", express.static(path.join(__dirname, ('public'))));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//------ MONGO SET UP ------//
mongo.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (error, client) => {
	assert.equal(error, null);
	console.log("Successfully connected to MongoDB");

  db = client.db(process.env.DBNAME);

  //------ ROUTES ------//
  app.get('/', (request, response) => {
		response.render('index', { title: 'Shurt it!' })
	});
	
	app.post('/new', postUrlController.postURL);
	app.get('/:short', getUrlController.getUrl);
	
	app.get('*', (request, response) => {
		response.render('404', { title: '404 - Resource not found' })
	});

  app.listen(process.env.PORT || 3000, () => {
      console.log(`Server started at port ${process.env.PORT || 3000}`);
  });
});