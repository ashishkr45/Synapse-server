import mongoose from "mongoose";
import { mongoUrl } from "../config";

async function connectDB() {
	try {
		await mongoose.connect(`${mongoUrl}`)
	} catch (error) {
		console.error(`[MONGOOSE_CONNECTION_FAILED]: ${error}`);
		process.exit(1);
	}
}

export default connectDB;