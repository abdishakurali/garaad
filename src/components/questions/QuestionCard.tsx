import { QuestionExplanation } from "./QuestionExplanation";
import Image from 'next/image';

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: number;
    question_text: string;
    image: string | null;
    question_type: string;
    options: Option[];
    correct_answer: Option[];
    explanation: string;
    difficulty: string;
    hints: string[];
    solution_steps: string[];
    created_at: string;
}

interface QuestionCardProps {
    question: Question;
    onAnswerSelect: (optionId: string) => void;
    selectedAnswer?: string;
}

export function QuestionCard({
    question,
    onAnswerSelect,
    selectedAnswer,
}: QuestionCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">
                    {question.question_text}
                </h2>
                <QuestionExplanation explanation={question.explanation} />
            </div>

            {question.image && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                        src={question.image}
                        alt="Question diagram"
                        width={500}
                        height={300}
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            )}

            <div className="space-y-3">
                {question.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onAnswerSelect(option.id)}
                        className={`w-full p-4 rounded-lg border transition-colors ${selectedAnswer === option.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedAnswer === option.id
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {option.id.toUpperCase()}
                            </div>
                            <span className="text-gray-700">{option.text}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
} 