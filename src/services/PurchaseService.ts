/**
 * PurchaseService.ts
 * Native iOS In-App Purchase logic using expo-in-app-purchases.
 * Handles subscription checking, purchasing, and restoring purchases.
 * 
 * Product IDs must be registered in App Store Connect once the
 * Apple Developer Account is active.
 */

import * as InAppPurchases from 'expo-in-app-purchases';

// These Product IDs must match exactly what you create in App Store Connect
export const PRODUCT_IDS = {
    MONTHLY: 'com.ajvargash.gostretch.monthly',
    ANNUAL: 'com.ajvargash.gostretch.annual',
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];

/**
 * Connect to the App Store payment queue.
 * Must be called once at app startup (in App.tsx or a top-level hook).
 */
export async function connectToStore(): Promise<void> {
    await InAppPurchases.connectAsync();
}

/**
 * Fetch available subscription products from the App Store.
 */
export async function fetchProducts(): Promise<InAppPurchases.IAPItem[]> {
    const { responseCode, results } = await InAppPurchases.getProductsAsync([
        PRODUCT_IDS.MONTHLY,
        PRODUCT_IDS.ANNUAL,
    ]);

    if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        return results;
    }

    return [];
}

/**
 * Trigger a purchase for the given product.
 * Returns true if the purchase was successful.
 */
export async function purchaseSubscription(productId: ProductId): Promise<boolean> {
    const { responseCode } = await InAppPurchases.purchaseItemAsync(productId);
    return responseCode === InAppPurchases.IAPResponseCode.OK;
}

/**
 * Restore previous purchases (required by App Store guidelines).
 */
export async function restorePurchases(): Promise<boolean> {
    const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();

    if (responseCode === InAppPurchases.IAPResponseCode.OK && results && results.length > 0) {
        // Check if any of our subscription products exist in history
        const hasPro = results.some(
            (p) => p.productId === PRODUCT_IDS.MONTHLY || p.productId === PRODUCT_IDS.ANNUAL
        );
        return hasPro;
    }

    return false;
}

/**
 * Disconnect from the App Store payment queue.
 * Call this when the app goes to background or on unmount.
 */
export async function disconnectFromStore(): Promise<void> {
    await InAppPurchases.disconnectAsync();
}
