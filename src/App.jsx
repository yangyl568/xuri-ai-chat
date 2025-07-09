import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Bubble } from '@ant-design/x';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';

const { Sider, Content } = Layout;

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
      </Layout>
    </Layout>
  )
}

export default App
