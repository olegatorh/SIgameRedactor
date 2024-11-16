import { useEffect, useState } from "react";
import './CreateQuiz.css';
import {useDispatch, useSelector} from "react-redux";
import { updateStep } from "@/store/quizSlice";
import {CreateQuestionsHelper} from "@/app/services/QuizCreateHelper";

export default function CreateQuestions() {
    const rounds = useSelector((state) => state.quizApi.quiz.rounds);
    const [updatedRounds, setUpdatedRounds] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        if (rounds && rounds.length > 0) {
            setUpdatedRounds(rounds.map(round => ({
                ...round,
                themes: round.themes.map(theme => ({
                    ...theme,
                    questions: theme.questions || []  // Ініціалізуємо пустим масивом, якщо немає питань
                }))
            })));
        }
    }, [rounds]);

    const addQuestion = (roundId, themeId) => {
        const newRounds = updatedRounds.map(round => {
            if (round.id === roundId) {
                return {
                    ...round,
                    themes: round.themes.map(theme => {
                        if (theme.id === themeId) {
                            return {
                                ...theme,
                                questions: [
                                    ...theme.questions,
                                    { id: Date.now(), value: '', type: '1', content: '', answer: '' }
                                ]
                            };
                        }
                        return theme;
                    })
                };
            }
            return round;
        });
        setUpdatedRounds(newRounds);
    };

    const handleQuestionChange = (roundId, themeId, questionId, field, value) => {
        const newRounds = updatedRounds.map(round => {
            if (round.id === roundId) {
                return {
                    ...round,
                    themes: round.themes.map(theme => {
                        if (theme.id === themeId) {
                            return {
                                ...theme,
                                questions: theme.questions.map(question =>
                                    question.id === questionId
                                        ? { ...question, [field]: value }
                                        : question
                                )
                            };
                        }
                        return theme;
                    })
                };
            }
            return round;
        });
        setUpdatedRounds(newRounds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('updatedRounds', updatedRounds)
            await CreateQuestionsHelper(updatedRounds, dispatch)
            dispatch(updateStep())
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="quiz-form">
            {updatedRounds.map((round) => (
                <div key={round.id} className="form-group round-section">
                    <h3 className="form-label">{`Round ${round.order} - ${round.round}`}</h3>
                    {round.themes.map((theme) => (
                        <div key={theme.id} className="form-group theme-section">
                            <h4 className="form-label">{`Theme: ${theme.theme}`}</h4>
                            <button
                                onClick={() => addQuestion(round.id, theme.id)}
                                className="form-button add-question-button"
                                style={{ marginBottom: '1rem' }}
                            >
                                Додати питання
                            </button>
                            <ul className="questions-list">
                                {theme.questions.map((question) => (
                                    <li key={question.id} className="question-item">
                                        <div className="question-field">
                                            <label className="question-label">Price</label>
                                            <input
                                                type="number"
                                                value={question.value}
                                                onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'value', e.target.value)}
                                                placeholder="Вартість питання"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="question-field">
                                            <label className="question-label">Type</label>
                                            <select
                                                value={question.type}
                                                onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'type', e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="1">Text</option>
                                                <option value="2">Image</option>
                                                <option value="3">Audio</option>
                                                <option value="4">Video</option>
                                            </select>
                                        </div>
                                        <div className="question-field">
                                            <label className="question-label">Question</label>
                                            {question.type === "1" ? (
                                                <input
                                                    type="text"
                                                    value={question.content}
                                                    onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'content', e.target.value)}
                                                    placeholder="Питання"
                                                    className="form-input"
                                                />
                                            ) : (
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'content', e.target.files[0])}
                                                    className="form-input"
                                                />
                                            )}
                                        </div>
                                        <div className="question-field">
                                            <label className="question-label">Answer</label>
                                            <input
                                                type="text"
                                                value={question.answer}
                                                onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'answer', e.target.value)}
                                                placeholder="Відповідь"
                                                className="form-input"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
            <form onSubmit={handleSubmit} className="quiz-form">
                <button type="submit" className="form-button">Next</button>
            </form>
        </div>
    );
}
