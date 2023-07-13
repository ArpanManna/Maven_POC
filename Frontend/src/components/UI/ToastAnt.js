import {
    RadiusBottomrightOutlined,
  } from '@ant-design/icons';
  import { Button, Divider, Space, notification } from 'antd';
  import React, { useMemo } from 'react';

  const Context = React.createContext({
    name: 'Default',
  });

  const Toast = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
      api.info({
        message: `Notification ${placement}`,
        description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
        placement,
      });
    };
    const contextValue = useMemo(
      () => ({
        name: 'Ant Design',
      }),
      [],
    );
    return (
      <Context.Provider value={contextValue}>
        {contextHolder}
        <Space>
          <Button
            type="primary"
            onClick={() => openNotification('bottomRight')}
            icon={<RadiusBottomrightOutlined />}
          >
            bottomRight
          </Button>
        </Space>
      </Context.Provider>
    );
  };
  export default Toast;
  