import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// The initial name of the connection
const PIECE_COLLECTION_NAME = "initialdata"

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

const initialSortOrder = {
  period: 1,
  composer: 1,
  work: 1,
  performers: 1,
  time: 1,
}

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let results = await collection.find({}).sort(initialSortOrder).limit(10000).toArray();
  res.send(results).status(200);
});

// This section will help you get a list of all the records limited to 50
router.get("/limited", async (req, res) => {
    let collection = await db.collection(PIECE_COLLECTION_NAME);
    let results = await collection.find({}).limit(50).toArray();
    res.send(results).status(200);
});

// This section will search for records matching the given term.
router.post("/search", async (req, res) => {
  const path = req.body.searchField === "*" ? {wildcard: "*"} : req.body.searchField
  const queryText = req.body.queryText
  if (!path || !queryText) res.send("Not found").status(404);
  else {
    const searchQuery = [
      {
        $search: {
          "text": {
            "query": queryText,
            "path": path,
          }
        }
      }
    ]
    let collection = await db.collection(PIECE_COLLECTION_NAME);
    let results = await collection.aggregate(searchQuery).toArray();
    res.send(results).status(200);
  }
});

router.get("/recommendation/:id", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let query = { _id: new ObjectId(req.params.id) };
  let result = [await collection.findOne(query)];

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.get("/recommendation/composer/:id", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let query = { _id: new ObjectId(req.params.id) };
  let og_result = await collection.findOne(query);
  if (!og_result) res.send("Not found").status(404);
  else {
    let results = await collection.aggregate([{$match: {_id: { $ne: og_result._id }, composer: og_result.composer}}, {$sample: {size: 3}}]).toArray();
    res.send(results).status(200);
  }
});

router.get("/recommendation/period/:id", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let query = { _id: new ObjectId(req.params.id) };
  let og_result = await collection.findOne(query);
  if (!og_result || !og_result.time) res.send("Not found").status(404);
  else {
    const origin = isNaN(og_result.time) ? 20.0 : parseFloat(og_result.time)
    const pivot = isNaN(og_result.time) ? 5.0 : parseFloat(og_result.time) / 4
    let results = await collection.aggregate([
      {$search: {
          compound: {
            must: [
              {
                equals: {
                  path: "period",
                  value: og_result.period
                }
              },
              {
                moreLikeThis: {
                  like: [
                    { work: og_result.work },
                  ]
                }
              },
              {
                near: {
                  path: "time",
                  origin: origin,
                  pivot: pivot,
                  score: { boost: { value: 10 } }
                }
              }
            ], 
            mustNot: [
              {
                equals: {
                  path: "_id",
                  value: og_result._id
                }
              },
              {
                text: {
                  query: og_result.work,
                  path: { value: "work", multi: "keywordAnalyzer" },
                }
              }
            ],
          }
        }
      },
      {
        $limit: 5
      }
    ]).toArray();
    res.send(results).status(200);
  }
});

router.get("/recommendation/disc/:id", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let query = { _id: new ObjectId(req.params.id) };
  let og_result = await collection.findOne(query);
  if (!og_result) res.send("Not found").status(404);
  else {
    let results = await collection.aggregate([{$match: {_id: { $ne: og_result._id }, label: og_result.label, number: og_result.number}}]).toArray();
    res.send(results).status(200);
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      label: req.body.label,
      format: req.body.format,
      number: req.body.number,
      period: req.body.period,
      composer: req.body.composer,
      work: req.body.work,
      performers: req.body.performers,
      time: req.body.time,
    };
    let collection = await db.collection(PIECE_COLLECTION_NAME);
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        label: req.body.label,
        format: req.body.format,
        number: req.body.number,
        period: req.body.period,
        composer: req.body.composer,
        work: req.body.work,
        performers: req.body.performers,
        time: req.body.time,
      },
    };

    let collection = await db.collection(PIECE_COLLECTION_NAME);
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection(PIECE_COLLECTION_NAME);
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;