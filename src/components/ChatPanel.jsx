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

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

const iconStyle = { color: "#000" };
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

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
  const [loading, setLoading] = useState(false);
  const msgEndRef = useRef(null);
  const { message } = App.useApp();
  const [content, setContent] = React.useState("");

  // Agent for request
  const [agent] = useXAgent({
    request: (_a, _b) =>
      __awaiter(
        void 0,
        [_a, _b],
        void 0,
        function* ({ message }, { onSuccess, onError }) {
          yield sleep();
          mockSuccess = !mockSuccess;
          if (mockSuccess) {
            onSuccess([`请求成功. 你说: ${message}`]);
          }
          onError(new Error("请求失败"));
        }
      ),
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
            onRequest(nextContent);
            setContent("");
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
