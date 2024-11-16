"use client"

import ProtectedRoute from "@/app/services/protectedProvider";
import Header from "@/app/header/header";
import QuizVisualisation from "@/app/quiz/vizualization";
import {useSelector} from "react-redux";
import CreateQuiz from "@/app/quiz/Quiz creation steps/CreateQuiz";
import CreateTags from "@/app/quiz/Quiz creation steps/CreateTags";
import CreateRounds from "@/app/quiz/Quiz creation steps/CreateRounds";
import CreateThemes from "@/app/quiz/Quiz creation steps/CreateThemes";
import CreateQuestions from "@/app/quiz/Quiz creation steps/CreateQuestions";

export default function Quiz() {
  const currentStep = useSelector((state) => state.quizApi.current_step);

  return (
      <Header>
          <ProtectedRoute>
              <div style={{display: 'flex', gap: '20px'}}>
                  <div style={{width: '50%'}}>
                      {currentStep === 1 && <CreateQuiz/>}
                      {currentStep === 2 && <CreateTags/>}
                      {currentStep === 3 && <CreateRounds/>}
                      {currentStep === 4 && <CreateThemes/>}
                      {currentStep > 4 && <CreateQuestions/>}
                  </div>
                      <QuizVisualisation/>
                  </div>
          </ProtectedRoute>
      </Header>

);
}
