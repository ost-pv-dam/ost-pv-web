import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Layout, Menu, Avatar } from 'antd'
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons'
import { signInWithGoogle } from '../firebase'

const { Sider } = Layout

const Sidebar = ({ user }) => {
  // 3 items on the sidebar
  const items =
    user && user !== 'unauthorized' && user !== 'signed_out'
      ? [
          {
            key: '1',
            label: user.displayName,
            icon: <Avatar src={user.photoURL} shape="square" size={36} />,
            style: { paddingLeft: '18px' }
          },
          {
            key: '2',
            label: 'Sign out',
            icon: <LogoutOutlined />,
            onClick: () => signOut(auth)
          }
        ]
      : [
          {
            key: '3',
            label: 'Sign in',
            icon: <LoginOutlined />,
            onClick: () => signInWithGoogle()
          }
        ]
  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0
      }}
      collapsed={true}
    >
      <div className="logo">
        <img
          src="block-m.png"
          alt="Block M Logo"
          style={{
            width: '100%',
            padding: '16px',
            textAlign: 'center'
          }}
        />
      </div>
      <Menu theme="dark" mode="inline" selectedKeys="0" items={items} />
    </Sider>
  )
}

export default Sidebar
