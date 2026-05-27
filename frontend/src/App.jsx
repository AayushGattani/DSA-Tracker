import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddQuestion from './components/AddQuestion';
import AllQuestions from './components/AllQuestions';
import QuestionDetail from './components/QuestionDetail';
import EditQuestion from './components/EditQuestion';
import Revisions from './components/Revisions';
import Settings from './components/Settings';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

// import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/add-question" 
              element={
                <PrivateRoute>
                  <AddQuestion />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/questions" 
              element={
                <PrivateRoute>
                  <AllQuestions />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/questions/:id" 
              element={
                <PrivateRoute>
                  <QuestionDetail />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/questions/:id/edit" 
              element={
                <PrivateRoute>
                  <EditQuestion />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/revisions" 
              element={
                <PrivateRoute>
                  <Revisions />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
