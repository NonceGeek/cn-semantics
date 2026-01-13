import React from 'react'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import ResourceDownload from './components/ResourceDownload'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <SearchSection />
        <ResourceDownload />
      </div>
      <Footer />
    </div>
  )
}

export default App
