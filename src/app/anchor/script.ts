import {
	Transaction,
	PublicKey
} from '@solana/web3.js';

export const getPDA = async (
	seeds: Array<Buffer | Uint8Array>,
	programId: PublicKey
) => {
	return PublicKey.findProgramAddressSync(seeds, programId);
};