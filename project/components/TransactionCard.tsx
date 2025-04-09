import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '@/types/finance';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useSettingsStore } from '@/store/settings-store';
import { getTranslation } from '@/constants/localization';
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Book, Utensils, Shirt, PiggyBank, Package } from 'lucide-react-native';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const { currency, language } = useSettingsStore();
  const t = (key: string) => getTranslation(key, language);
  
  const isIncome = transaction.type === 'income';
  
  const getCategoryIcon = () => {
    switch (transaction.category) {
      case 'food':
        return <Utensils size={20} color={colors.text} />;
      case 'entertainment':
        return <ShoppingBag size={20} color={colors.text} />;
      case 'education':
        return <Book size={20} color={colors.text} />;
      case 'clothing':
        return <Shirt size={20} color={colors.text} />;
      case 'savings':
        return <PiggyBank size={20} color={colors.text} />;
      default:
        return <Package size={20} color={colors.text} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getCategoryIcon()}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.category}>{t(transaction.category)}</Text>
        <Text style={styles.date}>{formatDate(transaction.date, language === 'ru' ? 'ru-RU' : 'en-US')}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <View style={styles.amountRow}>
          {isIncome ? (
            <ArrowDownLeft size={16} color={colors.success} />
          ) : (
            <ArrowUpRight size={16} color={colors.danger} />
          )}
          <Text 
            style={[
              styles.amount, 
              { color: isIncome ? colors.success : colors.danger }
            ]}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
  },
  amountContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amount: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
  },
});