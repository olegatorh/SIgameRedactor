import {useState} from "react";
import './CreateQuiz.css';
import {useDispatch, useSelector} from "react-redux";
import {CreateRoundsHelper} from "@/app/services/QuizCreateHelper";
import {updateStep} from "@/store/quizSlice";

export default function CreateRounds() {
    const [roundData, setRoundData] = useState([{name: ''}]);
    const dispatch = useDispatch();
    const quizId = useSelector((state) => state.quizApi.quiz.id);
    const handleRoundNameChange = (index, value) => {
        const updatedRounds = [...roundData];
        updatedRounds[index].name = value;
        setRoundData(updatedRounds);
    };

    const addRound = () => {
        setRoundData([...roundData, {name: ''}]);
    };

    const removeLastRound = () => {
        if (roundData.length > 1) {
            setRoundData(roundData.slice(0, -1));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CreateRoundsHelper(roundData, quizId, dispatch);
            console.log("Rounds created successfully:");
            dispatch(updateStep())
        } catch (error) {
            console.error("Failed to create rounds:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="quiz-form">
            {roundData.map((round, index) => (
                <div key={index} className="form-group">
                    <label htmlFor={`round-${index}`} className="form-label">
                        Round {index + 1} Name:
                    </label>
                    <input
                        type="text"
                        id={`round-${index}`}
                        className="form-input"
                        value={round.name}
                        onChange={(e) => handleRoundNameChange(index, e.target.value)}
                        required
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={addRound}
                className="form-button"
                style={{marginBottom: '1rem'}}
            >
                Add Round
            </button>

            {roundData.length > 1 && (
                <button
                    type="button"
                    onClick={removeLastRound}
                    className="form-button remove-last-button"
                    style={{marginBottom: '1rem'}}
                >
                    Remove Last Round
                </button>
            )}

            <button type="submit" className="form-button">Next</button>
        </form>
    );
}
