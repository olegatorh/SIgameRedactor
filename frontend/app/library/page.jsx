"use client";

import Header from "@/app/header/header";
import ProtectedRoute from "@/app/services/protectedProvider";
import Content from "@/app/library/content";
import "./Content.css";
import Footer from "@/app/header/footer";

export default function Quiz() {
  return (
      <>
    <Header>
      <ProtectedRoute>
        <div className="quizContainer">
          <div className="sidePanel">
          </div>
          <Content />
        </div>
      </ProtectedRoute>
    </Header>
        <Footer/>
        </>
  );
}
