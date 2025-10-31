import React, { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

const JoiningRegSheet = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mailSentFilter, setMailSentFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewingIdProof, setViewingIdProof] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abortController = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await pb.collection('joiningReg2025').getFullList({ 
          requestOptions: { signal: abortController.signal },
          sort: '-created'
        });
        setRegistrations(result);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching data:', err);
          setLoading(false);
        }
      }
    };
    fetchData();
    
    // Real-time subscription
    const subscriptionId = pb.collection('joiningReg2025').subscribe('*', () => {
      fetchData();
    });
    
    return () => {
      abortController.abort();
      pb.collection('joiningReg2025').unsubscribe(subscriptionId);
    };
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFiltered = React.useMemo(() => {
    let filtered = [...registrations];

    // Apply filters
    filtered = filtered.filter(r => {
      const matchesSearch =
        (r.name && r.name.toLowerCase().includes(search.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(search.toLowerCase())) ||
        (r.regNo && r.regNo.toLowerCase().includes(search.toLowerCase())) ||
        (r.phone && String(r.phone).includes(search));
      
      const matchesCourse = courseFilter === 'all' || r.course === courseFilter;
      const matchesTeam = teamFilter === 'all' || (r.team && r.team.includes(teamFilter));
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesMailSent = mailSentFilter === 'all' || 
        (mailSentFilter === 'sent' ? r.mailSent : !r.mailSent);

      return matchesSearch && matchesCourse && matchesTeam && matchesStatus && matchesMailSent;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === undefined || aVal === null) aVal = '';
        if (bVal === undefined || bVal === null) bVal = '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [registrations, search, courseFilter, teamFilter, statusFilter, mailSentFilter, sortConfig]);

  // Get unique values for filters
  const uniqueCourses = [...new Set(registrations.map(r => r.course).filter(Boolean))];
  const uniqueTeams = [...new Set(registrations.flatMap(r => r.team || []).filter(Boolean))];
  const uniqueStatus = [...new Set(registrations.map(r => r.status).filter(Boolean))];

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await pb.collection('joiningReg2025').update(recordId, {
        status: newStatus
      });
      // Update local state
      setRegistrations(prev => 
        prev.map(r => r.id === recordId ? { ...r, status: newStatus } : r)
      );
      setSelectedRecord(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const closeModal = () => {
    setSelectedRecord(null);
  };

  const closeIdProofModal = () => {
    setViewingIdProof(null);
  };

  const handleViewIdProof = (record) => {
    setViewingIdProof(record);
  };

  const getFileUrl = (record, filename) => {
    if (!filename) return null;
    return pb.files.getUrl(record, filename);
  };

  return (
    <div className="min-h-screen w-screen font-sans flex flex-col items-center justify-start px-2 sm:px-4 py-4 bg-gradient-to-br from-black via-[#1a0b2e] to-[#0f0820] bg-fixed">
      <div className="w-full px-4 pt-10 pb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-[#b614f0] to-[#3d81f6] bg-clip-text text-transparent tracking-tight mb-2 sm:mb-4" 
            style={{fontFamily: 'Montserrat, sans-serif'}}>
          Joining Registrations 2025
        </h2>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-center">
          <span className="bg-gradient-to-r from-[#b614f0] to-[#3d81f6] text-white font-bold text-base sm:text-lg rounded-full px-4 py-2 shadow-md border border-[#b614f0]/30">
            Total: {sortedAndFiltered.length}
          </span>
          <span className="bg-[#2a2a2a] text-[#b614f0] font-semibold text-sm sm:text-base rounded-full px-4 py-2 shadow-md border border-[#b614f0]/30">
            Mail Sent: {registrations.filter(r => r.mailSent).length}
          </span>
          <span className="bg-[#2a2a2a] text-[#3d81f6] font-semibold text-sm sm:text-base rounded-full px-4 py-2 shadow-md border border-[#3d81f6]/30">
            Selected: {registrations.filter(r => r.status === 'selected').length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, regNo, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[260px] text-base rounded-xl shadow-sm px-4 py-3 border border-[#b614f0]/30 focus:outline-none focus:ring-1 focus:ring-[#b614f0] focus:border-[#b614f0] bg-[#2a2a2a] text-white placeholder:text-gray-500"
          />
          
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="min-w-[160px] text-base rounded-xl shadow-sm px-4 py-3 border border-[#b614f0]/30 focus:outline-none focus:ring-1 focus:ring-[#b614f0] bg-[#2a2a2a] text-white"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value)}
            className="min-w-[180px] text-base rounded-xl shadow-sm px-4 py-3 border border-[#3d81f6]/30 focus:outline-none focus:ring-1 focus:ring-[#3d81f6] bg-[#2a2a2a] text-white"
          >
            <option value="all">All Teams</option>
            {uniqueTeams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="min-w-[160px] text-base rounded-xl shadow-sm px-4 py-3 border border-[#b614f0]/30 focus:outline-none focus:ring-1 focus:ring-[#b614f0] bg-[#2a2a2a] text-white"
          >
            <option value="all">All Status</option>
            {uniqueStatus.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={mailSentFilter}
            onChange={e => setMailSentFilter(e.target.value)}
            className="min-w-[160px] text-base rounded-xl shadow-sm px-4 py-3 border border-[#3d81f6]/30 focus:outline-none focus:ring-1 focus:ring-[#3d81f6] bg-[#2a2a2a] text-white"
          >
            <option value="all">All Mail Status</option>
            <option value="sent">Mail Sent</option>
            <option value="pending">Mail Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2 w-full shadow-xl rounded-2xl">
          {loading ? (
            <div className="bg-[#2a2a2a] border border-[#b614f0]/30 rounded-2xl p-10 text-center text-[#b614f0] text-xl">
              Loading...
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-0 text-sm rounded-2xl bg-[#1f1f1f]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-[#b614f0] via-[#3d81f6] to-[#b614f0] text-white">
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a]">
                    S.No.
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('name')}>
                    Name {getSortIcon('name')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('email')}>
                    Email {getSortIcon('email')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('regNo')}>
                    Reg No {getSortIcon('regNo')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('course')}>
                    Course {getSortIcon('course')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a]">
                    Team
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('phone')}>
                    Phone {getSortIcon('phone')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('campus')}>
                    Campus {getSortIcon('campus')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('mailSent')}>
                    Mail {getSortIcon('mailSent')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a] cursor-pointer hover:bg-white/10" onClick={() => handleSort('status')}>
                    Status {getSortIcon('status')}
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a]">
                    ID Proof
                  </th>
                  <th className="py-4 px-2 font-bold text-xs border border-[#3a3a3a]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-10 text-center text-[#b614f0] text-lg">
                      No registrations found.
                    </td>
                  </tr>
                ) : (
                  sortedAndFiltered.map((r, idx) => (
                    <tr 
                      key={r.id} 
                      className={`${r.status === 'selected' ? 'bg-green-900/20' : idx % 2 === 0 ? 'bg-[#2a2a2a]' : 'bg-[#1f1f1f]'} hover:bg-[#b614f0]/10 transition cursor-pointer`}
                    >
                      <td className="py-3 px-2 border border-[#3a3a3a] text-white font-bold text-center">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-white font-medium">
                        {r.name}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-gray-300 text-xs">
                        {r.email}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-white font-mono text-xs">
                        {r.regNo}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-gray-300 text-xs">
                        {r.course}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-gray-300 text-xs">
                        {r.team && r.team.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {r.team.map((t, i) => (
                              <span key={i} className="bg-gradient-to-r from-[#b614f0] to-[#3d81f6] text-white px-2 py-1 rounded text-xs">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-white font-mono text-xs">
                        {r.phone}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-gray-300 text-xs">
                        {r.campus}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-center">
                        {r.mailSent ? (
                          <span className="inline-flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10" fill="#10b981" />
                              <path d="M7 13l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10" fill="#ef4444" />
                              <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          r.status === 'selected' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-[#333333] text-gray-400'
                        }`}>
                          {r.status || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-center">
                        {r.idProof && r.idProof.length > 0 ? (
                          <button
                            onClick={() => handleViewIdProof(r)}
                            className="text-[#3d81f6] hover:text-[#b614f0] transition"
                            title="View ID Proof"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-2 border border-[#3a3a3a] text-center">
                        <button
                          onClick={() => handleRowClick(r)}
                          className="bg-gradient-to-r from-[#b614f0] to-[#3d81f6] hover:from-[#9d11d4] hover:to-[#2563eb] text-white px-3 py-1 rounded-lg text-xs font-bold transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#1f1f1f] border-2 border-[#b614f0]/40 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#b614f0] to-[#3d81f6] bg-clip-text text-transparent">Registration Details</h3>
              <button 
                onClick={closeModal}
                className="text-[#b614f0] hover:text-red-500 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#b614f0] text-sm">Name:</label>
                  <p className="text-white">{selectedRecord.name}</p>
                </div>
                <div>
                  <label className="font-bold text-[#b614f0] text-sm">Email:</label>
                  <p className="text-gray-300 break-all">{selectedRecord.email}</p>
                </div>
                <div>
                  <label className="font-bold text-[#3d81f6] text-sm">Registration No:</label>
                  <p className="text-white font-mono">{selectedRecord.regNo}</p>
                </div>
                <div>
                  <label className="font-bold text-[#3d81f6] text-sm">Phone:</label>
                  <p className="text-white font-mono">{selectedRecord.phone}</p>
                </div>
                <div>
                  <label className="font-bold text-[#b614f0] text-sm">Course:</label>
                  <p className="text-gray-300">{selectedRecord.course}</p>
                </div>
                <div>
                  <label className="font-bold text-[#3d81f6] text-sm">Campus:</label>
                  <p className="text-gray-300">{selectedRecord.campus}</p>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#b614f0] text-sm">Team:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRecord.team && selectedRecord.team.length > 0 ? (
                    selectedRecord.team.map((t, i) => (
                      <span key={i} className="bg-gradient-to-r from-[#b614f0] to-[#3d81f6] text-white px-3 py-1 rounded-full text-sm">
                        {t}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No team assigned</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#b614f0] text-sm">Mail Sent:</label>
                  <p className="text-white">{selectedRecord.mailSent ? '✅ Yes' : '❌ No'}</p>
                </div>
                <div>
                  <label className="font-bold text-[#3d81f6] text-sm block mb-2">Status:</label>
                  <select
                    value={selectedRecord.status || ''}
                    onChange={(e) => handleStatusChange(selectedRecord.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-white focus:outline-none focus:ring-2 focus:ring-[#3d81f6] text-sm"
                  >
                    <option value="">Not Set</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                    <option value="review">Review</option>
                  </select>
                </div>
              </div>

              {selectedRecord.idProof && selectedRecord.idProof.length > 0 && (
                <div>
                  <label className="font-bold text-[#b614f0] text-sm">ID Proof:</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRecord.idProof.map((file, i) => (
                      <a 
                        key={i}
                        href={getFileUrl(selectedRecord, file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-[#b614f0] to-[#3d81f6] hover:from-[#9d11d4] hover:to-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                      >
                        View Document {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t border-[#3a3a3a]">
                <div>
                  <label className="font-bold text-[#b614f0]">Created:</label>
                  <p className="text-gray-400">{new Date(selectedRecord.created).toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-bold text-[#3d81f6]">Updated:</label>
                  <p className="text-gray-400">{new Date(selectedRecord.updated).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Proof Modal */}
      {viewingIdProof && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={closeIdProofModal}>
          <div className="bg-[#1f1f1f] border-2 border-[#b614f0]/40 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#b614f0] to-[#3d81f6] bg-clip-text text-transparent">ID Proof</h3>
                <p className="text-gray-400 text-sm mt-1">{viewingIdProof.name} - {viewingIdProof.regNo}</p>
              </div>
              <button 
                onClick={closeIdProofModal}
                className="text-[#b614f0] hover:text-red-500 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {viewingIdProof.idProof && viewingIdProof.idProof.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {viewingIdProof.idProof.map((file, i) => (
                    <div key={i} className="border border-[#3a3a3a] rounded-lg overflow-hidden bg-[#2a2a2a]">
                      <div className="flex justify-between items-center p-3 bg-[#1f1f1f]">
                        <span className="text-white font-semibold text-sm">Document {i + 1}</span>
                        <a 
                          href={getFileUrl(viewingIdProof, file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-[#b614f0] to-[#3d81f6] hover:from-[#9d11d4] hover:to-[#2563eb] text-white px-3 py-1 rounded text-xs font-bold transition"
                        >
                          Open in New Tab
                        </a>
                      </div>
                      <div className="p-4 flex justify-center">
                        <img 
                          src={getFileUrl(viewingIdProof, file)} 
                          alt={`ID Proof ${i + 1}`}
                          className="max-w-full max-h-[60vh] object-contain rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No ID proof uploaded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoiningRegSheet;
