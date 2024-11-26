"use client"


import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCompletedQuizzes} from "@/store/quizSlice";

export default function Content() {
      const dispatch = useDispatch();
      const [quizess, setQuizess] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);


      useEffect(() => {
        const fetchQuizzes = async () => {
          try {
            const resultAction = await dispatch(getCompletedQuizzes());
            if (getCompletedQuizzes.fulfilled.match(resultAction)) {
              setQuizess(resultAction.payload);
            } else {
              setError(resultAction.payload?.message || 'Failed to fetch quizzes');
            }
          } catch (err) {
            setError(err.message || 'An error occurred');
          } finally {
            setLoading(false);
          }
        };

        fetchQuizzes();
      }, [dispatch]);

  return (
    <div>
      <h1>Completed Quizzes</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {quizess ? (
        <ul>
          {quizess.map((quizItem) => (
            <li key={quizItem.id}>
              {quizItem.title} - {quizItem.status} - {quizItem.date}
                <button>
                    <a href={quizItem.download_url} download={quizItem.title}>Download File</a>
                </button>
            </li>
          ))}
        </ul>
      ) : (
          <p>No completed quizzes found.</p>
      )}
    </div>
  );
}