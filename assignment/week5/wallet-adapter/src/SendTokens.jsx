import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export function SendTokens() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  async function sendTokens() {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected!");

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      await wallet.sendTransaction(transaction, connection);
      alert(`Sent ${amount} SOL to ${to}`);
      window.location.reload();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center gap-3 min-h-60">
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border-2 border-gray-500 p-1 rounded-md w-1/2"
      />
      <input
        type="text"
        placeholder="Amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border-2 border-gray-500 p-1 rounded-md w-1/2"
      />
      <button
        onClick={sendTokens}
        className=" text-xs bg-purple-400 rounded-md p-1"
      >
        Send
      </button>
    </div>
  );
}
