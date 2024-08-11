import { useState } from "react";
import axios from "axios"; // Ensure you have axios installed

function App() {
  const [solMnemonic, setSolMnemonic] = useState("");
  const [solWallets, setSolWallets] = useState([]);

  const [ethMnemonic, setEthMnemonic] = useState("");
  const [ethWallets, setEthWallets] = useState([]);

  async function handleGenerateSolMnemonic() {
    try {
      const response = await axios.get(
        "http://localhost:3000/generate-sol-mnemonic"
      );
      setSolMnemonic(response.data.mnemonic);
      setSolWallets([]);
    } catch (error) {
      console.error("Error generating Solana mnemonic:", error);
    }
  }

  async function handleCreateSolWallet() {
    if (!solMnemonic) {
      console.log("Generate Solana Mnemonic first");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/create-sol-wallets",
        {
          mnemonic: solMnemonic,
        }
      );

      setSolWallets(response.data.allWallets);
    } catch (error) {
      console.error("Error creating Solana wallet:", error);
    }
  }

  async function handleGenerateEthMnemonic() {
    try {
      const response = await axios.get(
        "http://localhost:3000/generate-eth-mnemonic"
      );
      setEthMnemonic(response.data.mnemonic);
      setEthWallets([]);
    } catch (error) {
      console.error("Error generating Ethereum mnemonic:", error);
    }
  }

  async function handleCreateEthWallet() {
    if (!ethMnemonic) {
      console.log("Generate Ethereum Mnemonic first");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/create-eth-wallets",
        {
          mnemonic: ethMnemonic,
        }
      );

      setEthWallets(response.data.allWallets);
    } catch (error) {
      console.error("Error creating Ethereum wallet:", error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl text-blue-700 font-bold">Web 3 - Wallet</h1>
      <div className="p-6 flex flex-col">
        {/* Solana Section */}
        <div>
          <button
            className="bg-blue-500 p-4 text-white rounded-lg"
            onClick={handleGenerateSolMnemonic}
          >
            Generate Mnemonic for Solana Wallet
          </button>
        </div>

        {solMnemonic && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h2 className="text-lg font-semibold">Your Solana Mnemonic:</h2>
            <p>{solMnemonic}</p>
          </div>
        )}
        <button
          className="bg-green-500 p-4 text-white rounded-lg mt-4"
          onClick={handleCreateSolWallet}
        >
          Create Solana Wallet
        </button>
        <div>
          {!solMnemonic && (
            <p className="text-red-600">Generate mnemonic first</p>
          )}
        </div>
        {solWallets.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h2 className="text-lg font-semibold">Solana Wallets:</h2>
            <ul>
              {solWallets.map((wallet, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <strong>Public Key:</strong> {wallet.publicKey} <br />
                  {/* Note: Private Key is commented out */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Ethereum Section */}
      <div>
        <div>
          <button
            className="bg-blue-500 p-4 text-white rounded-lg"
            onClick={handleGenerateEthMnemonic}
          >
            Generate Mnemonic for Ethereum Wallet
          </button>
        </div>

        {ethMnemonic && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h2 className="text-lg font-semibold">Your Ethereum Mnemonic:</h2>
            <p>{ethMnemonic}</p>
          </div>
        )}
        <button
          className="bg-green-500 p-4 text-white rounded-lg mt-4 w-full"
          onClick={handleCreateEthWallet}
        >
          Create Ethereum Wallet
        </button>
        <div>
          {!ethMnemonic && (
            <p className="text-red-600">Generate mnemonic first</p>
          )}
        </div>
        {ethWallets.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h2 className="text-lg font-semibold">Ethereum Wallets:</h2>
            <ul>
              {ethWallets.map((wallet, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <strong>Address:</strong> {wallet.address} <br />
                  {/* Note: Private Key is commented out */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
