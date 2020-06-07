const express = require('express');
const path = require("path");
const app = express();
const hostname = '0.0.0.0';
const port = process.env.NODE_PORT || 3002;
const cors = require('cors');
const bodyParser = require('body-parser');
const elastic = require("./elastic");
const routes = require('./api/routes');
                require("dotenv").config();

(async function main() {

  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {

    const elasticIndex = await elastic.esclient.indices.exists({index: elastic.index});

    if (!elasticIndex.body) {
      await elastic.createIndex(elastic.index);
      await elastic.setMoviesMapping();
    }

    app.use(cors())
             .use(bodyParser.urlencoded({ extended: false }))
             .use(bodyParser.json())
             .use("/movies",routes)
             .use((_req, res) => res.status(404).json({ success: false,error: "Route not found" }))
             .listen(port, () => console.log(`Server ready on port ${port}`));
  }

})();

// setting view engine to pug (new name for jade)
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Root path for front
app.get('/', function(req, res){
  res.render("index");
});

app.post('/',(req,res) => {
  {
    const requests = require('./requests');
      (async () => {
          console.log(req.body);
          let params = req.body;
          let json = requests.requestJSON(params);
          res.locals.results = await requests.postRequest(json);
          console.log(JSON.stringify(res.locals.results));
          res.render('index', { title: 'Hey', results: JSON.stringify(res.locals.results)});
      })();
      res.status(200);
      res.type('html');
      res.end('home');
  }
});

app.listen(3001, hostname);
