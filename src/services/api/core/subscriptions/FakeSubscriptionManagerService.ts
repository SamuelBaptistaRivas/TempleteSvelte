/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import type { SubscriptionInvoiceDto } from "@/application/dtos/core/subscriptions/SubscriptionInvoiceDto";
import type { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
import type { SelectedSubscriptionRequest } from "@/application/contracts/core/subscriptions/SelectedSubscriptionRequest";
import type { ISubscriptionManagerService } from "./ISubscriptionManagerService";
import type { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import type { SubscriptionCustomerDto } from "@/application/dtos/core/subscriptions/SubscriptionCustomerDto";
import type { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import plans from "@/application/pricing/plans";
import type { SubscriptionPaymentMethodDto } from "@/application/dtos/core/subscriptions/SubscriptionPaymentMethodDto";
import { tenantStore } from "@/store/modules/tenantStore";
import { pricingStore } from "@/store/modules/pricingStore";

const subscriptions: SubscriptionGetCurrentResponse[] = [];
for (const product of plans) {
  const customer: SubscriptionCustomerDto = {
    id: "",
    email: "",
    name: "",
    description: "",
    phone: "",
    currency: "",
    created: new Date(),
  };
  const invoices: SubscriptionInvoiceDto[] = [
    {
      created: new Date(),
      invoicePdf: "",
      lines: [
        {
          description: product.title,
          planName: product.title,
          planInterval: "month",
          planCurrency: "usd",
          priceUnitAmount: product.prices[0].price,
          priceType: "",
        },
      ],
    },
  ];
  const cards: SubscriptionCardDto[] = [
    {
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2030,
      lastFourDigits: "1234",
      expiryDate: new Date(2030, 12, 1),
    },
  ];
  const tenantProducts: TenantProductDto[] = [
    {
      id: "",
      tenantId: "",
      tenant: {} as TenantDto,
      subscriptionPriceId: product.prices[0].id,
      subscriptionPrice: product.prices[0],
      active: true,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      subscriptionServiceId: "",
      subscriptionProduct: product,
      maxWorkspaces: product.maxWorkspaces,
      maxUsers: product.maxUsers,
      maxLinks: product.maxLinks,
      maxStorage: product.maxStorage,
      monthlyContracts: product.monthlyContracts,
    },
  ];
  const paymentMethods: SubscriptionPaymentMethodDto[] = [
    {
      card: cards[0],
    },
  ];
  const subscription: SubscriptionGetCurrentResponse = {
    activeProduct: tenantProducts,
    myProducts: tenantProducts,
    customer,
    invoices,
    cards,
    paymentMethods,
  };
  subscriptions.push(subscription);
}
export class FakeSubscriptionManagerService
  implements ISubscriptionManagerService
{
  subscriptions = subscriptions;
  currentSubscription = subscriptions[1];
  getCurrentSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        tenantStore.setSubscription(this.currentSubscription);
        if (this.currentSubscription.myProducts?.length > 0) {
          pricingStore.setProduct(
            this.currentSubscription.myProducts[0].subscriptionProduct
          );
          pricingStore.setBillingPeriod(
            this.currentSubscription.myProducts[0].subscriptionPrice
              .billingPeriod
          );
        }
        resolve(this.currentSubscription);
      }, 500);
    });
  }
  getCoupon(
    _couponId: string,
    _currency: string
  ): Promise<SubscriptionCouponDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  updateSubscription(
    _subscription: SelectedSubscriptionRequest
  ): Promise<SubscriptionGetCurrentResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  cancelSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  updateCardToken(_cardToken: string): Promise<SubscriptionGetCurrentResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  createCustomerPortalSession(): Promise<SubscriptionGetCurrentResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
