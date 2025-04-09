import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user-store";
import { useFinanceStore } from "@/store/finance-store";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { SavingsGoalCard } from "@/components/SavingsGoalCard";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function GoalsScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { getSavingsGoalsByUser } = useFinanceStore();
  
  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isParent = currentUser.role === 'parent';
  const goals = getSavingsGoalsByUser(currentUser.id);
  
  // Separate active and completed goals
  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings Goals</Text>
        
        {!isParent && (
          <TouchableOpacity 
            style={styles.newButton}
            onPress={() => router.push('/goals/new')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.newButtonText}>New Goal</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {goals.length > 0 ? (
        <FlatList
          data={[...activeGoals, ...completedGoals]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavingsGoalCard 
              goal={item} 
              onPress={() => router.push(`/goals/${item.id}`)}
              onAddFunds={() => router.push(`/goals/${item.id}/add-funds`)}
            />
          )}
          ListHeaderComponent={() => (
            <>
              {activeGoals.length > 0 && (
                <Text style={styles.sectionTitle}>Active Goals</Text>
              )}
            </>
          )}
          ListFooterComponent={() => (
            <>
              {completedGoals.length > 0 && (
                <Text style={styles.sectionTitle}>Completed Goals</Text>
              )}
            </>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No savings goals yet</Text>
          {!isParent && (
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/goals/new')}
            >
              <Text style={styles.emptyButtonText}>Create Goal</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.xs,
  },
  newButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  listContent: {
    padding: layout.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  emptyText: {
    fontSize: fonts.sizes.lg,
    color: colors.textLight,
    marginBottom: layout.spacing.md,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
});