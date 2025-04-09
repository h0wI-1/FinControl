import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { useFinanceStore } from "@/store/finance-store";
import { useUserStore } from "@/store/user-store";
import { DollarSign, Calendar } from "lucide-react-native";

export default function NewGoalScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { createSavingsGoal } = useFinanceStore();
  
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  
  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const handleSubmit = () => {
    const numTargetAmount = parseFloat(targetAmount);
    const numInitialAmount = parseFloat(initialAmount) || 0;
    
    if (isNaN(numTargetAmount) || numTargetAmount <= 0) {
      // Handle invalid amount
      return;
    }
    
    createSavingsGoal({
      userId: currentUser.id,
      title,
      targetAmount: numTargetAmount,
      currentAmount: numInitialAmount,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
    
    router.push('/goals');
  };
  
  const isFormValid = 
    title.trim() !== '' && 
    targetAmount.trim() !== '' && 
    parseFloat(targetAmount) > 0;
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: "New Savings Goal",
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create a Savings Goal</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>What are you saving for?</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. New Bike, Video Game, etc."
              placeholderTextColor={colors.placeholder}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Amount</Text>
            <View style={styles.amountContainer}>
              <View style={styles.currencyContainer}>
                <DollarSign size={24} color={colors.text} />
              </View>
              <TextInput
                style={styles.amountInput}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Initial Contribution (Optional)</Text>
            <View style={styles.amountContainer}>
              <View style={styles.currencyContainer}>
                <DollarSign size={24} color={colors.text} />
              </View>
              <TextInput
                style={styles.amountInput}
                value={initialAmount}
                onChangeText={setInitialAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Date (Optional)</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateIconContainer}>
                <Calendar size={24} color={colors.text} />
              </View>
              <TextInput
                style={styles.dateInput}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={colors.placeholder}
              />
            </View>
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
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={styles.submitButtonText}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: layout.spacing.lg,
  },
  label: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
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
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.medium,
    padding: layout.spacing.md,
    color: colors.text,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
  },
  dateIconContainer: {
    backgroundColor: colors.highlight,
    padding: layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  dateInput: {
    flex: 1,
    fontSize: fonts.sizes.lg,
    padding: layout.spacing.md,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.spacing.md,
    marginTop: layout.spacing.md,
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