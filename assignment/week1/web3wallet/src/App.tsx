import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Buffer } from "buffer"; // Import Buffer
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
window.Buffer = Buffer; // Assign Buffer to window

function App() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [wallet, setWallet] = useState<string[]>([]);

  function handleGenerateMnemonic() {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setWallet([]);
  }

  function handleCreateWallet() {
    if (!mnemonic) return console.log("Generate Mnemonic");

    const seed = mnemonicToSeedSync(mnemonic);
    const newWallets = [];

    for (let i = 0; i < 4; i++) {
      try {
        const path = `m/44'/501'/${i}'/0'`; // Derivation path
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        newWallets.push(keypair.publicKey.toBase58());
      } catch (error) {
        console.error("Error creating wallet:", error);
      }
    }

    setWallet(newWallets);
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className=" text-4xl text-blue-700 font-bold">Web 3 - Wallet</h1>
      <div className="p-6">
        <button
          className=" bg-blue-500 p-4 text-white rounded-lg"
          onClick={handleGenerateMnemonic}
        >
          Generate Mnemonic
        </button>
      </div>

      {mnemonic && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-lg font-semibold">Your Mnemonic:</h2>
          <p>{mnemonic}</p>
        </div>
      )}
      <button
        className="bg-green-500 p-4 text-white rounded-lg mt-4"
        onClick={handleCreateWallet}
      >
        Create Wallets
      </button>
      <div>
        {!mnemonic && <p className="text-red-600">Generate mnemonic</p>}
      </div>
      {wallet.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-lg font-semibold">Wallets:</h2>
          <ul>
            {wallet.map((publicKey, index) => (
              <li key={index} className="text-sm text-gray-700">
                {publicKey}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
