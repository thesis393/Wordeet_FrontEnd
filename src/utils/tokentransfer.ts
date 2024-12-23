import {
	Connection,
	PublicKey,
	VersionedTransaction,
	TransactionMessage,
	sendAndConfirmRawTransaction,
	TransactionInstruction,
} from "@solana/web3.js";
import {
	getAssociatedTokenAddress,
	createAssociatedTokenAccountIdempotentInstruction,
	createTransferInstruction,
} from "@solana/spl-token";

// Use Devnet connection
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=926da061-472b-438a-bbb1-f289333c4126");

// Devnet USDC Mint Address
const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export const transferUSDC = async (
	recipientPublicKey: string,
	amount: number,
	publicKey: string | null | undefined,
	signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>
) => {
	try {
		// Ensure the wallet is connected
		if (!publicKey || !signTransaction) {
			throw new Error("Wallet is not connected.");
		}

		console.log("Recipient PublicKey: ", recipientPublicKey);
		console.log("publickey: ", publicKey);

		// Get the associated token accounts for USDC
		const senderTokenAccount = await getAssociatedTokenAddress(USDC_MINT_ADDRESS, new PublicKey(publicKey));
		const recipientTokenAccount = await getAssociatedTokenAddress(USDC_MINT_ADDRESS, new PublicKey(recipientPublicKey));

		const instructions: Array<TransactionInstruction> = []

		// Check if the sender's token account exists
		const senderTokenAccountInfo = await connection.getAccountInfo(senderTokenAccount);
		if (!senderTokenAccountInfo) {
			console.log("Sender's token account does not exist. Creating a new account...");
			throw new Error("You have no ata.");
			// Add instruction to create the sender's associated token account
		}

		const senderTokenBalance = await connection.getTokenAccountBalance(senderTokenAccount);
		console.log("Sender's token balance: ", senderTokenBalance.value.uiAmount, amount);
		if (senderTokenBalance.value.uiAmount && amount > senderTokenBalance.value.uiAmount) {
			throw new Error("Your token holdings are insufficient.");
		}

		// Check if the recipient's token account exists
		const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
		if (!recipientTokenAccountInfo) {
			console.log("Recipient's token account does not exist. Creating a new account...");
			// Add instruction to create the recipient's associated token account
			// Create recipient's associated token account if it doesn't exist
			instructions.push(createAssociatedTokenAccountIdempotentInstruction(
				new PublicKey(publicKey), // Payer of the transaction
				recipientTokenAccount, // Associated token account to create
				new PublicKey(recipientPublicKey), // Owner of the account
				USDC_MINT_ADDRESS // USDC Mint
			))
		}


		// Prepare instructions for creating the associated token accounts and transferring USDC

		// Transfer instruction
		instructions.push(
			createTransferInstruction(
				senderTokenAccount, // Sender's associated token account
				recipientTokenAccount, // Recipient's associated token account
				new PublicKey(publicKey), // Owner of the sender's token account
				amount * 1_000_000 // Amount to transfer (convert to lamports if needed)
			))

		// Get the latest blockhash
		const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

		// Create VersionedTransaction
		const message = new TransactionMessage({
			payerKey: new PublicKey(publicKey),
			recentBlockhash: blockhash,
			instructions,
		});

		const transaction = new VersionedTransaction(message.compileToV0Message());

		// Simulate the transaction
		const simulationResult = await connection.simulateTransaction(transaction);
		console.log("Simulation result:", simulationResult);
		if (simulationResult.value.err) {
			throw new Error(`Simulation failed: ${JSON.stringify(simulationResult.value.err)}`);
		}

		console.log("Simulation successful:", simulationResult.value);

		// Sign the transaction
		const signedTransaction = await signTransaction(transaction);

		// Convert to Buffer
		const rawTransaction = Buffer.from(signedTransaction.serialize());

		// Send the transaction and confirm it
		const signature = await sendAndConfirmRawTransaction(connection, rawTransaction, {
			skipPreflight: true,
			commitment: "processed",
		});

		console.log("Transaction successful with signature:", signature);
		return signature;
	} catch (error) {
		throw new Error(`Error transferring USDC:, ${error}`);
	}
}
