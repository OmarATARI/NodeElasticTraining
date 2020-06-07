const { Client } = require("@elastic/elasticsearch");
                   require("dotenv").config();

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const esclient   = new Client({ node: elasticUrl });
const index      = "movies2";
const type       = "movie";
const mapping = require('./mapping_movies/mapping.json');

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

async function createIndex(index) {
  try {

    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);

  } catch (err) {

    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);

  }
}

/**
 * @function setMoviesMapping,
 * @returns {void}
 * @description Sets the movies mapping to the database.
 */

async function setMoviesMapping () {
  try {
    const schema = mapping.mappings.movie;
  
    await esclient.indices.putMapping({ 
      index, 
      type,
      include_type_name: true,
      body: { 
        properties: schema 
      } 
    })
    
    console.log("Movies mapping created successfully");
  
  } catch (err) {
    console.error("An error occurred while setting the movies mapping:");
    console.error(err);
  }
}

/**
 * @function checkConnection
 * @returns {Promise<Boolean>}
 * @description Checks if the client is connected to ElasticSearch
 */

function checkConnection() {
  return new Promise(async (resolve) => {

    console.log("Checking connection to ElasticSearch...");
    let isConnected = false;

    while (!isConnected) {
      try {

        await esclient.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;

      } catch (_) {

      }
    }

    resolve(true);

  });
}

module.exports = {
  esclient,
  setMoviesMapping,
  checkConnection,
  createIndex,
  index,
  type
};