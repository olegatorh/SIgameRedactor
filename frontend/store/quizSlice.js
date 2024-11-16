import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from "@/app/services/axiosInstance";


export const createQuiz = createAsyncThunk('quizApi/createQuiz', async (quizData, {rejectWithValue, getState}) => {
    try {
        const {auth} = getState();
        const response = await axiosInstance.post(`/quiz/packages/`, quizData, {
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
            },
        });
        console.log(response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const createTags = createAsyncThunk('quizApi/createTag', async (quizData, {rejectWithValue, getState}) => {
    try {
        const {auth} = getState();
        console.log('tag request', quizData)
        const response = await axiosInstance.post('quiz/tag/', quizData, {
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
            },
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createRound = createAsyncThunk('quizApi/createRound', async (quizData, {rejectWithValue, getState}) => {
    try {
        const {auth} = getState();
        console.log('create round', quizData)
        const response = await axiosInstance.post('quiz/round/', quizData, {
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
            },
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createTheme = createAsyncThunk('quizApi/createTheme', async (quizData, {rejectWithValue, getState}) => {
    try {
        const {auth} = getState();
        console.log('create theme', quizData)
        const response = await axiosInstance.post('quiz/theme/', quizData, {
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
            },
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

// export const createTags = createAsyncThunk('quizApi/createTag', async (quizData, {rejectWithValue, getState}) => {
//     try {
//         const {auth} = getState();
//         const response = await axiosInstance.post('quiz/tag/', quizData, {
//             headers: {
//                 Authorization: `Bearer ${auth.access_token}`,
//             },
//         })
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }
// })


const quizApiSlice = createSlice({
    name: 'quizApi', initialState: {
        quiz: {},
        current_step: 1,
        isLoading: false,
        error: null,
        successMessage: null
    }, reducers: {
        updateStep: (state) => {
            state.current_step += 1
            state.successMessage = null
            state.error = null
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(createQuiz.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quiz = {...action.payload};
                state.successMessage = "Adding new Quiz successful!";
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Adding new Quiz failed";
            })
            .addCase(createTags.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTags.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quiz = {...state.quiz, 'tags': {...action.payload}};
                state.successMessage = "Adding new tags successful!";
            })
            .addCase(createTags.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Adding new tags failed";
            })
            .addCase(createRound.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createRound.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quiz = {  ...state.quiz,
                rounds: [...(state.quiz.rounds || []), action.payload]};
                state.successMessage = "Adding new round successful!";
            })
            .addCase(createRound.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Adding new round failed";
            })
            .addCase(createTheme.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTheme.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quiz = {  ...state.quiz,
                    rounds: state.quiz.rounds.map(round =>
                    round.id === action.payload.round_id
                        ? { ...round, themes: [...(round.themes || []), action.payload] }
                        : round
                    )
                }
                state.successMessage = "Adding new theme successful!";
            })
            .addCase(createTheme.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Adding new theme failed";
            })

    },
});

export const {updateStep} = quizApiSlice.actions;
export default quizApiSlice.reducer;
