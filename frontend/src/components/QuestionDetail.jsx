import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questionAPI, revisionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionDetails();
  }, [id]);

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const [questionRes, revisionRes] = await Promise.all([
        questionAPI.getQuestionById(id),
        revisionAPI.getQuestionRevisionHistory(id)
      ]);
      
      setQuestion(questionRes.data.data.question);
      setRevisions(revisionRes.data.data.revisions);
    } catch (error) {
      toast.error('Error loading question details');
      navigate('/questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This will also delete all associated revisions.')) {
      return;
    }

    try {
      await questionAPI.deleteQuestion(id);
      toast.success('Question deleted successfully');
      navigate('/questions');
    } catch (error) {
      toast.error('Error deleting question');
    }
  };

  const handleMarkComplete = async (revisionId) => {
    try {
      await revisionAPI.markRevisionCompleted(revisionId);
      toast.success('Revision marked as completed!');
      fetchQuestionDetails(); // Refresh data
    } catch (error) {
      toast.error('Error marking revision as complete');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isRevisionMissed = (revisionDate, status) => {
    if (status === 'revised') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const revDate = new Date(revisionDate);
    revDate.setHours(0, 0, 0, 0);
    return revDate < today;
  };

  if (loading) {
    return <div className="loading">Loading question details...</div>;
  }

  if (!question) {
    return <div className="loading">Question not found</div>;
  }

  const pendingRevisions = revisions.filter(r => r.status === 'pending' && !isRevisionMissed(r.revisionDate, r.status)).length;
  const completedRevisions = revisions.filter(r => r.status === 'revised').length;
  const missedRevisions = revisions.filter(r => isRevisionMissed(r.revisionDate, r.status)).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/questions')}
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold tracking-wide uppercase">Back to Library</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight premium-gradient-text leading-tight">
              {question.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {formatDate(question.solvedDate)}
              </span>
              <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {question.category || 'General'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(`/questions/${id}/edit`)}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/5 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.138 2.97a2.25 2.25 0 113.182 3.182L13.181 12.25a.75.75 0 01-.527.21l-3.218.06a.25.25 0 01-.25-.25l.06-3.219a.75.75 0 01.21-.527l6.671-6.672z" />
              </svg>
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="px-6 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold transition-all border border-rose-500/20 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="premium-card p-8 min-h-[300px] border border-white/5">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Personal Notes
              </h3>
              {question.notes ? (
                <div className="text-white/70 leading-relaxed font-medium whitespace-pre-wrap text-lg">
                  {question.notes}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-white/20 italic font-medium">
                  No notes available for this question.
                </div>
              )}
            </section>

            {question.link && (
              <section className="premium-card p-6 flex items-center justify-between group border border-white/5 overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">Problem Source</h4>
                    <p className="text-xs text-white/30 font-medium truncate max-w-[200px] sm:max-w-xs">{question.link}</p>
                  </div>
                </div>
                <a 
                  href={question.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/5 uppercase tracking-widest whitespace-nowrap"
                >
                  Solve Again
                </a>
              </section>
            )}
          </div>

          {/* Sidebar - Revision Stats & History */}
          <div className="space-y-8">
            <section className="premium-card p-8 border border-white/5">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Revision Velocity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/10 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{completedRevisions}</p>
                  <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest mt-1">Conquered</p>
                </div>
                <div className="p-4 rounded-3xl bg-blue-500/[0.03] border border-blue-500/10 text-center">
                  <p className="text-2xl font-bold text-blue-400">{pendingRevisions}</p>
                  <p className="text-[10px] font-bold text-blue-500/40 uppercase tracking-widest mt-1">Scheduled</p>
                </div>
                {missedRevisions > 0 && (
                  <div className="p-4 rounded-3xl bg-rose-500/[0.03] border border-rose-500/10 text-center col-span-2">
                    <p className="text-2xl font-bold text-rose-400">{missedRevisions}</p>
                    <p className="text-[10px] font-bold text-rose-500/40 uppercase tracking-widest mt-1">Missed Milestones</p>
                  </div>
                )}
              </div>
            </section>

            <section className="premium-card p-8 border border-white/5">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-6">Timeline</h3>
              <div className="space-y-6">
                {revisions.map((rev, index) => {
                  const isMissed = isRevisionMissed(rev.revisionDate, rev.status);
                  const isCompleted = rev.status === 'revised';
                  
                  return (
                    <div key={rev._id} className="relative flex gap-4 pl-2 group">
                      {index !== revisions.length - 1 && (
                        <div className="absolute left-[13px] top-8 w-px h-10 bg-white/5 group-hover:bg-white/10 transition-colors" />
                      )}
                      
                      <div className={`mt-1.5 w-2.5 h-2.5 rounded-full z-10 ring-4 ${
                        isCompleted ? 'bg-emerald-500 ring-emerald-500/10' :
                        isMissed ? 'bg-rose-500 ring-rose-500/10' :
                        'bg-white/20 ring-white/5'
                      }`} />
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-bold tracking-tight ${
                            isCompleted ? 'text-emerald-400 font-bold' :
                            isMissed ? 'text-rose-400 font-bold' :
                            'text-white/60 font-semibold'
                          }`}>
                            Milestone {rev.dayOffset}
                          </p>
                          <span className="text-[10px] font-bold text-white/20">
                            {formatDate(rev.revisionDate)}
                          </span>
                        </div>
                        
                        {!isCompleted && isMissed && (
                          <button
                            onClick={() => handleMarkComplete(rev._id)}
                            className="mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            Mark as Complete
                          </button>
                        )}
                        {isCompleted && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-emerald-500/60" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">Captured</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionDetail;
