import mongoose, { Schema } from "mongoose";

export interface UserType {
	email: string,
	username: string,
	googleId: string
	profilePic?: string,
};

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},

	username: {
		type: String,
		required: false,
	},

	googleId: {
		type: String,
		unique: true,
		required: true
	},

	profilePicUrl: {
		type: String,
		required: false
	},
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);