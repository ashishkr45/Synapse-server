import { Tag } from "../../database/content.schema";
import { Types } from "mongoose";

export const TagRepository = {
	findByTitle: async (title: string) => {
		return await Tag.findOne({ title });
	},

	create: async (title: string) => {
		return await Tag.create({ title });
	},

	findOrCreate: async (title: string) => {
		let tag = await Tag.findOne({ title });
		if(!tag) {
			tag = await Tag.create({ title });
		}
		return tag;
	}
}