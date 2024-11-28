import {createQuestion, createRound, createTheme} from "@/store/quizSlice";




export const CreateRoundsHelper = async (rounds, quizId, isFinalRound, dispatch) => {
    try {
        console.log(rounds.length)
        console.log(rounds)
        console.log(isFinalRound)
        for (const [index, round] of rounds.entries()) {
            const isLastRound = index === rounds.length - 1;
            const body = {
                round: round.name,
                package_id: quizId,
                ...(isFinalRound && isLastRound && { final: true }) // Add is_final only if conditions are met
            };

            await dispatch(createRound(body)).unwrap();
        }
    } catch (error) {
        console.error("Error creating rounds:", error);
        throw error;
    }
};

export const CreateThemesHelper = async (themesRound, dispatch) => {
    try {
        console.log('themesRound', themesRound)
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
    console.log('updatedRounds', updatedRounds)
    try {
        for (const rounds of updatedRounds) {
            for (const themes of rounds.themes) {
                for (const question of themes.questions) {
                    console.log('CreateQuestionsHelper', question)
                    await dispatch(createQuestion({
                        'question': question.content,
                        'question_type': question.question_type,
                        'content_type': question.content_type,
                        'question_price': question.value,
                        'answer': question.answer,
                        'theme_id': themes.id,
                        'answer_time': question.answer_time,
                        ...( (question.question_type === '3' || question.question_type === '4') && question.question_transfer === 0
                            ? { 'question_transfer': 1 }
                            : { 'question_transfer': question.question_transfer }),
                        ...(question.question_type_price === '2' && {'real_price': question.question_real_price}),
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