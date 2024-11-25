import { readUser } from "@/app/api";

export const readUserInfo = async (walletAddress: any) => {
	if (!walletAddress) {
		console.log("Wallet address is not connected");
		return;
	} else {
		console.log("Wallet address in readUserInfo", walletAddress);
	}
	try {
		const result = await readUser(walletAddress);
		if (result.data) {
			console.log("read user info success", result.data);
			return result.data;
		} else {
			console.log("read user info faild");
			return null;
		}
	} catch (error) {
		console.error("Error read User", error);
		return null;
	}
};
