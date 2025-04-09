import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user-store";
import { useFinanceStore } from "@/store/finance-store";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { TransactionCard } from "@/components/TransactionCard";
import { SpendingChart } from "@/components/SpendingChart";
import { mockSpendingStats } from "@/mocks/finance";
import { Filter, Plus } from "lucide-react-native";
import { CategoryType, TransactionType } from "@/types/finance";
import { useRouter } from "expo-router";

export default function TransactionsScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { getTransactionsByUser } = useFinanceStore();
  
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');
  
  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isParent = currentUser.role === 'parent';
  const transactions = getTransactionsByUser(currentUser.id);
  const spendingStats = isParent 
    ? { totalSpent: 0, totalReceived: 0, byCategorySpending: {}, savingsPercentage: 0 } 
    : mockSpendingStats[currentUser.id];
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const typeFilterMatch = typeFilter === 'all' ? true : transaction.type === typeFilter;
    const categoryFilterMatch = categoryFilter === 'all' ? true : transaction.category === categoryFilter;
    
    return typeFilterMatch && categoryFilterMatch;
  });
  
  const renderTypeFilterButton = (type: TransactionType | 'all', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        typeFilter === type && styles.filterButtonActive
      ]}
      onPress={() => setTypeFilter(type)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          typeFilter === type && styles.filterButtonTextActive
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const categories: (CategoryType | 'all')[] = ['all', 'food', 'entertainment', 'education', 'clothing', 'savings', 'other'];
  
  const renderCategoryFilterButton = (category: CategoryType | 'all') => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        categoryFilter === category && styles.categoryButtonActive
      ]}
      onPress={() => setCategoryFilter(category)}
    >
      <Text 
        style={[
          styles.categoryButtonText,
          categoryFilter === category && styles.categoryButtonTextActive
        ]}
      >
        {category === 'all' ? 'All Categories' : category}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Transactions</Text>
              
              {!isParent && (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => router.push('/transactions/new')}
                >
                  <Plus size={20} color="white" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {!isParent && <SpendingChart stats={spendingStats} />}
            
            <View style={styles.filtersContainer}>
              <View style={styles.filterRow}>
                <View style={styles.filterIcon}>
                  <Filter size={16} color={colors.textLight} />
                </View>
                <View style={styles.typeFilters}>
                  {renderTypeFilterButton('all', 'All')}
                  {renderTypeFilterButton('income', 'Income')}
                  {renderTypeFilterButton('expense', 'Expenses')}
                </View>
              </View>
              
              <View style={styles.categoryFilters}>
                {categories.map(renderCategoryFilterButton)}
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Transaction History</Text>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.sm,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.xs,
  },
  addButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  filtersContainer: {
    padding: layout.spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  filterIcon: {
    marginRight: layout.spacing.sm,
  },
  typeFilters: {
    flexDirection: 'row',
    gap: layout.spacing.sm,
  },
  filterButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.spacing.sm,
  },
  categoryButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: layout.spacing.xs,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: fonts.sizes.xs,
    color: colors.text,
    textTransform: 'capitalize',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  listContent: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  emptyContainer: {
    padding: layout.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
});