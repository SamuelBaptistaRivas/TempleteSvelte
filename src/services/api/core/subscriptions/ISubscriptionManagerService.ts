import type { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import type { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
import type { SelectedSubscriptionRequest } from "@/application/contracts/core/subscriptions/SelectedSubscriptionRequest";

export interface ISubscriptionManagerService {
  getCurrentSubscription(): Promise<SubscriptionGetCurrentResponse>;
  getCoupon(couponId: string, currency: string): Promise<SubscriptionCouponDto>;
  updateSubscription(
    subscription: SelectedSubscriptionRequest
  ): Promise<SubscriptionGetCurrentResponse>;
  cancelSubscription(): Promise<SubscriptionGetCurrentResponse>;
  updateCardToken(cardToken: string): Promise<SubscriptionGetCurrentResponse>;
  createCustomerPortalSession(): Promise<SubscriptionGetCurrentResponse>;
}
