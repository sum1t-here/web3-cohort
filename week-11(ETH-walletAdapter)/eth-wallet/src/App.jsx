import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useSendTransaction,
  WagmiProvider,
} from "wagmi";
import { config } from "./config";
import { WalletOptions } from "./WalletOptions";
import { formatEther, parseEther } from "viem";
import { useRef } from "react";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletOptions />
        <SendTransaction />
        <Balance />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Balance() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  // balanceData will hold the entire object returned by useBalance, not just the data part. This object typically contains more than just the balance, including properties like isLoading, isError, etc.
  const { data: balanceData } = useBalance({ address }); // Get user's balance

  // Format the balance to Ether if available
  const formattedBalance = balanceData
    ? formatEther(balanceData.value)
    : "Loading...";
  return (
    <div>
      {address && (
        <div>
          Your address - {address}
          <br />
          Your balance - {formattedBalance}
        </div>
      )}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}

function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction();
  const addressRef = useRef(null);
  const ethRef = useRef(null);

  async function sendTx() {
    const to = addressRef.current.value;
    const value = ethRef.current.value;
    sendTransaction({ to, value: parseEther(value) });
  }

  return (
    <div>
      <input ref={addressRef} placeholder="0xA0Cf…251e" required />
      <input ref={ethRef} placeholder="0.05" required />
      <button onClick={sendTx}>Send</button>
      {hash && <div>Transaction Hash: {hash}</div>}
    </div>
  );
}
