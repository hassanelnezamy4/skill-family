import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // قراءة بيانات المستخدم من الـ localStorage بنفس طريقة الـ Navbar بالضبط
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    // التحقق هل هو أدمن ولا لأ بناءً على الإيميل أو دور التخزين
    if (user && user.email === 'admin@skill.com') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* القسم الأول: اسم المنصة والنبذة */}
        <div className="footer-brand">
          <h3>Skill <span>Family</span></h3>
          <p>Empowering Every Member of the Family with Top Skills.</p>
        </div>

        {/* القسم الثاني: الروابط السريعة الديناميكية */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>

          {/* لو أدمن يظهر Dashboard، لو يوزر عادي يظهر My Bookings */}
          {isAdmin ? (
            <Link to="/dashboard">Dashboard</Link>
          ) : (
            <Link to="/my-bookings">My Bookings</Link>
          )}
        </div>

        {/* القسم الثالث: معلومات المشروع التقنية */}
        <div className="footer-info">
          <h4>Front-End Project</h4>
          <p>HTML5, CSS3, JavaScript, React.js & JSON API</p>
        </div>

        {/* القسم الرابع: أيقونات التواصل الاجتماعي */}
        <div className="footer-social">
          <h4>Connect With Us</h4>
          <div className="social-icons-wrapper">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Skill Family Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
}