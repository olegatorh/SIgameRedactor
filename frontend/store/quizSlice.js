import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from "@/app/services/axiosInstance";
import axios, {create} from "axios";





export const createQuiz = createAsyncThunk('quizApi/createQuiz', async (quizData, {rejectWithValue, getState}) => {
    try {
        const response = await axiosInstance.post(`/quiz/packages/`, quizData, {
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const createTags =
    createAsyncThunk('quizApi/createTag', async (quizData,
                                                 {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('quiz/tag/', quizData, {
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createRound = createAsyncThunk('quizApi/createRound',
    async (quizData, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('quiz/round/', quizData, {
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createTheme =
    createAsyncThunk('quizApi/createTheme', async (quizData, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('quiz/theme/', quizData, {
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


export const createQuestion = createAsyncThunk('quizApi/createQuestion', async (quizData, {
    rejectWithValue
}) => {
    try {
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
        })
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.status);
    }
})


export const downloadQuiz = createAsyncThunk('quizApi/downloadQuiz', async (quizData, {
    rejectWithValue
}) => {
    try {
        const response = await axiosInstance.get(`/quiz/download/${quizData}/`, {
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const updateCurrentStep = createAsyncThunk('quizApi/quiz/updateStep', async (quizData, {
    rejectWithValue
}) => {
    try {
        const response = await axiosInstance.patch(`/quiz/packages/${quizData.id}/`, {'current_step': quizData.current_step});
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getCompletedQuizzes = createAsyncThunk('quizApi/getQuizzes', async (quizData, {
    rejectWithValue
}) => {
    try {
        const response = await axiosInstance.get(`/quiz/completed/`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const deleteQuiz = createAsyncThunk('quizApi/deleteQuiz', async (quizData, {
    rejectWithValue
}) => {
    try {
        const response = await axiosInstance.delete(`quiz/packages/${quizData}/`)
        return { id: quizData, message: response.data.message }
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const getDraftQuiz = createAsyncThunk('quizApi/getDraftQuiz', async (quizData, {
    rejectWithValue
}) => {
    try {
        if (quizData) {
            const response = await axiosInstance.get(`quiz/draft/?${quizData}`)
            return response.data
        } else {
            const response = await axiosInstance.get(`quiz/draft/`)
            return response.data
        }
        } catch (error) {
        return rejectWithValue(error.response.data)
        }
})


const quizApiSlice = createSlice({
    name: 'quizApi', initialState: {
        quiz: {},
        isLoading: false,
        error: null,
        successMessage: null
    }, reducers: {
        updateStep : (state) => {
          state.quiz.current_step += 1
        },
        resetQuizState: (state) => {
              state.quiz = {};
              state.isLoading = false;
              state.error = null;
              state.successMessage = null;
    },
        updateCurrentQuiz : (state, action) => {
              state.quiz = {...action.payload.payload}
              state.isLoading = false;
              state.error = null;
              state.successMessage = null;
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
            .addCase(getDraftQuiz.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDraftQuiz.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = "getting draft Quizzes successful!";
            })
            .addCase(getDraftQuiz.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "getting draft Quizzes failed!";
            })
            .addCase(deleteQuiz.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteQuiz.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = "getting draft Quizzes successful!";
                if (state.quiz.id === action.payload.id) {
                    state.quiz = {}
                    state.isLoading = false;
                    state.error = null;
                    state.successMessage = null;
                }
            })
            .addCase(deleteQuiz.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "deleting draft Quiz failed!";
            })
    },
});

export const {updateStep, resetQuizState, updateCurrentQuiz} = quizApiSlice.actions;
export default quizApiSlice.reducer;



