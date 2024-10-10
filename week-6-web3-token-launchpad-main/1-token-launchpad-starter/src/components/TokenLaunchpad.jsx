// export function TokenLaunchpad() {
//   function createToken() {
//     const name = document.getElementById("name").value;
//     const symbol = document.getElementById("symbol").value;
//     const imageURL = document.getElementById("imageURL").value;
//     const initialSupply = document.getElementById("initialSupply").value;
//   }

//   return (
//     <div
//       style={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//       }}
//     >
//       <h1>Solana Token Launchpad</h1>
//       <input
//         id="name"
//         className="inputText"
//         type="text"
//         placeholder="Name"
//       ></input>{" "}
//       <br />
//       <input
//         id="symbol"
//         className="inputText"
//         type="text"
//         placeholder="Symbol"
//       ></input>{" "}
//       <br />
//       <input
//         id="imageURL"
//         className="inputText"
//         type="text"
//         placeholder="Image URL"
//       ></input>{" "}
//       <br />
//       <input
//         id="initialSupply"
//         className="inputText"
//         type="text"
//         placeholder="Initial Supply"
//       ></input>{" "}
//       <br />
//       <button onClick={createToken} className="btn">
//         Create a token
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

export function TokenLaunchpad() {
  // Using state for form values
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [initialSupply, setInitialSupply] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();

  // Function to create a token
  async function createToken() {
    // Generate a new keypair for the token mint
    const mintKeypair = Keypair.generate(); // Keypair for the mint (token creation)

    // Define metadata for the token
    const metadata = {
      mint: mintKeypair.publicKey, // Public key of the mint account (the token itself)
      name: "QIQI", // Token name (limited to a specific number of characters)
      symbol: "GI", // Token symbol (needs padding to match the length requirement)
      uri: "https://cdn.100xdevs.com/metadata.json", // URI pointing to metadata file (can contain image, description, etc.)
      additionalMetadata: [], // Placeholder for any additional metadata (optional)
    };

    // Calculate the space needed for the mint and metadata, using the new metadata pointer extension
    const mintLen = getMintLen([ExtensionType.MetadataPointer]); // Get required size for the mint account with metadata extension
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length; // Calculate total space for metadata (with type, length, and packed data)

    // Get the minimum number of lamports required to make the account rent-exempt
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    // Create a new transaction to set up the token mint and initialize it with metadata
    const transaction = new Transaction().add(
      // 1. Create a new account for the mint (the token itself)
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey, // Wallet's public key (payer of the transaction)
        newAccountPubkey: mintKeypair.publicKey, // Public key for the new mint account
        space: mintLen, // Size of the account (mint length including metadata)
        lamports, // Amount of lamports to make the account rent-exempt
        programId: TOKEN_2022_PROGRAM_ID, // Program ID for the SPL Token 2022 program
      }),
      // 2. Initialize metadata pointer for the mint
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey, // Mint account public key
        wallet.publicKey, // Mint authority
        mintKeypair.publicKey, // The same mint account holds the metadata pointer
        TOKEN_2022_PROGRAM_ID // Program ID for the SPL Token 2022 program
      ),
      // 3. Initialize the mint with the specified decimals and authorities
      createInitializeMintInstruction(
        mintKeypair.publicKey, // Mint account public key
        9, // Token decimals (similar to how SOL has 9 decimals)
        wallet.publicKey, // Mint authority (controls minting)
        null, // Freeze authority (optional, null means no freeze authority)
        TOKEN_2022_PROGRAM_ID // Program ID for the SPL Token 2022 program
      ),
      // 4. Initialize metadata for the token using the metadata package
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID, // Program ID for the SPL Token 2022 program
        mint: mintKeypair.publicKey, // Mint public key (where the token metadata is stored)
        metadata: mintKeypair.publicKey, // The same mint account holds the metadata
        name: metadata.name, // Name of the token
        symbol: metadata.symbol, // Symbol of the token
        uri: metadata.uri, // URI pointing to the token's metadata file
        mintAuthority: wallet.publicKey, // Mint authority (the wallet creating the token)
        updateAuthority: wallet.publicKey, // Authority to update metadata
      })
    );

    // Set the wallet as the fee payer
    transaction.feePayer = wallet.publicKey;

    // Get the latest blockhash to include in the transaction for recentBlockhash
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    // Partially sign the transaction with the mintKeypair (since it's a new account being created)
    transaction.partialSign(mintKeypair);

    // Send the signed transaction to the blockchain
    await wallet.sendTransaction(transaction, connection);

    // Log the public key of the newly created token mint (the public address of the token)
    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

    // 1. Get the associated token account for the wallet
    // The associated token account is where the tokens for the wallet holder will be stored.
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey, // The public key of the token mint (the new token you just created)
      wallet.publicKey, // The wallet's public key (the account that will receive and store the tokens)
      false, // Set to `false` because this isn't a program-derived address (PDA)
      TOKEN_2022_PROGRAM_ID // The program ID for the SPL Token 2022 program (used for token management)
    );

    // Log the associated token account's public key (this is where the tokens will be stored)
    console.log(associatedToken.toBase58());

    // 2. Create a transaction to create the associated token account for the wallet
    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, // Payer of the transaction (the wallet that is creating the token account)
        associatedToken, // The associated token account's address (where the wallet's tokens will be stored)
        wallet.publicKey, // Owner of the associated token account (the same wallet creating it)
        mintKeypair.publicKey, // The mint (token) that this associated account will hold
        TOKEN_2022_PROGRAM_ID // The program ID for the SPL Token 2022 program
      )
    );

    // Send the transaction to create the associated token account on the blockchain
    await wallet.sendTransaction(transaction2, connection);

    // 3. Create another transaction to mint tokens to the newly created associated token account
    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey, // The token mint's public key (the newly created token)
        associatedToken, // The associated token account (where the minted tokens will be sent)
        wallet.publicKey, // Mint authority (the wallet that has permission to mint the tokens)
        1000000000, // The amount to mint (in the smallest unit of the token, i.e., 1 token with 9 decimals = 1,000,000,000 units)
        [], // No additional signers needed here
        TOKEN_2022_PROGRAM_ID // The program ID for the SPL Token 2022 program
      )
    );

    // Send the transaction to mint the tokens to the associated token account
    await wallet.sendTransaction(transaction3, connection);

    // Log that the minting process is complete
    console.log("Minted!");
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Solana Token Launchpad</h1>
      <input
        className="inputText"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update state on input change
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)} // Update state on input change
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Image URL"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)} // Update state on input change
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Initial Supply"
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)} // Update state on input change
      />
      <br />
      <button onClick={createToken} className="btn">
        Create a token
      </button>
    </div>
  );
}
