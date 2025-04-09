import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { useFinanceStore } from "@/store/finance-store";
import { useUserStore } from "@/store/user-store";
import { formatCurrency } from "@/utils/formatters";
import { DollarSign } from "lucide-react-native";

export default function AddFundsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savingsGoals, updateSavingsGoal, addTransaction } = useFinanceStore();
  const { currentUser } = useUserStore();
  
  const [amount, setAmount] = useState('');
  
  const goal = savingsGoals.find(g => g.id === id);
  
  if (!goal || !currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  
  const handleAddFunds = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    
    // Update the goal
    updateSavingsGoal(goal.id, numAmount);
    
    // Add a transaction record
    addTransaction({
      userId: currentUser.id,
      amount: numAmount,
      type: 'expense',
      category: 'savings',
      description: `Added to ${goal.title} savings goal`,
    });
    
    router.back();
  };
  
  const isFormValid = amount.trim() !== '' && parseFloat(amount) > 0;
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: "Add Funds",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Add Funds to Goal</Text>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Current</Text>
              <Text style={styles.infoValue}>{formatCurrency(goal.currentAmount)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Target</Text>
              <Text style={styles.infoValue}>{formatCurrency(goal.targetAmount)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Remaining</Text>
              <Text style={styles.infoValue}>{formatCurrency(remaining)}</Text>
            </View>
          </View>
          
          <Text style={styles.label}>Amount to Add</Text>
          <View style={styles.amountContainer}>
            <View style={styles.currencyContainer}>
              <DollarSign size={24} color={colors.text} />
            </View>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.placeholder}
              autoFocus
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled
              ]}
              onPress={handleAddFunds}
              disabled={!isFormValid}
            >
              <Text style={styles.submitButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
    textAlign: 'center',
  },
  goalTitle: {
    fontSize: fonts.sizes.lg,
    color: colors.primary,
    marginBottom: layout.spacing.lg,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.xl,
    backgroundColor: colors.highlight,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
  },
  label: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    marginBottom: layout.spacing.xl,
  },
  currencyContainer: {
    backgroundColor: colors.highlight,
    padding: layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  amountInput: {
    flex: 1,
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.semibold,
    padding: layout.spacing.md,
    color: colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
  },
  submitButton: {
    flex: 2,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: 'white',
  },
});