import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from "@/app/services/axiosInstance";
import {logout} from "@/store/authSlice";


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


export const createQuestion = createAsyncThunk('quizApi/createQuestion', async (quizData, {
    rejectWithValue, getState
}) => {
    try {
        const {auth} = getState();
        console.log('create question', quizData)
        const formData = new FormData();
        formData.append('question', quizData.question);
        formData.append('question_type', quizData.question_type);
        formData.append('content_type', quizData.content_type);
        formData.append('question_price', quizData.question_price);
        formData.append('answer', quizData.answer);
        formData.append('theme_id', quizData.theme_id);
        formData.append('answer_time', quizData.answer_time);
        if (quizData.question_file) {
            formData.append('question_file', quizData.question_file);
        }
        if (quizData.question_transfer > 0) {
            formData.append('question_transfer', quizData.question_transfer);
        }
        if (quizData.real_price) {
            formData.append('real_price', quizData.real_price);
        }

        const response = await axiosInstance.post('quiz/question/', formData, {
            headers: {
                Authorization: `Bearer ${auth.access_token}`, 'Content-Type': 'multipart/form-data',
            },
        })
        console.log('created question ', response.data)
        return response.data;
    } catch (error) {
        console.log('create questionm ', error.response)
        return rejectWithValue(error.response.status);
    }
})


export const downloadQuiz = createAsyncThunk('quizApi/downloadQuiz', async (quizData, {
    rejectWithValue,
    getState
}) => {
    try {
        const {auth} = getState();
        const response = await axiosInstance.get(`/quiz/download/${quizData}/`, {
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

export const getCompletedQuizzes = createAsyncThunk('quizApi/getQuizzes', async (quizData, {
    rejectWithValue,
    getState
}) => {
    try {
        const {auth} = getState();
        const response = await axiosInstance.get(`/quiz/completed/`, {
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
        },
        resetQuizState: (state) => {
              state.quiz = {};
              state.current_step = 1;
              state.isLoading = false;
              state.error = null;
              state.successMessage = null;
    }
    }, extraReducers: (builder) => {
        builder
             .addCase(logout, (state) => {
                quizApiSlice.caseReducers.resetQuizState(state);
            })
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
                state.quiz = {
                    ...state.quiz, rounds: [...(state.quiz.rounds || []), action.payload]
                };
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
                state.quiz = {
                    ...state.quiz, rounds: state.quiz.rounds.map(round => round.id === action.payload.round_id ? {
                        ...round, themes: [...(round.themes || []), action.payload]
                    } : round)
                }
                state.successMessage = "Adding new theme successful!";
            })
            .addCase(createTheme.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Adding new theme failed";
            })
            .addCase(createQuestion.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quiz = {
                    ...state.quiz, rounds: state.quiz.rounds.map(round => {
                        const updatedThemes = round.themes.map(theme => theme.id === action.payload.theme_id ? {
                            ...theme, questions: [...(theme.questions || []), action.payload]
                        } : theme);

                        return {
                            ...round, themes: updatedThemes
                        };
                    })
                };

                state.successMessage = "Adding new question successful!";
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Adding new question failed";
            })
            .addCase(downloadQuiz.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(downloadQuiz.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = "Download new Quiz successful!";
            })
            .addCase(downloadQuiz.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Download new Quiz failed";
            })
            .addCase(getCompletedQuizzes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCompletedQuizzes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = "getting all Quizzes successful!";
            })
            .addCase(getCompletedQuizzes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "getting all Quizzes failed!";
            })
    },
});

export const {updateStep, resetQuizState} = quizApiSlice.actions;
export default quizApiSlice.reducer;
