import React, { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');

  useEffect(() => {
    let abortController = new AbortController();
    const fetchData = async () => {
      try {
        const result = await pb.collection('workshops').getFullList({
          sort: '-created',
          requestOptions: { signal: abortController.signal },
        });
        setRegistrations(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    };
    fetchData();
    // Real-time subscription
    const subscriptionId = pb.collection('workshops').subscribe('*', () => {
      fetchData();
    });
    return () => {
      abortController.abort();
      pb.collection('workshops').unsubscribe(subscriptionId);
    };
  }, []);

  const filtered = registrations.filter(r => {
    const matchesSearch =
      (r.name && r.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.email && r.email.toLowerCase().includes(search.toLowerCase())) ||
      (r.phone && String(r.phone).toLowerCase().includes(search.toLowerCase())) ||
      (r.course && r.course.toLowerCase().includes(search.toLowerCase())) ||
      (r.regNo && String(r.regNo).toLowerCase().includes(search.toLowerCase()));
    const iecMemberValue = String(r.iecMember || '').toLowerCase();
    const matchesMember =
      memberFilter === 'all' || (memberFilter === 'yes' ? iecMemberValue === 'yes' : iecMemberValue === 'no');
    return matchesSearch && matchesMember;
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
            placeholder="Search by name, email, phone, course, or reg no"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="min-w-[260px] flex-1 text-base rounded-xl shadow-md px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 placeholder:text-violet-400 mx-auto"
          />
          <select
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value)}
            className="min-w-[180px] text-base rounded-xl shadow-md px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 mx-auto"
          >
            <option value="all">All Members</option>
            <option value="yes">IEC Member: Yes</option>
            <option value="no">IEC Member: No</option>
          </select>
        </div>
        <div className="overflow-x-auto mt-2 w-full">
          <table className="w-full border-separate border-spacing-0 text-lg rounded-2xl shadow-2xl bg-[#ede9fe]">
            <thead>
              <tr className="bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#ede9fe] text-violet-900">
                <th className="py-4 px-2 font-black text-base border border-[#7c3aed]">S.No.</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Name</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Email</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Phone</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Course</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Reg No</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Referral</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">IEC Member</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Mail Sent</th>
                <th className="py-4 px-2 font-bold border border-[#7c3aed]">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="py-10 text-center text-violet-400 text-lg">No workshop registrations found.</td></tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="bg-[#ede9fe] transition">
                    <td className="py-3 px-2 font-bold text-violet-900 text-center border border-[#7c3aed]">{idx + 1}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.name}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.email}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.phone}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.course || '-'}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.regNo || '-'}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.referral || '-'}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">{r.iecMember || '-'}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900 text-center">{r.mailSent ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-2 border border-[#7c3aed] text-violet-900">
                      {r.created ? new Date(r.created).toLocaleString() : '-'}
                    </td>
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
