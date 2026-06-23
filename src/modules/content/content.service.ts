import { ContentRepository } from "./content.repository";
import { CreateContentSer, DeleteContentTypes, GetContentTypes } from "./content.types";
import { TagRepository } from "./tag.repository";
import { Types } from "mongoose";
import { nanoid } from "nanoid";

export const ContentService = {
	createContent: async (data: CreateContentSer) => {
		const { type, link, title, tags, note, description, userId } = data;

		if (link) {
			const existingContent = await ContentRepository.findByLink(link, userId);
			if (existingContent) {
				throw new Error("DUPLICATE_LINK");
			}
    }

		const uniqueTags = [...new Set(tags)];
		const tagDoc = await Promise.all(
			uniqueTags.map((tagTitle) => TagRepository.findOrCreate(tagTitle))
		);
		const tagId = tagDoc.map((tag) => tag._id);

		const newContent = await ContentRepository.createContent({
			type,
			title,
			link,
			note,
			description,
			tags: tagId,
			userId,
			createdAt: new Date()
		});

		return newContent;
	},

	GetContent: async (userId: string) => {
		const content = await ContentRepository.findByUserId(userId)
		
		if(!content) 
			throw new Error("CONTENT_NOT_FOUND");

		return content;
	},

	DeleteContent: async (data: DeleteContentTypes) => {
		const deletedContent = await ContentRepository.deleteByUserId(data);

		if (!deletedContent) {
			throw new Error("CONTENT_NOT_FOUND");
		}

		return deletedContent;
	},

	shareContent: async (contentId: Types.ObjectId, userId: Types.ObjectId) => {
		const content = await ContentRepository.findById(contentId, userId);

		if(!content) throw new Error("CONTENT_NOT_FOUND");

		if(content.shareLink) return content.shareLink;

		const shareLink = nanoid(21);
		content.shareLink = shareLink;
		await content.save();

		return shareLink;
	},

	unshareContent: async (contentId: Types.ObjectId, userId: Types.ObjectId) => {
		const content = await ContentRepository.findById(contentId, userId);

		if(!content) throw new Error("CONTENT_NOT_FOUND");
		if(!content.shareLink) throw new Error("CONTENT_NOT_FOUND");

		content.shareLink = undefined;
		await content.save();

		return true;
	},

	getSharedContent: async (shareLink: string) => {
		const content = await ContentRepository.findByShareLink(shareLink);

		if(!content) throw new Error("CONTENT_NOT_FOUND");

		return content;
	}
}