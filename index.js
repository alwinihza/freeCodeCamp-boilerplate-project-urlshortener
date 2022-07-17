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

var shorten_url_map = ['http://google.com'];

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res){
  if(!validURL(String(req.body.url)))
    res.json({error : "invalid url"});
  if (shorten_url_map.indexOf(String(req.body.url)) == -1 )
    shorten_url_map.push(String(req.body.url));
  res.json({original_url: String(req.body.url), short_url: shorten_url_map.indexOf(String(req.body.url))});
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  // res.json({response: Number(req.params.shorturl)});
  if(Number(req.params.shorturl) != NaN)
    res.redirect(301,shorten_url_map[Number(req.params.shorturl)]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
