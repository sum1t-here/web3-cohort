import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

function Airdrop() {
  const wallet = useWallet(); // provides the wallet variable in the Airdrop Component
  const { connection } = useConnection();
  const [amount, setAmount] = useState();

  const sendAirdropToUSer = async () => {
    const lamports = amount * LAMPORTS_PER_SOL; // Convert SOL to lamports
    await connection.requestAirdrop(wallet.publicKey, lamports);
    alert(`Airdropped ${amount} SOL`);
    window.location.reload();
  };
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="flex justify-center items-center">
        <span className="font-extrabold text-xl">Wallet Address:</span>
        <span className="ml-3 font-extralight text-sm">
          {wallet.publicKey?.toString()}
        </span>
      </h1>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-2 border-gray-500 p-1 rounded-md w-1/2"
        />
        <button
          onClick={sendAirdropToUSer}
          className=" text-xs bg-purple-400 rounded-md p-1"
        >
          Request Airdrop
        </button>
      </div>
    </div>
  );
}

export default Airdrop;
