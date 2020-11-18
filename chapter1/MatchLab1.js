/* Problem 
Help MongoDB pick a movie our next movie night! Based on employee polling, we've decided that potential movies must meet the following criteria.

imdb.rating is at least 7
genres does not contain "Crime" or "Horror"
rated is either "PG" or "G"
languages contains "English" and "Japanese"
Assign the aggregation to a variable named pipeline, like:
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
  
  },
}
];

