/*
Problem:

Our first movie night was a success. Unfortunately, our ISP called to let us know we're close to our bandwidth quota, but we need another movie recommendation!

Using the same $match stage from the previous lab, add a $project stage to only display the the title and film rating (title and rated fields).

Assign the results to a variable called pipeline.

*/

/* connection string 
mongo "mongodb://cluster0-shard-00-00-jxeqq.mongodb.net:27017,cluster0-shard-00-01-jxeqq.mongodb.net:27017,cluster0-shard-00-02-jxeqq.mongodb.net:27017/aggregations?replicaSet=Cluster0-shard-0" --authenticationDatabase admin --ssl -u m121 -p aggregations --norc

*/
 //######################## solution ###############################

  
  var pipline = [
    {
      $match: 
        {
          "imdb.rating": {$gte: 7},
          genres: { $nin: ["Crime", "Horror"]},
          rated: {$in: ["PG", "PG"]},
          languages: {$all: ["English","Japanese"]}
      
      }
    },{
      $project:{
        _id: 0, title: 1, rated: 1
      }
    }
   
    ];
  
    