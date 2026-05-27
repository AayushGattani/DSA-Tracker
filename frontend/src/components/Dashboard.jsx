import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionAPI, revisionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [todayRevisions, setTodayRevisions] = useState([]);
  const [todayQuestions, setTodayQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRevisions, setShowRevisions] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [statsRes, revisionsRes, questionsRes] = await Promise.all([
        questionAPI.getStatistics(),
        revisionAPI.getTodayRevisions(),
        questionAPI.getAllQuestions({ date: today })
      ]);
      
      setStats(statsRes.data.data);
      setTodayRevisions(revisionsRes.data.data.revisions);
      
      // Filter questions to only show those added today
      const todaysQs = questionsRes.data.data.questions.filter(q => {
        const questionDate = new Date(q.createdAt).toISOString().split('T')[0];
        return questionDate === today;
      });
      setTodayQuestions(todaysQs);
    } catch (error) {
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  const handleMarkComplete = async (revisionId) => {
    try {
      await revisionAPI.markRevisionCompleted(revisionId);
      toast.success('Revision marked as completed!');
      // Refresh data
      fetchData();
    } catch (error) {
      toast.error('Error marking revision as complete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/40 animate-pulse font-medium">Initializing Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Welcome Section */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-white/20"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Overview</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Welcome back, <span className="premium-gradient-text">{user?.name}</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl font-medium">
            Track your DSA journey with precision. You've conquered {stats?.totalQuestions || 0} problems so far.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="premium-card p-8 group hover:border-white/20 transition-all border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 py-1 bg-white/5 rounded">Total</span>
            </div>
            <p className="text-4xl font-bold mb-1">{stats?.totalQuestions || 0}</p>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Questions Tracked</p>
          </div>

          <div className="premium-card p-8 group hover:border-white/20 transition-all border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-amber-500/20 uppercase tracking-widest px-2 py-1 bg-amber-500/5 rounded">Pending</span>
            </div>
            <p className="text-4xl font-bold mb-1 text-amber-400">{todayRevisions.filter(r => r.status === 'pending').length}</p>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Today's Revisions Left</p>
          </div>

          <div className="premium-card p-8 group hover:border-white/20 transition-all border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-blue-500/20 uppercase tracking-widest px-2 py-1 bg-blue-500/5 rounded">Today</span>
            </div>
            <p className="text-4xl font-bold mb-1 text-blue-400">{stats?.today?.questions || 0}</p>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">New Challenges Today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Active Revisions */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                Active Revisions
                <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/5">
                  {todayRevisions.length}
                </span>
              </h2>
              <Link to="/revisions" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em]">View All</Link>
            </div>

            <div className="space-y-4">
              {todayRevisions.length === 0 ? (
                <div className="premium-card p-12 text-center border-dashed border-white/10">
                  <p className="text-white/30 font-medium italic">No revisions due today.</p>
                </div>
              ) : (
                todayRevisions.map((rev) => (
                  <div key={rev._id} className="premium-card p-6 flex items-center justify-between group border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10 group-hover:text-white transition-all">
                        <span className="text-xs font-bold">D{rev.dayOffset}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:premium-gradient-text transition-all">{rev.questionId?.title}</h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{rev.status}</p>
                      </div>
                    </div>
                    {rev.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkComplete(rev._id)}
                        className="px-4 py-2 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-white/5 active:scale-95"
                      >
                        REVISED
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Problems */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold tracking-tight">Today's Challenges</h2>
              <Link to="/questions" className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em]">History</Link>
            </div>

            <div className="space-y-4">
              {todayQuestions.length === 0 ? (
                <div className="premium-card p-12 text-center border-dashed border-white/10">
                  <p className="text-white/30 font-medium italic">No problems added today yet.</p>
                  <Link to="/add-question" className="mt-4 inline-block text-[10px] font-bold text-blue-400 uppercase tracking-widest">Track Now →</Link>
                </div>
              ) : (
                todayQuestions.map((q) => (
                  <Link 
                    to={`/questions/${q._id}`} 
                    key={q._id} 
                    className="premium-card p-6 flex items-center justify-between group border border-white/5 block hover:border-white/20 transition-all"
                  >
                    <div>
                      <h3 className="font-bold text-white group-hover:premium-gradient-text transition-all">{q.title}</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{q.category || 'General'}</p>
                    </div>
                    <div className="text-white/10 group-hover:text-white/40 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
