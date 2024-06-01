const express = require('express');
const { db } = require('./mongodb.js')
const app = express();

const PORT = process.env.PORT || 3000;

// Jade
app.set('views', __dirname+'/views');
app.set('/css', __dirname+'/css')
app.set('view engine', 'jade');

app.use(express.json());

/**
 * Request Type: GET
 * 
 * this is the landing page that will give you some information about the api and load 
 */
app.get('/', async (req, res) => {
  res.render('home', {
    title: "Welcome to Home page"
  });
});

app.get('/docs', async (req, res) => {
  res.render('docs', {
    title: 'Documentation',
    output: JSON.stringify({
      anime_name: '...',
      character: '...',
      quote: '...'
    }, null, 2)
  });
});


/**
 * Request Type: GET
 * 
 * example request
 * - /quote
 * - /quote?anime_name=Attack%20on%20titan
 * - /quote?character=erwin%20smith&anime_name=Attack%20on%20titan
 */
app.get('/quote', async (req, res) => {
  try {
    var obj={};

    (req.query.anime_name!=undefined)?obj.anime_name=req.query.anime_name:"";
    (req.query.character!=undefined)?obj.character=req.query.character:"";
    (req.query.size!=undefined)?obj.size=req.query.size:obj.size=1;
    
    if(Object.keys(obj).length==1) {
      first_quote = await db.collection('anime_quotes').aggregate([{$sample: {size: Number(obj.size)}}]).toArray();
      (Number(obj.size)==1)?res.send(first_quote[0]):res.send(first_quote);
    }     
    else {
      delete obj.size;
      first_quote = (await db.collection('anime_quotes').find(obj).collation({locale: 'en', strength: 2}).toArray());
      first_quote = await first_quote[Math.floor(Math.random()*first_quote.length)];
      res.send(first_quote);
    }

    console.log('/quote was hit')
  } catch(ex) {
    console.error(ex);
  }
});

//Start app
app.listen(PORT, async () => {
  console.log("Server Listening on http://localhost:"+PORT);
});
