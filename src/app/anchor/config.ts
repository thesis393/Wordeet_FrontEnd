import { useMemo } from 'react';
import * as anchor from "@project-serum/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { IDL } from "./idl";
import {
	PublicKey,
} from "@solana/web3.js";
export const WORDEET_PROGRAM_ID = new PublicKey("EMh2kNfPQVMvJ4JA5Exzrz55FSHXnZmrxGAJyr8WWan");

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
					//@ts-ignore
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
