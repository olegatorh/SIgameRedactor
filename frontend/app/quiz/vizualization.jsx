import {useSelector} from "react-redux";


export default function QuizVisualisation() {
    const quizData = useSelector((state) => state.quizApi.quiz);
    return (
        <div style={{width: '50%', border: '1px solid #ccc', padding: '20px'}}>
            <h2>Quiz Data Visualization</h2>
            <pre>{JSON.stringify(quizData, null, 2)}</pre>
        </div>
    )
}