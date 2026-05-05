// User service for handling premium status updates
interface UserPremiumUpdate {
  userId: string;
  isPremium: boolean;
  subscriptionId?: string;
}

class UserService {
  private static instance: UserService;

  private constructor() { }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async updatePremiumStatus(update: UserPremiumUpdate & { planType?: 'installment' | 'full' }): Promise<boolean> {
    const internalUrl = (process.env.DJANGO_INTERNAL_URL || "https://api.garaad.org").replace(/\/$/, "");
    const internalSecret = process.env.INTERNAL_API_SECRET;
    const endpoint = `${internalUrl}/api/accounts/set-premium/`;

    console.log("[updatePremiumStatus] called with:", {
      userId: update.userId,
      isPremium: update.isPremium,
      planType: update.planType,
    });
    console.log("[updatePremiumStatus] env:", {
      hasSecret: !!internalSecret,
      djangoUrl: internalUrl,
      endpoint,
    });

    if (!internalSecret) {
      console.error("[updatePremiumStatus] INTERNAL_API_SECRET is not set — cannot grant premium");
      return false;
    }

    try {
      const subscriptionType = "challenge";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": internalSecret,
        },
        body: JSON.stringify({
          user_id: update.userId,
          is_premium: update.isPremium,
          subscription_type: subscriptionType,
          plan_type: update.planType,
        }),
      });

      const responseText = await response.text();
      console.log("[updatePremiumStatus] response:", {
        status: response.status,
        ok: response.ok,
        body: responseText,
      });

      if (!response.ok) {
        console.error(`[updatePremiumStatus] Django returned ${response.status}: ${responseText}`);
        return false;
      }

      console.log(`[updatePremiumStatus] ✅ User ${update.userId} premium granted`);
      return true;
    } catch (error) {
      console.error("[updatePremiumStatus] fetch threw:", error instanceof Error ? error.message : error);
      return false;
    }
  }

  async getUserPremiumStatus(userId: string): Promise<boolean> {
    try {
      console.log(`Getting premium status for user: ${userId}`);

      // NOTE: In production, replace with actual database query.
      // e.g., const user = await db.users.findUnique({ where: { id: userId } });
      // return user?.isPremium || false;

      // For now, return false (user is not premium)
      return false;
    } catch (error) {
      console.error("Error getting premium status:", error);
      return false;
    }
  }
}

export default UserService;
