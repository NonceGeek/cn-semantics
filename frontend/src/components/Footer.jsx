import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="feedback">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4 H20 C21.1 4 22 4.9 22 6 V18 C22 19.1 21.1 20 20 20 H4 C2.9 20 2 19.1 2 18 V6 C2 4.9 2.9 4 4 4 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M22 6 L12 13 L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="footer-content">
            <h3 className="footer-title">意见与反馈</h3>
            <p className="footer-text">
              如果您在使用过程中发现数据错误、系统故障或有任何改进建议,欢迎随时联系我们。您的反馈对我们完善资源至关重要。
            </p>
            <a href="mailto:liury@gzhu.edu.cn" className="footer-email">
              liury@gzhu.edu.cn
            </a>
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-copyright">
            <p>国际中文教育资源库项目组</p>
            <p>© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
