import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SpendingStats, CategoryType } from '@/types/finance';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { formatCurrency } from '@/utils/formatters';

interface SpendingChartProps {
  stats: SpendingStats;
}

export const SpendingChart = ({ stats }: SpendingChartProps) => {
  const categoryColors: Record<CategoryType, string> = {
    food: '#FF9F1C',
    entertainment: '#E71D36',
    education: '#2EC4B6',
    clothing: '#7209B7',
    savings: '#4361EE',
    other: '#B5B5B5',
  };
  
  const totalSpending = Object.values(stats.byCategorySpending).reduce((sum, value) => sum + value, 0);
  
  const categories = Object.entries(stats.byCategorySpending)
    .filter(([_, amount]) => amount > 0)
    .sort(([_, a], [__, b]) => b - a) as [CategoryType, number][];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category</Text>
      
      <View style={styles.barContainer}>
        <View style={styles.barChart}>
          {categories.map(([category, amount]) => {
            const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
            return (
              <View 
                key={category}
                style={[
                  styles.barSegment,
                  { 
                    backgroundColor: categoryColors[category as CategoryType],
                    width: `${percentage}%`,
                  }
                ]}
              />
            );
          })}
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        {categories.map(([category, amount]) => (
          <View key={category} style={styles.legendItem}>
            <View style={styles.legendRow}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: categoryColors[category as CategoryType] }
                ]} 
              />
              <Text style={styles.legendCategory}>{category}</Text>
            </View>
            <Text style={styles.legendAmount}>{formatCurrency(amount)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>{formatCurrency(stats.totalSpent)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Received</Text>
          <Text style={styles.summaryValue}>{formatCurrency(stats.totalReceived)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Savings</Text>
          <Text style={styles.summaryValue}>{stats.savingsPercentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  barContainer: {
    marginBottom: layout.spacing.md,
  },
  barChart: {
    height: 24,
    flexDirection: 'row',
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    marginBottom: layout.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: layout.spacing.sm,
  },
  legendCategory: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    textTransform: 'capitalize',
  },
  legendAmount: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: layout.spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
});