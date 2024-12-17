"use client"


import Header from "@/app/header/header";
import {useDispatch, useSelector} from "react-redux";
import CreateQuiz from "@/app/quiz/Quiz creation steps/CreateQuiz";
import CreateTags from "@/app/quiz/Quiz creation steps/CreateTags";
import CreateRounds from "@/app/quiz/Quiz creation steps/CreateRounds";
import CreateThemes from "@/app/quiz/Quiz creation steps/CreateThemes";
import CreateQuestions from "@/app/quiz/Quiz creation steps/CreateQuestions";
import CreateTemplate from "@/app/quiz/Quiz creation steps/CreateTemplate";
import QuizVisualisation from "@/app/quiz/vizualization";
import ProtectedRoute from "@/app/services/protectedProvider";
import Footer from "@/app/header/footer";
import {getDraftQuiz, resetQuizState, updateCurrentQuiz} from "@/store/quizSlice";
import {useEffect} from "react";



export default function Quiz() {
  const dispatch = useDispatch();
  useEffect(() => {
        const fetchData = async () => {
            const response = await dispatch(getDraftQuiz());
            if (response.payload.user){
              dispatch(updateCurrentQuiz(response));
            }
        };
        fetchData();
    }, [dispatch]);
  const currentStep = useSelector((state) => state.quizApi.quiz.current_step);
  const  restart  = async () => {
      dispatch(resetQuizState())
    }
  return (
      <>
      <Header>
          <ProtectedRoute>
              <div style={{display: 'flex', gap: '20px'}}>
                  <div style={{width: '50%'}}>
                      {!currentStep && <CreateQuiz/>}
                      {currentStep === 2 && <CreateTags/>}
                      {currentStep === 3 && <CreateRounds/>}
                      {currentStep === 4 && <CreateThemes/>}
                      {currentStep === 5 && <CreateQuestions/>}
                      {currentStep === 6 && <CreateTemplate/>}
                      <div style={{display: 'flex', marginTop: 40, gap: '20px' }} >
                                  {currentStep && (
                            <button className="form-button restart-button" onClick={restart}>
                                Restart
                            </button>)}
                          </div>
                  </div>
                      <QuizVisualisation/>
                  </div>
          </ProtectedRoute>
      </Header>
          <Footer/>
      </>

);
}
