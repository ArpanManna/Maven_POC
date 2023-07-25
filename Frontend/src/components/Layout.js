import { useCallback, useEffect, useState } from "react";
import Nav from "./Nav";
import { useWeb3 } from "@3rdweb/hooks";
import { getUserDetails } from "@/utils/service";
import { useContextState } from "@/context";
import { EVENTS, createSocketConnection } from "@pushprotocol/socket";
import { ToastMessage } from "./UI/Toast";
import Link from "next/link";
import { useIsMounted } from "@/lib/hooks/us-is-mounted";

export default function Layout({ children }) {
  const { chainId, provider, address } = useWeb3();
  const [{ }, dispatch] = useContextState();
  const [disconnected, setDisconnected] = useState(true);
  const isMounted = useIsMounted();

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
      {isMounted && <main>{children}</main>}
    </>
  );
}