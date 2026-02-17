import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Course {
  id: string;
  title: string;
}

const QuizPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<{answer: number, correct: boolean}[]>([]);

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("id", courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });

  const questions: Question[] = [
    {
      question: "AI systems primarily work by:",
      options: [
        "Thinking like humans",
        "Predicting patterns from data",
        "Storing answers",
        "Browsing the internet"
      ],
      correctAnswer: 1
    },
    {
      question: "What is AI hallucination?",
      options: [
        "AI refuses to answer",
        "AI generates fake or incorrect information",
        "AI becomes emotional",
        "AI stops working"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following improves AI output most?",
      options: [
        "Longer prompts",
        "Clear instructions",
        "Repeating the same prompt",
        "Using complex words"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the key takeaway about AI?",
      options: [
        "AI replaces human responsibility",
        "AI knows everything",
        "AI amplifies human capability",
        "AI works without human input"
      ],
      correctAnswer: 2
    },
    {
      question: "What is prompt iteration?",
      options: [
        "Using the same prompt repeatedly",
        "Improving AI outputs step by step",
        "Writing very long prompts",
        "Using complex technical terms"
      ],
      correctAnswer: 1
    }
  ];

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, { answer: selectedAnswer, correct: isCorrect }]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answeredQuestions[currentQuestion - 1]?.answer ?? null);
      setSubmitted(currentQuestion - 1 < answeredQuestions.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const isQuizComplete = answeredQuestions.length === questions.length;

  if (isQuizComplete) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {passed ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                    Quiz Completed!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-orange-600">
                    <XCircle className="w-8 h-8" />
                    Quiz Completed
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {course.title} - Final Assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {score} / {questions.length}
                </div>
                <div className="text-xl text-gray-600 mb-4">
                  {percentage.toFixed(1)}%
                </div>
                <Progress value={percentage} className="mb-4" />
                <p className="text-lg">
                  {passed 
                    ? "Congratulations! You've successfully completed the course." 
                    : "Keep learning! Review the course material and try again."}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Minimum passing score: 70%
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Review your answers:</h3>
                {questions.map((question, index) => {
                  const userAnswer = answeredQuestions[index];
                  const isCorrect = userAnswer?.correct;
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{index + 1}. {question.question}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Your answer: {question.options[userAnswer?.answer ?? 0]}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600 mt-1">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <Button onClick={resetQuiz} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={() => navigate(`/dashboard`)}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/course/${courseId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">Final Quiz - Module 1</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
              <span className="text-sm text-gray-500">
                Score: {score}/{answeredQuestions.length}
              </span>
            </div>
            <Progress value={progress} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {currentQuestionData.question}
              </h3>
              
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => {
                  if (!submitted) {
                    setSelectedAnswer(parseInt(value));
                  }
                }}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;

                  let optionClass = "flex items-center space-x-3 p-4 rounded-lg border transition-colors ";
                  
                  if (submitted) {
                    if (index === currentQuestionData.correctAnswer) {
                      optionClass += "bg-green-50 border-green-200";
                    } else if (index === selectedAnswer && index !== currentQuestionData.correctAnswer) {
                      optionClass += "bg-red-50 border-red-200";
                    } else {
                      optionClass += "bg-gray-50 border-gray-200 opacity-50";
                    }
                  } else {
                    optionClass += isSelected
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                      : "bg-white border-gray-200 hover:bg-gray-50";
                  }

                  return (
                    <Label
                      key={index}
                      htmlFor={`option-${index}`}
                      className={optionClass + (submitted ? " cursor-not-allowed" : " cursor-pointer")}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        disabled={submitted}
                        className={
                          submitted && index === currentQuestionData.correctAnswer
                            ? "text-green-600 border-green-600"
                            : "text-blue-600 border-blue-600"
                        }
                      />
                      <span className="text-base flex-1">{option}</span>
                      {submitted && index === currentQuestionData.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {submitted && index === selectedAnswer && index !== currentQuestionData.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            {submitted && (
              <div className={`p-4 rounded-lg ${
                selectedAnswer === currentQuestionData.correctAnswer 
                  ? "bg-green-50 text-green-800" 
                  : "bg-red-50 text-red-800"
              }`}>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  {selectedAnswer === currentQuestionData.correctAnswer ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Incorrect
                    </>
                  )}
                </div>
                {selectedAnswer !== currentQuestionData.correctAnswer && (
                  <p className="text-sm">
                    The correct answer is: <strong>{currentQuestionData.options[currentQuestionData.correctAnswer]}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {!submitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {isLastQuestion ? "Finish Quiz" : "Next Question"}
                  {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
