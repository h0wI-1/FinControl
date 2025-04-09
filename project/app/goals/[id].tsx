import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { useFinanceStore } from "@/store/finance-store";
import { useUserStore } from "@/store/user-store";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Target, Calendar, Check, PlusCircle } from "lucide-react-native";

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savingsGoals, completeSavingsGoal } = useFinanceStore();
  const { currentUser } = useUserStore();
  
  const goal = savingsGoals.find(g => g.id === id);
  
  if (!goal || !currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const formattedProgress = Math.min(Math.round(progress), 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  
  const handleComplete = () => {
    Alert.alert(
      "Complete Goal",
      "Are you sure you want to mark this goal as completed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Complete", 
          onPress: () => {
            completeSavingsGoal(goal.id);
            router.back();
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: "Savings Goal",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Target size={24} color={colors.primary} />
              <Text style={styles.title}>{goal.title}</Text>
            </View>
            
            {goal.isCompleted && (
              <View style={styles.completedBadge}>
                <Check size={16} color="white" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
          
          <View style={styles.amountsContainer}>
            <Text style={styles.currentAmount}>
              {formatCurrency(goal.currentAmount)}
            </Text>
            <Text style={styles.targetAmount}>
              of {formatCurrency(goal.targetAmount)}
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
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Remaining</Text>
              <Text style={styles.infoValue}>{formatCurrency(remaining)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>{formatDate(goal.createdAt)}</Text>
            </View>
            
            {goal.deadline && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Target Date</Text>
                <Text style={styles.infoValue}>{formatDate(goal.deadline)}</Text>
              </View>
            )}
          </View>
          
          {goal.deadline && !goal.isCompleted && (
            <View style={styles.deadlineContainer}>
              <Calendar size={20} color={colors.textLight} />
              <Text style={styles.deadlineText}>
                Target date: {formatDate(goal.deadline)}
              </Text>
            </View>
          )}
          
          {!goal.isCompleted && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.addFundsButton}
                onPress={() => router.push(`/goals/${goal.id}/add-funds`)}
              >
                <PlusCircle size={20} color="white" />
                <Text style={styles.addFundsText}>Add Funds</Text>
              </TouchableOpacity>
              
              {formattedProgress >= 100 && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={handleComplete}
                >
                  <Check size={20} color="white" />
                  <Text style={styles.completeText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: layout.spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.xs,
  },
  completedText: {
    color: 'white',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: layout.spacing.md,
    gap: layout.spacing.xs,
  },
  currentAmount: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  targetAmount: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
  progressContainer: {
    marginBottom: layout.spacing.lg,
  },
  progressBackground: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    marginBottom: layout.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressCompleted: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    textAlign: 'right',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.lg,
    flexWrap: 'wrap',
  },
  infoItem: {
    minWidth: '30%',
    marginBottom: layout.spacing.sm,
  },
  infoLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
    padding: layout.spacing.md,
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.lg,
  },
  deadlineText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  actionButtons: {
    gap: layout.spacing.md,
  },
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.sm,
  },
  addFundsText: {
    color: 'white',
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.md,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.sm,
  },
  completeText: {
    color: 'white',
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.md,
  },
});