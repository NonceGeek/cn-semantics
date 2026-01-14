import React, { useState, useEffect } from 'react'
import './SearchSection.css'

function SearchSection() {
  const [activeTab, setActiveTab] = useState('word')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'star'
  const [categoryExpandedData, setCategoryExpandedData] = useState({ level3: {}, level4: {} })
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [hoveredWord, setHoveredWord] = useState(null)

  // Fetch all words for each unique level_3 and level_4 when search results change
  useEffect(() => {
    if (activeTab === 'word' && searchResults && searchResults.data && searchResults.data.length > 0) {
      const fetchCategoryWords = async () => {
        setCategoryLoading(true)
        try {
          // Extract unique level_3 and level_4 values
          // Use Map for level_4 to bind the first original search word to each category
          const uniqueLevel3 = new Set()
          const level4ToWord = new Map() // Map: level_4 -> first original search word
          console.log('searchResults.data', searchResults.data)
          searchResults.data.forEach(item => {
            if (item.level_3) uniqueLevel3.add(item.level_3)
            if (item.level_4) {
              // Only store the first word for each level_4
              if (!level4ToWord.has(item.level_4)) {
                level4ToWord.set(item.level_4, item.word)
              }
            }
          })

          // Fetch all words for each level_3
          const level3Promises = Array.from(uniqueLevel3).map(async (level3) => {
            try {
              const apiUrl = new URL('https://backend.cnsemantics.com/search_by_level')
              apiUrl.searchParams.append('level', level3)
              apiUrl.searchParams.append('limit', '1000')
              
              const response = await fetch(apiUrl.toString())
              if (!response.ok) {
                console.error(`Failed to fetch level_3: ${level3}`)
                return { level3, data: [] }
              }
              
              const result = await response.json()
              // Filter to only include words with matching level_3
              const filtered = result.data.filter(item => item.level_3 === level3)
              return { level3, data: filtered }
            } catch (err) {
              console.error(`Error fetching level_3 ${level3}:`, err)
              return { level3, data: [] }
            }
          })

          // Fetch all words for each level_4
          const level4Promises = Array.from(level4ToWord.keys()).map(async (level4) => {
            try {
              const apiUrl = new URL('https://backend.cnsemantics.com/search_by_level')
              apiUrl.searchParams.append('level', level4)
              apiUrl.searchParams.append('limit', '1000')
              
              const response = await fetch(apiUrl.toString())
              if (!response.ok) {
                console.error(`Failed to fetch level_4: ${level4}`)
                return { level4, data: [] }
              }
              
              const result = await response.json()
              // Filter to only include words with matching level_4
              const filtered = result.data.filter(item => item.level_4 === level4)
              return { level4, data: filtered }
            } catch (err) {
              console.error(`Error fetching level_4 ${level4}:`, err)
              return { level4, data: [] }
            }
          })

          // Wait for all requests to complete
          const [level3Results, level4Results] = await Promise.all([
            Promise.all(level3Promises),
            Promise.all(level4Promises)
          ])

          // Organize results into the same structure as groupResultsByCategory
          const level3Groups = {}
          level3Results.forEach(({ level3, data }) => {
            level3Groups[level3] = data
          })

          console.log('level3Groups', level3Groups)

          const level4Groups = {}
          level4Results.forEach(({ level4, data }) => {
            level4Groups[level4] = {
              data: data,
              searchWord: level4ToWord.get(level4) || null // First original search word for this level_4
            }
          })

          console.log('level4Groups', level4Groups)

          // Add original searchResults.data words to the groups
          searchResults.data.forEach(originalItem => {
            // Add to level3Groups
            if (originalItem.level_3) {
              if (!level3Groups[originalItem.level_3]) {
                level3Groups[originalItem.level_3] = []
              }
              // Check if item already exists (by id) to avoid duplicates
              const existsInLevel3 = level3Groups[originalItem.level_3].some(item => item.id === originalItem.id)
              if (!existsInLevel3) {
                level3Groups[originalItem.level_3].push(originalItem)
              }
            }

            // Add to level4Groups (now has { data, searchWord } structure)
            if (originalItem.level_4) {
              if (!level4Groups[originalItem.level_4]) {
                level4Groups[originalItem.level_4] = {
                  data: [],
                  searchWord: level4ToWord.get(originalItem.level_4) || null
                }
              }
              // Check if item already exists (by id) to avoid duplicates
              const existsInLevel4 = level4Groups[originalItem.level_4].data.some(item => item.id === originalItem.id)
              if (!existsInLevel4) {
                level4Groups[originalItem.level_4].data.push(originalItem)
              }
            }
          })

          setCategoryExpandedData({ level3: level3Groups, level4: level4Groups })
        } catch (err) {
          console.error('Error fetching category words:', err)
        } finally {
          setCategoryLoading(false)
        }
      }

      fetchCategoryWords()
    } else {
      // Reset when not in word search mode or no results
      setCategoryExpandedData({ level3: {}, level4: {} })
    }
  }, [searchResults, activeTab])

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      alert('请输入搜索内容')
      return
    }

    // Only call API for word search tab
    if (activeTab === 'word') {
      setLoading(true)
      setError(null)

      try {
        const word = searchInput.trim()
        const apiUrl = new URL('https://backend.cnsemantics.com/search_by_word')
        apiUrl.searchParams.append('word', word)
        apiUrl.searchParams.append('limit', '100')

        const response = await fetch(apiUrl.toString())

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Search results:', result)
        setSearchResults(result)
      } catch (err) {
        console.error('Search error:', err)
        setError(err.message || '搜索失败，请稍后重试')
        alert(err.message || '搜索失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    } else {
      // Category search - call search_by_level API
      setLoading(true)
      setError(null)

      try {
        const level = searchInput.trim()
        const apiUrl = new URL('https://backend.cnsemantics.com/search_by_level')
        apiUrl.searchParams.append('level', level)
        apiUrl.searchParams.append('limit', '100')

        const response = await fetch(apiUrl.toString())

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Search results:', result)
        setSearchResults(result)
      } catch (err) {
        console.error('Search error:', err)
        setError(err.message || '搜索失败，请稍后重试')
        alert(err.message || '搜索失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Group results by level_3 and level_4
  const groupResultsByCategory = (data) => {
    if (!data || data.length === 0) return { level3: {}, level4: {} }

    const level3Groups = {}
    const level4Groups = {}

    data.forEach(item => {
      // Group by level_3
      const l3 = item.level_3
      if (!level3Groups[l3]) {
        level3Groups[l3] = []
      }
      level3Groups[l3].push(item)

      // Group by level_4
      const l4 = item.level_4
      if (!level4Groups[l4]) {
        level4Groups[l4] = []
      }
      level4Groups[l4].push(item)
    })

    return { level3: level3Groups, level4: level4Groups }
  }

  // Get difficulty badge color
  const getDifficultyColor = (level) => {
    if (level == null) return '#a855f7' // purple for 增补
    if (level <= 2) return '#10b981' // green for level 1, 2
    if (level <= 4) return '#2563eb' // blue for level 3, 4
    if (level <= 6) return '#f59e0b' // orange for level 5, 6
    return '#ef4444' // red for level 7
  }

  // Sort items by difficulty_level (1-7, then null/增补)
  const sortByDifficulty = (items) => {
    return [...items].sort((a, b) => {
      // Null values go to the end
      if (a.difficulty_level == null && b.difficulty_level == null) return 0
      if (a.difficulty_level == null) return 1
      if (b.difficulty_level == null) return -1
      // Sort by difficulty_level ascending (1 to 7)
      return a.difficulty_level - b.difficulty_level
    })
  }

  // Get the main searched word (first result or exact match)
  const getMainWord = () => {
    if (!searchResults || !searchResults.data || searchResults.data.length === 0) return null
    // Try to find exact match first
    const exactMatch = searchResults.data.find(item => 
      item.word.toLowerCase() === searchInput.trim().toLowerCase()
    )
    return exactMatch || searchResults.data[0]
  }

  // Calculate positions for words in concentric circles by difficulty level
  // 8 rings: level 1-7 and null (增补) radiating outward from center
  const calculateWordPositions = (words, centerX, centerY) => {
    if (!words || words.length === 0) return []
    
    // Define 8 rings for difficulty levels 1-7 and null (增补)
    // Ring radius increases as difficulty increases (40px spacing between rings)
    const levelToRing = {
      1: { radius: 90, level: 1 },
      2: { radius: 130, level: 2 },
      3: { radius: 170, level: 3 },
      4: { radius: 210, level: 4 },
      5: { radius: 250, level: 5 },
      6: { radius: 290, level: 6 },
      7: { radius: 330, level: 7 },
      null: { radius: 370, level: null } // 增补 at outermost ring
    }

    // Group words by difficulty level
    const wordsByLevel = {}
    words.forEach(word => {
      const level = word.difficulty_level
      const key = level === null ? 'null' : level
      if (!wordsByLevel[key]) {
        wordsByLevel[key] = []
      }
      wordsByLevel[key].push(word)
    })

    const positions = []

    // Process each level and position words on their respective ring
    Object.entries(levelToRing).forEach(([levelKey, ringInfo]) => {
      const key = levelKey === 'null' ? 'null' : parseInt(levelKey)
      const wordsInLevel = wordsByLevel[key] || wordsByLevel[levelKey] || []
      
      if (wordsInLevel.length === 0) return

      const angleStep = (2 * Math.PI) / wordsInLevel.length
      
      wordsInLevel.forEach((word, index) => {
        const angle = index * angleStep - Math.PI / 2 // Start from top
        const x = centerX + ringInfo.radius * Math.cos(angle)
        const y = centerY + ringInfo.radius * Math.sin(angle)
        
        positions.push({
          word,
          x,
          y,
          angle
        })
      })
    })

    return positions
  }

  // Render star map for a category
  const renderStarMap = (category, items, searchWord = null) => {
    if (!items || items.length === 0) return null

    const sortedItems = sortByDifficulty(items)
    // HINT: centerX and centerY are the center of the star map.
    const centerX = 450
    const centerY = 450
    const positions = calculateWordPositions(sortedItems, centerX, centerY)

    // Get the level_4 category for this level_3
    const level4Category = items[0]?.level_4 || ''

    return (
      <div key={`star-${category}`} className="star-map-container">
        <div className="star-map-header">
          <h3 className="star-map-title">"{category}"义类词汇辐射图</h3>
          {searchWord && (
            <p className="star-map-subtitle">包含检索词: {searchWord}</p>
          )}
        </div>

        <div className="star-map-svg-container">
          <div className="star-map-legend">
            <div className="legend-title">难度等级图例</div>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                <span>等级 1-2</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#2563eb' }}></span>
                <span>等级 3-4</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                <span>等级 5-6</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
                <span>等级 7</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#a855f7' }}></span>
                <span>增补</span>
              </div>
            </div>
          </div>
          <svg width="1000" height="1000" className="star-map-svg">
            {/* Draw concentric circles - 8 rings for difficulty levels 1-7 and null */}
            {[90, 130, 170, 210, 250, 290, 330, 370].map((radius, i) => (
              <circle
                key={`ring-${i}`}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
              />
            ))}

            {/* Center node */}
            <g
              onMouseEnter={() => setHoveredWord({ type: 'center', category, searchWord })}
              onMouseLeave={() => setHoveredWord(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={centerX}
                cy={centerY}
                r="50"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="16"
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {category.length > 6 ? category.substring(0, 6) + '...' : category}
              </text>
            </g>

            {/* Word nodes - render all circles and text first */}
            {positions.map((pos, index) => {
              const item = pos.word
              const color = getDifficultyColor(item.difficulty_level)
              const isHovered = hoveredWord?.id === item.id

              return (
                <g key={item.id}>
                  {/* Word circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? "14" : "11"}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredWord(item)}
                    onMouseLeave={() => setHoveredWord(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    className="star-map-node"
                  />
                  
                  {/* Word text */}
                  <text
                    x={pos.x}
                    y={pos.y + 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1a1a1a"
                    fontSize="12"
                    fontWeight="500"
                  >
                    {item.word}
                  </text>
                </g>
              )
            })}

            {/* Tooltips layer - render all tooltips last to ensure they are on top */}
            {/* Center tooltip */}
            {hoveredWord?.type === 'center' && hoveredWord?.category === category && (
              <g>
                <rect
                  x={centerX - 70}
                  y={centerY - 110}
                  width="140"
                  height="60"
                  rx="8"
                  fill="#ffffff"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  filter="url(#shadow)"
                />
                <text
                  x={centerX - 50}
                  y={centerY - 85}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#1a1a1a"
                  fontSize="14"
                  fontWeight="700"
                >
                  {category}
                </text>
                <rect
                  x={centerX + 10}
                  y={centerY - 95}
                  width="50"
                  height="20"
                  rx="10"
                  fill="#dbeafe"
                />
                <text
                  x={centerX + 35}
                  y={centerY - 85}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#2563eb"
                  fontSize="10"
                  fontWeight="500"
                >
                  Lv.核心
                </text>
                <text
                  x={centerX - 50}
                  y={centerY - 60}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#2563eb"
                  fontSize="12"
                >
                  ● 义类中心
                </text>
              </g>
            )}

            {/* Word node tooltips */}
            {positions.map((pos) => {
              const item = pos.word
              const isHovered = hoveredWord?.id === item.id

              return isHovered ? (
                <g key={`tooltip-${item.id}`}>
                  <rect
                    x={pos.x + 30}
                    y={pos.y - 60}
                    width="120"
                    height="80"
                    rx="8"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    filter="url(#shadow)"
                  />
                  <text
                    x={pos.x + 90}
                    y={pos.y - 40}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1a1a1a"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {item.word}
                  </text>
                  <text
                    x={pos.x + 90}
                    y={pos.y - 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6b7280"
                    fontSize="12"
                  >
                    Lv.{item.difficulty_level == null ? '增补' : item.difficulty_level}
                  </text>
                  <text
                    x={pos.x + 90}
                    y={pos.y - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#2563eb"
                    fontSize="11"
                  >
                    ● {item.level_3}
                  </text>
                  <text
                    x={pos.x + 90}
                    y={pos.y + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    所属: {item.level_4}
                  </text>
                </g>
              ) : null
            })}

            {/* Shadow filter for tooltip */}
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    )
  }

  // Render star map for category search
  const renderCategoryStarMap = (searchTerm, items) => {
    if (!items || items.length === 0) return null

    const sortedItems = sortByDifficulty(items)
    const centerX = 450
    const centerY = 450
    const positions = calculateWordPositions(sortedItems, centerX, centerY)

    return (
      <div key={`category-star-${searchTerm}`} className="star-map-container">
        <div className="star-map-header">
          <h3 className="star-map-title">"{searchTerm}"词汇难度辐射图</h3>
          <p className="star-map-subtitle">由内向外: 难度等级 1 → 7/增补</p>
        </div>

        <div className="star-map-svg-container">
          <div className="star-map-legend">
            <div className="legend-title">难度等级图例</div>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                <span>等级 1-2</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#2563eb' }}></span>
                <span>等级 3-4</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                <span>等级 5-6</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
                <span>等级 7</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#a855f7' }}></span>
                <span>增补</span>
              </div>
            </div>
          </div>
          <svg width="1000" height="1000" className="star-map-svg">
            {/* Draw concentric circles - 8 rings for difficulty levels 1-7 and null */}
            {[90, 130, 170, 210, 250, 290, 330, 370].map((radius, i) => (
              <circle
                key={`ring-${i}`}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
              />
            ))}

            {/* Center node */}
            <g
              onMouseEnter={() => setHoveredWord({ type: 'center', category: searchTerm, searchWord: null })}
              onMouseLeave={() => setHoveredWord(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={centerX}
                cy={centerY}
                r="50"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="16"
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {searchTerm.length > 6 ? searchTerm.substring(0, 6) + '...' : searchTerm}
              </text>
            </g>

            {/* Word nodes - render all circles and text first */}
            {positions.map((pos, index) => {
              const item = pos.word
              const color = getDifficultyColor(item.difficulty_level)
              const isHovered = hoveredWord?.id === item.id

              return (
                <g key={item.id}>
                  {/* Word circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? "14" : "11"}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredWord(item)}
                    onMouseLeave={() => setHoveredWord(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    className="star-map-node"
                  />
                  
                  {/* Word text */}
                  <text
                    x={pos.x}
                    y={pos.y + 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1a1a1a"
                    fontSize="12"
                    fontWeight="500"
                  >
                    {item.word}
                  </text>
                </g>
              )
            })}

            {/* Tooltips layer - render all tooltips last to ensure they are on top */}
            {/* Center tooltip */}
            {hoveredWord?.type === 'center' && hoveredWord?.category === searchTerm && (
              <g>
                <rect
                  x={centerX - 70}
                  y={centerY - 110}
                  width="140"
                  height="60"
                  rx="8"
                  fill="#ffffff"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  filter="url(#shadow)"
                />
                <text
                  x={centerX - 50}
                  y={centerY - 85}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#1a1a1a"
                  fontSize="14"
                  fontWeight="700"
                >
                  {searchTerm}
                </text>
                <rect
                  x={centerX + 10}
                  y={centerY - 95}
                  width="50"
                  height="20"
                  rx="10"
                  fill="#dbeafe"
                />
                <text
                  x={centerX + 35}
                  y={centerY - 85}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#2563eb"
                  fontSize="10"
                  fontWeight="500"
                >
                  Lv.核心
                </text>
                <text
                  x={centerX - 50}
                  y={centerY - 60}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#2563eb"
                  fontSize="12"
                >
                  ● 义类中心
                </text>
              </g>
            )}

            {/* Word node tooltips */}
            {positions.map((pos) => {
              const item = pos.word
              const isHovered = hoveredWord?.id === item.id

              return isHovered ? (
                <g key={`tooltip-${item.id}`}>
                  <rect
                    x={pos.x + 30}
                    y={pos.y - 60}
                    width="120"
                    height="80"
                    rx="8"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    filter="url(#shadow)"
                  />
                  <text
                    x={pos.x + 90}
                    y={pos.y - 40}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1a1a1a"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {item.word}
                  </text>
                  <text
                    x={pos.x + 90}
                    y={pos.y - 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6b7280"
                    fontSize="12"
                  >
                    Lv.{item.difficulty_level == null ? '增补' : item.difficulty_level}
                  </text>
                  <text
                    x={pos.x + 90}
                    y={pos.y - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#2563eb"
                    fontSize="11"
                  >
                    ● {item.level_3}
                  </text>
                  <text
                    x={pos.x + 90}
                    y={pos.y + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    所属: {item.level_4}
                  </text>
                </g>
              ) : null
            })}

            {/* Shadow filter for tooltip */}
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    )
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
              placeholder={activeTab === 'word' ? '请输入词语，如：海洋、乐观、应聘' : '请输入义类名称，如：感情、肢体动作、自然事物'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="search-button" onClick={handleSearch} disabled={loading}>
            {loading ? '搜索中...' : '搜索'}
          </button>
        </div>

        <p className="search-hint">
        支持模糊检索，若被检索词 W 为多义类项词语，则同时呈现 W1、W2、W3.......对应的结果。
        </p>
      </div>

      {/* Search Results */}
      {searchResults && (
        <>
          {searchResults.data && searchResults.data.length > 0 ? (
        <div className="search-results">
          <div className="results-header">
            {activeTab === 'word' ? (
              <h2 className="results-title">检索结果</h2>
            ) : (
              <h2 className="results-title">检索到 {searchResults.data.length} 个相关词语</h2>
            )}
            <div className="view-toggle">
              <button
                className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>列表视图</span>
              </button>
              <button
                className={`toggle-button ${viewMode === 'star' ? 'active' : ''}`}
                onClick={() => setViewMode('star')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>义类星图</span>
              </button>
            </div>
          </div>

          {viewMode === 'list' && (
            <>
              {activeTab === 'word' ? (
                <>
                  {/* Word Search: Searched Word Information */}
                  {searchResults.data && searchResults.data.length > 0 && (
                    <div className="word-info-section">
                      <div className="word-info-label">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 8 V12 M12 16 H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>检索词信息</span>
                      </div>
                      <div className="word-info-cards-grid">
                        {sortByDifficulty(searchResults.data).map((item) => (
                          <div key={item.id} className="word-info-card">
                            <div className="word-info-main">
                              <span className="word-info-word">{item.word}</span>
                              <span 
                                className="word-info-badge"
                                style={{ backgroundColor: getDifficultyColor(item.difficulty_level) }}
                              >
                                {item.difficulty_level == null ? '增补' : `等级${item.difficulty_level}`}
                              </span>
                            </div>
                            <div className="word-info-path">
                              {item.level_3} &gt; {item.level_4}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Word Search: Level 3 Categories - using expanded data from API */}
                  {categoryLoading ? (
                    <div className="category-loading">
                      <p>加载相关词语中...</p>
                    </div>
                  ) : (
                    <>
                      {Object.entries(categoryExpandedData.level3).map(([category, items]) => (
                        <div key={`l3-${category}`} className="category-section">
                          <div className="category-header">
                            <h3 className="category-title">三级义类: {category}</h3>
                            <span className="category-count">{items.length}个词语</span>
                          </div>
                          <div className="word-cards-grid">
                            {sortByDifficulty(items).map((item) => (
                              <div key={item.id} className="word-card">
                                <div className="word-card-header">
                                  <span className="word-card-word">{item.word}</span>
                                  <span 
                                    className="word-card-badge"
                                    style={{ backgroundColor: getDifficultyColor(item.difficulty_level) }}
                                  >
                                    {item.difficulty_level == null ? '增补' : `Lv.${item.difficulty_level}`}
                                  </span>
                                </div>
                                <div className="word-card-categories">
                                  <div className="word-card-category">L3: {item.level_3}</div>
                                  <div className="word-card-category">L4: {item.level_4}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Word Search: Level 4 Categories - using expanded data from API */}
                      {Object.entries(categoryExpandedData.level4).map(([category, groupData]) => (
                        <div key={`l4-${category}`} className="category-section">
                          <div className="category-header">
                            <h3 className="category-title">四级义类: {category}</h3>
                            <span className="category-count">{groupData.data.length}个词语</span>
                            {groupData.searchWord && (
                              <span className="search-words-badge">检索词: {groupData.searchWord}</span>
                            )}
                          </div>
                          <div className="word-cards-grid">
                            {sortByDifficulty(groupData.data).map((item) => (
                              <div key={item.id} className="word-card">
                                <div className="word-card-header">
                                  <span className="word-card-word">{item.word}</span>
                                  <span 
                                    className="word-card-badge"
                                    style={{ backgroundColor: getDifficultyColor(item.difficulty_level) }}
                                  >
                                    {item.difficulty_level == null ? '增补' : `Lv.${item.difficulty_level}`}
                                  </span>
                                </div>
                                <div className="word-card-categories">
                                  <div className="word-card-category">L3: {item.level_3}</div>
                                  <div className="word-card-category">L4: {item.level_4}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Category Search: Group by category path (level_1 > level_2 > level_3 > level_4) */}
                  {searchResults.data && searchResults.data.length > 0 && (() => {
                    // Group items by their full category path
                    const groupedByCategory = {}
                    searchResults.data.forEach(item => {
                      const categoryKey = `${item.level_1}|${item.level_2}|${item.level_3}|${item.level_4}`
                      if (!groupedByCategory[categoryKey]) {
                        groupedByCategory[categoryKey] = {
                          level_1: item.level_1,
                          level_2: item.level_2,
                          level_3: item.level_3,
                          level_4: item.level_4,
                          items: []
                        }
                      }
                      groupedByCategory[categoryKey].items.push(item)
                    })

                    return Object.entries(groupedByCategory).map(([categoryKey, group]) => (
                      <div key={categoryKey} className="category-group">
                        {/* Category Breadcrumb */}
                        <div className="category-breadcrumb">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6 H20 C21.1 6 22 6.9 22 8 V16 C22 17.1 21.1 18 20 18 H4 C2.9 18 2 17.1 2 16 V8 C2 6.9 2.9 6 4 6 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M8 10 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M8 14 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span>{group.level_1} &gt; {group.level_2} &gt; {group.level_3} &gt; {group.level_4}</span>
                        </div>

                        {/* Word Cards Grid for this category */}
                        <div className="word-cards-grid">
                          {sortByDifficulty(group.items).map((item) => (
                            <div key={item.id} className="word-card">
                              <div className="word-card-header">
                                <span className="word-card-word">{item.word}</span>
                                <span 
                                  className="word-card-badge"
                                  style={{ backgroundColor: getDifficultyColor(item.difficulty_level) }}
                                >
                                  {item.difficulty_level == null ? '增补' : `Lv.${item.difficulty_level}`}
                                </span>
                              </div>
                              <div className="word-card-categories">
                                <div className="word-card-category">L3: {item.level_3}</div>
                                <div className="word-card-category">L4: {item.level_4}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  })()}
                </>
              )}
            </>
          )}

          {viewMode === 'star' && activeTab === 'word' && (
            <>
              {categoryLoading ? (
                <div className="category-loading">
                  <p>加载相关词语中...</p>
                </div>
              ) : (
                <>
                  {Object.entries(categoryExpandedData.level4).map(([category, groupData]) => 
                    renderStarMap(category, groupData.data, groupData.searchWord)
                  )}
                </>
              )}
            </>
          )}

          {viewMode === 'star' && activeTab === 'category' && (
            <>
              {searchResults && searchResults.data && searchResults.data.length > 0 ? (
                renderCategoryStarMap(searchInput.trim(), searchResults.data)
              ) : (
                <div className="star-map-placeholder">
                  <p>未找到相关结果</p>
                </div>
              )}
            </>
          )}
        </div>
          ) : (
            <div className="search-results">
              <div className="no-results">
                <p>未找到相关结果</p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default SearchSection
