import React, { useState, useRef, useEffect } from 'react';
import { Typography, Input, Button, Empty } from 'antd';
import { Bubble } from '@ant-design/x';
import styles from './ChatPanel.module.scss';

const { Title, Paragraph } = Typography;

const ChatPanel = ({ currentConv, messages, onSend }) => {
  const [input, setInput] = useState('');
  const msgEndRef = useRef(null);

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentConv]);

  if (!currentConv) {
    return (
      <div className={styles.welcome}>
        <div className={styles.logo}>旭日AI</div>
        <Title level={2}>欢迎使用旭日AI聊天</Title>
        <Paragraph>请选择左侧对话或新建对话开始聊天。</Paragraph>
      </div>
    );
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <Empty description="暂无消息，快来发送第一条吧！" />
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
        <Input.TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); onSend(input); setInput(''); } }}
          placeholder="请输入消息..."
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <Button type="primary" onClick={() => { if (input.trim()) { onSend(input); setInput(''); } }}>
          发送
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel; 