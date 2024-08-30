import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function Bal() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getBal = async () => {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      document.getElementById("balance").innerHTML = balance / LAMPORTS_PER_SOL;
    }
  };
  getBal();
  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <p>SOL Balance:</p> <p id="balance" className="text-green-400"></p>
    </div>
  );
}

export default Bal;
