import {createQuestion, createRound, createTheme} from "@/store/quizSlice";




export const CreateRoundsHelper = async (rounds, quizId, dispatch) => {
    try {
        for (const round of rounds) {
            await dispatch(createRound({'round': round.name, 'package_id': quizId})).unwrap();
        }
    } catch (error) {
        console.error("Error creating rounds:", error);
        throw error;
    }
};

export const CreateThemesHelper = async (themesRound, dispatch) => {
    try {
        for (const themes of themesRound) {
            for (const theme of themes) {
                await dispatch(createTheme({
                    'theme': theme.value, 'comments': theme.comment, 'round_id': theme.roundId
                })).unwrap();
            }
        }
    } catch (error) {
        console.error("Error creating rounds:", error);
        throw error;
    }
};


export const CreateQuestionsHelper = async (updatedRounds, dispatch) => {
    try {
        for (const rounds of updatedRounds) {
            for (const themes of rounds.themes) {
                for (const question of themes.questions) {
                    console.log('CreateQuestionsHelper', question)
                    await dispatch(createQuestion({
                        'question': question.content,
                        'question_type': question.type,
                        'question_price': question.value,
                        'answer': question.answer,
                        'theme_id': themes.id,
                        ...(question.file && { 'question_file': question.file })
                })).unwrap();
                }
            }
        }
    } catch (error) {
        console.error("Error creating rounds:", error);
        throw error;
    }
};