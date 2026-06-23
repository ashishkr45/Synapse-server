import { z } from "zod";
import { Types } from "mongoose";

const CONTENT_TYPES = [
  "article", "tweet", "link", "document", "youtube",
  "code", "thread", "note", "quote", "event", 
  "bookmark", "post", "reel",
] as const;

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess(
    emptyStringToUndefined,
    z.string().trim().max(maxLength).optional()
  );

const optionalSecureUrl = z.preprocess(
  emptyStringToUndefined,
  z
    .string()
    .trim()
    .max(2048)
    .url("Link must be a valid URL")
    .refine((url) => /^https?:\/\//i.test(url), {
      message: "Link must start with http:// or https://",
    })
    .optional()
);

const tagsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Each tag must not be empty")
      .max(30, "Each tag must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Tags can only contain letters, numbers, _ and -"
      )
  )
  .min(1, "At least one tag is required")
  .max(20, "At most 20 tags are allowed");

export const CreateContentSchema = z
  .object({
    type: z.enum(CONTENT_TYPES),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(150, "Title must be at most 150 characters"),

    description: optionalTrimmedString(1000),
    link: optionalSecureUrl,
    note: optionalTrimmedString(5000),
    tags: tagsSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    const hasLink =
      typeof data.link === "string" && data.link.length > 0;
    const hasNote =
      typeof data.note === "string" && data.note.length > 0;

    if (!hasLink && !hasNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either link or note is required",
        path: ["link"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either link or note is required",
        path: ["note"],
      });
    }

    if (hasLink && hasNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either link or note, not both",
        path: ["link"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either link or note, not both",
        path: ["note"],
      });
    }
  });

export const DeleteContentSchema = z.object({
  contentId: z.string().min(24, "Invalid content ID").max(24, "Invalid content ID")
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid MongoDb ID formate",
    }),
});

export const ShareContentSchema = z.object({
  contentId: z
    .string()
    .min(24, "Invalid content ID")
    .max(24, "Invalid content ID")
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid MongoDB ID format",
    }),
});

export const UnshareContentSchema = z.object({
  contentId: z
    .string()
    .min(24, "Invalid content ID")
    .max(24, "Invalid content ID")
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid MongoDB ID format",
    }),
});

export const GetSharedContentSchema = z.object({
  shareLine: z
    .string()
    .min(1, "Share link is required")
    .max(50, "Invalid share link"),
});