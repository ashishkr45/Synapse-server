import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { ContentService } from "./content.service";
import { Types } from "mongoose";
import { ValidationError, AuthenticationError, ConflictError, NotFoundError } from "../../utils/errors";

export const contentController = {
	postContent: async (req: Request, res: Response): Promise<void> => {
		try {
			const data = req.body;

			const userId = req.userId;
			if(!userId) {
				throw new AuthenticationError("User not authenticated");
			}

			const newContent = await ContentService.createContent({
				...data.data,
				userId
			});

			res.status(201).json({
				success: true,
				message: "Content created successfully",
				data: newContent
			});

		} catch(error) {
			console.error("[Create Content Error]:", error);

			if (error instanceof Error && error.message === "DUPLICATE_LINK") {
        throw new ConflictError("This link has already been saved");
      }
      throw error;
		}
	},

	getContent: async(req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		if(!userId)
			throw new AuthenticationError("User not authenticated");

		try {
			const content = await ContentService.GetContent(userId);

			res.status(200).json({
				success: true,
				message: "Content Feteched",
				content
			});
		} catch(error) {
			console.error("[Get Content Error]:", error);
			if (error instanceof Error && error.message === "CONTENT_NOT_FOUND") {
        throw new NotFoundError("No content found for this user");
			}
			throw error;
		}
	},

	deleteContent: async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		const { contentId } = req.params;

		if (!userId) {
			throw new AuthenticationError("User not authenticated");
		}

		if (!contentId) {
			throw new ValidationError("Content ID is required");
		}

		if (!Types.ObjectId.isValid(contentId)) {
			throw new ValidationError("Invalid content ID format");
		}

		try {
			const deletedContent = await ContentService.DeleteContent({
				_id: new Types.ObjectId(contentId),
				userId: new Types.ObjectId(userId),
			});

			res.status(200).json({
				success: true,
				message: "Content deleted successfully",
				data: deletedContent,
			});

		} catch (error) {
			console.error("[Delete Content Error]:", error);
			if (error instanceof Error && error.message === "CONTENT_NOT_FOUND") {
				throw new NotFoundError("Content");
			}
			throw error;
		}
	},

	shareContent: async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		const { contentId } = req.body;

		if (!userId) {
			throw new AuthenticationError("User not authenticated");
		}

		if (!contentId) {
			throw new ValidationError("Content ID is required");
		}

		if (!Types.ObjectId.isValid(contentId)) {
			throw new ValidationError("Invalid content ID format");
		}

		try {
			const shareLink = await ContentService.shareContent(
				new Types.ObjectId(contentId),
				new Types.ObjectId(userId)
			)

			res.status(200).json({
				success: true,
				message: "Shareable link created",
				shareLink: `/content/${shareLink}`,
			});
			return;
		} catch(error) {
			console.error("[Share Content Error]:", error);
			if (error instanceof Error && error.message === "CONTENT_NOT_FOUND") {
				throw new NotFoundError("Content");
			}
			throw error;
		}
	},

	unshareContent: async (req: Request, res: Response): Promise<void> => {
		const userId = req.userId;
		const { contentId } = req.body;

		if (!userId) {
			throw new AuthenticationError("User not authenticated");
		}

		if (!contentId) {
			throw new ValidationError("Content ID is required");
		}

		if (!Types.ObjectId.isValid(contentId)) {
			throw new ValidationError("Invalid content ID format");
		}

		try {
			await ContentService.unshareContent(
				new Types.ObjectId(contentId),
				new Types.ObjectId(userId)
			)

			res.status(200).json({
				success: true,
				message: "Content is private",
			});
			return;

		} catch(error) {
			console.error("[Unshare Content Error]:", error);

			if (error instanceof Error && error.message === "CONTENT_NOT_FOUND") {
				throw new NotFoundError("Content");
			}
			if (error instanceof Error && error.message === "ALREADY_PRIVATE") {
				throw new ValidationError("Content is already private");
			}
			throw error;
		}
	},

	getShareContent: async (req: Request, res: Response): Promise<void> => {
		const { shareLine } = req.body;

		if (!shareLine) {
			throw new ValidationError("Share link is required");
		}

		try {
			const content = await ContentService.getSharedContent(shareLine);

			res.status(200).json({
				success: true,
				message: "Content fetched",
				content,
			});
			return;

		} catch(error) {
			console.error("[Get Shared Content Error]:", error);
			
			if (error instanceof Error && error.message === "CONTENT_NOT_FOUND") {
				throw new NotFoundError("Content");
			}
			throw error;
		}
	}
}