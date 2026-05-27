import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './AllQuestions.css';

const AllQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await questionAPI.getAllQuestions(filterParams);
      setQuestions(response.data.data.questions);
    } catch (error) {
      toast.error('Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    const filterParams = {};
    if (filters.startDate) filterParams.startDate = filters.startDate;
    if (filters.endDate) filterParams.endDate = filters.endDate;
    fetchQuestions(filterParams);
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
    fetchQuestions();
  };

  const handleQuestionClick = (id) => {
    navigate(`/questions/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/40 animate-pulse font-medium">Loading questions...</div>
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
              All Questions
            </h1>
            <p className="text-white/50 font-medium tracking-tight">
              You've mastered <span className="text-white">{questions.length}</span> individual challenges
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
            <span className="font-semibold tracking-tight">Dashboard</span>
          </button>
        </header>

        {/* Filters Panel */}
        <section className="premium-card p-6 mb-10 border border-white/5">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1">
                  From Date
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="premium-input w-full pl-4 pr-4"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1">
                  To Date
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="premium-input w-full pl-4 pr-4"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={applyFilters}
                className="premium-button flex-1 md:flex-initial px-8 py-4 shadow-xl shadow-white/5"
              >
                Apply Filters
              </button>
              <button 
                onClick={clearFilters}
                className="flex-1 md:flex-initial px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/5 active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Questions Grid */}
        {questions.length === 0 ? (
          <div className="premium-card p-24 text-center border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 transform rotate-12">
              <svg className="w-10 h-10 text-white/20 -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No matching problems found</h3>
            <p className="text-white/40 max-w-xs mx-auto mb-8">Try adjusting your date range or add your first question to begin tracking.</p>
            <button 
              onClick={() => navigate('/add-question')}
              className="premium-button px-8 py-3.5"
            >
              Add First Problem
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {questions.map((question) => (
              <div 
                key={question._id}
                onClick={() => handleQuestionClick(question._id)}
                className="premium-card p-8 flex flex-col group cursor-pointer hover:border-white/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/5 group-hover:border-white/10 transition-colors">
                    {formatDate(question.solvedDate)}
                  </span>
                  <div className="text-white/20 group-hover:text-white/60 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:premium-gradient-text transition-all duration-300">
                  {question.title}
                </h3>
                
                {question.notes && (
                  <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                    {question.notes}
                  </p>
                )}

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {question.link && (
                      <span className="p-2 rounded-lg bg-white/5 text-white/30 border border-white/5 group-hover:text-white/60 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </span>
                    )}
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider border border-white/5">
                      {question.category || 'General'}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white/50 transition-colors">
                    Details
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllQuestions;
