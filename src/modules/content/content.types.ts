import { contentVariety } from "../../database/content.schema";
import { Types } from "mongoose";

export type contentForm = typeof contentVariety[number];

export interface CreateContentSer {
  type: contentForm;
  title: string;
  link?: string;
  note?: string;
  description?: string;
  tags: string[];
  userId: string | Types.ObjectId;
}

export interface CreateContentRepo {
  type: contentForm;
  title: string;
  link?: string;
  note?: string;
  description?: string;
  tags: Types.ObjectId[];
  userId: string | Types.ObjectId;
  createdAt: Date;
}

export interface ContentTypes {
  type: contentForm;
  title: string;  
	link?: string;
  note?: string;
  description?: string;
  tags: Types.ObjectId[];
}

export interface TagDocument {
  _id: Types.ObjectId;
  title: string;
}

export interface GetContentTypes {
  userId: Types.ObjectId
}

export interface DeleteContentTypes {
  _id: Types.ObjectId,
  userId: Types.ObjectId
}

export interface FindLinkByUserId {
  link: string, 
  userId: Types.ObjectId
}