import React, { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import { useWeb3 } from '@3rdweb/hooks';
import { fetchNotifications } from '@/lib/pushProtocol';
import { BellIcon } from '@heroicons/react/24/outline'
import { useContextState } from '@/context';

const NotificationDrawer = () => {
  const [open, setOpen] = useState(false);
  const [{ notifications }, dispatch] = useContextState();
  const { address } = useWeb3();

  useEffect(() => {
    if (address) getNotifications();
  }, [address])

  useEffect(() => {
    if (address) getNotifications();
  }, [])

  const getNotifications = async () => {
    await fetchNotifications(address, dispatch);
  }

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary" onClick={showDrawer}
        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
      </Button>
      <Drawer title="Notifications" placement="right" onClose={onClose} open={open}>

        {notifications && notifications.map(({ notification }, index) => (
          <div className='border p-3 rounded-md shadow-sm mb-2' key={index}>
            <h2 className='text-md font-semibold'>{notification.title}</h2>
            <h2 className='text-xs'>{notification.body}</h2>
          </div>
        ))}
      </Drawer>
    </>
  );
};
export default NotificationDrawer;