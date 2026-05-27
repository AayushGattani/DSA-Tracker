import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { settingsAPI, questionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import ContributionCalendar from './ContributionCalendar';
// import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [streakData, setStreakData] = useState(null);
  const [contributionData, setContributionData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [streakRes, contributionRes, statsRes] = await Promise.all([
        settingsAPI.getStreak(),
        settingsAPI.getContributionGraph(),
        questionAPI.getStatistics()
      ]);

      setStreakData(streakRes.data.data);
      setContributionData(contributionRes.data.data);
      setStatistics(statsRes.data.data);
    } catch (error) {
      toast.error('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/40 animate-pulse font-medium">Analyzing your progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">
              Commander Profile
            </h1>
            <p className="text-white/50 font-medium italic">
              "Every day is a step closer to mastery."
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* User Profile Overview */}
          <div className="premium-card p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold text-white mb-6 animate-float">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
            <p className="text-white/40 font-medium text-sm mb-6">{user?.email}</p>
            <div className="w-full h-px bg-white/5 mb-6"></div>
            <div className="flex gap-4 w-full">
               <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Rank</div>
                  <div className="text-lg font-bold text-white">Elite</div>
               </div>
               <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">XP</div>
                  <div className="text-lg font-bold text-white">{streakData?.totalQuestions * 10 || 0}</div>
               </div>
            </div>
          </div>

          {/* Activity Metrics */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="premium-card p-8 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.79a1 1 0 00-1.209-.982 4.002 4.002 0 00-3.376 3.65c-.015.193-.022.386-.022.577 0 2.22 1.791 4 4 4 2.25 0 3.75-1.55 4.904-2.73.551-.564 1.057-1.332 1.359-2.02.445-1.016.586-2.14.586-3.13 0-.17-.006-.337-.017-.5a1 1 0 00-.73-.883zm-1.6 10.42c-.447.43-.983.807-1.545 1.02a3.995 3.995 0 01-1.25.21c-2.209 0-4-1.791-4-4 0-.12.004-.238.012-.354a6.015 6.015 0 013.385-3.522c.002.329.01.664.032.992.052.756.236 1.453.535 2.071.32.66.744 1.192 1.253 1.58.204.156.435.286.687.388a1 1 0 001.201-.482c.15-.313.292-.705.424-1.127.135-.432.253-.895.352-1.363l.007-.035c.421 1.096.34 2.257-.1 3.139a5.025 5.025 0 01-.84 1.265z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-8">Persistence Engine</h3>
                <div className="flex items-end gap-6">
                  <div className="text-6xl font-black text-white">{streakData?.currentStreak || 0}</div>
                  <div className="pb-2">
                    <div className="text-sm font-bold text-white uppercase tracking-widest">Day Streak</div>
                    <div className="text-xs text-white/30 font-medium">Record: {streakData?.maxStreak || 0} Days</div>
                  </div>
                </div>
             </div>

             <div className="premium-card p-8">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-8">Overall Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-black text-white">{streakData?.totalQuestions || 0}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Conquered</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">{streakData?.totalActiveDays || 0}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Active Days</div>
                  </div>
                 
                  <div>
                    <div className="text-3xl font-black text-white">{statistics?.completedRevisions || 0}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Solidified</div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Contribution Graph Card */}
        <section className="premium-card p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Contribution Horizon</h3>
              <p className="text-sm text-white/40 font-medium italic">Visualization of your last orbital period (365 days)</p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-2">
            <ContributionCalendar data={contributionData} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
