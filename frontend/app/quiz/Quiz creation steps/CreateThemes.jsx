import { useState, useEffect } from "react";
import './CreateQuiz.css';
import { useDispatch, useSelector } from "react-redux";
import { updateStep } from "@/store/quizSlice";
import {CreateThemesHelper} from "@/app/services/QuizCreateHelper";

export default function CreateThemes() {
    const rounds = useSelector((state) => state.quizApi.quiz.rounds);
    const [themes, setThemes] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (rounds) {
            setThemes(rounds.map(round => {
                if (round.final) {
                    return [{ roundId: round.id, value: '', comment: '' }];
                }
                return [];
            }));
        }
    }, [rounds]);

    const addTopic = (roundIndex) => {
        const newThemes = [...themes];
        newThemes[roundIndex].push({roundId: rounds[roundIndex].id, value: '', comment: ''});
        setThemes(newThemes);
    };

    const removeTopic = (roundIndex, topicIndex) => {
        const newThemes = [...themes];
        newThemes[roundIndex].splice(topicIndex, 1);
        setThemes(newThemes);
    };

    const handleTopicChange = (roundIndex, topicIndex, key, value) => {
        const newThemes = [...themes];
        newThemes[roundIndex][topicIndex] = {...newThemes[roundIndex][topicIndex], [key]: value};
        setThemes(newThemes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('themes', themes);
            await CreateThemesHelper(themes, dispatch);
            dispatch(updateStep())
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="quiz-form">
            {rounds && rounds.map((round, index) => (
                <div key={index} className="form-group round-section">
                    <h3 className="form-label">{`Round ${round.order} - ${round.round}`}</h3>
                    {round.final && (<h3 className="form-label">This is a final round!</h3>)}

                    <ul className="topics-list">
                        {round.final ? (
                            <li className="topic-item">
                                <input
                                    type="text"
                                    value={themes[index]?.[0]?.value || ''}
                                    onChange={(e) => handleTopicChange(index, 0, 'value', e.target.value)}
                                    placeholder="Назва теми"
                                    className="form-input"
                                    style={{marginRight: '0.5rem'}}
                                />
                                <input
                                    type="text"
                                    value={themes[index]?.[0]?.comment || ''}
                                    onChange={(e) => handleTopicChange(index, 0, 'comment', e.target.value)}
                                    placeholder="Коментар"
                                    className="form-input"
                                    style={{marginRight: '0.5rem'}}
                                />
                            </li>
                        ) : (
                            // Render multiple topic fields with add/remove options for non-final rounds
                            themes[index]?.map((topic, topicIndex) => (
                                <li key={topicIndex} className="topic-item">
                                    <input
                                        type="text"
                                        value={topic.value}
                                        onChange={(e) => handleTopicChange(index, topicIndex, 'value', e.target.value)}
                                        placeholder="Назва теми"
                                        className="form-input"
                                        style={{marginRight: '0.5rem'}}
                                    />
                                    <input
                                        type="text"
                                        value={topic.comment}
                                        onChange={(e) => handleTopicChange(index, topicIndex, 'comment', e.target.value)}
                                        placeholder="Коментар"
                                        className="form-input"
                                        style={{marginRight: '0.5rem'}}
                                    />
                                    <button
                                        onClick={() => removeTopic(index, topicIndex)}
                                        className="form-button remove-last-button"
                                    >
                                        Забрати тему
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>

                    {/* Show add topic button only for non-final rounds */}
                    {!round.final && (
                        <button
                            onClick={() => addTopic(index)}
                            className="form-button add-round-button"
                            style={{marginBottom: '1rem'}}
                        >
                            Додати тему
                        </button>
                    )}
                </div>
            ))}

            <form onSubmit={handleSubmit} className="quiz-form">
                <button type="submit" className="form-button">Next</button>
            </form>
        </div>
    );
}
