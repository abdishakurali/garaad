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

    // Test localStorage functionality
    const testLocalStorage = () => {
        // Test saving data
        const testData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            age: "25",
            referralCode: "TEST123"
        };

        localStorage.setItem('welcome_user_data', JSON.stringify(testData));
        localStorage.setItem('welcome_selections', JSON.stringify({ 0: "goal1", 1: "time1" }));
        localStorage.setItem('welcome_current_step', "2");

        alert("Test data saved to localStorage. Check welcome page to see if data is restored.");
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('welcome_user_data');
        localStorage.removeItem('welcome_selections');
        localStorage.removeItem('welcome_current_step');
        localStorage.removeItem('welcome_topic_levels');
        localStorage.removeItem('welcome_selected_topic');
        localStorage.removeItem('user');

        alert("localStorage data cleared.");
    };

    const showLocalStorage = () => {
        const data = {
            userData: localStorage.getItem('welcome_user_data'),
            selections: localStorage.getItem('welcome_selections'),
            currentStep: localStorage.getItem('welcome_current_step'),
            topicLevels: localStorage.getItem('welcome_topic_levels'),
            selectedTopic: localStorage.getItem('welcome_selected_topic'),
            user: localStorage.getItem('user')
        };

        console.log('localStorage data:', data);
        alert("Check console for localStorage data");
    };

    // Test email verification logic
    const testEmailVerification = () => {
        // Simulate a user with verified email
        const verifiedUser = {
            id: "1",
            email: "verified@example.com",
            is_email_verified: true,
            is_premium: false
        };

        console.log('Testing email verification logic:', verifiedUser);

        if (verifiedUser.is_email_verified) {
            alert("User email is verified - should redirect to appropriate page");
        } else {
            alert("User email is not verified - should redirect to verification page");
        }
    };

    // Test error handling
    const testErrorHandling = () => {
        // Simulate different server error responses
        const errorResponses = [
            {
                email: ["User with this email already exists."],
                status: 400
            },
            {
                password: ["This password is too short."],
                status: 400
            },
            {
                name: ["This field is required."],
                status: 400
            },
            {
                detail: "Invalid credentials",
                status: 401
            }
        ];

        console.log('Testing error handling for different server responses:', errorResponses);

        errorResponses.forEach((response, index) => {
            console.log(`Error ${index + 1}:`, response);
        });

        alert("Check console for error handling test cases");
    };

    // Test welcome page specific error handling
    const testWelcomePageErrorHandling = () => {
        // Simulate the specific error that was causing issues
        const welcomePageError = {
            email: ["User with this email already exists."],
            status: 400
        };

        console.log('Testing welcome page error handling:', welcomePageError);

        // Simulate how the auth service would process this error
        const errorMessage = welcomePageError.email?.[0] || "Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.";

        console.log('Processed error message:', errorMessage);
        alert(`Error message that should be displayed: "${errorMessage}"`);
    };

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

                        {/* localStorage Test Section */}
                        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h3 className="font-semibold mb-3 text-yellow-800">localStorage Test</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={testLocalStorage}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                                >
                                    Save Test Data
                                </button>
                                <button
                                    onClick={clearLocalStorage}
                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                >
                                    Clear Data
                                </button>
                                <button
                                    onClick={showLocalStorage}
                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                >
                                    Show Data
                                </button>
                                <button
                                    onClick={testEmailVerification}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                >
                                    Test Email Verification
                                </button>
                                <button
                                    onClick={testErrorHandling}
                                    className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                                >
                                    Test Error Handling
                                </button>
                                <button
                                    onClick={testWelcomePageErrorHandling}
                                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
                                >
                                    Test Welcome Page Error
                                </button>
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">
                                Use these buttons to test the localStorage functionality for the welcome form.
                            </p>
                        </div>

                        {/* Error Handling Test Section */}
                        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h3 className="font-semibold mb-3 text-yellow-800">Error Handling Test</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={testErrorHandling}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                                >
                                    Test Error Handling
                                </button>
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">
                                Use this button to test the error handling functionality for different server responses.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 