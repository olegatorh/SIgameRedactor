import {useState} from "react";
import './CreateQuiz.css';
import {createTags, updateCurrentStep, updateStep} from "@/store/quizSlice";
import {useDispatch, useSelector} from "react-redux";


export default function CreateTags() {
    const [tags, setTag] = useState('');
    const dispatch = useDispatch();
    const quizId = useSelector((state) => state.quizApi.quiz.id);
    const current_step = useSelector((state) => state.quizApi.quiz.current_step);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const quizData = {'package_id': quizId, 'tag_names': tags}
            await dispatch(createTags(quizData)).unwrap();
            await dispatch(updateCurrentStep({'id': quizId, 'current_step': current_step + 1}))
            dispatch(updateStep())
        } catch (error) {
            alert(error.message)
        }
    };

    return (<form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
            <label htmlFor="tag" className="form-label">Tags:</label>
            <input
                type="text"
                id="tag"
                className="form-input"
                value={tags}
                onChange={(e) => setTag(e.target.value)}
                required
            />
            <label htmlFor="tags" className="form-label">separate it by comma please</label>
        </div>
        <button type="submit" className="form-button">Next</button>
    </form>);
}
