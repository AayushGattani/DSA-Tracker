import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questionAPI } from '../api';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
// import './AddQuestion.css'; // Reuse the same CSS

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    link: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await questionAPI.getQuestionById(id);
      const question = response.data.data.question;
      setFormData({
        title: question.title,
        notes: question.notes || '',
        link: question.link || ''
      });
    } catch (error) {
      toast.error('Error loading question');
      navigate('/questions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a question title');
      return;
    }

    setSubmitting(true);

    try {
      await questionAPI.updateQuestion(id, {
        title: formData.title,
        notes: formData.notes,
        link: formData.link
      });
      toast.success('Question updated successfully!');
      navigate(`/questions/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating question');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading question...</div>;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate(`/questions/${id}`)} 
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                title="Back to Question"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold premium-gradient-text">Edit Question</h2>
              <p className="text-white/40 mt-1">Refine your notes and problem details.</p>
            </div>
        </div>

        <div className="premium-card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                placeholder="Update your approach, complexity, or learnings..."
                rows="10"
                className="premium-input w-full resize-none min-h-[200px]"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => navigate(`/questions/${id}`)} 
                className="px-6 py-2.5 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="premium-button-primary min-w-[180px]" 
                disabled={submitting}
              >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Updating...
                    </span>
                ) : 'Update Question'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditQuestion;
