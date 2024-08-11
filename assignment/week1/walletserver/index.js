import { Keypair } from "@solana/web3.js";
import { ethers, HDNodeWallet } from "ethers";
import { mnemonicToSeedSync, generateMnemonic } from "bip39";
import cors from "cors";
import nacl from "tweetnacl";
import bodyParser from "body-parser";
import express from "express";
import { derivePath } from "ed25519-hd-key";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/hello", (req, res) => {
  res.status(200).json({
    msg: "hi",
  });
});

app.get("/generate-sol-mnemonic", (req, res) => {
  const mnemonic = generateMnemonic();
  res.json({ mnemonic });
});

let sol_wallets = []; // keep track of sol wallets

app.post("/create-sol-wallets", (req, res) => {
  const { mnemonic } = req.body;

  if (!mnemonic) {
    return res.status(400).json({ error: "Mnemonic is required" });
  }

  try {
    const seed = mnemonicToSeedSync(mnemonic);
    const i = sol_wallets.length; // Index to determine the next wallet

    const path = `m/44'/501'/${i}'/0'`; // Derivation path for Solana
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const newSolWallet = {
      publicKey: keypair.publicKey.toBase58(),
      //   privateKey: Buffer.from(keypair.secretKey).toString("hex"),
    };

    sol_wallets.push(newSolWallet);

    res.json({ wallet: newSolWallet, allWallets: sol_wallets });
  } catch (error) {
    console.error("Error creating Solana wallets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/generate-eth-mnemonic", (req, res) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    res.json({ mnemonic: wallet.mnemonic.phrase });
  } catch (error) {
    console.error("Error generating Ethereum mnemonic:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

let eth_wallets = [];
app.post("/create-eth-wallets", (req, res) => {
  const { mnemonic } = req.body;

  if (!mnemonic) {
    return res.status(400).json({ error: "Mnemonic is required" });
  }

  try {
    const seed = mnemonicToSeedSync(mnemonic);

    const i = eth_wallets.length;

    const hdNode = HDNodeWallet.fromSeed(seed);
    const childNode = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
    const newEthWallet = new ethers.Wallet(childNode.privateKey);

    const walletInfo = {
      address: newEthWallet.address,
      //   privateKey: newEthWallet.privateKey,
    };

    eth_wallets.push(walletInfo);

    res.json({ wallet: walletInfo, allWallets: eth_wallets });
  } catch (error) {
    console.error("Error creating Ethereum wallets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
