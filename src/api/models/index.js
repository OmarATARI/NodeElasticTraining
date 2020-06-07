const { esclient, index, type } = require("../../elastic");

async function getMovies(req) {

  const query = {
    query: {
      match: {
        fields: {
          title: req.text
        },
        operator: "and",
        fuzziness: "auto"
      }
    }
  }

  const { body: { hits } } = await esclient.search({
    from:  req.page  || 0,
    size:  req.limit || 100,
    index: index, 
    type:  type,
    body:  query
  });

  const results = hits.total.value;
  const values  = hits.hits.map((hit) => {
    return {
      id:     hit._id,
      quote:  hit._source.quote,
      author: hit._source.author,
      score:  hit._score
    }
  });

  return {
    results,
    values
  }

}

module.exports = {
  getMovies
}