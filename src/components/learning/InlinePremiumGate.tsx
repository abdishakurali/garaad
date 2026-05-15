import Link from "next/link";
import { Lock } from "lucide-react";

interface InlinePremiumGateProps {
    lockedCount: number;
}

export function InlinePremiumGate({ lockedCount }: InlinePremiumGateProps) {
    return (
        <div className="my-2 py-5 px-4 rounded-[12px] border border-gold/20 bg-card text-center">
            <Lock className="w-4 h-4 text-gold mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">
                {lockedCount} {lockedCount === 1 ? "cashar" : "casharo"} oo kooban
            </p>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Hel buuxda koorsada si aad u hesho dhammaan casharka iyo taageerada.
            </p>
            <Link href="/subscribe/pay" className="btn-gold text-sm" style={{ padding: "10px 20px", minHeight: "40px" }}>
                Fur Casharka Xiga — $79 →
            </Link>
        </div>
    );
}
