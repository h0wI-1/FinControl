import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Modal,
  Button
} from 'react-native';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { FamilyRule } from '@/types/user';
import { getTranslation } from '../constants/localization'; // Обновите путь, если необходимо
import { useSettingsStore } from '../store/settings-store'; // Обновите путь, если необходимо

interface FamilyRuleFormProps {
  rule?: FamilyRule;
  onSubmit: (rule: Omit<FamilyRule, 'id'>) => void;
  onCancel: () => void;
}

export const FamilyRuleForm = ({ rule, onSubmit, onCancel }: FamilyRuleFormProps) => {
  const { language } = useSettingsStore();
  const t = (key: string) => getTranslation(key, language);
  
  const [title, setTitle] = useState(rule?.title || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [isActive, setIsActive] = useState(rule?.isActive ?? true);
  
  const isEditing = !!rule;
  
  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      isActive
});
  };
  
  const isFormValid = title.trim() !== '' && description.trim() !== '';
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditing ? t('editRule') : t('addRule')}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('ruleTitle')}</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t('ruleTitlePlaceholder')}
            placeholderTextColor={colors.placeholder}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('ruleDescription')}</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder={t('ruleDescriptionPlaceholder')}
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{t('ruleActive')}</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
            ios_backgroundColor={colors.border}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              !isFormValid && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? t('saveChanges') : t('addRule')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: layout.spacing.md,
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
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.text,
    minHeight: 120,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  switchLabel: {
    fontSize: fonts.sizes.md,
    color: colors.text,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

const FamilyScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const handleRuleSubmit = (rule) => {
    // Логика для добавления или обновления правила
    setModalVisible(false);
  };

  return (
    <View>
      <Button title="Add Rule" onPress={() => setModalVisible(true)} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <FamilyRuleForm
              rule={selectedRule}
              onSubmit={handleRuleSubmit}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FamilyScreen;