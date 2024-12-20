import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {
	PublicKey,
} from "@solana/web3.js";
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

import { IDL } from "./idl";

export const WORDEET_PROGRAM_ID = new PublicKey("B5iXXqi3EMpsyjcBj3gx37BTcNJMucUaV6ormamecmQP");

export const adminKeypair = anchor.web3.Keypair.fromSecretKey(bs58.decode(process.env.ADMIN_SECRET_KEY || ''));
export const adminWallet = new NodeWallet(adminKeypair);
export const ADMIN_ADDRESS = adminKeypair.publicKey;

export const connection = new anchor.web3.Connection(
	"https://api.devnet.solana.com",
	"confirmed");

export const provider = new anchor.AnchorProvider(connection, adminWallet, anchor.AnchorProvider.defaultOptions());

export const program = new anchor.Program(
	IDL as anchor.Idl,
	WORDEET_PROGRAM_ID,
	provider
);
