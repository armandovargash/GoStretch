/**
 * PaywallScreen.tsx
 * Native iOS subscription paywall for GoStretch Pro.
 * Follows Apple HIG for subscription paywalls — clean, high-trust, native feel.
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as InAppPurchases from 'expo-in-app-purchases';
import {
    fetchProducts,
    purchaseSubscription,
    restorePurchases,
    PRODUCT_IDS,
} from '../services/PurchaseService';

// Design tokens matching Apple HIG
const CORAL = '#FF7F7F';
const BG = '#F9F9FC';
const CARD = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#8E8E93';

interface Props {
    onClose: () => void;
    onPurchaseSuccess: () => void;
}

const PRO_FEATURES = [
    { icon: 'body-outline', label: '+40 sesiones de estiramiento guiadas' },
    { icon: 'timer-outline', label: 'Sesiones de 5, 10, y 20 minutos' },
    { icon: 'analytics-outline', label: 'Análisis avanzado de progreso' },
    { icon: 'notifications-outline', label: 'Recordatorios inteligentes personalizados' },
    { icon: 'heart-outline', label: 'Planes por zona corporal (espalda, cuello, piernas)' },
];

export default function PaywallScreen({ onClose, onPurchaseSuccess }: Props) {
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState<InAppPurchases.IAPItem[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingProducts, setIsFetchingProducts] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setIsFetchingProducts(true);
        try {
            const result = await fetchProducts();
            setProducts(result);
        } catch {
            // In development / simulator, products won't load — that's expected
        } finally {
            setIsFetchingProducts(false);
        }
    }

    const monthlyProduct = products.find((p) => p.productId === PRODUCT_IDS.MONTHLY);
    const annualProduct = products.find((p) => p.productId === PRODUCT_IDS.ANNUAL);

    const monthlyPrice = monthlyProduct?.price ?? '€4.99';
    const annualPrice = annualProduct?.price ?? '€36.00';
    const annualMonthly = (36 / 12).toFixed(2); // €3.00/mes

    async function handlePurchase() {
        setIsLoading(true);
        try {
            const productId =
                selectedPlan === 'monthly' ? PRODUCT_IDS.MONTHLY : PRODUCT_IDS.ANNUAL;
            const success = await purchaseSubscription(productId);
            if (success) {
                onPurchaseSuccess();
            }
        } catch {
            Alert.alert('Error', 'No se pudo completar la compra. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRestore() {
        setIsLoading(true);
        try {
            const found = await restorePurchases();
            if (found) {
                onPurchaseSuccess();
            } else {
                Alert.alert(
                    'Sin compras',
                    'No encontramos compras previas con esta cuenta de App Store.'
                );
            }
        } catch {
            Alert.alert('Error', 'No se pudieron restaurar las compras.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Close */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Cerrar">
                <Ionicons name="close" size={24} color={TEXT_SECONDARY} />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.badge}>GoStretch Pro</Text>
                    <Text style={styles.headline}>Cuida tu cuerpo,{'\n'}todos los días.</Text>
                    <Text style={styles.subheadline}>
                        Accede a toda la biblioteca de sesiones y planes personalizados.
                    </Text>
                </View>

                {/* Feature List */}
                <View style={styles.features}>
                    {PRO_FEATURES.map((f) => (
                        <View key={f.icon} style={styles.featureRow}>
                            <Ionicons name={f.icon as any} size={20} color={CORAL} style={styles.featureIcon} />
                            <Text style={styles.featureText}>{f.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Plan Selector */}
                <View style={styles.plansRow}>
                    <TouchableOpacity
                        style={[styles.planCard, selectedPlan === 'annual' && styles.planCardSelected]}
                        onPress={() => setSelectedPlan('annual')}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selectedPlan === 'annual' }}
                    >
                        <View style={styles.planBadge}>
                            <Text style={styles.planBadgeText}>Más popular</Text>
                        </View>
                        <Text style={styles.planName}>Anual</Text>
                        <Text style={styles.planPrice}>{annualPrice}</Text>
                        <Text style={styles.planSubPrice}>€{annualMonthly}/mes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
                        onPress={() => setSelectedPlan('monthly')}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selectedPlan === 'monthly' }}
                    >
                        <Text style={styles.planName}>Mensual</Text>
                        <Text style={styles.planPrice}>{monthlyPrice}</Text>
                        <Text style={styles.planSubPrice}>por mes</Text>
                    </TouchableOpacity>
                </View>

                {/* CTA */}
                <TouchableOpacity
                    style={[styles.ctaBtn, isLoading && styles.ctaBtnDisabled]}
                    onPress={handlePurchase}
                    disabled={isLoading}
                    accessibilityRole="button"
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.ctaText}>
                            Comenzar{' '}
                            {selectedPlan === 'annual' ? `por ${annualPrice}/año` : `por ${monthlyPrice}/mes`}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Legal */}
                <Text style={styles.legal}>
                    La suscripción se renueva automáticamente. Cancela en cualquier momento desde Ajustes →
                    Apple ID → Suscripciones.
                </Text>

                <TouchableOpacity onPress={handleRestore} disabled={isLoading}>
                    <Text style={styles.restoreText}>Restaurar compras</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
        top: Platform.OS === 'ios' ? 56 : 16,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 28,
        marginTop: 20,
    },
    badge: {
        fontSize: 13,
        fontWeight: '600',
        color: CORAL,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    headline: {
        fontSize: 30,
        fontWeight: '700',
        color: TEXT_PRIMARY,
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: 10,
    },
    subheadline: {
        fontSize: 16,
        color: TEXT_SECONDARY,
        textAlign: 'center',
        lineHeight: 22,
    },
    features: {
        backgroundColor: CARD,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    featureIcon: {
        marginRight: 12,
        width: 24,
    },
    featureText: {
        fontSize: 15,
        color: TEXT_PRIMARY,
        flex: 1,
    },
    plansRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    planCard: {
        flex: 1,
        backgroundColor: CARD,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    planCardSelected: {
        borderColor: CORAL,
    },
    planBadge: {
        backgroundColor: CORAL,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 8,
    },
    planBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    planName: {
        fontSize: 16,
        fontWeight: '600',
        color: TEXT_PRIMARY,
        marginBottom: 4,
    },
    planPrice: {
        fontSize: 22,
        fontWeight: '700',
        color: TEXT_PRIMARY,
    },
    planSubPrice: {
        fontSize: 13,
        color: TEXT_SECONDARY,
        marginTop: 2,
    },
    ctaBtn: {
        backgroundColor: CORAL,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: CORAL,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaBtnDisabled: {
        opacity: 0.6,
    },
    ctaText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
    legal: {
        fontSize: 12,
        color: TEXT_SECONDARY,
        textAlign: 'center',
        lineHeight: 17,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    restoreText: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
