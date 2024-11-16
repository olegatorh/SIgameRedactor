import {createRound} from "@/store/quizSlice";
import {createTheme} from "@/store/quizSlice";

export const CreateRoundsHelper = async (rounds, quizId, dispatch) => {
    try {
        for (const round of rounds) {
            await dispatch(createRound({ 'round': round.name, 'package_id': quizId })).unwrap();
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
                    'theme': theme.value,
                    'comments': theme.comment,
                    'round_id': theme.roundId
                })).unwrap();
            }
        }
    } catch (error) {
        console.error("Error creating rounds:", error);
        throw error;
    }
};