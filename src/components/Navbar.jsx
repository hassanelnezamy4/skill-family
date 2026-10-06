import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user && user.email === 'admin@skill.com';

  return (
    <div className="navbar">
      <h3>Skill Family</h3>
      <div>
        {isAdmin ? (
          /* الأدمن يشوف الرئيسية والداشبورد عشان يقدر يتحرك بحرية */
          <>
            <Link to="/home">Home</Link>
            {/* تم تصحيح المسار ليتطابق مع باقي الملفات /dashboard */}
            <Link to="/dashboard">Dashboard</Link>
          </>
        ) : (
          /* اليوزر العادي يشوف الرئيسية وحجوزاته بس */
          <>
            <Link to="/home">Home</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </>
        )}

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login'; // توجيه مباشر وإجباري للمتصفح
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}