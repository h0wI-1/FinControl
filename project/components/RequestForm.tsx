import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { CategoryType } from '@/types/finance';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { useFinanceStore } from '@/store/finance-store';
import { useUserStore } from '@/store/user-store';
import { DollarSign } from 'lucide-react-native';

interface RequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RequestForm = ({ onSuccess, onCancel }: RequestFormProps) => {
  const { currentUser } = useUserStore();
  const { createRequest } = useFinanceStore();
  
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<CategoryType>('other');
  
  const categories: CategoryType[] = [
    'food', 
    'entertainment', 
    'education', 
    'clothing', 
    'savings', 
    'other'
  ];
  
  const handleSubmit = () => {
    if (!currentUser) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      // Handle invalid amount
      return;
    }
    
    createRequest({
      childId: currentUser.id,
      amount: numAmount,
      reason,
      category,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const isFormValid = amount.trim() !== '' && 
    parseFloat(amount) > 0 && 
    reason.trim() !== '';
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Request Money</Text>
          
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
            />
          </View>
          
          <Text style={styles.label}>What do you need it for?</Text>
          <TextInput
            style={styles.reasonInput}
            value={reason}
            onChangeText={setReason}
            placeholder="Explain why you need this money..."
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.placeholder}
          />
          
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text 
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.categoryButtonTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onCancel}
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
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
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
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.semibold,
    padding: layout.spacing.md,
    color: colors.text,
  },
  label: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.spacing.sm,
    marginBottom: layout.spacing.xl,
  },
  categoryButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    textTransform: 'capitalize',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: fonts.weights.medium,
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