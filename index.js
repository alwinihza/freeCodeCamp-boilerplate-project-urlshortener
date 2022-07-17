require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

var shorten_url_map = [];

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res){
  shorten_url_map.push(String(req.body.url));
  console.log(shorten_url_map);
  res.json({original_url: String(req.body.url), short_url: shorten_url_map.indexOf(String(req.body.url))});
});

app.get('/api/:shorturl', function(req, res) {
  res.redirect(shorten_url_map[req.params.shorturl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
