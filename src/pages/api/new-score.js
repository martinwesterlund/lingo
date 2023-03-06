import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method !== "POST") return;
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGODB_URI
    );
    const db = client.db();
    const collection = db.collection("Toplist");
    const result = await collection.insertOne(req.body);
    client.close();
    return res.status(201).json({
      score: result,
      message: "Score added",
    });
}
export default handler;



