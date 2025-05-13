"use client";

import { useEffect } from "react";

const somaliStrings = {
    title: "Cinwaan",
    description: "Faahfaahin",
    email: "Email",
    feedbackType: "Nooca Jawaabta",
    bug: "Cilad",
    suggestion: "Talo",
    question: "Su'aal",
    attachments: "Lifaaqyo"
};

function setupSomaliShakeForm() {
    // Use global constructors from Shake SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const title = new (window as any).ShakeTitle('title', somaliStrings.title, '', true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const desc = new (window as any).ShakeTextInput('description', somaliStrings.description, '', true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const email = new (window as any).ShakeEmail('email', somaliStrings.email, '', false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pickerItems = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (window as any).ShakePickerItem('bug', somaliStrings.bug, undefined, 'bug'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (window as any).ShakePickerItem('suggestion', somaliStrings.suggestion, undefined, 'suggestion'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (window as any).ShakePickerItem('question', somaliStrings.question, undefined, 'question'),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const picker = new (window as any).ShakePicker('feedback_type', somaliStrings.feedbackType, pickerItems);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attachments = new (window as any).ShakeAttachments();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shakeForm = new (window as any).ShakeForm([title, desc, email, picker, attachments]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Shake.config.shakeForm = shakeForm;
}

const ShakeInitializer = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const apiKey = process.env.NEXT_PUBLIC_SHAKE_API_KEY;
            if (!apiKey) {
                console.error("Shake API Key not set. Add NEXT_PUBLIC_SHAKE_API_KEY to .env.local.");
                return;
            }
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).Shake.start(apiKey);

                // Wait for SDK constructors to be available
                const interval = setInterval(() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((window as any).ShakeTitle &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).ShakeTextInput &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).ShakeEmail &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).ShakePicker &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).ShakePickerItem &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).ShakeAttachments &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).ShakeForm
                    ) {
                        setupSomaliShakeForm();
                        clearInterval(interval);
                    }
                }, 100);

                // Optionally, clear interval after 5 seconds to avoid infinite loop
                setTimeout(() => clearInterval(interval), 5000);

            } catch (error) {
                console.error("Error initializing Shake SDK:", error);
            }
        }
    }, []);

    return null;
};

export default ShakeInitializer; 