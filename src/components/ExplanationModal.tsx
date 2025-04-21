import React from 'react';
import { X } from 'lucide-react';

interface ExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    image?: string;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
    isOpen,
    onClose,
    explanation,
    image
}) => {
    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center p-4
                transition-all duration-300 ease-out
                ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}
            `}
        >
            {/* Backdrop */}
            <div
                className={`
                    fixed inset-0 bg-black/50
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0'}
                `}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`
                    relative bg-white rounded-2xl w-full sm:w-[600px] md:w-[700px] lg:w-[800px] overflow-hidden
                    transform transition-all duration-500 ease-out
                    ${isOpen
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-8 opacity-0 scale-95'
                    }
                `}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Sharraxaad</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {image && (
                        <div className="flex justify-center">
                            <div className="max-w-[50%] w-fit animate-in fade-in-50 duration-700 delay-200">
                                <img
                                    src={image}
                                    alt="Sharraxaad sawir ah"
                                    className="w-full h-auto rounded-lg shadow-md object-contain"
                                />
                            </div>
                        </div>
                    )}
                    <p className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed animate-in fade-in-50 duration-700 delay-300">
                        {explanation}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExplanationModal; 