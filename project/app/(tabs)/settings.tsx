import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { useSettingsStore, CURRENCIES, LANGUAGES, Currency, Language } from "@/store/settings-store";
import { getTranslation } from "@/constants/localization";
import { 
  Globe, 
  DollarSign, 
  Bell, 
  Info, 
  ChevronRight,
  Moon,
  Sun
} from "lucide-react-native";

export default function SettingsScreen() {
  const { currency, language, setCurrency, setLanguage } = useSettingsStore();
  
  const t = (key: string) => getTranslation(key, language);
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    value: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingValue}>{value}</Text>
      </View>
      <ChevronRight size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
  
  const handleCurrencyChange = () => {
    // Simple rotation through available currencies
    const currencyCodes = Object.keys(CURRENCIES) as Currency[];
    const currentIndex = currencyCodes.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencyCodes.length;
    setCurrency(currencyCodes[nextIndex]);
  };
  
  const handleLanguageChange = () => {
    // Toggle between English and Russian
    setLanguage(language === 'en' ? 'ru' : 'en');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('settings')}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          
          {renderSettingItem(
            <Globe size={24} color={colors.primary} />,
            t('language'),
            LANGUAGES[language].name,
            handleLanguageChange
          )}
          
          {renderSettingItem(
            <DollarSign size={24} color={colors.primary} />,
            t('currency'),
            CURRENCIES[currency].name,
            handleCurrencyChange
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('notifications')}</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Info size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('version')}</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scrollContent: {
    padding: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.lg,
  },
  section: {
    marginBottom: layout.spacing.xl,
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.textLight,
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
  },
});