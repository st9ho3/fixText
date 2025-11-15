import './Sidebar.css'

function Sidebar({ isCollapsed, setIsCollapsed, historyEntries = [], onLoadEntry, onDeleteEntry }) {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'No text'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const handleDelete = async (e, entryId) => {
    e.stopPropagation() // Prevent triggering the onClick of the parent div

    if (window.confirm('Are you sure you want to delete this entry?')) {
      await onDeleteEntry(entryId)
    }
  }

  return (
    <>
      <button
        className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
          <h2>History</h2>
          <div className="history-list">
            {historyEntries.length === 0 ? (
              <p className="no-history">No history yet</p>
            ) : (
              historyEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="history-item"
                  onClick={() => onLoadEntry(entry)}
                >
                  <div className="history-item-header">
                    <span className="history-item-type">
                      {entry.promptType === 'createParagraph' ? '📝' : '📋'}
                    </span>
                    <span className="history-item-date">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  <div className="history-item-text">
                    {truncateText(entry.inputText)}
                  </div>
                  <div className="history-item-footer">
                    <span className="history-item-status">
                      {entry.status === 'completed' && '✓'}
                      {entry.status === 'pending' && '⏳'}
                      {entry.status === 'error' && '✗'}
                    </span>
                    <button
                      className="delete-button"
                      onClick={(e) => handleDelete(e, entry.id)}
                      aria-label="Delete entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
