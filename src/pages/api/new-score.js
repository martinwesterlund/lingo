// import { MongoClient } from "mongodb";

// async function handler(req, res) {
//   console.log("Body", req.body);
//   if (req.method !== "POST") return;

//   try {
//     const { name, score } = req.body;
//     if (!name || !score) return;

//     const client = await MongoClient.connect(process.env.MONGODB_URI);
//     const db = client.db();
//     const collection = db.collection("Toplist");
//     const result = await collection.insertOne({ name, score });
//     client.close();
//     res.status(201).json({
//       score: result,
//       message: "Score added",
//     });
//   } catch (error) {
//     res.json(error);
//     res.status(405).end();
//   }
// }
// export default handler;


// export default async function(req: NextApiRequest, res: NextApiResponse) {
//   return new Promise(resolve => {
//         try {
//           const request = http.request( // Node core http module
//             url,
//             {
//               headers: await makeHeaders(req, res),
//               method: req.method,
//             },
//             response => {
//               response.pipe(res);
//               resolve()
//             },
//           );

//           request.write(JSON.stringify(req.body));
//           request.end();
//         } catch (error) {
//           Log.error(error); // Can be a simple console.error too
//           res.status(500).end();
//           return resolve()
//         }
//       }
//     }
//     res.status(405).end();
//     return resolve()
//   })
// }