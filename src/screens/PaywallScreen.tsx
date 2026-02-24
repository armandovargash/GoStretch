/**
 * PaywallScreen.tsx
 * Native iOS subscription paywall for GoStretch Pro.
 * Powered by RevenueCat (react-native-purchases).
 *
 * SETUP REQUIRED before first real build:
 * 1. Create a RevenueCat account → add app → create "pro" entitlement
 * 2. Add monthly (€4.99) and annual (€36) products in App Store Connect
 * 3. Link them in RevenueCat dashboard
 * 4. Replace the API key in PurchaseService.ts
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
import { PurchasesPackage } from 'react-native-purchases';
import { fetchPackages, purchasePackage, restorePurchasesRC } from '../services/PurchaseService';

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
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPackages, setIsFetchingPackages] = useState(true);

    useEffect(() => {
        loadPackages();
    }, []);

    async function loadPackages() {
        setIsFetchingPackages(true);
        try {
            const pkgs = await fetchPackages();
            setPackages(pkgs);
            // Default: select the annual package (best value)
            const annual = pkgs.find(p => p.packageType === 'ANNUAL');
            setSelectedPkg(annual ?? pkgs[0] ?? null);
        } catch {
            // In Expo Go / simulator, RevenueCat will return empty — expected
        } finally {
            setIsFetchingPackages(false);
        }
    }

    // Fallback display prices when RevenueCat is not yet configured
    const getPrice = (type: 'monthly' | 'annual') => {
        const pkg = packages.find(p =>
            type === 'annual' ? p.packageType === 'ANNUAL' : p.packageType === 'MONTHLY'
        );
        return pkg?.product.priceString ?? (type === 'annual' ? '€36.00' : '€4.99');
    };

    async function handlePurchase() {
        if (!selectedPkg) {
            Alert.alert('Error', 'No hay paquetes disponibles en este momento.');
            return;
        }
        setIsLoading(true);
        try {
            const success = await purchasePackage(selectedPkg);
            if (success) onPurchaseSuccess();
        } catch (e: any) {
            if (!e.userCancelled) {
                Alert.alert('Error', 'No se pudo completar la compra. Inténtalo de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRestore() {
        setIsLoading(true);
        try {
            const found = await restorePurchasesRC();
            if (found) {
                onPurchaseSuccess();
            } else {
                Alert.alert('Sin compras', 'No encontramos compras previas con esta cuenta de App Store.');
            }
        } catch {
            Alert.alert('Error', 'No se pudieron restaurar las compras.');
        } finally {
            setIsLoading(false);
        }
    }

    const isAnnualSelected = selectedPkg?.packageType === 'ANNUAL';
    const annualMonthly = (36 / 12).toFixed(2);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Close button */}
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
                    {/* Annual */}
                    <TouchableOpacity
                        style={[styles.planCard, isAnnualSelected && styles.planCardSelected]}
                        onPress={() => {
                            const annual = packages.find(p => p.packageType === 'ANNUAL');
                            if (annual) setSelectedPkg(annual);
                        }}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isAnnualSelected }}
                    >
                        <View style={styles.planBadge}>
                            <Text style={styles.planBadgeText}>Más popular</Text>
                        </View>
                        <Text style={styles.planName}>Anual</Text>
                        <Text style={styles.planPrice}>{getPrice('annual')}</Text>
                        <Text style={styles.planSubPrice}>€{annualMonthly}/mes</Text>
                    </TouchableOpacity>

                    {/* Monthly */}
                    <TouchableOpacity
                        style={[styles.planCard, !isAnnualSelected && styles.planCardSelected]}
                        onPress={() => {
                            const monthly = packages.find(p => p.packageType === 'MONTHLY');
                            if (monthly) setSelectedPkg(monthly);
                        }}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: !isAnnualSelected }}
                    >
                        <Text style={styles.planName}>Mensual</Text>
                        <Text style={styles.planPrice}>{getPrice('monthly')}</Text>
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
                            Comenzar {isAnnualSelected ? `por ${getPrice('annual')}/año` : `por ${getPrice('monthly')}/mes`}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Legal */}
                <Text style={styles.legal}>
                    La suscripción se renueva automáticamente. Cancela en cualquier momento desde
                    Ajustes → Apple ID → Suscripciones.
                </Text>

                <TouchableOpacity onPress={handleRestore} disabled={isLoading}>
                    <Text style={styles.restoreText}>Restaurar compras</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
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
    scroll: { paddingHorizontal: 24, paddingTop: 24 },
    hero: { alignItems: 'center', marginBottom: 28, marginTop: 20 },
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
    subheadline: { fontSize: 16, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 22 },
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
    featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    featureIcon: { marginRight: 12, width: 24 },
    featureText: { fontSize: 15, color: TEXT_PRIMARY, flex: 1 },
    plansRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
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
    planCardSelected: { borderColor: CORAL },
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
    planName: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 4 },
    planPrice: { fontSize: 22, fontWeight: '700', color: TEXT_PRIMARY },
    planSubPrice: { fontSize: 13, color: TEXT_SECONDARY, marginTop: 2 },
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
    ctaBtnDisabled: { opacity: 0.6 },
    ctaText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
    legal: {
        fontSize: 12,
        color: TEXT_SECONDARY,
        textAlign: 'center',
        lineHeight: 17,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    restoreText: { fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', textDecorationLine: 'underline' },
});
