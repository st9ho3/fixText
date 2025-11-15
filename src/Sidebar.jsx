import './Sidebar.css'

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
          <h2>Menu</h2>
          <nav>
            <ul>
              <li>Dashboard</li>
              <li>History</li>
              <li>Settings</li>
            </ul>
          </nav>
        </div>
      </div>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>
    </>
  )
}

export default Sidebar
