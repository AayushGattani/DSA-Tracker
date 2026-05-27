import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './AddQuestion.css';

const AddQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    link: '',
    solvedDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fix timezone issue: append time to ensure correct date is saved
      const dataToSend = {
        ...formData,
        solvedDate: `${formData.solvedDate}T12:00:00`
      };
      await questionAPI.addQuestion(dataToSend);
      toast.success('Question added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                title="Back to Dashboard"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold premium-gradient-text">Add New Question</h2>
              <p className="text-white/40 mt-1">Record your progress and set your revision schedule.</p>
            </div>
        </div>

        <div className="premium-card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-white/70 ml-1 flex items-center gap-1">
                    Question Title <span className="text-red-500/50">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Two Sum Problem"
                    className="premium-input w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="solvedDate" className="text-sm font-medium text-white/70 ml-1 flex items-center gap-1">
                    Solved Date <span className="text-red-500/50">*</span>
                  </label>
                  <input
                    type="date"
                    id="solvedDate"
                    name="solvedDate"
                    value={formData.solvedDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="premium-input w-full bg-white/5"
                    required
                  />
                </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium text-white/70 ml-1">
                Problem Link
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/40 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="e.g., https://leetcode.com/problems/two-sum/"
                    className="premium-input w-full pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-white/70 ml-1">
                Notes & Solution Strategy
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Break down your approach, time complexity, or any tricky edge cases..."
                rows="6"
                className="premium-input w-full resize-none min-h-[150px]"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="px-6 py-2.5 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Discard Changes
              </button>
              <button 
                type="submit" 
                className="premium-button-primary min-w-[160px]" 
                disabled={loading}
              >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Saving...
                    </span>
                ) : 'Add Question'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddQuestion;
