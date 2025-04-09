import React from "react";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";
import { Home, DollarSign, BarChart3, Target, Users, Settings } from "lucide-react-native";
import { useSettingsStore } from "@/store/settings-store";
import { getTranslation } from "@/constants/localization";

export default function TabLayout() {
  const { language } = useSettingsStore();
  
  const t = (key: string) => getTranslation(key, language);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: t('moneyRequests'),
          tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: t('transactions'),
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: t('savingsGoals'),
          tabBarIcon: ({ color, size }) => <Target size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: t('family'),
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}