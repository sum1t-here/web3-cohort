import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function Airdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState(""); // React state for the amount input

  async function requestAirdrop() {
    try {
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL; // Convert SOL amount to lamports
      if (!wallet.publicKey || isNaN(lamports)) {
        alert("Please enter a valid amount and connect your wallet.");
        return;
      }

      await connection.requestAirdrop(wallet.publicKey, lamports); // Request the airdrop
      alert(`Airdropped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
    } catch (error) {
      console.error("Airdrop request failed", error);
      alert("Failed to request airdrop. Check console for more details.");
    }
  }

  return (
    <div>
      <br />
      <br />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)} // React's way of handling form inputs
      />
      <button onClick={requestAirdrop}>Request Airdrop</button>
    </div>
  );
}
