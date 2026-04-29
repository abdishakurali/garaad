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
    try {
      console.log("Updating user premium status via internal API:", update);

      const internalUrl = process.env.DJANGO_INTERNAL_URL || "https://api.garaad.org";
      const internalSecret = process.env.INTERNAL_API_SECRET;

      if (!internalSecret) {
        console.error("INTERNAL_API_SECRET is not configured in environment variables");
        return false;
      }

      const response = await fetch(
        `${internalUrl.replace(/\/$/, "")}/api/accounts/set-premium/`,
        {
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Internal API error (${response.status}): ${errorText}`);
        return false;
      }

      const data = await response.json();
      console.log(`✅ User ${update.userId} premium status updated successfully:`, data);
      return true;
    } catch (error) {
      console.error("❌ Error updating premium status:", error);
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
