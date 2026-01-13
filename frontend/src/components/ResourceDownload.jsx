import React from 'react'
import './ResourceDownload.css'

function ResourceDownload() {
  const handleDownload = (type) => {
    // Define download URLs
    const downloadUrls = {
      guide: 'https://dimsum-utils.oss-cn-guangzhou.aliyuncs.com/cn-sementics/guide.pdf',
      lexicon: 'https://dimsum-utils.oss-cn-guangzhou.aliyuncs.com/cn-sementics/words.pdf' // Placeholder - update when available
    }

    const url = downloadUrls[type]
    if (!url) {
      console.error(`Unknown download type: ${type}`)
      return
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = type === 'guide' ? '使用指南.pdf' : '完整词表.pdf'
    link.target = '_blank' // Open in new tab as fallback
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="resource-download" id="download">
      <div className="download-container">
        <div className="download-header">
          <h2 className="download-title">资源下载</h2>
          <p className="download-description">请下载最新的《等级标准》配套文件,助力教学与研究。</p>
        </div>

        <div className="download-cards">
          <div className="download-card">
            <div className="card-icon card-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5 C4 18.6716 4.67157 18 5.5 18 H18.5 C19.3284 18 20 18.6716 20 19.5 C20 20.3284 19.3284 21 18.5 21 H5.5 C4.67157 21 4 20.3284 4 19.5 Z" fill="currentColor"/>
                <path d="M5 4 H19 C19.5523 4 20 4.44772 20 5 V16 C20 16.5523 19.5523 17 19 17 H5 C4.44772 17 4 16.5523 4 16 V5 C4 4.44772 4.44772 4 5 4 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M8 8 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">使用指南</h3>
              <p className="card-description">包含平台使用说明及义类体系介绍</p>
              <button className="download-link" onClick={() => handleDownload('guide')}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15 V19 C21 19.5304 20.7893 20.0391 20.4142 20.4142 C20.0391 20.7893 19.5304 21 19 21 H5 C4.46957 21 3.96086 20.7893 3.58579 20.4142 C3.21071 20.0391 3 19.5304 3 19 V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10 L12 15 L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15 V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>下载 PDF (使用指南)</span>
              </button>
            </div>
          </div>

          <div className="download-card">
            <div className="card-icon card-icon-green">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M3 9 H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 3 V21" stroke="currentColor" strokeWidth="2"/>
                <circle cx="7" cy="7" r="1" fill="currentColor"/>
                <circle cx="12" cy="7" r="1" fill="currentColor"/>
                <circle cx="17" cy="7" r="1" fill="currentColor"/>
                <circle cx="7" cy="12" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="17" cy="12" r="1" fill="currentColor"/>
                <circle cx="7" cy="17" r="1" fill="currentColor"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
                <circle cx="17" cy="17" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">词语表类义词群</h3>
              <p className="card-description">完整版《等级标准》义类词汇数据</p>
              <button className="download-link" onClick={() => handleDownload('lexicon')}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15 V19 C21 19.5304 20.7893 20.0391 20.4142 20.4142 C20.0391 20.7893 19.5304 21 19 21 H5 C4.46957 21 3.96086 20.7893 3.58579 20.4142 C3.21071 20.0391 3 19.5304 3 19 V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10 L12 15 L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15 V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>下载 PDF (完整词表)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResourceDownload
