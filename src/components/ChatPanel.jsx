import React, { useState, useRef, useEffect } from "react";
import { App, Button, Space, Divider, Flex, Switch } from "antd";
import { Bubble, Welcome, Sender, useXAgent, useXChat } from "@ant-design/x";
import styles from "./ChatPanel.module.scss";
import {
  ShareAltOutlined,
  EllipsisOutlined,
  LinkOutlined,
  ApiOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { chatApi } from "@/api/chat.js";

const iconStyle = { color: "#000" };

const roles = {
  ai: {
    placement: "start",
    avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
  },
  local: {
    placement: "end",
    avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
  },
};
let mockSuccess = false;
const ChatPanel = ({ currentConv, onSend }) => {
  const { message } = App.useApp();
  const msgEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = React.useState("");

  // Agent for request
  const [agent] = useXAgent({
    request: ({ message }, { onSuccess, onError }) => {
      chatApi({
        model: "deepseek-ai/DeepSeek-V3",
        "max_tokens": 512,
        "enable_thinking": true,
        "thinking_budget": 4096,
        "min_p": 0.05,
        "temperature": 0.7,
        "top_p": 0.7,
        "top_k": 50,
        "frequency_penalty": 0.5,
        "n": 1,
        messages: [
          {
            role: "user",
            messages: message,
          },
        ],
      })
        .then((response) => {
          const reply = response.choices?.[0]?.message?.content || "请求成功，但未返回内容";
          onSuccess([reply]); // 调用成功回调
        })
        .catch((error) => {
          onError(new Error("请求失败，请稍后再试")); // 调用失败回调
        })
        .finally(() => {
          setLoading(false); // 确保加载状态被取消
          setContent(""); // 清空输入框内容
        });
    },
  });
  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "等待中...",
    requestFallback: "请求失败，请稍后再试。",
  });

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, ["", currentConv]);

  if (!currentConv) {
    return (
      <div className={styles.welcome}>
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
          <div>你好，有什么可以帮你的吗？</div>
        ) : (
          <Bubble.List
            roles={roles}
            items={messages.map(({ id, message, status }) => ({
              key: id,
              loading: status === "loading",
              role: status === "local" ? "local" : "ai",
              content: message,
            }))}
          />
        )}
        <div ref={msgEndRef} />
      </div>
      <div className={styles.inputBar}>
        {/* 组件：输入框、发送按钮 https://x.ant.design/components/sender-cn#sender-demo-footer */}
        <Sender
          value={content}
          loading={agent.isRequesting()}
          onChange={setContent}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="请输入消息..."
          footer={({ components }) => {
            const { SendButton, LoadingButton, SpeechButton } = components;
            return (
              <Flex justify="space-between" align="center">
                <Flex gap="small" align="center">
                  <Button
                    style={iconStyle}
                    type="text"
                    icon={<LinkOutlined />}
                  />
                  <Divider type="vertical" />
                  深度思考
                  <Switch size="small" />
                  <Divider type="vertical" />
                  <Button icon={<SearchOutlined />}>全局搜索</Button>
                </Flex>
                <Flex align="center">
                  <Button
                    type="text"
                    style={iconStyle}
                    icon={<ApiOutlined />}
                  />
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
          onSubmit={(nextContent) => {
            if (!nextContent.trim()) return; // 防止发送空消息
            setLoading(true); // 设置加载状态
            onRequest(nextContent) // 调用 useXChat 的 onRequest 方法
              .then(() => {
                setLoading(false); // 请求成功后取消加载状态
              })
              .catch(() => {
                setLoading(false); // 请求失败后取消加载状态
                message.error("消息发送失败，请稍后重试"); // 显示错误提示
              });
            setContent(""); // 清空输入框内容
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
