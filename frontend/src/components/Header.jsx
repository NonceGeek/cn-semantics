import React from 'react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="header-title-group">
            <h1 className="header-title">国际中文教育词汇义类资源检索平台</h1>
            <p className="header-subtitle">基于《等级标准》构建的智能语义检索系统</p>
          </div>
        </div>
        <nav className="header-nav">
          <a href="#search" className="nav-link">资源检索</a>
          <a href="#download" className="nav-link">资料下载</a>
          <a href="#feedback" className="nav-link">意见反馈</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
