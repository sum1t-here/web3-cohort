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
  const [isSending, setIsSending] = useState(false);

  async function sendTokens() {
    if (!wallet.publicKey) {
      alert("Please connect your wallet");
      return;
    }

    if (!to || !amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid recipient address and amount");
      return;
    }

    try {
      setIsSending(true);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      alert(`Successfully sent ${amount} SOL to ${to}`);
    } catch (error) {
      console.error("Error sending tokens:", error);
      alert("Failed to send tokens. Please check the details and try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount (in SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTokens} disabled={isSending}>
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
