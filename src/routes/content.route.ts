import { Router } from "express";
import { contentController } from "../modules/content/content.controller";
import { auth } from "../middleware/middleware";
import { Validate } from "../middleware/validate";
import {
	contentCreationLimiter,
	contentSharingLimiter,
	readOnlyLimiter
} from "../middleware/rateLimiter"
import {
	CreateContentSchema,
	DeleteContentSchema,
	ShareContentSchema,
	UnshareContentSchema,
	GetSharedContentSchema,
} from "../modules/content/content.validation"

const contentRouter: Router = Router();

contentRouter.get(
	"/board", 
	contentSharingLimiter, 
	auth, 
	contentController.getContent
);

contentRouter.post(
	"/board", 
	readOnlyLimiter, 
	auth, 
	Validate(CreateContentSchema, 'body'), 
	contentController.postContent
);

contentRouter.delete(
	"/board/:contentId", 
	contentCreationLimiter, 
	auth, 
	Validate(DeleteContentSchema, 'params'), 
	contentController.deleteContent
);

contentRouter.post(
	"/share", 
	contentSharingLimiter, 
	auth, 
	Validate(ShareContentSchema, 'body'), 
	contentController.shareContent
);

contentRouter.post(
	"/unshare", 
	contentSharingLimiter, 
	auth, 
	Validate(UnshareContentSchema, 'body'), 
	contentController.unshareContent
);

contentRouter.get(
	"/:shareLine", 
	readOnlyLimiter, 
	Validate(GetSharedContentSchema, 'params'), 
	contentController.getShareContent
);

export default contentRouter;

