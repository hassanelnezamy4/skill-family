import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './Dashboard.css';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cats, setCats] = useState([]); 
  const [requests, setRequests] = useState([]); // State لطلبات الكورسات من السيرفر
  const navigate = useNavigate();

  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    price: '',
    duration: '', 
    image: '',    
    catId: '', 
    description: '' 
  });

  useEffect(() => {
    fetchCourses();
    fetchBookings();
    fetchCategories(); 
    fetchCourseRequests(); // جلب طلبات الكورسات من السيرفر عند تحميل الصفحة
  }, []);

  const fetchCourses = () => {
    api.get('/subcat').then(res => setCourses(res.data)).catch(err => console.error("Error fetching courses", err));
  };

  const fetchBookings = () => {
    api.get('/bookings')
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error fetching bookings", err));
  };

  const fetchCategories = () => {
    api.get('/cat')
      .then(res => setCats(res.data))
      .catch(err => console.error("Error fetching categories", err));
  };

  // دالة جلب الطلبات من الـ API (db.json)
  const fetchCourseRequests = () => {
    api.get('/requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error("Error fetching course requests", err));
  };

  // دالة مسح كل الطلبات من السيرفر
  const clearCourseRequests = async () => {
    if (window.confirm("Are you sure you want to clear all course requests?")) {
      try {
        await Promise.all(requests.map(req => api.delete(`/requests/${req.id}`)));
        setRequests([]);
      } catch (err) {
        console.error("Error clearing course requests", err);
      }
    }
  };

  // دالة مسح كل الحجوزات من السيرفر
  const clearBookings = async () => {
    if (window.confirm("Are you sure you want to clear all user bookings?")) {
      try {
        await Promise.all(bookings.map(item => api.delete(`/bookings/${item.id}`)));
        setBookings([]);
      } catch (err) {
        console.error("Error clearing bookings", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/subcat/${id}`);
        fetchCourses();
      } catch (err) {
        console.error("Error deleting course", err);
      }
    }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course.id);
    setFormData({
      title: course.title || '',
      instructor: course.instructor || '',
      price: course.price || '',
      duration: course.duration || '',
      image: course.image || '',
      catId: course.catId !== undefined ? course.catId : '', 
      description: course.description || course.details || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        price: Number(formData.price),
        catId: Number(formData.catId)
      };

      await api.put(`/subcat/${editingCourse}`, updatedData);
      setEditingCourse(null); 
      fetchCourses(); 
    } catch (error) {
      console.error("Error updating course", error);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        
        {/* قسم إدارة الكورسات */}
        <div className="dashboard-top-row">
          <h2>Admin Dashboard - Manage Courses</h2>
          <button 
            className="add-course-btn"
            onClick={() => navigate('/add-course')}
          >
            + Add New Course
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Instructor</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map(c => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.instructor}</td>
                  <td>{c.price} EGP</td>
                  <td>
                    <button className="update-btn" onClick={() => handleOpenEdit(c)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-table-cell">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* قسم متابعة حجوزات المستخدمين للأدمن */}
        <div className="bookings-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="bookings-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
              📋 User Bookings Tracking (متابعة حجوزات المستخدمين)
            </h2>
            {bookings.length > 0 && (
              <button className="clear-requests-btn" onClick={clearBookings}>
                Clear All Bookings
              </button>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            {bookings.length === 0 ? (
              <p className="empty-bookings-text">No user bookings found yet.</p>
            ) : (
              <div className="bookings-grid">
                {bookings.map(item => (
                  <div key={item.id} className="booking-card">
                    <h4 className="booking-card-title">{item.title}</h4>
                    <div className="booking-info-row"><b>👤 User Name:</b> <span>{item.userName || 'Unknown'}</span></div>
                    <div className="booking-info-row"><b>📧 Email:</b> <span>{item.userEmail || 'N/A'}</span></div>
                    <div className="booking-info-row"><b>💰 Price:</b> <span>{item.price} EGP</span></div>
                    <div className="booking-date-row"><b>📅 Date & Time:</b> <span>{item.date || 'N/A'}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* قسم طلبات الكورسات الجديدة من المستخدمين (User Course Requests) */}
        <div className="bookings-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="bookings-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
              🎯 User Course Requests (طلبات كورسات المستخدمين)
            </h2>
            {requests.length > 0 && (
              <button className="clear-requests-btn" onClick={clearCourseRequests}>
                Clear All Requests
              </button>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            {requests.length === 0 ? (
              <p className="empty-bookings-text">No course requests from users yet.</p>
            ) : (
              <div className="bookings-grid">
                {requests.map((req, index) => (
                  <div key={req.id || index} className="booking-card" style={{ borderLeft: '4px solid #ff9800' }}>
                    <h4 className="booking-card-title">📚 {req.course}</h4>
                    <div className="booking-info-row"><b>👤 User Name:</b> <span>{req.userName || 'Guest'}</span></div>
                    <div className="booking-info-row"><b>📧 Email:</b> <span>{req.userEmail || 'N/A'}</span></div>
                    <div className="booking-date-row"><b>📅 Requested On:</b> <span>{req.date}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* نموذج التعديل الشامل (Modal) */}
      {editingCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <div className="modal-header">
              <h3>Edit Course Details</h3>
              <button 
                type="button"
                className="modal-close-x-btn"
                onClick={() => setEditingCourse(null)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Instructor</label>
                <input 
                  type="text" 
                  value={formData.instructor} 
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration / Time</label>
                <input 
                  type="text" 
                  value={formData.duration} 
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={formData.image} 
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.catId} 
                  onChange={(e) => setFormData({ ...formData, catId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {cats.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-cancel-btn"
                  onClick={() => setEditingCourse(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-save-btn"
                >
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}