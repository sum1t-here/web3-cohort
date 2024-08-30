import { useState } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

export function SignMsg() {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("");

  async function onClick() {
    try {
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");

      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      const isValid = ed25519.verify(
        signature,
        encodedMessage,
        publicKey.toBytes()
      );
      if (!isValid) throw new Error("Message signature invalid!");

      alert(`Message signature: ${bs58.encode(signature)}`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 min-h-32">
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-2 border-gray-500 p-1 rounded-md w-1/2"
      />
      <button
        onClick={onClick}
        className=" text-xs bg-purple-400 rounded-md p-1"
      >
        Sign Message
      </button>
    </div>
  );
}
