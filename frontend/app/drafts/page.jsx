"use client";

import Header from "@/app/header/header";
import ProtectedRoute from "@/app/services/protectedProvider";
import Footer from "@/app/header/footer";
import {useDispatch} from "react-redux";
import {useState} from "react";
import Content from "@/app/library/content";
import {getDraftQuiz} from "@/store/quizSlice";

export default function Drafts() {
  const value = 'all=True'
  return (
      <>
    <Header>
      <ProtectedRoute>
        <div className="quizContainer">
          <div className="sidePanel">
          </div>
          <Content getQuizzes={getDraftQuiz} value={value} />
        </div>
      </ProtectedRoute>
    </Header>
        <Footer/>
        </>
  );
}
