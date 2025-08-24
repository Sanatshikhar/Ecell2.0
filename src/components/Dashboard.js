import React, { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campusFilter, setCampusFilter] = useState('all');
  const [campusOptions, setCampusOptions] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const fetchData = async () => {
      try {
        const result = await pb.collection('iecReg').getFullList({ requestOptions: { signal: abortController.signal } });
        setRegistrations(result);
        const campuses = Array.from(new Set(result.map(r => r.campus).filter(Boolean)));
        setCampusOptions(campuses);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    };
    fetchData();
    // Real-time subscription
    const subscriptionId = pb.collection('iecReg').subscribe('*', () => {
      fetchData();
    });
    return () => {
      abortController.abort();
      pb.collection('iecReg').unsubscribe(subscriptionId);
    };
  }, []);

  const filtered = registrations.filter(r => {
    const matchesSearch =
      (r.name && r.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.email && r.email.toLowerCase().includes(search.toLowerCase())) ||
      (r.phone && String(r.phone).toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'verified' ? r.verified : !r.verified);
    const matchesCampus = campusFilter === 'all' || r.campus === campusFilter;
    return matchesSearch && matchesStatus && matchesCampus;
  });

  return (
  <div className="min-h-screen overflow-y-hidden w-screen font-sans flex flex-col items-center justify-start px-2 sm:px-4 py-4 bg-gradient-to-br from-[#ede9fe] via-[#a78bfa] to-[#7c3aed] bg-fixed" style={{backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'}}>
  <div className="w-full px-4 pt-10 pb-8">
  <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-violet-900 tracking-tight mb-2 sm:mb-4" style={{fontFamily: 'Montserrat, sans-serif', textShadow: '0 2px 12px #a78bfa88'}}>Registrations Dashboard</h2>
        <div className="flex flex-wrap gap-6 mb-10 items-center justify-between w-full">
          <span className="bg-[#a78bfa] text-violet-900 font-bold text-base sm:text-lg rounded-full px-4 py-2 shadow border border-[#7c3aed] whitespace-nowrap">
            Total: {filtered.length}
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="min-w-[260px] flex-1 text-base rounded-xl shadow-md px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 placeholder:text-violet-400 mx-auto"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="min-w-[180px] text-base rounded-xl shadow-md px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 mx-auto"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <select
            value={campusFilter}
            onChange={e => setCampusFilter(e.target.value)}
            className="min-w-[180px] text-base rounded-xl shadow-md px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 mx-auto"
          >
            <option value="all">All Campus</option>
            <option value="SOA Campus 2">SOA Campus 2</option>
            <option value="SOA Campus 4">SOA Campus 4</option>
          </select>
        </div>
        <div className="overflow-x-auto mt-2 w-full">
          <table className="w-full border-separate border-spacing-0 text-lg rounded-2xl shadow-2xl bg-[#ede9fe]">
            <thead>
              <tr className="bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#ede9fe] text-violet-900">
                <th className="py-4 px-2 font-black text-base border border-[#7c3aed]">S.No.</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Status</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Name</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Email</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Phone</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Campus</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-violet-400 text-lg">No registrations found.</td></tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className={r.verified ? "bg-[#a78bfa]/20 transition" : "bg-[#ede9fe] transition"}>
                    <td className="py-3 px-2 font-bold text-violet-900 text-center border border-[#7c3aed]">{idx + 1}</td>
                    <td className="py-3 px-2 text-center border border-[#7c3aed]">
                      {r.verified ? (
                        <span className="inline-flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" fill="#2aad4b" />
                            <path d="M7 13l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" fill="#b22a2a" />
                            <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.name}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.email}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.phone}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.campus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
