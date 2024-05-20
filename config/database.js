import mongoose from "mongoose";

let connected = false;

const connectDb = async () => {
  mongoose.set("strictQuery", true);
  // if db is already connected dont connect again
  if (connected) {
    console.log("MongoDb is already connected...");
    return;
  }

  // connect to Db
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("mongDb connected...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
