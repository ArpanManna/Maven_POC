import Nav from '@/components/Nav'
import { useWeb3 } from '@3rdweb/hooks'
import { useCallback, useEffect, useState } from 'react'
import ToastMessage from "@/components/UI/Toast";
import { EVENTS, createSocketConnection } from '@pushprotocol/socket'

export default function Home() {
  const { address } = useWeb3();
  const [disconnected, setDisconnected] = useState(true);

  useEffect(() => {
    if (address && disconnected) {
      setDisconnected(false)
      const pushSDKSocket = createSocketConnection({
        user: `eip155:5:${address}`, // CAIP-10 format
        env: 'staging',
        socketOptions: { autoConnect: true }
      });
      pushSDKSocket?.on(EVENTS.CONNECT, () => { console.log('connected') })
      pushSDKSocket?.on(EVENTS.DISCONNECT, (err) => setDisconnected(true));
      pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => console.log(message))
      pushSDKSocket?.on(EVENTS.USER_FEEDS, (notification) => {
        simpleNotify("success", notification.payload.notification.title, notification.payload.notification.body)
      })
      pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) => console.log(spam))
    }
  }, [address, disconnected])

  const simpleNotify = useCallback((type, title, body) => {
    ToastMessage({ type, title, body });
  }, []);

  return (
    <>
      <Nav />
      <h2>Home Page</h2>
    </>
  )
}
