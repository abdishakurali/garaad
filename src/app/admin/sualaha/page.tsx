"use client";

import { useState, useEffect } from "react";
import { adminApi as api, ApiError } from "@/lib/admin-api";
import { Search, MessageSquare, User, Clock, CheckCircle, XCircle } from "lucide-react";

interface Question {
    id: number;
    text: string;
    author: {
        username: string;
    };
    created_at: string;
    is_answered: boolean;
}

export default function SualahaPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await api.get("lms/questions/");
            // Handle both paginated and non-paginated responses robustly
            const rawData = res.data;
            const data = Array.isArray(rawData)
                ? rawData
                : (rawData && Array.isArray(rawData.results) ? rawData.results : []);
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.author.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-blue-800 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                    Su'aalaha
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                    Halkan waxaad ka maamuli kartaa su'aalaha ay ardaydu weydiiyeen.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Raadi su'aal ama arday..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-12">Soo loading...</div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map(question => (
                        <div key={question.id} className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-gray-900">{question.author.username}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${question.is_answered ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {question.is_answered ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        <span className="font-bold text-xs uppercase tracking-wider">
                                            {question.is_answered ? 'Laga jawaabay' : 'Jawaab sugaya'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-800 text-lg leading-relaxed">
                                    {question.text}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button className="text-blue-600 font-bold hover:underline flex items-center gap-1.5">
                                        <MessageSquare className="w-4 h-4" />
                                        Ka jawaab
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                        <div className="text-gray-400 text-center p-12 bg-white rounded-xl border border-gray-100">
                            Su'aalo lama helin.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
