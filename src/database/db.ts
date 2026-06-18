import mongoose from "mongoose";
import { mongoUrl } from "../config";

async function connectDB() {
	try {
		const connectionInstance = await mongoose.connect(`${mongoUrl}`)
		console.log(`MongoDB Connected! \n DB Host: ${connectionInstance.connection.host}`);
	} catch (error) {
		console.error(`[MONGOOSE_CONNECTION_FAILED]: ${error}`);
		process.exit(1);
	}
}

export default connectDB;