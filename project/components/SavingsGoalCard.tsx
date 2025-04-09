import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SavingsGoal } from '@/types/finance';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useSettingsStore } from '@/store/settings-store';
import { getTranslation } from '@/constants/localization';
import { Target, Calendar, Check } from 'lucide-react-native';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onPress?: () => void;
  onAddFunds?: () => void;
}

export const SavingsGoalCard = ({ goal, onPress, onAddFunds }: SavingsGoalCardProps) => {
  const { currency, language } = useSettingsStore();
  const t = (key: string) => getTranslation(key, language);
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const formattedProgress = Math.min(Math.round(progress), 100);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Target size={18} color={colors.primary} />
          <Text style={styles.title}>{goal.title}</Text>
        </View>
        
        {goal.isCompleted && (
          <View style={styles.completedBadge}>
            <Check size={14} color="white" />
            <Text style={styles.completedText}>{t('completed')}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.amountsContainer}>
        <Text style={styles.currentAmount}>
          {formatCurrency(goal.currentAmount, currency)}
        </Text>
        <Text style={styles.targetAmount}>
          of {formatCurrency(goal.targetAmount, currency)}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${formattedProgress}%` },
              goal.isCompleted && styles.progressCompleted
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{formattedProgress}%</Text>
      </View>
      
      {goal.deadline && (
        <View style={styles.deadlineContainer}>
          <Calendar size={14} color={colors.textLight} />
          <Text style={styles.deadlineText}>
            {t('targetDate')}: {formatDate(goal.deadline, language === 'ru' ? 'ru-RU' : 'en-US')}
          </Text>
        </View>
      )}
      
      {!goal.isCompleted && onAddFunds && (
        <TouchableOpacity 
          style={styles.addFundsButton}
          onPress={onAddFunds}
        >
          <Text style={styles.addFundsText}>{t('addFunds')}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.xs,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm,
    gap: 4,
  },
  completedText: {
    color: 'white',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: layout.spacing.sm,
    gap: layout.spacing.xs,
  },
  currentAmount: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  targetAmount: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
  progressContainer: {
    marginBottom: layout.spacing.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressCompleted: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    textAlign: 'right',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.xs,
    marginBottom: layout.spacing.sm,
  },
  deadlineText: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
  },
  addFundsButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
  },
  addFundsText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
    fontSize: fonts.sizes.md,
  },
});