/**
 * PurchaseService.ts
 * Native iOS StoreKit subscriptions powered by RevenueCat.
 *
 * Before going to production:
 * 1. Create a RevenueCat account at app.revenuecat.com (free tier available)
 * 2. Add your App Store app and products (monthly/annual) in RevenueCat dashboard
 * 3. Replace the placeholder API key below with your actual RevenueCat iOS API key
 * 4. Create the matching product IDs in App Store Connect
 */

import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// ──────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — Replace with your real RevenueCat API key before building
// ──────────────────────────────────────────────────────────────────────────────
const REVENUECAT_API_KEY_IOS = 'appl_REPLACE_WITH_YOUR_REVENUECAT_IOS_KEY';

export const ENTITLEMENT_ID = 'pro'; // Create this entitlement in RevenueCat dashboard

/**
 * Initialize RevenueCat SDK. Call this once at app startup in App.tsx.
 */
export async function configurePurchases(): Promise<void> {
    if (Platform.OS !== 'ios') return;

    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS });
}

/**
 * Fetch available subscription packages from RevenueCat.
 * Returns the current offering's availablePackages array.
 */
export async function fetchPackages(): Promise<PurchasesPackage[]> {
    const offerings = await Purchases.getOfferings();
    if (offerings.current?.availablePackages) {
        return offerings.current.availablePackages;
    }
    return [];
}

/**
 * Purchase a subscription package.
 * Returns true if the purchase unlocked the Pro entitlement.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

/**
 * Check if the current user has an active Pro subscription.
 */
export async function checkProStatus(): Promise<boolean> {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

/**
 * Restore purchases for the current App Store account.
 */
export async function restorePurchasesRC(): Promise<boolean> {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}
