import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Divider, Flex, Switch } from 'antd';
import { Bubble, Welcome, Sender } from '@ant-design/x';
import styles from './ChatPanel.module.scss';
import { ShareAltOutlined, EllipsisOutlined, LinkOutlined, SearchOutlined, ApiOutlined } from '@ant-design/icons';

const iconStyle = { color: '#000' };

const ChatPanel = ({ currentConv, messages, onSend }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentConv]);

  if (!currentConv) {
    return (
      <div className={styles.welcome}>
        {/* <div className={styles.logo}>旭日AI</div>
        <Title level={2}>欢迎使用旭日AI聊天</Title>
        <Paragraph>请选择左侧对话或新建对话开始聊天。</Paragraph> */}
        <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="欢迎使用旭日AI聊天"
            description="请选择左侧对话或新建对话开始聊天。"
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
      </div>
    );
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          123
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={styles.bubbleWrap}>
              <Bubble content={msg.content} type={msg.role === 'user' ? 'primary' : 'default'} />
            </div>
          ))
        )}
        <div ref={msgEndRef} />
      </div>
      <div className={styles.inputBar}>
        {/* 组件：输入框、发送按钮 https://x.ant.design/components/sender-cn#sender-demo-footer */}
        <Sender
          value={value}
          onChange={setValue}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="请输入消息..."
          footer={({ components }) => {
            const { SendButton, LoadingButton, SpeechButton } = components;
            return (
              <Flex justify="space-between" align="center">
                <Flex gap="small" align="center">
                  <Button style={iconStyle} type="text" icon={<LinkOutlined />} />
                  <Divider type="vertical" />
                  深度思考
                  <Switch size="small" />
                  <Divider type="vertical" />
                  <Button icon={<SearchOutlined />}>全局搜索</Button>
                </Flex>
                <Flex align="center">
                  <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
                  <Divider type="vertical" />
                  <SpeechButton style={iconStyle} />
                  <Divider type="vertical" />
                  {loading ? (
                    <LoadingButton type="default" />
                  ) : (
                    <SendButton type="primary" disabled={false} />
                  )}
                </Flex>
              </Flex>
            );
          }}
          onSubmit={() => {
            setLoading(true);
          }}
          onCancel={() => {
            setLoading(false);
          }}
          actions={false}
        />
      </div>
    </div>
  );
};

export default ChatPanel; 