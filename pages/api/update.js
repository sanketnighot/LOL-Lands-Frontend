import { connectToDatabase } from "../../src/utils/mongodb";

const handler = async (req, res) => {
  const { id, data } = req.body;

  console.log(id, data);

  const db = await connectToDatabase();
  const collectionObj = db.collection("maps");
  await collectionObj.updateOne({ _id: id }, { $set: data });
  return res.json(true);
};

export default handler;
