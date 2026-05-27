import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-white/80 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg shadow-white/10">
                <span className="text-black font-black text-xl">D</span>
              </div>
              <span className="text-2xl font-black premium-gradient-text tracking-tight">DSA Tracker</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:shadow-xl hover:shadow-white/20 active:scale-95 hover:bg-white/95">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Master DSA with Scientific Precision</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Transform Your <span className="premium-gradient-text">DSA Journey</span>
            </h1>
            
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Track, revise, and master data structures & algorithms with scientifically proven spaced repetition. 
              Never forget what you've learned.
            </p>
            
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-white/20 active:scale-95 group"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-white/50 text-lg">Powerful features designed for serious learners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="premium-card p-8 group hover:border-white/20 transition-all">
              <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mb-6 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Question Tracking</h3>
              <p className="text-white/50 leading-relaxed">
                Log every problem you solve with details like difficulty, category, notes, and solution links. Keep your entire learning journey organized.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="premium-card p-8 group hover:border-white/20 transition-all">
              <div className="p-4 bg-purple-500/10 rounded-2xl w-fit mb-6 group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Spaced Repetition System</h3>
              <p className="text-white/50 leading-relaxed">
                Based on proven learning science, our system reminds you to revise problems at optimal intervals (1, 3, 7, 14, 21 days) for maximum retention.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="premium-card p-8 group hover:border-white/20 transition-all">
              <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
              <p className="text-white/50 leading-relaxed">
                Visualize your learning journey with detailed statistics, contribution calendars, and insights into your problem-solving patterns.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="premium-card p-8 group hover:border-white/20 transition-all">
              <div className="p-4 bg-amber-500/10 rounded-2xl w-fit mb-6 group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Daily Revision Reminders</h3>
              <p className="text-white/50 leading-relaxed">
                Never miss a revision. Get a personalized dashboard showing exactly which problems to revise today based on your schedule.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="premium-card p-8 group hover:border-white/20 transition-all">
              <div className="p-4 bg-rose-500/10 rounded-2xl w-fit mb-6 group-hover:bg-rose-500/20 transition-colors">
                <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Customizable Settings</h3>
              <p className="text-white/50 leading-relaxed">
                Tailor the revision pattern to your learning style. Adjust intervals, apply changes retroactively, and control your learning strategy.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="premium-card p-8 group hover:border-white/20 transition-all">
              <div className="p-4 bg-cyan-500/10 rounded-2xl w-fit mb-6 group-hover:bg-cyan-500/20 transition-colors">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Rich Note Taking</h3>
              <p className="text-white/50 leading-relaxed">
                Add detailed notes, attach solution links, tag problems by category, and mark difficulty levels. Everything you need in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/50 text-lg">Simple, yet powerful workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Solve a Problem',
                description: 'Work through a DSA problem on any platform like LeetCode, HackerRank, or GeeksforGeeks.'
              },
              {
                step: '02',
                title: 'Log Your Solution',
                description: 'Add the question to DSA Tracker with details, difficulty, category, and your notes.'
              },
              {
                step: '03',
                title: 'Automatic Scheduling',
                description: 'The system automatically schedules revisions using spaced repetition (1, 3, 7, 14, 21 days).'
              },
              {
                step: '04',
                title: 'Revise & Master',
                description: 'Get daily reminders for problems due for revision. Mark them complete as you review.'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-white/15 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-white/10">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="premium-gradient-text">Master DSA</span>?
          </h2>
          <p className="text-xl text-white/60 mb-12">
            Join thousands of developers who never forget what they learn. Start your journey today.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-white/20 active:scale-95 group"
          >
            Get Started Free
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2">
                <span className="text-black font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold premium-gradient-text">DSA Tracker</span>
            </div>

            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/in/ankit23-exe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              <a 
                href="https://x.com/Ankit23_exe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a 
                href="https://github.com/ankit23-exe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm">
              © 2026 DSA Tracker. Built with ❤️ for developers who never stop learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
