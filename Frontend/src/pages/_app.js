import { socketConnection } from '@/lib/Notify';
import '@/styles/globals.css'
import { ThirdwebWeb3Provider, useWeb3 } from "@3rdweb/hooks";
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
          <ToastContainer
        position="top-center"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
      <Component {...pageProps} />
    </ThirdwebWeb3Provider>)
}
