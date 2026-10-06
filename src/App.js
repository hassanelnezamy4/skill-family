import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AddCourse from './components/AddCourse';
import Footer from './components/Footer';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} style={{ animation: 'fadeInSlide 0.5s ease-out forwards' }}>
      <Routes location={location}>
        {/* الصفحة الرئيسية أصبحت هي الـ Root */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* صفحة تسجيل الدخول أصبحت في مسار مستقل */}
        <Route path="/login" element={<Login />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        
        {/* مسار احتياطي يعيد التوجيه للصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  
  // هنا بنقوله: اخفي الفوتر لو إحنا في صفحة الـ /login أو في الصفحة الرئيسية /
  const isLogin = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <AnimatedRoutes />
      </div>
      {/* الفوتر هيظهر في باقي الصفحات بس، وهيختفي تماماً في اللوجين */}
      {!isLogin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}