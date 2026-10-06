import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './Details.css';

export default function Details() {
  const { id } = useParams(); 
  const [c, setC] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // جلب بيانات الكورس المحدد مع معالجة الأخطاء
    api.get(`/subcat/${id}`)
      .then(r => setC(r.data))
      .catch(err => {
        console.error('فشل في جلب تفاصيل الكورس', err);
        setError('تعذر تحميل تفاصيل الكورس المطلوبة.');
      });
  }, [id]);

  const handleBookCourse = async () => {
    try {
      // 1. نجيب بيانات اليوزر الكاملة من الـ localStorage
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      if (!currentUser) {
        alert('الرجاء تسجيل الدخول أولاً قبل الحجز!');
        navigate('/', { replace: true });
        return;
      }

      // 🛑 فحص لو المستخدم الحالي هو الأدمن، نمنعه من الحجز ونوجهه للداشبورد
      if (currentUser.email === 'admin@skill.com') {
        alert('⚠️ عذراً يا بشمهندس، حساب الأدمن مخصص للإدارة فقط ولا يمكنه حجز كورسات!');
        navigate('/dashboard');
        return;
      }

      // 2. بنبعت الحجز ومعاه التاريخ والوقت معاً بدقة (للمستخدم العادي فقط)
      await api.post('/bookings', {
        courseId: c.id,
        title: c.title,
        price: c.price,
        image: c.image,
        instructor: c.instructor,
        date: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        userEmail: currentUser.email,
        userName: currentUser.name || 'User'
      });

      alert(`🎉 مبروك يا ${currentUser.name || 'بطل'}! تم حجز كورس "${c.title}" بنجاح.`);
      
      // 3. توجيه اليوزر لصفحة حجوزاته تلقائياً بعد إتمام الحجز بنجاح
      navigate('/my-bookings');
    } catch (err) {
      console.error('فشل الحجز', err);
      alert('حدث خطأ أثناء الحجز، تأكد أن السيرفر يعمل.');
    }
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#ef4444' }}>
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="details-container">
        <img src={c.image} alt={c.title} />
        <div className="details-info">
          <h2>{c.title}</h2>
          <p><b>المدرب:</b> {c.instructor || 'غير محدد'}</p>
          <p><b>المدة:</b> {c.duration || 'غير محددة'}</p>
          <p><b>السعر:</b> {c.price ? `${c.price} EGP` : 'مجاني'}</p>
          <p className="desc">{c.details}</p>
          
          <button className="book-btn" onClick={handleBookCourse}>
            احجز الآن
          </button>
        </div>
      </div>
    </div>
  );
}