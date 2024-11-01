"use client";

import { useEffect } from "react";
import { Progress, Button, Card, Space } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  fetchQuestions,
  setCurrentQuestion,
  selectAnswer,
  submitQuiz,
  STORAGE_KEY,
  resetQuiz,
} from "@/lib/features/quiz/quizSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ResultsChart from "./ResultChart";

const Quiz = () => {
  const dispatch = useAppDispatch();
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    score,
    status,
  } = useAppSelector((state) => state.quiz);

  // Fetch questions when status is idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuestions());
    }
  }, [status, dispatch]);

  // Persist quiz state to localStorage for session continuity
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        questions,
        currentQuestionIndex,
        userAnswers,
        isSubmitted,
        score,
        status,
      })
    );
  }, [
    questions,
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    score,
    status,
  ]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg p-6">
        {/* Header with Quiz title and Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl md:text-2xl font-semibold">
              JavaScript Quiz
            </h1>
            <span className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress percent={progress} status="active" />
        </div>

        {/* Question display with answer options */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{currentQuestion?.question}</h2>
          <Space direction="vertical" className="w-full">
            {Object.entries(currentQuestion?.answers || {}).map(
              ([key, value]) => {
                if (!value) return null;
                const isSelected = userAnswers[currentQuestion?.id]?.[key];
                const isCorrect =
                  isSubmitted &&
                  currentQuestion?.correct_answers[`${key}_correct`] === "true";

                return (
                  <Button
                    key={key}
                    type={isSelected ? "primary" : "default"}
                    className={`w-full text-left ${
                      isSubmitted && isCorrect ? "border-green-500" : ""
                    }`}
                    onClick={() =>
                      dispatch(
                        selectAnswer({
                          questionId: currentQuestion.id,
                          answerId: key,
                        })
                      )
                    }
                    disabled={isSubmitted}
                  >
                    <div className="flex justify-between items-center">
                      <span>{value}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircleOutlined className="text-green-500" />
                      )}
                    </div>
                  </Button>
                );
              }
            )}
          </Space>
        </div>

        {/* Display Results Chart after submission */}
        {isSubmitted && <ResultsChart score={score} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            icon={<LeftOutlined />}
            onClick={() =>
              dispatch(setCurrentQuestion(currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            isSubmitted ? (
              <Button type="primary" onClick={() => dispatch(resetQuiz())}>
                Start a new quiz
              </Button>
            ) : (
              <Button type="primary" onClick={() => dispatch(submitQuiz())}>
                Submit Quiz
              </Button>
            )
          ) : (
            <Button
              icon={<RightOutlined />}
              onClick={() =>
                dispatch(setCurrentQuestion(currentQuestionIndex + 1))
              }
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Quiz;
