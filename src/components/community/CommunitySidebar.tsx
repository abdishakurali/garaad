"use client";

import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CommunityCategory } from "@/types/community";

interface CommunitySidebarProps {
    campuses: CommunityCategory[];
    selectedCampusId?: string | number;
    onSelectCampus: (campus: CommunityCategory) => void;
    onClearCampus: () => void;
}

export function CommunitySidebar({ campuses, selectedCampusId, onSelectCampus, onClearCampus }: CommunitySidebarProps) {
    return (
        <div className="w-[72px] flex flex-col items-center py-3 bg-[#E3E5E8] dark:bg-[#1E1F22] z-10 select-none">
            <TooltipProvider>
                <div className="flex flex-col items-center space-y-2 w-full">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all bg-white dark:bg-[#313338] p-0 flex items-center justify-center overflow-hidden group"
                                onClick={onClearCampus}
                            >
                                <div className="w-full h-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                                    <Home className="h-6 w-6 text-green-500 group-hover:text-white transition-colors" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Guriga</TooltipContent>
                    </Tooltip>

                    <Separator className="w-8 bg-gray-300 dark:bg-gray-700 h-[2px]" />

                    <ScrollArea className="flex-1 w-full px-3">
                        <div className="flex flex-col items-center space-y-2 py-2">
                            {campuses.map((campus) => {
                                const campusId = campus.id;
                                const campusName = campus.title || "Campus";

                                return (
                                    <Tooltip key={campusId}>
                                        <TooltipTrigger asChild>
                                            <div className="relative group">
                                                <div className={`absolute left-[-12px] top-1/4 bottom-1/4 w-1 bg-white rounded-r-full transition-all duration-200 ${selectedCampusId === campusId ? 'h-8 opacity-100' : 'h-2 opacity-0 group-hover:opacity-100 group-hover:h-5'
                                                    }`} />
                                                <Button
                                                    onClick={() => onSelectCampus(campus)}
                                                    className={`w-12 h-12 rounded-[24px] group-hover:rounded-[16px] transition-all p-0 overflow-hidden relative ${selectedCampusId === campusId ? 'rounded-[16px] bg-blue-500 text-white shadow-lg' : 'bg-white dark:bg-[#313338] text-gray-500 dark:text-gray-400 hover:bg-blue-500 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="w-full h-full flex items-center justify-center font-black text-sm">
                                                        {campusName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">{campusName}</TooltipContent>
                                    </Tooltip>
                                );
                            })}

                            {/* Plus button removed (static) */}
                        </div>
                    </ScrollArea>
                </div>
            </TooltipProvider>
        </div>
    );
}
