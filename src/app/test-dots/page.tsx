"use client";

import { useState } from "react";
import LessonHeader from "@/components/LessonHeader";

export default function TestDotsPage() {
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

    // Simulate lesson content blocks
    const sortedBlocks = [
        { id: 1, type: "text", content: "Introduction to the lesson" },
        { id: 2, type: "problem", content: "First problem" },
        { id: 3, type: "text", content: "Explanation" },
        { id: 4, type: "problem", content: "Second problem" },
        { id: 5, type: "text", content: "Conclusion" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <LessonHeader
                currentQuestion={currentBlockIndex + 1}
                totalQuestions={sortedBlocks.length}
                coursePath="/courses"
                onDotClick={(blockIndex) => setCurrentBlockIndex(blockIndex)}
                completedLessons={[]}
            />

            <main className="pt-20 pb-32 mt-4">
                <div className="container mx-auto max-w-2xl px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Test Dots Navigation</h1>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                Current Block: {currentBlockIndex + 1} of {sortedBlocks.length}
                            </p>
                            <p className="text-sm text-gray-500">
                                Click the dots in the header to navigate between blocks
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h2 className="font-semibold mb-2">
                                Block {currentBlockIndex + 1}: {sortedBlocks[currentBlockIndex].type}
                            </h2>
                            <p className="text-gray-700">
                                {sortedBlocks[currentBlockIndex].content}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={() => setCurrentBlockIndex(Math.max(0, currentBlockIndex - 1))}
                                disabled={currentBlockIndex === 0}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentBlockIndex(Math.min(sortedBlocks.length - 1, currentBlockIndex + 1))}
                                disabled={currentBlockIndex === sortedBlocks.length - 1}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 