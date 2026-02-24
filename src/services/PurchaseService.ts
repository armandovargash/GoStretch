/**
 * PurchaseService.ts
 * Native iOS StoreKit 2 subscription logic.
 *
 * **ARCHITECTURE NOTE:**
 * Native IAP requires a compiled app (EAS build). It does NOT work in Expo Go.
 * This file uses a development mock so all screens render correctly in Expo Go.
 * When building for production (eas build --profile production), this is replaced
 * by the real StoreKit 2 implementation pointing at App Store Connect products.
 *
 * Products to create in App Store Connect (once Apple Developer account is active):
 * - com.ajvargash.gostretch.monthly  →  Auto-Renewable Subscription, €4.99/month
 * - com.ajvargash.gostretch.annual   →  Auto-Renewable Subscription, €36.00/year
 */

import { Platform, Alert } from 'react-native';

export const PRODUCT_IDS = {
    MONTHLY: 'com.ajvargash.gostretch.monthly',
    ANNUAL: 'com.ajvargash.gostretch.annual',
};

export interface SubscriptionProduct {
    productId: string;
    localizedPrice: string;
    title: string;
}

// ─── Development / Expo Go mock ───────────────────────────────────────────────
// These are displayed in the UI when StoreKit is not available.
const MOCK_PRODUCTS: SubscriptionProduct[] = [
    { productId: PRODUCT_IDS.ANNUAL, localizedPrice: '€36,00', title: 'GoStretch Pro – Anual' },
    { productId: PRODUCT_IDS.MONTHLY, localizedPrice: '€4,99', title: 'GoStretch Pro – Mensual' },
];

/**
 * Fetch available subscriptions.
 * Returns App Store products on a real build; mocks in Expo Go.
 */
export async function fetchSubscriptions(): Promise<SubscriptionProduct[]> {
    if (Platform.OS !== 'ios') return MOCK_PRODUCTS;

    try {
        // TODO (production): replace with real StoreKit 2 call via react-native-iap
        // const { getSubscriptions } = await import('react-native-iap');
        // return await getSubscriptions({ skus: Object.values(PRODUCT_IDS) });
        return MOCK_PRODUCTS;
    } catch {
        return MOCK_PRODUCTS;
    }
}

/**
 * Purchase a subscription by productId.
 * Shows a preview alert in Expo Go.
 */
export async function purchaseSubscription(productId: string): Promise<boolean> {
    if (Platform.OS !== 'ios') {
        Alert.alert('Solo iOS', 'GoStretch Pro sólo está disponible en iOS.');
        return false;
    }

    // TODO (production): replace with real StoreKit 2 call
    Alert.alert(
        '👋 Vista Previa',
        'Estás viendo la app en Expo Go.\n\nLas compras reales se activarán en la versión del App Store. Ahora puedes explorar todo el diseño y flujo de la app.',
        [{ text: 'Entendido' }]
    );
    return false;
}

/**
 * Restore previous purchases.
 * Shows a preview alert in Expo Go.
 */
export async function restorePurchases(): Promise<boolean> {
    Alert.alert(
        '👋 Vista Previa',
        'La restauración de compras funciona en la app publicada desde el App Store.',
        [{ text: 'Entendido' }]
    );
    return false;
}
