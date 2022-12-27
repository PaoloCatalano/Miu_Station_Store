import mongoose from "mongoose";
/* DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning. */
const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected.");
    return;
  }
  mongoose.connect(process.env.MONGODB_URL, (err) => {
    if (err) throw err;
    console.log("Connected to mongodb.");
  });
};

export default connectDB;
