import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { revisionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './Revisions.css';

const Revisions = () => {
  const navigate = useNavigate();
  const [todayRevisions, setTodayRevisions] = useState([]);
  const [upcomingRevisions, setUpcomingRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('today');

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    try {
      setLoading(true);
      const [todayRes, upcomingRes] = await Promise.all([
        revisionAPI.getTodayRevisions(),
        revisionAPI.getUpcomingRevisions(14)
      ]);
      
      setTodayRevisions(todayRes.data.data.revisions);
      setUpcomingRevisions(upcomingRes.data.data.revisions);
    } catch (error) {
      toast.error('Error loading revisions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (revisionId) => {
    try {
      await revisionAPI.markRevisionCompleted(revisionId);
      toast.success('Revision marked as completed!');
      fetchRevisions();
    } catch (error) {
      toast.error('Error marking revision');
    }
  };

  const handleMarkAllCompleted = async () => {
    const pendingIds = todayRevisions
      .filter(r => r.status === 'pending')
      .map(r => r._id);

    if (pendingIds.length === 0) {
      toast.info('No pending revisions to mark');
      return;
    }

    try {
      await revisionAPI.markMultipleRevisionsCompleted(pendingIds);
      toast.success(`${pendingIds.length} revisions marked as completed!`);
      fetchRevisions();
    } catch (error) {
      toast.error('Error marking revisions');
    }
  };

  const formatDate = (dateString) => {
    // Extract just the YYYY-MM-DD part and add 1 day to fix timezone offset
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    const date = new Date(year, parseInt(month) - 1, parseInt(day));
    // Add 1 day to account for timezone offset
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const groupRevisionsByDate = (revisions) => {
    const grouped = {};
    revisions.forEach(revision => {
      // Use just the date portion (YYYY-MM-DD) to avoid timezone issues
      const dateKey = revision.revisionDate.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(revision);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/40 animate-pulse font-medium">Synchronizing your progress...</div>
      </div>
    );
  }

  const pendingCount = todayRevisions.filter(r => r.status === 'pending').length;
  const completedCount = todayRevisions.filter(r => r.status === 'revised').length;
  const groupedUpcoming = groupRevisionsByDate(upcomingRevisions);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">
              Revision Studio
            </h1>
            <p className="text-white/50 font-medium italic">
              "Repetition is the mother of learning."
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-3 text-white/60 hover:text-white transition-all"
          >
            <span className="p-2.5 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="font-semibold tracking-tight">Return</span>
          </button>
        </header>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit mb-12">
          <button 
            onClick={() => setSelectedTab('today')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              selectedTab === 'today' 
                ? 'bg-white text-black shadow-xl shadow-white/10 active:scale-95' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            Active Today <span className="ml-2 px-2 py-0.5 rounded-md bg-current/10 text-[10px] uppercase">
              {todayRevisions.length}
            </span>
          </button>
          <button 
            onClick={() => setSelectedTab('upcoming')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              selectedTab === 'upcoming' 
                ? 'bg-white text-black shadow-xl shadow-white/10 active:scale-95' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            Planning Ahead <span className="ml-2 px-2 py-0.5 rounded-md bg-current/10 text-[10px] uppercase">
              {upcomingRevisions.length}
            </span>
          </button>
        </div>

        {selectedTab === 'today' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {todayRevisions.length === 0 ? (
              <div className="premium-card p-24 text-center border-dashed border-white/10">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Peak Performance</h3>
                <p className="text-white/40 font-medium">No active revisions due today. Rest or explore new challenges.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Pending: {pendingCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Completed: {completedCount}</span>
                    </div>
                  </div>
                  {pendingCount > 0 && (
                    <button 
                      onClick={handleMarkAllCompleted}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest border-b border-blue-500/0 hover:border-blue-300/50 pb-1"
                    >
                      Sweep All Tasks
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {todayRevisions.map((revision) => (
                    <div 
                      key={revision._id} 
                      className={`premium-card p-8 group relative overflow-hidden transition-all duration-500 ${
                        revision.status === 'revised' ? 'opacity-50 grayscale scale-[0.98]' : 'hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] border border-white/5">
                          Tier {revision.dayOffset}
                        </span>
                        {revision.status === 'revised' && (
                          <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:premium-gradient-text transition-colors">
                        {revision.questionId?.title || 'Unknown Challenge'}
                      </h3>
                      
                      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                        <button
                          onClick={() => navigate(`/questions/${revision.questionId?._id}`)}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
                        >
                          Study Details
                        </button>
                        {revision.status === 'pending' && (
                          <button
                            onClick={() => handleMarkCompleted(revision._id)}
                            className="flex-1 px-4 py-3 rounded-xl bg-white text-black hover:shadow-lg hover:shadow-white/5 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                          >
                            Conquer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {selectedTab === 'upcoming' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {Object.keys(groupedUpcoming).length === 0 ? (
              <div className="premium-card p-24 text-center border-dashed border-white/10">
                <p className="text-white/40 font-medium italic">Empty horizon. Start adding problems to your tracking list.</p>
              </div>
            ) : (
              Object.keys(groupedUpcoming).sort().map(date => (
                <div key={date} className="space-y-6">
                  <div className="flex items-center gap-6 px-2">
                    <h3 className="text-lg font-bold text-white tracking-widest uppercase">
                      {formatDate(date)}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase px-3 py-1 bg-white/5 rounded-full">
                      {groupedUpcoming[date].length} Problems Scheduled
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedUpcoming[date].map((revision) => (
                      <div 
                        key={revision._id} 
                        className="premium-card p-6 border border-white/5 hover:border-white/10"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="px-2.5 py-1 rounded-md bg-white/5 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                            Day {revision.dayOffset}
                          </span>
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                            Target Hit
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white/80 group-hover:text-white transition-colors">
                          {revision.questionId?.title || 'Question'}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Revisions;
