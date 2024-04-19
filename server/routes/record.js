import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// The initial name of the connection
const PIECE_COLLECTION_NAME = "truncatedinitialdata"

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection(PIECE_COLLECTION_NAME);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a list of all the records limited to 50
router.get("/limited", async (req, res) => {
    let collection = await db.collection(PIECE_COLLECTION_NAME);
    let results = await collection.find({}).limit(50).toArray();
    res.send(results).status(200);
});

router.get("/recommendation/:id", async (req, res) => {
    let collection = await db.collection(PIECE_COLLECTION_NAME);
    let results = await collection.aggregate([{ $sample: { size: 3 }}]).toArray();
    res.send(results).status(200);
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