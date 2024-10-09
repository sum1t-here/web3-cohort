import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Airdrop } from "./Airdrop";
import { ShowSolBalance } from "./ShowSolBalance";
import { SendTokens } from "./SendTokens";
import { SignMessage } from "./SignMessage";

export default function App() {
  return (
    <ConnectionProvider
      endpoint={
        "https://solana-devnet.g.alchemy.com/v2/ZC8y0y5BptsXMVqUDbbn_NkWaaIrUmZg"
      }
    >
      <WalletProvider wallets={[]} autoconnect>
        <WalletModalProvider>
          <div>
            <WalletMultiButton />
            <WalletDisconnectButton />
            <Airdrop />
            <ShowSolBalance />
            <SendTokens />
            <SignMessage />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
