import './CreateQuiz.css';
import {downloadQuiz} from "@/store/quizSlice";
import {useDispatch, useSelector} from "react-redux";



export default function CreateTemplate() {
        const quizId = useSelector((state) => state.quizApi.quiz.id);
        const dispatch = useDispatch()

        const handleSubmit = async (e) => {
        e.preventDefault();
        const quizLink = await dispatch(downloadQuiz(quizId)).unwrap();
        console.log('quizLink', quizLink)
        try {
        } catch (error) {
            alert(error.message);
        }
    };

    return (
            <form onSubmit={handleSubmit} className="quiz-form">
                <button type="submit" className="form-button">Load Quiz</button>
            </form>
    );
}
