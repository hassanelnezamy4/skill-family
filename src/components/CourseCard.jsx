import { Link } from 'react-router-dom';
import './CourseCard.css';

export default function CourseCard({ course }) {
  return (
    <div className="card">
      <img src={course.image || 'https://via.placeholder.com/300x180'} alt={course.title || 'Course'} />
      <div className="card-content">
        <h3>{course.title || 'بدون عنوان'}</h3>
        <div className="meta">
          <span>{course.instructor || 'مدرب غير محدد'}</span>
          <span>{course.duration || 'غير محدد'}</span>
        </div>
        <p className="price">{course.price ? `${course.price} EGP` : 'مجاني'}</p>
        <Link to={`/details/${course.id}`}>عرض التفاصيل</Link>
      </div>
    </div>
  );
}