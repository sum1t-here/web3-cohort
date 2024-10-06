import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import nacl from "tweetnacl";

// Solana connection (Devnet)
const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/mInLm6vtkwDnwFfaJr49wR0SVwLVyG1c"
);

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);

  const fetchBalance = async (publicKey) => {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  };

  return (
    <div>
      <button
        onClick={async function () {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);

          const balance = await fetchBalance(keypair.publicKey);

          setCurrentIndex(currentIndex + 1);
          setWallets((prevWallets) => [
            ...prevWallets,
            { publicKey: keypair.publicKey, balance },
          ]);
        }}
      >
        Add SOL wallet
      </button>
      {wallets.map((wallet, index) => (
        <div key={index}>
          Sol Address: {wallet.publicKey.toBase58()} | Balance: {wallet.balance}{" "}
          SOL
        </div>
      ))}
    </div>
  );
}
