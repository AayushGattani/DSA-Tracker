import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { settingsAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    reminderPattern: user?.reminderPattern || '1,3,7,14,21',
    applyOption: 'future',
    customDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      setFormData({
        ...formData,
        name: user?.name || '',
        reminderPattern: response.data.data.reminderPattern
      });
    } catch (error) {
      toast.error('Error loading settings');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await settingsAPI.updateProfile(formData.name);
      updateUser({ ...user, name: formData.name });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReminderPattern = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await settingsAPI.updateReminderPattern(
        formData.reminderPattern,
        formData.applyOption,
        formData.customDate
      );
      updateUser({ ...user, reminderPattern: formData.reminderPattern });
      toast.success('Reminder pattern updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating reminder pattern');
    } finally {
      setLoading(false);
    }
  };

  const reminderDays = formData.reminderPattern
    .split(',')
    .map(d => parseInt(d.trim()))
    .filter(d => !isNaN(d));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold premium-gradient-text tracking-tight mb-2">
              Settings
            </h1>
            <p className="text-white/50 font-medium italic">
              Configure your learning environment and profile.
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

        <div className="space-y-8">
          {/* Profile Settings */}
          <section className="premium-card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Profile Settings
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="premium-input w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="premium-input w-full opacity-50 cursor-not-allowed bg-white/0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20 uppercase">Permanent</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="premium-button-primary w-full md:w-auto"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Save Profile Changes'}
              </button>
            </form>
          </section>

          {/* Reminder Pattern Settings */}
          <section className="premium-card p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Revision Reminder Pattern
              </h3>
              <p className="text-sm text-white/40 font-medium">
                Set the days when you want to be reminded to revise questions. 
                Using comma-separated numbers for specific intervals.
              </p>
            </div>

            <form onSubmit={handleUpdateReminderPattern} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="reminderPattern" className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Reminder Intervals (Days)</label>
                <input
                  type="text"
                  id="reminderPattern"
                  name="reminderPattern"
                  value={formData.reminderPattern}
                  onChange={handleChange}
                  placeholder="e.g. 1, 3, 7, 14, 21"
                  className="premium-input w-full"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 block">Apply Strategy To:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'future', label: 'Future challenges only' },
                    { id: 'today', label: 'From today onwards' },
                    { id: 'beginning', label: 'Reset from start' },
                    { id: 'custom', label: 'Specified start date' }
                  ].map((option) => (
                    <label 
                      key={option.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.applyOption === option.id 
                          ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="applyOption"
                        value={option.id}
                        checked={formData.applyOption === option.id}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.applyOption === option.id ? 'border-white' : 'border-white/20'
                      }`}>
                        {formData.applyOption === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-tight">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.applyOption === 'custom' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label htmlFor="customDate" className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Strategy Start Date</label>
                  <input
                    type="date"
                    id="customDate"
                    name="customDate"
                    value={formData.customDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="premium-input w-full"
                    required
                  />
                </div>
              )}

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Verification Preview</h4>
                <div className="flex flex-wrap gap-3">
                  {reminderDays.length > 0 ? (
                    reminderDays.map((day, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        Day {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-red-400 text-[10px] font-bold uppercase">Invalid pattern detected</span>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="premium-button-primary w-full md:w-auto"
                disabled={loading}
              >
                {loading ? 'Synchronizing...' : 'Save Strategy Configuration'}
              </button>
            </form>
          </section>

          {/* Educational Content */}
          <section className="premium-card p-8 border-dashed border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
               Scientific Methodology
            </h3>
            
            <div className="space-y-6 relative z-10">
              <p className="text-white/60 font-medium leading-relaxed">
                When you solve a question on <strong className="text-white">Day 0</strong>, it will automatically
                appear for revision on the days you've specified in your reminder pattern.
              </p>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Example: If you set reminder interval to <span className="text-emerald-400">1, 3, 7, 14, 21</span></h4>
                <div className="space-y-3">
                  <p className="text-white/60 text-sm mb-4">When you solve a question on <strong className="text-white">January 1</strong>:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <strong className="text-white">Day 1</strong> (Jan 2) - First revision
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <strong className="text-white">Day 3</strong> (Jan 4) - Second revision
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <strong className="text-white">Day 7</strong> (Jan 8) - Third revision
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <strong className="text-white">Day 14</strong> (Jan 15) - Fourth revision
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <strong className="text-white">Day 21</strong> (Jan 22) - Fifth revision
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10">
                <p className="text-white/50 text-sm italic leading-relaxed">
                  💡 <strong className="text-white/70">Spaced Repetition:</strong> This technique uses increasing intervals between reviews to optimize learning and long-term retention.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
