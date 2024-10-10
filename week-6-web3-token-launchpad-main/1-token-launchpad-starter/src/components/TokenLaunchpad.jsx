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
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptAccount,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

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
    const mintKeyPair = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptAccount(connection);

    const transaction = new Transaction.add()(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeyPair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mintKeyPair,
        9,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    (transaction.feePayer = wallet.publicKey),
      (transaction.recentBlockhash = await connection.getLatestBlockhash());
    transaction.partialSign(mintKeyPair);

    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintKeyPair.publicKey.toBase58()}`);
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
