"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CampusRoom, UserProfile, BADGE_LEVELS } from "@/types/community";
import { Lock } from "lucide-react";

interface LockedRoomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    room: CampusRoom | null;
    userProfile: UserProfile | null;
}

export function LockedRoomDialog({ isOpen, onClose, room, userProfile }: LockedRoomDialogProps) {
    if (!room || !room.min_badge_level || !userProfile) return null;

    const requiredBadge = BADGE_LEVELS[room.min_badge_level];
    const currentBadge = BADGE_LEVELS[userProfile.badge_level];

    // Fallback if badge data is missing
    if (!requiredBadge) return null;

    const currentPoints = userProfile.community_points || 0;
    const requiredPoints = requiredBadge.points_required || 0;
    const progress = requiredPoints > 0 ? Math.min(100, (currentPoints / requiredPoints) * 100) : 100;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogTitle className="text-center text-xl font-black uppercase">Qolkan Waa Xiran Yahay</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Qolkan <strong>"{room.name_somali}"</strong> waxaa kaliya geli kara ardayda gaartay darajada <span className="font-bold text-primary" style={{ color: requiredBadge.color }}>{requiredBadge.display_name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span>Horumarkaaga</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-center text-gray-500 italic">
                            Waxaad u baahan tahay <strong>{Math.max(0, requiredPoints - currentPoints)} XP</strong> dheeraad ah si aad u furato.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                        <span className="text-2xl mr-2">{requiredBadge.emoji}</span>
                        <p className="text-xs text-gray-500 mt-1">Sii wad barashada iyo ka qaybqaadashada si aad u gaarto darajada xigta!</p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto font-black uppercase tracking-widest">
                        Waa Gartay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
