import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from "./auth.repository";
import { jwtSecret } from "../../config";
import { googleClientId } from "../../config";

const JWT_SECRET = jwtSecret as string;
const client = new OAuth2Client(googleClientId);

export const AuthService = {
	processGoogleLogin: async (googleToken: string) => {
		const ticker = await client.verifyIdToken({
			idToken: googleToken,
			audience: googleClientId
		});

		const payload = ticker.getPayload();

		if(!payload || !payload.email) throw new Error("INVALID_TOKEN");

		const { email, name, sub } = payload;

		const user = await UserRepository.createGoogleUser({
			email,
			username: name || email.split('@')[0],
			googleId: sub,
		});

		const appToken = jwt.sign(
			{ id: user._id.toString() },
			JWT_SECRET,
			{ expiresIn: '7d' }
		);
		
		return appToken;
	}
}