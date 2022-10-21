import { MongoClient } from "mongodb";

let uri = "mongodb+srv://lol:lordslands123456@lol-maps.n4xq0ul.mongodb.net/?retryWrites=true&w=majority";
let dbName = "test";

export const connectToDatabase = async () => {
  return await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => client.db(dbName))
    .catch((err) => console.log(err));
};


const handler = async (req, res) => {
  const db = await connectToDatabase();
  const collectionObj = db.collection("maps");
  const data = await collectionObj.find({}).toArray();
  return res.json(data || []);
};

export default handler;
