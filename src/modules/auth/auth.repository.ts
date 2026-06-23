import { User, UserType } from "../../database/user.schema";

export const UserRepository = {
	findEmail: async (email: string) => {
		return await User.findOne({ email });
	},

	createGoogleUser: async (userData: UserType) => {
		return await User.create(userData);
	}
}