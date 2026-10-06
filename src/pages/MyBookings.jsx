import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './MyBookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser) return;

    api.get('/bookings')
      .then(res => {
        const userBookings = res.data.filter(item => item.userEmail === currentUser.email);
        setBookings(userBookings);
      })
      .catch(err => console.error('خطأ في جلب الحجوزات', err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="bookings-container">
        <h2>📚 الكورسات التي قمت بحجزها</h2>
        
        {bookings.length === 0 ? (
          <p className="no-bookings">لا توجد حجوزات حتى الآن.</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map(item => (
              <div key={item.id} className="booking-card">
                {/* عرض الصورة بشكل منسق في أعلى الكارت */}
                {item.image && (
                  <img src={item.image} alt={item.title} className="booking-card-img" />
                )}
                <h4 className="booking-card-title">{item.title}</h4>
                
                <div className="booking-info-row">
                  <b>👨‍🏫 المدرب:</b> <span>{item.instructor || 'N/A'}</span>
                </div>
                
                <div className="booking-info-row">
                  <b>💰 السعر:</b> <span>{item.price} EGP</span>
                </div>
                
                <div className="booking-date-row">
                  <b>📅 تاريخ ووقت الحجز:</b> <span>{item.date || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}