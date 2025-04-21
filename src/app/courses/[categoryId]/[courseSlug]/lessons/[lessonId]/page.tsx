"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { fetchLesson, submitAnswer } from '@/store/features/learningSlice';
import AnswerFeedback from '@/components/AnswerFeedback';
import LessonHeader from '@/components/LessonHeader';
import type { LessonContentBlock, ProblemContent, TextContent } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle, Scale, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ScaleBalanceProblem {
    equation: string;
    steps: string[];
}

interface ScaleBalanceContent {
    type: 'scale_balance';
    problems: ScaleBalanceProblem[];
    instructions: string;
}

const ScaleBalanceInteractive: React.FC<{
    content: ScaleBalanceContent;
    onComplete: () => void;
}> = ({ content, onComplete }) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [showSolution, setShowSolution] = useState(false);

    const currentProblem = content.problems[currentProblemIndex];

    const handleNextProblem = () => {
        if (currentProblemIndex < content.problems.length - 1) {
            setCurrentProblemIndex(prev => prev + 1);
            setCurrentStepIndex(-1);
            setShowSolution(false);
        } else {
            onComplete();
        }
    };

    const handleShowNextStep = () => {
        if (currentStepIndex < currentProblem.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            setShowSolution(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold">Scale Balance Exercise</h3>
                <p className="text-lg">{content.instructions}</p>
            </div>

            <div className="p-6 border rounded-lg bg-gray-50">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Problem {currentProblemIndex + 1} of {content.problems.length}
                        </span>
                        <Scale className="h-6 w-6 text-primary" />
                    </div>

                    <div className="text-2xl font-semibold text-center py-4">
                        {currentProblem.equation}
                    </div>

                    <div className="space-y-3">
                        {currentStepIndex >= 0 && (
                            <div className="space-y-2">
                                <p className="font-medium">Steps:</p>
                                {currentProblem.steps.slice(0, currentStepIndex + 1).map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <MinusCircle className="h-4 w-4 text-primary" />
                                        {step}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {showSolution && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <p className="text-green-700 font-medium">Solution Complete!</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {!showSolution && (
                        <Button
                            onClick={handleShowNextStep}
                            className="flex-1"
                        >
                            {currentStepIndex === -1 ? 'Start Solving' : 'Next Step'}
                        </Button>
                    )}
                    {showSolution && (
                        <Button
                            onClick={handleNextProblem}
                            className="flex-1"
                        >
                            {currentProblemIndex < content.problems.length - 1 ? 'Next Problem' : 'Complete Lesson'}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const LessonPage = () => {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const currentLesson = useSelector((state: RootState) => state.learning.currentLesson);
    const answerState = useSelector((state: RootState) => state.learning.answerState);
    const isLoading = useSelector((state: RootState) => state.learning.isLoading);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const continueSound = new Audio('/sounds/continue.mp3');

    useEffect(() => {
        if (params.lessonId) {
            dispatch(fetchLesson(params.lessonId as string));
        }
    }, [dispatch, params.lessonId]);

    const handleContinue = () => {
        const contentBlocks = currentLesson?.content_blocks || [];
        if (contentBlocks.length > 0) {
            continueSound.play();
            setCurrentBlockIndex(prev => Math.min(prev + 1, contentBlocks.length - 1));
            setSelectedOption(null);
            setShowExplanation(false);
        }
    };

    const handleOptionSelect = (option: string) => {
        if (!answerState.lastAttempt) {
            setSelectedOption(option);
        }
    };

    const handleCheckAnswer = () => {
        if (currentLesson && selectedOption) {
            dispatch(submitAnswer({ lessonId: currentLesson.id.toString(), answer: selectedOption }));
        }
    };

    const renderContinueButton = (isLastBlock: boolean) => (
        <Button
            onClick={handleContinue}
            className="px-8 py-6 text-lg rounded-full"
        >
            {isLastBlock ? 'Finish' : 'Continue'}
            <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
    );

    const renderBlock = (block: LessonContentBlock) => {
        const sortedBlocks = [...(currentLesson?.content_blocks || [])].sort((a, b) =>
            (a.order || 0) - (b.order || 0)
        );
        const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;

        switch (block.block_type) {
            case 'problem': {
                let content: ProblemContent;
                try {
                    content = typeof block.content === 'string'
                        ? JSON.parse(block.content) as ProblemContent
                        : block.content as ProblemContent;

                    if (!content || !content.options || !Array.isArray(content.options)) {
                        console.error('Invalid problem content structure:', content);
                        return (
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-muted-foreground">Problem content is not properly formatted</p>
                            </div>
                        );
                    }
                } catch (error) {
                    console.error('Error parsing problem content:', error);
                    return (
                        <div className="p-4 border rounded-lg text-center">
                            <p className="text-muted-foreground">Error loading problem content</p>
                        </div>
                    );
                }

                return (
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold">{content.question}</h2>
                            {content.image && (
                                <img
                                    src={content.image}
                                    alt="Problem illustration"
                                    className="max-w-[400px] mx-auto rounded-lg"
                                />
                            )}
                        </div>

                        <div className="grid gap-3">
                            {content.options.map((option: string) => {
                                const isSelected = option === selectedOption;
                                const wasSelected = option === answerState.lastAttempt;
                                const isCorrect = answerState.showAnswer && option === content.correct_answer;
                                const isIncorrect = answerState.showAnswer && wasSelected && !isCorrect;

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={answerState.showAnswer}
                                        className={cn(
                                            "p-4 text-left rounded-lg border-2 transition-all w-full",
                                            "hover:border-primary/50",
                                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                            isSelected && !answerState.showAnswer && "border-primary",
                                            {
                                                "border-green-500 bg-green-50 text-green-700": isCorrect,
                                                "border-red-500 bg-red-50 text-red-700": isIncorrect
                                            }
                                        )}
                                    >
                                        <span className="text-lg">{option}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {!answerState.showAnswer && selectedOption && (
                                <Button
                                    onClick={handleCheckAnswer}
                                    className="flex-1"
                                >
                                    Check Answer
                                </Button>
                            )}

                            {answerState.showAnswer && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowExplanation(!showExplanation)}
                                        className="flex items-center gap-2"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        Why?
                                    </Button>
                                    <Button
                                        onClick={handleContinue}
                                        className="flex-1"
                                    >
                                        Continue
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>

                        {answerState.showAnswer && showExplanation && content.explanation && (
                            <div className={cn(
                                "p-4 rounded-lg",
                                answerState.isCorrect ? "bg-green-50" : "bg-red-50"
                            )}>
                                <p className="text-lg font-medium mb-2">
                                    {answerState.isCorrect ? "Correct!" : "Incorrect"}
                                </p>
                                <p className="text-lg">{content.explanation}</p>
                            </div>
                        )}
                    </div>
                );
            }
            case 'text': {
                const textContent = typeof block.content === 'string'
                    ? JSON.parse(block.content) as TextContent
                    : block.content as TextContent;

                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
                        <div className="w-full space-y-6">
                            {textContent.text && (
                                <ReactMarkdown>{textContent.text}</ReactMarkdown>
                            )}
                            {textContent.desc && (
                                <div className="text-muted-foreground mt-4">
                                    <ReactMarkdown>{textContent.desc}</ReactMarkdown>
                                </div>
                            )}
                            <div className="flex justify-center">
                                {renderContinueButton(isLastBlock)}
                            </div>
                        </div>
                    </div>
                );
            }
            case 'example': {
                const content = typeof block.content === 'string'
                    ? JSON.parse(block.content)
                    : block.content;

                const title = 'title' in content ? content.title : 'Example';
                const description = 'description' in content ? content.description : '';
                const examples = 'examples' in content && Array.isArray(content.examples) ? content.examples : [];

                return (
                    <div className="space-y-6">
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-semibold">{title}</h3>
                            <p className="text-lg">{description}</p>
                            <ul className="list-disc pl-6">
                                {examples.map((example: string, index: number) => (
                                    <li key={index} className="text-lg">{example}</li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={handleContinue}
                            className="w-full sm:w-auto"
                        >
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            }
            case 'image': {
                const imageContent = typeof block.content === 'string'
                    ? JSON.parse(block.content)
                    : block.content;

                if (!imageContent?.url) {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-muted-foreground">Image not available</p>
                                <div className="flex justify-center">
                                    {renderContinueButton(isLastBlock)}
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
                        <div className="w-full space-y-6">
                            <figure className="space-y-3">
                                <div className="flex justify-center">
                                    <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ maxWidth: '320px', maxHeight: '320px' }}>
                                        <img
                                            src={imageContent.url}
                                            alt={imageContent.alt || "Lesson content"}
                                            width={imageContent.width}
                                            height={imageContent.height}
                                            className="w-full h-full object-contain"
                                            style={{ aspectRatio: `${imageContent.width} / ${imageContent.height}` }}
                                        />
                                    </div>
                                </div>
                                {imageContent.caption && (
                                    <figcaption className="text-center text-base text-muted-foreground">
                                        {imageContent.caption}
                                    </figcaption>
                                )}
                            </figure>
                            <div className="flex justify-center">
                                {renderContinueButton(isLastBlock)}
                            </div>
                        </div>
                    </div>
                );
            }
            case 'video':
            case 'interactive': {
                const content = typeof block.content === 'string'
                    ? JSON.parse(block.content)
                    : block.content;

                if (content.type === 'scale_balance') {
                    return (
                        <ScaleBalanceInteractive
                            content={content as ScaleBalanceContent}
                            onComplete={handleContinue}
                        />
                    );
                }

                // Fallback for other interactive types
                return (
                    <div className="p-4 border rounded-lg">
                        <p className="text-muted-foreground">
                            This type of interactive content is not supported yet.
                        </p>
                        <Button
                            onClick={handleContinue}
                            className="mt-4 w-full sm:w-auto"
                        >
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!currentLesson) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-600">No lesson found</div>
            </div>
        );
    }

    const sortedBlocks = [...(currentLesson.content_blocks || [])].sort((a, b) =>
        (a.order || 0) - (b.order || 0)
    );
    const currentBlock = sortedBlocks[currentBlockIndex];
    console.log(currentBlock)
    return (
        <div className="min-h-screen bg-white">

            <div className="max-w-2xl mx-auto px-4 mt-8 flex justify-between items-center">
                <LessonHeader
                    currentQuestion={currentBlockIndex + 1}
                    totalQuestions={sortedBlocks.length}
                />

            </div>
            <main className="pt-20 pb-32">
                <div>
                    {currentBlock && renderBlock(currentBlock)}
                </div>


            </main>
            <AnswerFeedback />
        </div>
    );
};

export default LessonPage; 