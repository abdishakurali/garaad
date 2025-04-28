"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  Award,
  Sparkles,
  Flame,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserReward {
  id: number;
  user: number;
  reward_type: "points" | "badge" | "streak";
  reward_name: string;
  value: number;
  awarded_at: string;
}

interface RewardComponentProps {
  onContinue: () => void;
  rewards: UserReward[];
}

// Move this config outside the component so it’s only created once
const TYPE_CONFIG = {
  points: {
    defaultIcon: <CheckCircle className="h-6 w-6" />,
    gradientFrom: "from-green-400",
    gradientTo: "to-green-500",
    glowColor: "bg-green-400",
    accentColor: "text-green-400",
    valueLabel: "Total XP",
    valueIcon: <Award className="h-5 w-5" />,
  },
  badge: {
    defaultIcon: <Medal className="h-6 w-6" />,
    gradientFrom: "from-purple-400",
    gradientTo: "to-blue-500",
    glowColor: "bg-purple-400",
    accentColor: "text-purple-400",
    valueLabel: "Badge Level",
    valueIcon: <Award className="h-5 w-5 rotate-12" />,
  },
  streak: {
    defaultIcon: <Flame className="h-6 w-6" />,
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    glowColor: "bg-orange-400",
    accentColor: "text-orange-400",
    valueLabel: "Day Streak",
    valueIcon: <Flame className="h-5 w-5" />,
  },
};

function RewardComponent({ onContinue, rewards = [] }: RewardComponentProps) {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const hasMoreRewards = rewards.length > 1;

  // Reset index when rewards array changes
  useEffect(() => {
    setCurrentRewardIndex(0);
  }, [rewards]);

  // If no rewards, render nothing
  if (rewards.length === 0) {
    return null;
  }

  const currentReward = rewards[currentRewardIndex];

  // Memoize config lookup
  const config = TYPE_CONFIG[currentReward.reward_type] || TYPE_CONFIG.points;

  // Stable handler for continue button
  const handleContinue = () => {
    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex((idx) => idx + 1);
    } else {
      onContinue();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="relative">
        <div className="relative flex flex-col items-center text-center p-8 pt-12">
          {/* Achievement Icon */}
          <motion.div
            key={`icon-${currentReward.id}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mb-8"
          >
            <div
              className={`absolute inset-0 ${config.glowColor} rounded-xl blur-md opacity-30 scale-110`}
            />
            <div
              className={`relative bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} p-3 rounded-xl shadow-md`}
            >
              {config.defaultIcon}
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10, y: -10 }}
              animate={{ opacity: 1, x: -20, y: -20 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className={config.accentColor}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10, y: -10 }}
              animate={{ opacity: 1, x: 20, y: -20 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className={config.accentColor}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </motion.div>

          {/* Achievement Text */}
          <motion.div
            key={`text-${currentReward.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">
              {currentReward.reward_name}
            </h2>
            <p className="text-gray-500 mb-8">
              {currentReward.reward_type === "badge"
                ? "Wxaad heshay calaamad cusub!"
                : currentReward.reward_type === "streak"
                ? "Waxaad ilaashatay streak-gaaga!"
                : "Waxaad heshay points-ka! dhamaystirka casharkan"}
            </p>
          </motion.div>

          {/* Points/Badge/Streak Value */}
          <motion.div
            key={`value-${currentReward.id}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <div className="text-xs uppercase text-gray-400 tracking-wider mb-1">
              {config.valueLabel}
            </div>
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold">{currentReward.value}</span>
              <motion.span
                initial={{ rotate: -30, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className={`${config.accentColor} ml-1`}
              >
                {config.valueIcon}
              </motion.span>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            key={`button-${currentReward.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full"
          >
            <Button
              onClick={handleContinue}
              className={`w-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white py-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:opacity-90`}
            >
              {currentRewardIndex < rewards.length - 1 ? "Sii wado" : "Dhammee"}
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Reward counter indicator */}
          {hasMoreRewards && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 flex gap-1.5 justify-center"
            >
              {rewards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentRewardIndex
                      ? `bg-${config.accentColor.split("-")[1]}`
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export memoized component
export default memo(RewardComponent);
