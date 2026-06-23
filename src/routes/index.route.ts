import { Router, Request, Response } from "express";
import loginRouter from "./auth.route";
import contentRouter from "./content.route";

const router: Router = Router();

router.use("/auth/", loginRouter);
router.use("/content", contentRouter);

router.all("*splat", (req: Request, res: Response) => {
	res.status(404).json({
		message: `Cannot find the resource ${req.originalUrl}`,
	});
})


export default router;