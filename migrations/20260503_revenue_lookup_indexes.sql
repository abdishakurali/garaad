CREATE INDEX IF NOT EXISTS idx_payment_order_user
  ON payment_order(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user
  ON subscriptions_subscription(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_composite
  ON subscriptions_payment(user_id, transaction_id);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_order
  ON payment_paymentwebhook(order_id);
