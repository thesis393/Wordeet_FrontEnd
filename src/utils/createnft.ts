import {
	createNft,
	findMetadataPda,
	mplTokenMetadata,
	verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
	createGenericFile,
	generateSigner,
	keypairIdentity,
	percentAmount,
	publicKey as UMIPublicKey,
	publicKey
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { burn, collectionAddress, create, createCollection, fetchAsset, fetchCollection, mplCore, removePlugin, update } from '@metaplex-foundation/mpl-core'
import { uploadSingleDataIrys } from "@/app/api";

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=86ceda5c-d0c6-48f9-8b29-e79b81bbbc1e");


export const mintNft = async (nftData: any, wallet: WalletContextState, collectionAddress: any) => {


	try {
		console.log("mintNft start");
		const umi = createUmi(connection);
		console.log("nftData", nftData);

		// Register Wallet Adapter to Umi
		umi.use(walletAdapterIdentity(wallet))
			.use(mplTokenMetadata())

		// Generate an NFT
		console.log(`Creating NFT...`);
		const mint = generateSigner(umi);

		// upload collection data
		const mintResult = await uploadSingleDataIrys(nftData);

		if (mintResult.url != null) {

			const uri = mintResult.url;
			console.log("mintData url", mintResult.url, uri);

			// const collection = await fetchCollection(umi, publicKey(collectionAddy));

			// console.log("collection", collection);
			const transaction = await createNft(umi, {
				mint,
				name: nftData?.name,
				uri: uri,
				sellerFeeBasisPoints: percentAmount(0),
				collection: {
					key: collectionAddress,
					verified: false,
				},
			}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

			const metadata = findMetadataPda(umi, { mint: mint.publicKey });
			// await verifyCollectionV1(umi, {
			// 	metadata,
			// 	collectionMint: collectionAddress,
			// 	authority: umi.identity,
			// }).sendAndConfirm(umi, { send: { commitment: "finalized" } });
			console.log(`Collection NFT address is:`, `https://explorer.solana.com/address/${mint.publicKey}/tokens?cluster=devnet`);
			return mint.publicKey;
		} else {
			console.log("mint Data upload faild");
			return null;
		}

	} catch (error) {
		console.log(`Error mintNft:, ${error}`);
		return null;
	}
}