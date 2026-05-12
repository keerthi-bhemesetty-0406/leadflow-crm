import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [isAdding, setIsAdding] = useState(false); 
  const [isViewing, setIsViewing] = useState(false); 
  const [viewKey, setViewKey] = useState(0); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', source: 'Call' });
  
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  const addLeadRef = useRef(null);
  const viewLeadsRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchResults, setSearchResults] = useState(null);
  const [tableSearch, setTableSearch] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leads');
      setLeads(res.data);
    } catch (err) { console.error(err); }
  };

  const handleStatusUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/leads/${id}`, { status: tempStatus });
      if (res.status === 200) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: tempStatus } : l));
        setConfirmId(null);
        setEditingStatusId(null);
        setTempStatus("");
        if (searchResults) handleSearchClick();
      }
    } catch (err) { console.error("Update failed:", err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads(); 
        if (searchResults) handleSearchClick();
      } catch (err) { console.error(err); }
    }
  };

  const toggleAddCard = () => {
  setIsViewing(false);
  setIsAdding(true);
  
  setTimeout(() => {
    if (addLeadRef.current) {
      // Get the position of the card relative to the page
      const yOffset = -100; // Adjust this number based on your navbar height
      const y = addLeadRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 100);
};

const toggleViewCard = () => {
  setIsAdding(false);
  setIsViewing(true);
  setViewKey(prev => prev + 1);
  
  setTimeout(() => {
    if (viewLeadsRef.current) {
      // Get the position of the card relative to the page
      const yOffset = -100; // Adjust this number based on your navbar height
      const y = viewLeadsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 100);
};

  const handleAddLead = async (e) => {
  e.preventDefault();
  const { name, phone } = formData;

  // 1. Basic Validation (Requirement: Form validation) [cite: 32, 33]
  if (!name || name.trim() === "") {
    alert("Please enter a valid Full Name.");
    return;
  }

  // 2. Exact 10-Digit Phone Validation 
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  // 3. Smart Duplicate Check (Local state check) 
  const phoneExists = leads.some(
    (lead) => lead.phone.replace(/\D/g, "") === cleanPhone
  );

  if (phoneExists) {
    alert("A lead with this phone number already exists.");
    return;
  }

  // 4. Submit to Backend (Proper API handling) 
  setLoading(true); 
  try {
    await axios.post('http://localhost:5000/api/leads', {
      ...formData,
      name: name.trim(),
      phone: cleanPhone 
    });
    
    alert("Lead added successfully!");
    setFormData({ name: '', email: '', phone: '', source: 'Call' }); 
    fetchLeads(); 
    setIsAdding(false);
  } catch (err) {
    // Corrected error handling block 
    if (err.response && err.response.data && err.response.data.error) {
      alert(err.response.data.error); 
    } else {
      alert("An unexpected error occurred.");
    }
  } finally {
    setLoading(false); 
  }
};

  const handleSearchClick = () => {
    if (searchTerm.trim() === '' && statusFilter === 'All Status') {
      setSearchResults(null);
      return;
    }
    const filtered = leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (statusFilter === 'All Status' || l.status === statusFilter)
    );
    setSearchResults(filtered);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    interested: leads.filter(l => l.status === 'Interested').length,
    converted: leads.filter(l => l.status === 'Converted').length,
    notInterested: leads.filter(l => l.status === 'Not Interested').length,
  };

  return (
    <div className="dashboard-container">
      <nav className="glass-nav">
        <div className="logo-box">
          <span className="logo-icon">✦</span>
          <span className="logo-text">LeadFlow <span>CRM</span></span>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Welcome back!👋</h1>
          <p>Here's a snapshot of your Leads</p>
        </header>

        <div className="search-card-container">
          <div className="search-input-wrapper">
            <span className="search-icon-inside">🔍</span>
            <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="search-controls">
            <select className="status-dropdown" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All Status">All Status</option>
              <option value="New">New</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Not Interested">Not Interested</option>
            </select>
            <button className="search-btn" onClick={handleSearchClick}>Search</button>
          </div>
        </div>

        {searchResults !== null && (
  <div className="view-leads-card animate-slide search-results-box">
    <div className="card-header">
      <div className="header-text">
        <h3>Search Results ({searchResults.length})</h3>
      </div>
      <button className="close-card-btn" onClick={() => {
          setSearchResults(null);
          setSearchTerm(''); // This clears the search input at the top
        }} >✕</button>
    </div>
    <div className="table-wrapper">
      <table className="leads-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>PHONE</th>
            <th>SOURCE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length > 0 ? (
            searchResults.map(l => (
              <tr key={l.id}>
                {/* Fixed the avatar here as well to match your previous style */}
                <td>
                  <div className="table-name-cell">
                    
                    {l.name}
                  </div>
                </td>
                <td>{l.phone}</td>
                <td>{l.source}</td>
                <td>
                  <span className={`status-pill ${l.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            /* This row appears across all columns when no results are found */
            <tr>
              <td colSpan="4" className="no-results-td">
                No search results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

        <div className="stats-grid">
          <div className="stat-card total"><span className="stat-label">Total Leads</span><h2 className="stat-value">{stats.total}</h2></div>
          <div className="stat-card new"><span className="stat-label">New Leads</span><h2 className="stat-value">{stats.new}</h2></div>
          <div className="stat-card interested"><span className="stat-label">Interested</span><h2 className="stat-value">{stats.interested}</h2></div>
          <div className="stat-card converted"><span className="stat-label">Converted</span><h2 className="stat-value">{stats.converted}</h2></div>
          <div className="stat-card not-interested"><span className="stat-label">Not Interested</span><h2 className="stat-value">{stats.notInterested}</h2></div>
        </div>

        <div className="action-grid">
          <div className="action-card add" onClick={toggleAddCard}>
            <div className="action-icon">+</div>
            <div className="action-text"><h3>Add Lead</h3><p>Create a new lead</p></div>
          </div>
          <div className="action-card view" onClick={toggleViewCard}>
            <div className="action-icon">👁</div>
            <div className="action-text"><h3>View Leads</h3><p>Browse all leads</p></div>
          </div>
          <div className="action-card update" onClick={toggleViewCard}>
            <div className="action-icon">🔄</div>
            <div className="action-text"><h3>Update Status</h3><p>Change lead stage</p></div>
          </div>
          <div className="action-card delete" onClick={toggleViewCard}>
            <div className="action-icon">🗑</div>
            <div className="action-text"><h3>Delete Lead</h3><p>Remove a lead</p></div>
          </div>
        </div>

        {isViewing && (
  <div key={`view-${viewKey}`} ref={viewLeadsRef} className="view-leads-card animate-slide">
    <div className="card-header">
      <div className="header-text">
        <h3>All Leads Database</h3>
        <br></br>
        <p>View,Edit statuses or remove data instantly.</p>
      </div>
      <button className="close-card-btn" onClick={() => setIsViewing(false)}>✕</button>
    </div>

    <div className="table-controls-wrapper">
      <div className="mini-search-wrapper">
        <span className="search-icon-inside">🔍</span>
        <input 
          type="text" 
          placeholder="Filter list by name..." 
          value={tableSearch} 
          onChange={(e) => setTableSearch(e.target.value)} 
        />
      </div>
    </div>

    <div className="table-wrapper">
      <table className="leads-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>PHONE</th>
            <th>SOURCE</th>
            <th className="text-center">STATUS</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {/* Create the filtered list variable first */}
          {(() => {
            const filteredLeads = leads.filter(l => 
              l.name.toLowerCase().includes(tableSearch.toLowerCase())
            );

            return filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <tr key={lead.id}>
  {/* Standard Left Alignment */}
  <td>
    <div className="table-name-cell">
      
      {lead.name}
    </div>
  </td>
  <td>{lead.phone}</td>
  <td>{lead.source}</td>

  {/* Centered Status Column */}
  <td className="status-td">
    <div className="status-cell-container">
      {confirmId === lead.id ? (
        <div className="confirm-inline-box">
          <span>Update?</span>
          <div className="confirm-btns">
            <button className="y-btn" onClick={() => handleStatusUpdate(lead.id)}>Yes</button>
            <button className="n-btn" onClick={() => setConfirmId(null)}>No</button>
          </div>
        </div>
      ) : editingStatusId === lead.id ? (
        <select 
          className="status-select-pill editing"
          onChange={(e) => { setTempStatus(e.target.value); setConfirmId(lead.id); setEditingStatusId(null); }}
          onBlur={() => setEditingStatusId(null)}
          autoFocus
        >
          <option hidden>Select...</option>
          <option value="New">New</option>
          <option value="Interested">Interested</option>
          <option value="Converted">Converted</option>
          <option value="Not Interested">Not Interested</option>
        </select>
      ) : (
        <div className="status-view-wrapper">
          <span className={`status-pill ${lead.status.toLowerCase().replace(/\s+/g, '-')}`}>{lead.status}</span>
          <button className="inline-edit-btn" onClick={() => setEditingStatusId(lead.id)}>✏️</button>
        </div>
      )}
    </div>
  </td>

  {/* Centered Action Column */}
  <td className="action-td">
    <button className="delete-row-btn" onClick={() => handleDelete(lead.id)}>Delete</button>
  </td>
</tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results-td">
                  No leads found matching your filter
                </td>
              </tr>
            );
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}
        {isAdding && (
          <div ref={addLeadRef} className="add-lead-card animate-slide">
            <div className="card-header">
              <div className="header-text"><h3>Add a new lead</h3><p>Capture leads from any channel in seconds.</p></div>
              <button className="close-card-btn" onClick={() => setIsAdding(false)}>✕</button>
            </div>
            <form onSubmit={handleAddLead} className="add-form">
              <div className="form-row">
                <div className="input-field"><label>FULL NAME</label><div className="input-with-icon"><span className="icon">👤</span><input type="text" placeholder="e.g. Riya" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div></div>
                <div className="input-field"><label>PHONE NUMBER</label><div className="input-with-icon"><span className="icon">📞</span><input type="text" placeholder="+91" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div></div>
              </div>
              <div className="source-selection-wrapper">
                <label>CHOOSE SOURCE</label>
                <div className="source-buttons">
                  {['Call', 'WhatsApp', 'Field'].map((src) => (
                    <button key={src} type="button" className={`source-btn ${formData.source === src ? 'active' : ''}`} onClick={() => setFormData({...formData, source: src})}>{src}</button>
                  ))}
                </div>
              </div>
              <div className="form-footer">
                <button type="submit" className="primary-add-btn" disabled={loading}>
  {loading ? "Creating..." : "Create Lead"}
</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;