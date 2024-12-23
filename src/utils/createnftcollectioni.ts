import {
	createNft,
	mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
	generateSigner,
	percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { WalletContextState } from "@solana/wallet-adapter-react";
import { uploadSingleDataIrys } from "@/app/api";

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=926da061-472b-438a-bbb1-f289333c4126");


export const createNftCollection = async (collectionData: any, wallet: WalletContextState): Promise<any> => {
	try {
		console.log("createNftCollection start");
		const umi = createUmi(connection);
		console.log("collectionData", collectionData);

		// Register Wallet Adapter to Umi
		umi.use(walletAdapterIdentity(wallet))
			.use(mplTokenMetadata())

		// generate mint keypair
		const collectionMint = generateSigner(umi);

		// upload collection data
		const collectResult = await uploadSingleDataIrys(collectionData);

		if (collectResult.url != "") {

			const uri = collectResult.url;
			console.log("collectionData url", collectResult.url, uri);

			// create and mint NFT
			const result = await createNft(umi, {
				mint: collectionMint,
				name: collectionData?.name,
				symbol: collectionData?.symbol,
				uri,
				updateAuthority: umi.identity.publicKey,
				sellerFeeBasisPoints: percentAmount(0),
				isCollection: true,
			}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

			console.log(`Collection NFT address is:`, `https://explorer.solana.com/address/${collectionMint.publicKey}/tokens?cluster=devnet`);
			console.log("✅ Finished successfully!");
			return collectionMint.publicKey || null;
		} else {
			console.log("Collection Data upload faild");
			return null;
		}
	} catch (error) {
		console.log(`Error createNftCollection:, ${error}`);
		return null;
	}
}