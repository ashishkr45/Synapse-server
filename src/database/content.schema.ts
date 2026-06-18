import mongoose, { Schema, Types } from "mongoose";

// Content Schema
export const contentVariety = [
	"article", "tweet", "link", "document", 
	"youtube", "code", "thread", "note", "quote", "event", 
	"bookmark", "post", "reel",
];

const contentSchema = new Schema({
	link: { type: String, },
	type: { type: String, enum: contentVariety, required: true },
	note: { type: String, },
	description: { type: String, },
	title: { type: String, required: true },
	tags: [{ type: Types.ObjectId, ref: 'Tag', required: true }],
	userId: { type: Types.ObjectId, required: true, ref: 'User' },
	shareLink: { type: String, unique: true, sparse: true },
	createdAt: { type: Date, default: Date.now }
});

export const Content = mongoose.model('Content', contentSchema);

// Tag Schema
const tagSchema = new Schema({
	title: { type: String, required: true, unique: true }
});

export const Tag = mongoose.model('Tag', tagSchema);