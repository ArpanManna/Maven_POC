import Layout from '@/components/Layout';
import { ContextProvider } from '@/context';
import '@/styles/globals.css'
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const supportedChainIds = [80001];

  const connectors = {
    injected: {}
  };


  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <ContextProvider>
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
      <Layout>
      <Component {...pageProps} />
      </Layout>
      </ContextProvider>
    </ThirdwebWeb3Provider>)
}
