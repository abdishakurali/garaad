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

    if (!internalSecret) {
      console.error("[updatePremiumStatus] INTERNAL_API_SECRET is not set — cannot grant premium");
      return false;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": internalSecret,
        },
        body: JSON.stringify({
          user_id: update.userId,
          is_premium: update.isPremium,
          subscription_type: "challenge",
          plan_type: update.planType,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.error(`[updatePremiumStatus] Django returned ${response.status}: ${body}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("[updatePremiumStatus] fetch threw:", error instanceof Error ? error.message : error);
      return false;
    }
  }
}

export default UserService;
