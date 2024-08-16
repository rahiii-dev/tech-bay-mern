import mongoose from "mongoose";

console.log(process.env);

export async function DbConnect() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to Database...");
    } catch (error) {
        console.log(error, "Error connecting to Database...");
    }
}
