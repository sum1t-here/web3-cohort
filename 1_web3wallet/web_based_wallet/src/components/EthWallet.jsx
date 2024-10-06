import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);

  const fetchEthBalance = async (address) => {
    const provider = new ethers.JsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/muidtpD3HItXbXDo5kmflvZ123TAOhPu"
    );
    try {
      const balance = await provider.getBalance(address);
      console.log(ethers.formatEther(balance));
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error fetching ETH balance:", error);
      return null;
    }
  };

  const addEthWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);

    // Fetch ETH balance for the generated wallet address
    const balance = await fetchEthBalance(wallet.address);

    setWallets((prevWallets) => [
      ...prevWallets,
      { address: wallet.address, balance },
    ]);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div>
      <button onClick={addEthWallet}>Add ETH wallet</button>

      {wallets.map((wallet, index) => (
        <div key={index}>
          Eth Address: {wallet.address} | Balance: {wallet.balance} ETH
        </div>
      ))}
    </div>
  );
};
