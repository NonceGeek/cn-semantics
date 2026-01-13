import React from 'react'
import './SystemStatusAlert.css'

function SystemStatusAlert() {
  const handleImportClick = () => {
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        console.log('Selected file:', file.name)
        // TODO: Implement CSV import logic
        alert(`已选择文件: ${file.name}\n导入功能待实现`)
      }
    }
    input.click()
  }

  return (
    <div className="system-status-alert">
      <div className="alert-content">
        <div className="alert-left">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8 V12 M12 16 H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatusAlert
