import Header from "@/app/header/header";
import "./page.css";
import Footer from "@/app/header/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="main">
        <h1 className="title">Welcome to Sigame Quiz Redactor</h1>
        <p className="instruction">
          Follow the steps below to get started:
        </p>
        <ol>
          <li>Step 1: Click on Quiz Redactor.</li>
          <li>Step 2: Fill all fields and click next.</li>
          <li>Step 3: After you complete all fields </li>
          <li>you will have option to download your quizz</li>
          <li>Step 4: download it and run it in Sigame</li>
          <li>Step 5: that&#39;s all, Congratulations!</li>
          <li>P.S.  your completed Quizzes will be saved on the Quiz library page!</li>
        </ol>
      </main>
      <Footer/>
    </>
  );
}
