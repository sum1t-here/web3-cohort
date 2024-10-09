import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function ShowSolBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function getBalance() {
      if (wallet.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    }
    getBalance();
  }, [wallet.publicKey, connection]); // Re-run if the wallet or connection changes

  return (
    <div>
      <p>SOL Balance:</p>
      <div>{balance !== null ? balance : "Loading..."}</div>
    </div>
  );
}
