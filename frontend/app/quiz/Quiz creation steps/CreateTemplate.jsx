import './CreateQuiz.css';
import {downloadQuiz, resetQuizState} from "@/store/quizSlice";
import {useDispatch, useSelector} from "react-redux";
import {router} from "next/client";
import {useRouter} from "next/navigation";



export default function CreateTemplate() {
        const quizId = useSelector((state) => state.quizApi.quiz.id);
        const dispatch = useDispatch()
        const router = useRouter();


        const handleSubmit = async (e) => {
        e.preventDefault();
        const quizLink = await dispatch(downloadQuiz(quizId)).unwrap();
        window.open(quizLink.download_url, '_blank')
        dispatch(resetQuizState())
        router.push('/library')

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
