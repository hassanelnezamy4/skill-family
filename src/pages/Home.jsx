import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import './Home.css';

export default function Home(){
  const [cats, setCats] = useState([]); 
  const [courses, setCourses] = useState([]); 
  const [active, setActive] = useState('all'); 
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // States الخاصة بطلب كورس جديد
  const [courseName, setCourseName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user && user.email === 'admin@skill.com') {
      setIsAdmin(true);
    }

    api.get('/cat').then(r => setCats(r.data)); 
    api.get('/subcat').then(r => setCourses(r.data));
  },[]);

  const filtered = courses.filter(c => {
    const mCat = active === 'all' || String(c.catId) === String(active); 
    const mSearch = c.title.toLowerCase().includes(search.toLowerCase()); 
    return mCat && mSearch;
  });

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      // بنبعت الطلب للسيرفر مباشرة (db.json)
      await api.post('/requests', {
        course: courseName,
        date: new Date().toLocaleString(),
        userEmail: user ? user.email : 'Unknown',
        userName: user ? user.name : 'Guest'
      });

      setSubmitted(true);
      setCourseName('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting course request:', error);
    }
  };

  return(
    <div className="home-page">
      <header>
        <Navbar />
      </header>

      <main>
        <section className="hero">
          <h1>Skill Family</h1>
          <p>Empowering Every Member of the Family</p>
          <input 
            type="text" 
            placeholder="Search for React, Design, English..." 
            onChange={e => setSearch(e.target.value)} 
          />
        </section>

        <nav className="filter-bar">
          <button className={active === 'all' ? 'active' : ''} onClick={() => setActive('all')}>All</button>
          {cats.map(c => (
            <button 
              key={c.id} 
              className={String(active) === String(c.id) ? 'active' : ''} 
              onClick={() => setActive(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>

        <section className="grid">
          {filtered.length > 0 ? (
            filtered.map(c => <CourseCard key={c.id} course={c} isAdmin={isAdmin} />)
          ) : (
            <p>لا توجد كورسات مطابقة لبحثك حالياً.</p>
          )}
        </section>

        {/* قسم اطلب كورس جديد */}
        <section className="course-request-section">
          <h3>مش لاقي الكورس اللي بتدور عليه؟</h3>
          <p>اكتب اسم الكورس ونحن سنوفره لك قريباً!</p>
          
          <form onSubmit={handleRequest}>
            <input 
              type="text" 
              placeholder="اكتب اسم الكورس هنا..." 
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <button type="submit">إرسال الطلب</button>
          </form>

          {submitted && <p className="success-msg">تم إرسال طلبك بنجاح للأدمن!</p>}
        </section>
      </main>
    </div>
  );
}