import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useState } from "react";

export function SignMessage() {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const onClick = async () => {
    if (!publicKey) {
      alert("Wallet not connected!");
      return;
    }
    if (!signMessage) {
      alert("Wallet does not support message signing!");
      return;
    }
    if (!message) {
      alert("Please enter a message to sign.");
      return;
    }

    try {
      setIsSigning(true);

      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
        alert("Message signature invalid!");
        return;
      }

      alert(`Message signature: ${bs58.encode(signature)}`);
    } catch (error) {
      console.error("Error signing message:", error);
      alert("Failed to sign the message.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={onClick} disabled={isSigning}>
        {isSigning ? "Signing..." : "Sign Message"}
      </button>
    </div>
  );
}
