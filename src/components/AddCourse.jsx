import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from './Navbar';
import './AddCourse.css';

export default function AddCourse() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [catId, setCatId] = useState('1');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState('');
  const [details, setDetails] = useState('');
  const [cats, setCats] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cat')
      .then(r => {
        setCats(r.data);
        if (r.data.length > 0) {
          setCatId(r.data[0].id); // تعيين أول تصنيف كافتراضي تلقائياً
        }
      })
      .catch(err => console.error('خطأ في جلب التصنيفات', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subcat', {
        title,
        price: Number(price), // تحويل السعر لرقم لضمان توافقه مع الـ Backend
        catId: Number(catId),
        instructor,
        duration,
        image,
        details
      });
      alert('تم إضافة الكورس بنجاح! 🎉');
      
      // العودة تلقائياً للوحة التحكم بعد الإضافة الناجحة
      navigate('/dashboard');
    } catch (err) {
      console.error('خطأ أثناء إضافة الكورس', err);
      alert('حصل خطأ، تأكد من اتصال السيرفر وحاول تاني.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="add-course-container">
        <h2>إضافة كورس جديد</h2>
        <form onSubmit={handleSubmit} className="add-course-form">
          <input type="text" placeholder="عنوان الكورس" value={title} onChange={e => setTitle(e.target.value)} required />
          <input type="number" placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} required />
          <select value={catId} onChange={e => setCatId(e.target.value)} required>
            {cats.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="text" placeholder="اسم المدرب" value={instructor} onChange={e => setInstructor(e.target.value)} required />
          <input type="text" placeholder="المدة (مثال: 10h)" value={duration} onChange={e => setDuration(e.target.value)} required />
          <input type="text" placeholder="رابط الصورة (URL)" value={image} onChange={e => setImage(e.target.value)} required />
          <textarea placeholder="التفاصيل" value={details} onChange={e => setDetails(e.target.value)} rows="4" required />
          <button type="submit">حفظ وإضافة الكورس</button>
        </form>
      </div>
    </div>
  );
}