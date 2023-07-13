import Image from 'next/image'
// import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import { sendNotification, socketConnection } from '@/lib/Notify'
import { useWeb3 } from '@3rdweb/hooks'
import { useCallback, useEffect, useState } from 'react'
import { NotificationItem } from '@pushprotocol/uiweb'
import { ToastContainer, toast } from "react-toastify";
import ToastMessage from "@/components/UI/Toast";
import { EVENTS, createSocketConnection } from '@pushprotocol/socket'

// const inter = Inter({ subsets: ['latin'] })

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
        notify("success", notification.payload.notification.title, notification.payload.notification.body)
        console.log(notification)
      })
      pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) => console.log(spam))
    }
  }, [address, disconnected])

  const notify = useCallback((type, title, body) => {
    ToastMessage({ type, title, body });
  }, []);

  // useEffect(() => {
  //   sendNotification("Hii", "Kuch Bhi Nahi", "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994");
  // },[])
  return (
    <>
      <Nav />
      <h2>Home Page</h2>
    </>
  )
}
