import {useEffect, useState} from "react";
import './CreateQuiz.css';
import {useDispatch, useSelector} from "react-redux";
import {updateStep} from "@/store/quizSlice";
import {CreateQuestionsHelper} from "@/app/services/QuizCreateHelper";

export default function CreateQuestions() {
    const rounds = useSelector((state) => state.quizApi.quiz.rounds);
    const [updatedRounds, setUpdatedRounds] = useState([]);
    const dispatch = useDispatch()
    const maxFileSize = 50 * 1024 * 1024



    useEffect(() => {
        if (rounds && rounds.length > 0) {
            setUpdatedRounds(rounds.map(round => ({
                ...round, themes: round.themes.map(theme => ({
                    ...theme, questions: theme.questions || []
                }))
            })));
        }
    }, [rounds]);

    const addQuestion = (roundId, themeId) => {
        const newRounds = updatedRounds.map(round => {
            if (round.id === roundId) {
                return {
                    ...round, themes: round.themes.map(theme => {
                        if (theme.id === themeId) {
                            return {
                                ...theme,
                                questions: [...theme.questions, {
                                    id: Date.now(),
                                    value: '',
                                    content_type: '1',
                                    question_type: '1',
                                    content: '',
                                    answer: '',
                                    file: null,
                                    question_transfer: 0,
                                    question_real_price: 0,
                                    question_type_price: 0,
                                    answer_time: 30
                                }]
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

    const removeQuestion = (roundId, themeId, questionId) => {
        const newRounds = updatedRounds.map(round => {
            if (round.id === roundId) {
                return {
                    ...round, themes: round.themes.map(theme => {
                        if (theme.id === themeId) {
                            return {
                                ...theme, questions: theme.questions.filter(question => question.id !== questionId)
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
                    ...round, themes: round.themes.map(theme => {
                        if (theme.id === themeId) {
                            return {
                                ...theme,
                                questions: theme.questions.map(question => question.id === questionId ? {
                                    ...question,
                                    [field]: value
                                } : question)
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


    const validateQuestions = () => {
        for (let round of updatedRounds) {
            for (let theme of round.themes) {
                for (let question of theme.questions) {
                    if (!question.content || !question.answer || !question.value) {
                        alert(`Please fill all required fields in round ${round.order}, theme "${theme.theme}".`);
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateQuestions()) {
            return;
        }
        try {
            console.log('updatedRounds', updatedRounds);
            await CreateQuestionsHelper(updatedRounds, dispatch);
            dispatch(updateStep());
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRangeChange = (roundId, themeId, questionId, e) => {
        const newTime = e.target.value;
        handleQuestionChange(roundId, themeId, questionId, 'answer_time', newTime);
    };

    const handleFileValidation = (e, roundId, themeId, questionId) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > maxFileSize) {
                alert(`File size should not exceed 50 MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
                e.target.value = ''
                return;
            }
            handleQuestionChange(roundId, themeId, questionId, 'file', file)

        }
    }

    return (<div className="quiz-form">
            {updatedRounds.map((round) => (<div key={round.id} className="form-group round-section">
                    <h3 className="form-label">{`Round ${round.order} - ${round.round}`}</h3>
                    {round.themes.map((theme) => (<div key={theme.id} className="form-group theme-section">
                        <h4 className="form-label">{`Theme: ${theme.theme}`}</h4>
                        <ul className="questions-list">
                            {theme.questions.map((question) => (<li key={question.id} className="question-item">
                                <div className="question-field">
                                    <label className="question-label">Price</label>
                                    <input
                                        type="number"
                                        value={question.value}
                                        onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'value', e.target.value)}
                                        placeholder="Вартість питання"
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="question-field">
                                    <label className="question-label">Content Type</label>
                                    <select
                                        value={question.content_type}
                                        onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'content_type', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="1">Text</option>
                                        <option value="2">Image</option>
                                        <option value="3">Audio</option>
                                        <option value="4">Video</option>
                                    </select>
                                </div>
                                {question.content_type !== "1" ? (<input
                                    type="file"
                                    onChange={(e) => handleFileValidation(e, round.id, theme.id, question.id)}
                                    className="form-input"
                                />) : <></>}
                                <div className="question-field">
                                    <label className="question-label">Question Type</label>
                                    <select
                                        value={question.question_type}
                                        onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'question_type', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="1">Simple</option>
                                        <option value="2">Stake</option>
                                        <option value="3">Secret</option>
                                        <option value="4">SecretPublicPrice</option>
                                        <option value="5">noRisk</option>
                                    </select>
                                </div>
                                {question.question_type === "3" || question.question_type === "4" ? (
                                    <div className="question-field">
                                        <label className="question-label">Question transfer</label>
                                        <select
                                            value={question.question_transfer}
                                            onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'question_transfer', e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="1">All</option>
                                            <option value="2">All except yourself</option>
                                        </select>
                                        <label className="question-label">Question cost type</label>
                                        <select
                                            value={question.question_type_price}
                                            onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'question_type_price', e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="1">value from Price field</option>
                                            <option value="2">your fixed value</option>
                                        </select>
                                        {question.question_type_price === '2' ? (<input
                                            type="number"
                                            value={question.question_real_price}
                                            onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'question_real_price', e.target.value)}
                                            placeholder="Real question price"
                                            className="form-input"
                                        />) : <></>}
                                    </div>

                                ) : <></>}
                                <div className="question-field">
                                    <label className="question-label">Question</label>
                                    <input
                                        type="text"
                                        value={question.content}
                                        onChange={(e) => handleQuestionChange(round.id, theme.id, question.id, 'content', e.target.value)}
                                        placeholder="Питання"
                                        className="form-input"
                                    />
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
                                    <div className="range-container">
                                        <label htmlFor="timeRange" className="range-label">Select answer time
                                            (seconds):</label>
                                        <input
                                            type="range"
                                            id="timeRange"
                                            name="timeRange"
                                            min="5"
                                            max="100"
                                            value={question.answer_time}
                                            onChange={(e) => handleRangeChange(round.id, theme.id, question.id, e)}
                                            className="styled-range"

                                        />
                                        <span className="range-value">{question.answer_time || 30}s</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeQuestion(round.id, theme.id, question.id)}
                                    className="form-button remove-question-button"
                                    style={{marginTop: '1rem'}}
                                >
                                    Delete question
                                </button>
                            </li>))}
                        </ul>
                        <button
                            onClick={() => addQuestion(round.id, theme.id)}
                            className="form-button"
                            style={{marginBottom: '1rem'}}
                        >
                            Add question
                        </button>
                    </div>))}
            </div>))}
        <form onSubmit={handleSubmit} className="quiz-form">
            <button type="submit" className="form-button">Next</button>
        </form>
    </div>);
}
