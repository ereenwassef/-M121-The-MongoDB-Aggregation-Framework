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

   // EX 1  $match and $projectLab2
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
  
  // EX2 Lab - Computing Fields

  /**Problem:

Our movies dataset has a lot of different documents, some with more convoluted titles than others. If we'd like to analyze our collection to find movie titles that are composed of only one word, we could fetch all the movies in the dataset and do some processing in a client application, but the Aggregation Framework allows us to do this on the server!

Using the Aggregation Framework, find a count of the number of movies that have a title composed of one word. To clarify, "Cinderella" and "3-25" should count, where as "Cast Away" would not.

Make sure you look into the $split String expression and the $size Array expression

To get the count, you can append itcount() to the end of your pipeline

*/


 //######################## solution ###############################

//We begin with a $match stage, ensuring that we only allow movies where the title is a string
  db.movies.aggregate([
    {
      $match: {
        title: {
          $type: "string"
        }
      }
    },
   // Next is our $project stage, splitting the title on spaces. This creates an array of strings
    {
      $project: {
        title: { $split: ["$title", " "] },
        _id: 0
      }
    },
    //We use another $match stage to filter down to documents that only have one element in the newly computed title field, and use itcount() to get a count
    {
      $match: {
        title: { $size: 1 }
      }
    }
  ]).itcount()

  // EX3 Optional Lab - Expressions with $project

  /*
  Problem:

Let's find how many movies in our movies collection are a "labor of love", where the same person appears in cast, directors, and writers

Hint: You will need to use $setIntersection operator in the aggregation pipeline to find out the result.

Note that your dataset may have duplicate entries for some films. You do not need to count the duplicate entries.

To get a count after you have defined your pipeline, there are two simple methods.
  */
 //######################## solution ###############################
 // With our first $match stage, we filter out documents that are not an array or have an empty array for the fields we are interested in.

 db.movies.aggregate([
  {
    $match: {
      cast: { $elemMatch: { $exists: true } },
      directors: { $elemMatch: { $exists: true } },
      writers: { $elemMatch: { $exists: true } }
    }
  },
   //  Next is a $project stage, removing the _id field and retaining both the directors and cast fields. We replace the existing writers field with a new computed value, cleaning up the strings within writers
  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
        $map: {
          input: "$writers",
          as: "writer",
          in: {
            $arrayElemAt: [
              {
                $split: ["$$writer", " ("]
              },
              0
            ]
          }
        }
      }
    }
  },
// We use another $project stage to computer a new field called labor_of_love that ensures the intersection of cast, writers, and our newly cleaned directors is greater than 0. This definitely means that at least one element in each array is identical! $gt will return true or false.
  {
    $project: {
      labor_of_love: {
        $gt: [
          { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
          0
        ]
      }
    }
  },
  // Lastly, we follow with a $match stage, only allowing documents through where labor_of_love is true. In our example we use a $match stage, but itcount() works too.
  {
    $match: { labor_of_love: true }
  },
  {
    $count: "labors of love"
  }
])