import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { App as AntdApp } from 'antd';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </React.StrictMode>
);
