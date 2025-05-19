import mongoose from "mongoose";
import env from 'dotenv';

env.config();
// Connect to MongoDB using the connection string from .env
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default mongoose;