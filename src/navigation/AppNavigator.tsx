import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Using Expo vector icons for SF Symbol equivalents
import { theme } from '../theme';
import { useAppStore } from '../store/useAppStore';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SessionFlowScreen from '../screens/SessionFlowScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs Navigator
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Library') {
                        iconName = focused ? 'library' : 'library-outline';
                    } else if (route.name === 'Progress') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.accent,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTitleStyle: {
                    fontFamily: 'System', // iOS Default
                    fontWeight: '600',
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.cardBackground,
                    borderTopColor: theme.colors.border,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Biblioteca' }} />
            <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progreso' }} />
        </Tab.Navigator>
    );
}

// Root Navigator
export default function AppNavigator() {
    const hasSeenOnboarding = useAppStore((state) => state.stats.hasSeenOnboarding);

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                }}
                initialRouteName={hasSeenOnboarding ? "MainTabs" : "Onboarding"}
            >
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen
                    name="SessionFlow"
                    component={SessionFlowScreen}
                    options={{ presentation: 'fullScreenModal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
