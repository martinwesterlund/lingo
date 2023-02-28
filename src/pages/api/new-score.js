import { MongoClient } from "mongodb";

async function handler(req, res) {
  return new Promise(resolve => {
  console.log("Body", req.body);
  if (req.method !== "POST") return;

    const { name, score } = req.body;
    if (!name || !score) return;

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const collection = db.collection("Toplist");
    const result = await collection.insertOne({ name, score });
    client.close();
    res.status(201).json({
      score: result,
      message: "Score added",
    });
    return resolve()
  })
}
export default handler;
