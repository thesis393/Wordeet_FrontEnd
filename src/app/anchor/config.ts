// import * as anchor from "@project-serum/anchor";
// import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
// import {
// 	PublicKey,
// } from "@solana/web3.js";
// import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

// import { IDL } from "./idl";

// export const WORDEET_PROGRAM_ID = new PublicKey("B5iXXqi3EMpsyjcBj3gx37BTcNJMucUaV6ormamecmQP");

// export const adminKeypair = anchor.web3.Keypair.fromSecretKey(bs58.decode(process.env.ADMIN_SECRET_KEY || ''));
// export const adminWallet = new NodeWallet(adminKeypair);
// export const ADMIN_ADDRESS = adminKeypair.publicKey;

// export const connection = new anchor.web3.Connection(
// 	"https://api.devnet.solana.com",
// 	"confirmed");


// export const provider = new anchor.AnchorProvider(connection, adminWallet, anchor.AnchorProvider.defaultOptions());

// export const program = new anchor.Program(
// 	IDL as anchor.Idl,
// 	WORDEET_PROGRAM_ID,
// 	provider
// );


import { useMemo } from 'react';
import * as anchor from "@project-serum/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { IDL } from "./idl";
import {
	PublicKey,
} from "@solana/web3.js";
export const WORDEET_PROGRAM_ID = new PublicKey("B5iXXqi3EMpsyjcBj3gx37BTcNJMucUaV6ormamecmQP");

const useProgram = () => {
	const connection = new anchor.web3.Connection(
		"https://devnet.helius-rpc.com/?api-key=926da061-472b-438a-bbb1-f289333c4126",
		"confirmed");
	const wallet = useWallet();

	const program = useMemo(() => {
		try {
			if (wallet && IDL && WORDEET_PROGRAM_ID) {
				const provider = new anchor.AnchorProvider(
					connection,
					wallet,
					anchor.AnchorProvider.defaultOptions()
				);
				return new anchor.Program(IDL, WORDEET_PROGRAM_ID, provider);
			}
		} catch (error) {
			console.error("Error initializing the program:", error);
		}
	}, [connection, wallet]);

	return program;
};

export default useProgram;
