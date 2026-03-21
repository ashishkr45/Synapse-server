import { Request, Response, Router } from "express";
import { z } from "zod";
import { Content, Tag } from "../database/db";
import { auth } from "../middleware/middleware";
import { nanoid } from "nanoid";

const contentRouter: Router = Router();

export const contentSchema = z.object({
  type: z.enum([
    "article", "tweet", "link", "document", "youtube", 
    "code", "thread", "note", "quote", "event", 
    "bookmark", "post", "reel",
  ]),
  link: z.string().url().optional(),
  note: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()),
});


contentRouter.post("/board", auth, async (req: Request, res: Response) => {
  try {
    const parsedData = contentSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid input format",
        error: parsedData.error.format(),
      });
      return;
    }

    const { type, link, title, tags, note } = parsedData.data;

    if (link) {
      const exists = await Content.findOne({ link, userId: req.userId });
      if (exists) {
        res.status(409).json({ message: "Content already exists." });
        return;
      }
    }

    const tagIds = await Promise.all(
      tags.map(async (tagTitle) => {
        let tag = await Tag.findOne({ title: tagTitle });
        if (!tag) tag = await Tag.create({ title: tagTitle });
        return tag._id;
      })
    );

    const newContent = await Content.create({
      type,
      link,
      note,
      title,
      tags: tagIds,
      userId: req.userId,
      createdAt: new Date()
    });

    res.status(201).json({
      status: "success",
      message: "Content created successfully",
      data: { 
        content: newContent,
        createdAt: newContent.createdAt
      },
    });

  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

contentRouter.get("/board", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const content = await Content.find({ userId })
      .populate("userId", "username")
      .populate("tags", "title");

    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch content",
      error,
    });
  }
});

contentRouter.delete("/board/:contentId", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { contentId } = req.params;

    const deletedContent = await Content.findOneAndDelete({ 
      _id: contentId, 
      userId: userId 
    });

    if (!deletedContent) {
      res.status(404).json({ message: "Content not found or you don't have permission to delete it." });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Content deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete content",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

contentRouter.post("/share", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { contentId } = req.body;

    if(!contentId) {
      res.status(400).json({
        message: "Content Id required!"
      });
      return;
    }

    const content = await Content.findOne({ _id: contentId, userId });
    if(!content) {
      res.status(404).json({
        message: "No content found!"
      });
      return;
    }

    if(content.shareLink) {
      res.status(200).json({
        status: "success",
        message: "Shareable link already exists",
        shareLink: `/content/${content.shareLink}`,
      });
      return;
    }

    const shareLink = nanoid(10);
    content.shareLink = shareLink;
    await content.save();

    res.status(200).json({
      status: "success",
      message: "Shareable link created",
      shareLink: `/content/${shareLink}`,
    });
  } catch (error) {
    console.error("Error creating shareable link:", error);
    res.status(500).json({ message: "Server error" });
  }
});

contentRouter.post("/unshare", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { contentId } = req.body;

    if (!contentId) {
      res.status(400).json({ message: "Content Id is required!" });
      return;
    }

    const content = await Content.findOne({ _id: contentId, userId });
    if (!content) {
      res.status(404).json({ message: "Content not found!" });
      return;
    }

    if (!content.shareLink) {
      res.status(400).json({ message: "Content is already private." });
      return;
    }

    content.shareLink = undefined;
    await content.save();

    res.status(200).json({
      status: "success",
      message: "Content is now private.",
    });

  } catch (error) {
    console.error("Error making content private:", error);
    res.status(500).json({ message: "Server error" });
  }
});

contentRouter.get("/:shareLine", async (req: Request, res: Response) => {
  try {
    const { shareLine } = req.params;

    if (!shareLine) {
      res.status(400).json({ message: "Share link is required!" });
      return;
    }

    const content = await Content.findOne({ shareLink: shareLine })
      .populate("userId", "username")
      .populate("tags", "title");

    if (!content) {
      res.status(404).json({ message: "Content not found!" });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Content fetched successfully",
      content,
    });
  } catch (error) {
    console.error("Error fetching shared content:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default contentRouter;