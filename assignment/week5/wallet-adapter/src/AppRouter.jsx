//
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Route, Routes } from "react-router-dom";
import "@solana/wallet-adapter-react-ui/styles.css";

import Airdrop from "./Airdrop";
import Bal from "./Bal";
import { SignMsg } from "./SignMsg";
import { SendTokens } from "./SendTokens";
import Template from "./Template";
import { Buffer } from "buffer";

// Polyfill Buffer globally in the browser
window.Buffer = window.Buffer || Buffer;

function AppRouter() {
  return (
    <ConnectionProvider
      endpoint={
        "https://solana-devnet.g.alchemy.com/v2/mInLm6vtkwDnwFfaJr49wR0SVwLVyG1c"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Routes>
            <Route path="/" element={<Template />}>
              <Route path="/" element={<Wallet />} />
              <Route path="/sign-message" element={<SignMsg />} />
              <Route path="/send-tokens" element={<SendTokens />} />
            </Route>
          </Routes>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function Wallet() {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="flex flex-row m-5 gap-4">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <div>
        <h1 className=" text-blue-800">Hey there, welcome....</h1>
      </div>
      <Airdrop />
      <Bal />
    </div>
  );
}

export default AppRouter;
