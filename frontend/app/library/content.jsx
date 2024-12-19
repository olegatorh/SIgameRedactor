"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Content.css";
import {deleteQuiz} from "@/store/quizSlice";

export default function Content({getQuizzes, value}) {
  const dispatch = useDispatch();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const resultAction = await dispatch(getQuizzes(value));
        if (getQuizzes.fulfilled.match(resultAction)) {
          setQuizzes(resultAction.payload.reverse());
        } else {
          setError(resultAction.payload?.message || "Failed to fetch quizzes");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [dispatch, refreshKey]);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteQuizHandler = async (id) => {
      const result = await dispatch(deleteQuiz(id))
      if (deleteQuiz.fulfilled.match(result)) {
      setRefreshKey((prevKey) => prevKey + 1);
      } else {
        console.error("Failed to delete quiz:", result.payload);
      }

  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(quizzes.length / itemsPerPage);



   return (
    <div className="container">
      <h1 className="title">Available packages to download</h1>
      {loading && <p>Завантаження...</p>}
      {error && <p className="error">Помилка: {error}</p>}
      {quizzes && quizzes.length > 0 ? (
        <div>
          <div className="list fillContainer">
            {currentQuizzes.map((quizItem) => (
                <div key={quizItem.id} className="card smallCard">
                  <div className="cardContent">
                    <strong>Title: {quizItem.title}</strong>
                    <p>Date: {quizItem.date}</p>
                    <p>Status: <strong>{quizItem.current_step}</strong></p>
                    <p>Difficulty: {quizItem.difficulty}</p>
                    <p>Author: {quizItem.author}</p>
                    <p>Description: {quizItem.description}</p>
                  </div>
                  <div className={"buttonContainer"}>
                  {quizItem.current_step !== 6 ? (
                      <button
                          className="deleteButton"
                          onClick={() => deleteQuizHandler(quizItem.id)}
                      >
                        Delete quiz
                      </button>
                  ) : (
                      <button
                          className="downloadButton"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = quizItem.download_url;
                            link.download = quizItem.title;
                            link.click();
                          }}
                      >
                        Download quiz
                      </button>
                  )}
                  </div>
                </div>
            ))}
          </div>
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    className={`paginationButton ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                >
                {index + 1}
                </button>
            ))}
          </div>
        </div>
      ) : (
        !loading && <p>Немає доступних файлів для скачування.</p>
      )}
    </div>
  );
}