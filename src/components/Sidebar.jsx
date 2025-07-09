import React, { useState } from 'react';
import { Layout, Button, Menu, Tooltip } from 'antd';
import styles from './Sidebar.module.scss';
import { PlusOutlined, DeleteOutlined, MessageOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ conversations, activeId, onNewChat, onDelete, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      width={260}
      collapsedWidth={68}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className={styles.sidebar}
    >
      <div className={styles.logoRow}>
        <div className={styles.logo}>{collapsed ? '旭' : '旭日AI'}</div>
        <Tooltip title={collapsed ? '展开' : '收起'} placement="right">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseBtn}
            size="small"
          />
        </Tooltip>
      </div>
      <div className={styles.newChatBtnWrap}>
        {collapsed ? (
          <Tooltip title="新建对话" placement="right">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              shape="circle"
              className={styles.newChatBtnCollapsed}
              onClick={onNewChat}
            />
          </Tooltip>
        ) : (
          <Button type="primary" icon={<PlusOutlined />} className={styles.newChatBtn} block onClick={onNewChat}>
            新建对话
          </Button>
        )}
      </div>
      {!collapsed && (
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
                onClick={() => onSelect(conv.id)}
              >
                <span>{conv.title}</span>
                <span className={styles.time}>{conv.time}</span>
                <DeleteOutlined
                  className={styles.deleteIcon}
                  onClick={e => { e.stopPropagation(); onDelete(conv.id); }}
                />
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        </Menu>
      )}
    </Sider>
  );
};

export default Sidebar; 