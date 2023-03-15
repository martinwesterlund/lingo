import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method !== "GET") return;

  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("Toplist");
  const toplist = await collection
    .find({})
    .sort({ points: -1 })
    .limit(10)
    .toArray();

  const inARowToplist = await collection
    .find({})
    .sort({ inARow: -1 })
    .limit(10)
    .toArray();
  client.close();

  return res.status(200).json({
    toplist,
    inARowToplist,
    messade: "Toplist fetched",
  });
}
export default handler;
