import React, { useState } from 'react';
import { Layout, Button, Menu, Typography, message } from 'antd';
import styles from './Sidebar.module.scss';
import { PlusOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

function getNowDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const initialConversations = [
  { id: 1, title: '对话 1', time: '2024-06-01' },
  { id: 2, title: '对话 2', time: '2024-06-02' },
];

const Sidebar = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id || null);
  const [nextId, setNextId] = useState(conversations.length + 1);

  const handleNewChat = () => {
    const newConv = {
      id: nextId,
      title: `对话 ${nextId}`,
      time: getNowDate(),
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newConv.id);
    setNextId(nextId + 1);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (activeId === id && filtered.length > 0) {
      setActiveId(filtered[0].id);
    } else if (filtered.length === 0) {
      setActiveId(null);
    }
  };

  const handleSelect = (id) => {
    setActiveId(id);
  };

  return (
    <Sider width={260} className={styles.sidebar}>
      <div className={styles.logo}>旭日AI</div>
      <Button type="primary" icon={<PlusOutlined />} className={styles.newChatBtn} block onClick={handleNewChat}>
        新建对话
      </Button>
      <Menu
        mode="inline"
        className={styles.menu}
        selectedKeys={activeId ? [String(activeId)] : []}
      >
        <Menu.ItemGroup key="history" title="对话记录">
          {conversations.map((conv) => (
            <Menu.Item
              key={conv.id}
              icon={<MessageOutlined />}
              className={styles.menuItem}
              onClick={() => handleSelect(conv.id)}
            >
              <span>{conv.title}</span>
              <span className={styles.time}>{conv.time}</span>
              <DeleteOutlined
                className={styles.deleteIcon}
                onClick={(e) => handleDelete(conv.id, e)}
              />
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
};

export default Sidebar; 