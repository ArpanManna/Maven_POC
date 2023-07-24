import { useCallback, useEffect, useState } from "react";
import Nav from "./Nav";
import { useWeb3 } from "@3rdweb/hooks";
import { getUserDetails } from "@/utils/service";
import { useContextState } from "@/context";
import { EVENTS, createSocketConnection } from "@pushprotocol/socket";
import { ToastMessage } from "./UI/Toast";
import Link from "next/link";

export default function Layout({ children }) {
  const { chainId, provider, address } = useWeb3();
  const [{ }, dispatch] = useContextState();
  const [disconnected, setDisconnected] = useState(true);

  useEffect(() => {
    if (address) getCurrentUserDetails();
  }, [address]);

  useEffect(() => {
    if (address && disconnected) {
      setDisconnected(false)
      const pushSDKSocket = createSocketConnection({
        user: `eip155:80001:${address}`, // CAIP-10 format
        env: 'staging',
        socketOptions: { autoConnect: true }
      });
      pushSDKSocket?.on(EVENTS.CONNECT, () => { console.log('connected') })
      pushSDKSocket?.on(EVENTS.DISCONNECT, (err) => {
        console.log(err);
        setDisconnected(true)
      });
      pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => console.log(message))
      pushSDKSocket?.on(EVENTS.USER_FEEDS, (notification) => {
        console.log(notification);
        simpleNotify("success", notification.payload.notification.title, notification.payload.notification.body)
      })
      pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) => console.log(spam))
    }
  }, [address, disconnected])

  const simpleNotify = useCallback((type, title, body) => {
    ToastMessage({ type, title, body });
  }, []);

  const getCurrentUserDetails = async () => {
    await getUserDetails(chainId, provider, address, dispatch);
  }

  return (
    <>
      <Nav />
      <Link href={"/chat"} class="fixed z-90 bottom-10 right-8 bg-blue-600 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
</svg>

        </Link>
      <main>{children}</main>
    </>
  );
}