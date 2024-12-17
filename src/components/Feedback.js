// src/components/Feedback.js
import Sidebar from './Sidebar';
import './Feedback.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://43.200.27.116:5000/api/feedback');
        if (response.data.success) {
          setFeedbacks(response.data.feedbacks);
        } else {
          throw new Error('데이터를 가져오는 데 실패했습니다.');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFeedbacks();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
			<Sidebar />
      <h1>수정된 Prediction Feedback</h1>
      <ul>
        {feedbacks.map(feedback => (
          <li key={feedback.id}>
            <p><strong>Post ID:</strong> {feedback.post_id}</p>
            <p><strong>Prediction:</strong> {feedback.prediction}</p>
            <p><strong>Updated At:</strong> {new Date(feedback.updated_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeedbackPage;
