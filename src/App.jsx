import { useState } from 'react'
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import './App.css'

const { Content } = Layout;

function getNowTime() {
  const d = new Date();
  return d.toLocaleTimeString('zh-CN', { hour12: false });
}

const initialConversations = [
  { id: 1, title: '对话 1', time: '2024-06-01' },
  { id: 2, title: '对话 2', time: '2024-06-02' },
];

const initialMessages = {
  1: [
    { role: 'assistant', content: '你好，我是旭日AI，有什么可以帮您？' },
  ],
  2: [],
};

function App() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id || null);
  const [nextId, setNextId] = useState(conversations.length + 1);
  const [messages, setMessages] = useState(initialMessages);

  // 新建对话
  const handleNewChat = () => {
    const newConv = {
      id: nextId,
      title: `对话 ${nextId}`,
      time: new Date().toISOString().slice(0, 10),
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newConv.id);
    setNextId(nextId + 1);
    setMessages({ ...messages, [newConv.id]: [] });
  };

  // 删除对话
  const handleDelete = (id) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    const newMessages = { ...messages };
    delete newMessages[id];
    setMessages(newMessages);
    if (activeId === id && filtered.length > 0) {
      setActiveId(filtered[0].id);
    } else if (filtered.length === 0) {
      setActiveId(null);
    }
  };

  // 切换对话
  const handleSelect = (id) => {
    setActiveId(id);
  };

  // 发送消息
  const handleSend = (text) => {
    if (!activeId || !text.trim()) return;
    setMessages({
      ...messages,
      [activeId]: [
        ...(messages[activeId] || []),
        { role: 'user', content: text.trim() },
        // 可模拟AI回复
        // { role: 'assistant', content: '收到：' + text.trim() },
      ],
    });
  };

  const currentConv = conversations.find((c) => c.id === activeId);
  const currentMessages = messages[activeId] || [];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
      <Layout>
        <Content style={{ padding: 0 }}>
          <ChatPanel
            currentConv={currentConv}
            messages={currentMessages}
            onSend={handleSend}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
