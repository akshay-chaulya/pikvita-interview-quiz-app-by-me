import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Type definitions
interface Answer {
  [key: string]: boolean;
}

interface Question {
  id: string;
  question: string;
  answers: { [key: string]: string | null };
  correct_answers: { [key: string]: string };
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: { [questionId: string]: Answer };
  isSubmitted: boolean;
  score: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const STORAGE_KEY = "quizState";

// Async thunk for fetching questions
export const fetchQuestions = createAsyncThunk<Question[]>(
  "quiz/fetchQuestions",
  async () => {
    const response = await fetch(
      "https://quizapi.io/api/v1/questions?apiKey=M7RT7dicTsTgRWHPM4LqiwuNuiHK9VmtPIuFZOnY&category=code&difficulty=Easy&limit=10&tags=JavaScript"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data: Question[] = await response.json();
    return data;
  }
);

// Load state from localStorage
const loadState = (): QuizState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as QuizState;
  } catch (err) {
    return undefined;
  }
};

// Initial state
const initialState: QuizState = loadState() || {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  isSubmitted: false,
  score: 0,
  status: "idle",
  error: null,
};

// Slice
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    selectAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) => {
      const { questionId, answerId } = action.payload;
      if (!state.isSubmitted) {
        state.userAnswers[questionId] = {
          ...Object.fromEntries(
            Object.keys(state.questions[state.currentQuestionIndex].answers)
              .filter(
                (key) =>
                  state.questions[state.currentQuestionIndex].answers[key]
              )
              .map((key) => [key, false])
          ),
          [answerId]: !state.userAnswers[questionId]?.[answerId],
        };
      }
    },
    submitQuiz: (state) => {
      let correct = 0;
      state.questions.forEach((question) => {
        const userAnswer = state.userAnswers[question.id] || {};
        let isCorrect = true;

        Object.entries(question.correct_answers || {}).forEach(
          ([key, value]) => {
            const answerId = key.replace("_correct", "");
            if ((value === "true") !== (userAnswer[answerId] === true)) {
              isCorrect = false;
            }
          }
        );

        if (isCorrect) correct++;
      });

      state.score = (correct / state.questions.length) * 100;
      state.isSubmitted = true;
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.isSubmitted = false;
      state.score = 0;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchQuestions.fulfilled,
        (state, action: PayloadAction<Question[]>) => {
          state.status = "succeeded";
          state.questions = action.payload;
        }
      )
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { setCurrentQuestion, selectAnswer, submitQuiz, resetQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;
