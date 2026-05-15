import Link from "next/link";
import { Lock } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

interface InlinePremiumGateProps {
    lockedCount: number;
}

export function InlinePremiumGate({ lockedCount }: InlinePremiumGateProps) {
    const { data: challengeStatus } = useChallengeStatus();
    const isWaitlistOnly = challengeStatus?.is_waitlist_only;

    return (
        <div className="my-2 py-5 px-4 rounded-[12px] border border-gold/20 bg-card text-center">
            <Lock className="w-4 h-4 text-gold mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">
                {lockedCount === 1
                    ? "1 cashar oo Mentorship ardayda loogu talagalay"
                    : `${lockedCount} casharro oo Mentorship ardayda loogu talagalay`}
            </p>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {isWaitlistOnly
                    ? "Kooxda way buuxdaa. Geli liiska si aad u hesho kooxda xigta."
                    : "Ku soo biir Mentorship-ka si aad u hesho dhammaan casharrada iyo macallin shakhsiyeed."}
            </p>
            {!isWaitlistOnly && (
                <Link href="/subscribe" className="btn-gold text-sm" style={{ padding: "10px 20px", minHeight: "40px" }}>
                    Fur dhammaan casharrada →
                </Link>
            )}
        </div>
    );
}
