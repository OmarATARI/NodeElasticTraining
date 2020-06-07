const fetch  = require('node-fetch');

exports.postRequest = (json) => {
    return new Promise ((resolve, reject) => {
        fetch('http://localhost:9200/movies2/_search?pretty', {
            method : 'post' ,
            body : json ,
            headers:{'Content-Type': 'application/json'}
        })
            .then((res) => res.json())
            .then ((json) => {
                resolve (json.hits.hits)
            })
            .catch((e) => {
                reject(e);
                console.error(e);
            })
    } )
};

exports.requestJSON = (params) => {
    return JSON.stringify( { 
        "query":{
            "bool": {
                "must":[
                    { "match_phrase": { "fields.actors": params.actor}},
                    { "match": { "fields.plot": params.plot}},
                ]
                }}
    });
}
