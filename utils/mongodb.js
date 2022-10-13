import { MongoClient } from "mongodb";

let uri = "mongodb+srv://propert-test:propert12345@cluster0.uvnik.mongodb.net/propert-test?retryWrites=true&w=majority";
let dbName = "propert-test";

export const connectToDatabase = async () => {
  return await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => client.db(dbName))
    .catch((err) => console.log(err));
};
