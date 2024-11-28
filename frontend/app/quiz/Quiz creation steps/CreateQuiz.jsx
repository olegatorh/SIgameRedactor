import {useState} from "react";
import './CreateQuiz.css';
import {createQuiz, updateStep} from "@/store/quizSlice";
import {useDispatch} from "react-redux";

export default function CreateQuiz() {
    const [quizInfo, setquizInfo] = useState({title: '', difficulty: 1, author: '', description: ''});
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createQuiz(quizInfo)).unwrap();
            dispatch(updateStep())
        } catch (error) {
            alert(error)
        }
    };
    return (<form onSubmit={handleSubmit} className="quiz-form">
            <div className="form-group">
                <label htmlFor="title" className="form-label">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="form-input"
                    value={quizInfo.title}
                    onChange={(e) => setquizInfo({...quizInfo, title: e.target.value})}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="difficulty" className="form-label">Difficulty:</label>
                <input
                    type="number"
                    id="difficulty"
                    className="form-input"
                    min="1"
                    max="10"
                    value={quizInfo.difficulty}
                    onChange={(e) => setquizInfo({...quizInfo, difficulty: e.target.value})}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="author" className="form-label">Author:</label>
                <input
                    type="text"
                    id="author"
                    className="form-input"
                    value={quizInfo.author}
                    onChange={(e) => setquizInfo({...quizInfo, author: e.target.value})}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description" className="form-label">Description:</label>
                <input
                    type="text"
                    id="description"
                    className="form-input"
                    value={quizInfo.description}
                    onChange={(e) => setquizInfo({...quizInfo, description: e.target.value})}
                    required
                />
            </div>
            <button type="submit" className="form-button">Next</button>
        </form>);
}
