import { connectToDatabase } from "utils/mongodb";

const handler = async (req, res) => {
  const db = await connectToDatabase();
  const collectionObj = db.collection("maps");
  const data = await collectionObj.find({}).toArray();
  return res.json(data || []);
};

export default handler;
