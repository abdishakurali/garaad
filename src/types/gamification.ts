import { UserIdentity, NextAction } from "./auth";

export interface GamificationStatus {
    identity: UserIdentity;
    xp: number;
    level: number;
    streak: { count: number };
    energy: {
        current: number;
        max: number;
        next_refill?: string;
    };
    next_action: NextAction;
}

export interface ActivityUpdatePayload {
    action_type: string;
    problems_solved?: number;
    energy_spent?: number;
    lesson_ids?: string[];
    request_id: string; // Keep for idempotency
}

export interface ActivityUpdateResponse {
    success: boolean;
    xp_gained: number;
    energy_used: number;
    new_status: GamificationStatus;
    milestones?: string[];
}
