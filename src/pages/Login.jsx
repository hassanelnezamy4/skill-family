import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // دالة ذكية لتحويل الإيميل لاسم شخص مرتب وديناميكي تماماً
  const getNameFromEmail = (mail) => {
    const namePart = mail.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const dynamicName = getNameFromEmail(trimmedEmail);

    // 1. التحقق الصارم من حساب الأدمن الثابت (الإيميل والباسورد معاً)
    if (trimmedEmail === 'admin@skill.com') {
      if (trimmedPassword === '123') {
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', email: trimmedEmail }));
        navigate('/dashboard', { replace: true });
        return;
      } else {
        setError('Invalid password for Admin account!');
        return;
      }
    }

    try {
      // 2. فحص الـ Admin من الـ JSON API (لو موجود في الباك إند)
      const adminRes = await api.get(`/admin?email=${trimmedEmail}&password=${trimmedPassword}`);
      if (adminRes.data.length > 0) {
        const adminData = adminRes.data[0];
        localStorage.setItem('user', JSON.stringify({
          ...adminData,
          name: adminData.name || dynamicName
        }));
        navigate('/dashboard', { replace: true });
        return;
      }

      // 3. فحص الـ User من الـ JSON API
      const userRes = await api.get(`/user?email=${trimmedEmail}&password=${trimmedPassword}`);
      if (userRes.data.length > 0) {
        const userData = userRes.data[0];
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          name: userData.name || dynamicName
        }));
        navigate('/home', { replace: true });
        return;
      }

      // 4. لأي إيميل عادي آخر (يقبل أي باسورد يكتبه المستخدم)
      if (trimmedEmail && trimmedPassword) {
        localStorage.setItem('user', JSON.stringify({ name: dynamicName, email: trimmedEmail }));
        navigate('/home', { replace: true });
        return;
      }

      setError('Please enter a valid email and password.');
    } catch (err) {
      console.error(err);
      
      // 5. العمل في حالة انقطاع السيرفر (Offline Mode) للحسابات العادية
      if (trimmedEmail && trimmedPassword) {
        localStorage.setItem('user', JSON.stringify({ name: dynamicName, email: trimmedEmail }));
        navigate('/home', { replace: true });
        return;
      }

      setError('Server connection error. Please check the backend.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back to <span>Skill Family</span></h2>
        <p className="login-subtitle">Please sign in to continue</p>
        
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="user@skill.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter any password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}