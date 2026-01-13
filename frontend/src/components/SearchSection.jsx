import React, { useState } from 'react'
import './SearchSection.css'

function SearchSection() {
  const [activeTab, setActiveTab] = useState('word')
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = () => {
    if (!searchInput.trim()) {
      alert('请输入搜索内容')
      return
    }
    console.log(`Searching ${activeTab === 'word' ? 'by word' : 'by category'}:`, searchInput)
    // TODO: Implement search logic
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h2 className="search-title">词汇义类检索</h2>
          <p className="search-description">支持按词语反查义类，或按义类名称批量检索词群</p>
        </div>

        <div className="search-tabs">
          <button
            className={`tab-button ${activeTab === 'word' ? 'active' : ''}`}
            onClick={() => setActiveTab('word')}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7 C4 5.89543 4.89543 5 6 5 H10 C10.5523 5 11 5.44772 11 6 C11 6.55228 10.5523 7 10 7 H6 V17 H10 C10.5523 17 11 17.4477 11 18 C11 18.5523 10.5523 19 10 19 H6 C4.89543 19 4 18.1046 4 17 V7 Z" fill="currentColor"/>
              <path d="M14 5 H18 C19.1046 5 20 5.89543 20 7 V17 C20 18.1046 19.1046 19 18 19 H14 C13.4477 19 13 18.5523 13 18 C13 17.4477 13.4477 17 14 17 H18 V7 H14 C13.4477 7 13 6.55228 13 6 C13 5.44772 13.4477 5 14 5 Z" fill="currentColor"/>
            </svg>
            <span>按词语检索</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'category' ? 'active' : ''}`}
            onClick={() => setActiveTab('category')}
          >
            <span>按义类检索</span>
          </button>
        </div>

        <div className="search-input-group">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21 L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={activeTab === 'word' ? '请输入词语,如:害羞、波浪...' : '请输入义类名称,如:情感、自然...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            搜索
          </button>
        </div>

        <p className="search-hint">
          提示:系统会自动识别词语后的数字编号
        </p>
      </div>
    </section>
  )
}

export default SearchSection
