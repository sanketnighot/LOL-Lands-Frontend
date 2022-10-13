// import { connectToDatabase } from "../../src/utils/mongodb";
import { MongoClient } from "mongodb";

let uri = "mongodb+srv://propert-test:propert12345@cluster0.uvnik.mongodb.net/propert-test?retryWrites=true&w=majority";
let dbName = "propert-test";

const connectToDatabase = async () => {
  return await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => client.db(dbName))
    .catch((err) => console.log(err));
};

const handler = async (req, res) => {
  const { id, data } = req.body;

  console.log(id, data);

  const db = await connectToDatabase();
  const collectionObj = db.collection("maps");
  await collectionObj.updateOne({ _id: id }, { $set: data });
  return res.json(true);
};

export default handler;
