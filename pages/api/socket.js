import { Server } from "socket.io";
import { connectToDatabase } from "utils/mongodb";

var socket = null;

const handler = async (_, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    socket = io;
  }

  const db = await connectToDatabase();
  const collectionObj = db.collection("maps");

  const changeStream = collectionObj.watch([], {
    fullDocument: "updateLookup",
  });

  changeStream.on("change", (change) => {
    socket.emit("changed", change.fullDocument);
  });

  res.end();
};

export default handler;
