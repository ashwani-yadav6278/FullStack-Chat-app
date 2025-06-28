import mongoose from 'mongoose';

 const connectDB= async()=>{
    try {

      const conn=  await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected successfully:  ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDb connection error:", error)
    }
}

export default connectDB;