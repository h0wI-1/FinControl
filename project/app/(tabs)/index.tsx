import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user-store";
import { useFinanceStore } from "@/store/finance-store";
import { useSettingsStore } from "@/store/settings-store";
import { getTranslation } from "@/constants/localization";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { mockSpendingStats } from "@/mocks/finance";
import { UserSwitcher } from "@/components/UserSwitcher";
import { MoneyRequestCard } from "@/components/MoneyRequestCard";
import { SavingsGoalCard } from "@/components/SavingsGoalCard";
import { SpendingChart } from "@/components/SpendingChart";
import { formatCurrency } from "@/utils/formatters";
import { useRouter } from "expo-router";
import { PlusCircle, ArrowRight, Bell, Target } from "lucide-react-native";
import { CategoryType } from "@/types/finance";

export default function DashboardScreen() {
  const router = useRouter();
  const { currentUser, family, login } = useUserStore();
  const { 
    getPendingRequests, 
    getRequestsByChild,
    getSavingsGoalsByUser,
    getTransactionsByUser
  } = useFinanceStore();
  const { currency, language } = useSettingsStore();
  
  const t = (key: string) => getTranslation(key, language);

  // Auto-login for demo purposes
  useEffect(() => {
    if (!currentUser) {
      login('1'); // Login as parent by default
    }
  }, [currentUser, login]);

  if (!currentUser || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  const isParent = currentUser.role === 'parent';
  
  // Get data based on user role
  const pendingRequests = isParent ? getPendingRequests() : [];
  const childRequests = !isParent ? getRequestsByChild(currentUser.id) : [];
  const userGoals = getSavingsGoalsByUser(currentUser.id);
  const userTransactions = getTransactionsByUser(currentUser.id);
  
  // Get spending stats
  const defaultCategorySpending: Record<CategoryType, number> = {
    food: 0,
    entertainment: 0,
    education: 0,
    clothing: 0,
    savings: 0,
    other: 0
  };
  
  const spendingStats = isParent 
    ? { 
        totalSpent: 0, 
        totalReceived: 0, 
        byCategorySpending: defaultCategorySpending, 
        savingsPercentage: 0 
      } 
    : mockSpendingStats[currentUser.id];

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('hello')}</Text>
            <Text style={styles.userName}>{currentUser.name}</Text>
          </View>
          <TouchableOpacity>
            <Image 
              source={{ uri: currentUser.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>

        <UserSwitcher />
        
        {isParent ? (
          // Parent Dashboard
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('pendingRequests')}</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/requests')}
              >
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {pendingRequests.length > 0 ? (
              pendingRequests.slice(0, 2).map(request => (
                <MoneyRequestCard 
                  key={request.id} 
                  request={request} 
                  onPress={() => router.push(`/requests/${request.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Bell size={40} color={colors.textLight} />
                <Text style={styles.emptyStateText}>{t('noPendingRequests')}</Text>
              </View>
            )}
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('familyRules')}</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/family')}
              >
                <Text style={styles.seeAllText}>{t('manage')}</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.rulesPreview}>
              {family.rules.slice(0, 3).map((rule, index) => (
                <View key={rule.id} style={styles.ruleItem}>
                  <View style={styles.ruleNumberContainer}>
                    <Text style={styles.ruleNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.ruleTitle}>{rule.title}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          // Child Dashboard
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>{t('yourBalance')}</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(spendingStats.totalReceived - spendingStats.totalSpent, currency)}
              </Text>
              <View style={styles.balanceActions}>
                <TouchableOpacity 
                  style={styles.balanceActionButton}
                  onPress={() => router.push('/requests/new')}
                >
                  <PlusCircle size={16} color="white" />
                  <Text style={styles.balanceActionText}>{t('requestMoney')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <SpendingChart stats={spendingStats} />
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('yourRequests')}</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/requests')}
              >
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {childRequests.length > 0 ? (
              childRequests.slice(0, 2).map(request => (
                <MoneyRequestCard 
                  key={request.id} 
                  request={request}
                  onPress={() => router.push(`/requests/${request.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Bell size={40} color={colors.textLight} />
                <Text style={styles.emptyStateText}>{t('noRequestsYet')}</Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/requests/new')}
                >
                  <Text style={styles.emptyStateButtonText}>{t('createRequest')}</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('savingsGoals')}</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/goals')}
              >
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {userGoals.length > 0 ? (
              userGoals.slice(0, 1).map(goal => (
                <SavingsGoalCard 
                  key={goal.id} 
                  goal={goal}
                  onPress={() => router.push(`/goals/${goal.id}`)}
                  onAddFunds={() => router.push(`/goals/${goal.id}/add-funds`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Target size={40} color={colors.textLight} />
                <Text style={styles.emptyStateText}>{t('noSavingsGoals')}</Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/goals/new')}
                >
                  <Text style={styles.emptyStateButtonText}>{t('createGoal')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: layout.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  greeting: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
  userName: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  emptyState: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.xl,
    alignItems: 'center',
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    marginTop: layout.spacing.sm,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.md,
  },
  balanceLabel: {
    fontSize: fonts.sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: layout.spacing.xs,
  },
  balanceAmount: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: 'white',
    marginBottom: layout.spacing.sm,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  balanceActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    gap: 4,
  },
  balanceActionText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
    fontSize: fonts.sizes.sm,
  },
  rulesPreview: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  ruleNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.sm,
  },
  ruleNumber: {
    color: 'white',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  ruleTitle: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    flex: 1,
  },
});