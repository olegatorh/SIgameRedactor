import { useState, useEffect } from "react";
import './CreateQuiz.css';
import { useDispatch, useSelector } from "react-redux";
import { updateStep } from "@/store/quizSlice";
import {CreateRoundsHelper, CreateThemesHelper} from "@/app/services/roundCreateHelper";

export default function CreateThemes() {
    const rounds = useSelector((state) => state.quizApi.quiz.rounds);
    const [themes, setThemes] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (rounds) {
            setThemes(rounds.map(round => []));
        }
    }, [rounds]);

    const addTopic = (roundIndex) => {
        const newThemes = [...themes];
        newThemes[roundIndex].push({ roundId: rounds[roundIndex].id, value: '', comment: '' });
        setThemes(newThemes);
    };

    const removeTopic = (roundIndex, topicIndex) => {
        const newThemes = [...themes];
        newThemes[roundIndex].splice(topicIndex, 1);
        setThemes(newThemes);
    };

    const handleTopicChange = (roundIndex, topicIndex, key, value) => {
        const newThemes = [...themes];
        newThemes[roundIndex][topicIndex] = { ...newThemes[roundIndex][topicIndex], [key]: value };
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
                    <button
                        onClick={() => addTopic(index)}
                        className="form-button add-round-button"
                        style={{ marginBottom: '1rem' }}
                    >
                        Додати тему
                    </button>
                    <ul className="topics-list">
                        {themes[index]?.map((topic, topicIndex) => (
                            <li key={topicIndex} className="topic-item">
                                <input
                                    type="text"
                                    value={topic.value}
                                    onChange={(e) => handleTopicChange(index, topicIndex, 'value', e.target.value)}
                                    placeholder="Назва теми"
                                    className="form-input"
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <input
                                    type="text"
                                    value={topic.comment}
                                    onChange={(e) => handleTopicChange(index, topicIndex, 'comment', e.target.value)}
                                    placeholder="Коментар"
                                    className="form-input"
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <button
                                    onClick={() => removeTopic(index, topicIndex)}
                                    className="form-button remove-last-button"
                                >
                                    Забрати тему
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <form onSubmit={handleSubmit} className="quiz-form">
                <button type="submit" className="form-button">Next</button>
            </form>
        </div>
    );
}
