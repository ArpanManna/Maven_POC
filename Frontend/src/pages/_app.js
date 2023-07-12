import '@/styles/globals.css'
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

export default function App({ Component, pageProps }) {
  const supportedChainIds = [1, 5, 80001, 11155111];

  const connectors = {
    injected: {}
  };

  return (
    <ThirdwebWeb3Provider 
    supportedChainIds={supportedChainIds}
    connectors={connectors}
  >
      <Component {...pageProps} />
    </ThirdwebWeb3Provider>)
}
