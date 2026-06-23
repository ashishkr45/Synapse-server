import { Types } from "mongoose";
import { Content } from "../../database/content.schema";
import { CreateContentRepo, DeleteContentTypes, GetContentTypes, FindLinkByUserId } from "./content.types";
import { content } from "googleapis/build/src/apis/content";

export const ContentRepository = {
	createContent: async (data: CreateContentRepo) => {
		return await Content.create(data);
	},

	findLinkByUserId: async (data: FindLinkByUserId) => {
    return await Content.findOne(data);
  },

	findByUserId: async (userId: string) => {
		return await Content.find({ userId })
			.populate("userId", "username")
			.populate("tags", "title");
	},

	deleteByUserId: async (props: DeleteContentTypes) => {
		return await Content.findOneAndDelete({
			_id: props._id,
			userId: props.userId
		})
	},

	findByLink: async (link: string, userId: string | Types.ObjectId) => {
    return await Content.findOne({ link, userId });
	},

	findById: async(contentId: Types.ObjectId, userId: Types.ObjectId) => {
		return await Content.findOne({ _id: contentId, userId });
	}, 

	findByShareLink: async (shareLink: string) => {
		return await Content.findOne({ shareLink })
			.populate("userId", "username")
			.populate("tags", "title");
	},
}