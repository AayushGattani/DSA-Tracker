import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
              <span className="text-black font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold premium-gradient-text hidden sm:inline">RecallDSA</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/questions" label="Questions" />
            <NavLink to="/revisions" label="Revisions" />
            <NavLink to="/add-question" label="Add New" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-white">{user?.name}</span>
              
            </div>
            <div className="flex items-center space-x-2">
                <Link to="/profile" className="p-2 text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
                <Link to="/settings" className="p-2 text-white/60 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all hover:text-red-400 hover:border-red-400/30 hidden sm:block"
                >
                  Logout
                </button>
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#030303] border-t border-white/5 py-4 space-y-2 px-4">
            <MobileNavLink to="/dashboard" label="Dashboard" onClick={closeMobileMenu} />
            <MobileNavLink to="/questions" label="Questions" onClick={closeMobileMenu} />
            <MobileNavLink to="/revisions" label="Revisions" onClick={closeMobileMenu} />
            <MobileNavLink to="/add-question" label="Add New" onClick={closeMobileMenu} />
            <button 
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive
          ? 'text-white bg-white/10 border border-white/20'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive
          ? 'text-white bg-white/10 border border-white/20'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
