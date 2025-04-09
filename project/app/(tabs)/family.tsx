import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user-store";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { FamilyRuleCard } from "@/components/FamilyRuleCard";
import { FamilyRuleForm } from "@/components/FamilyRuleForm";
import { FamilyRule } from "@/types/user";
import { UserSwitcher } from "@/components/UserSwitcher";
import { PlusCircle, Settings } from "lucide-react-native";
import { getTranslation } from "@/constants/localization";
import { useSettingsStore } from "@/store/settings-store";
import { Platform } from "react-native";

export default function FamilyScreen() {
  const { currentUser, family, addFamilyRule, updateFamilyRule } = useUserStore();
  const { language } = useSettingsStore();
  const t = (key: string) => getTranslation(key, language);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<FamilyRule | null>(null);
  
  if (!currentUser || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  const isParent = currentUser.role === 'parent';
  
  const handleAddRule = () => {
    setEditingRule(null);
    setModalVisible(true);
  };
  
  const handleEditRule = (rule: FamilyRule) => {
    setEditingRule(rule);
    setModalVisible(true);
  };
  
  const handleSubmitRule = (ruleData: Omit<FamilyRule, 'id'>) => {
    if (editingRule) {
      updateFamilyRule(editingRule.id, ruleData);
    } else {
      addFamilyRule(ruleData);
    }
    setModalVisible(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('family')}</Text>
          
          {isParent && (
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.familyCard}>
          <Text style={styles.familyName}>{family.name}</Text>
          <View style={styles.membersContainer}>
            {family.members.map(member => (
              <View key={member.id} style={styles.memberItem}>
                <Image 
                  source={{ uri: member.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }} 
                  style={styles.memberAvatar} 
                />
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{t(member.role)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <UserSwitcher />
        
        <View style={styles.rulesHeader}>
          <Text style={styles.sectionTitle}>{t('familyRules')}</Text>
          
          {isParent && (
            <TouchableOpacity 
              style={styles.addRuleButton}
              onPress={handleAddRule}
            >
              <PlusCircle size={20} color={colors.primary} />
              <Text style={styles.addRuleText}>{t('addRule')}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {family.rules.length > 0 ? (
          family.rules.map(rule => (
            <FamilyRuleCard 
              key={rule.id} 
              rule={rule} 
              onEdit={handleEditRule} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('noRulesYet')}</Text>
            {isParent && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={handleAddRule}
              >
                <Text style={styles.emptyStateButtonText}>{t('addFirstRule')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FamilyRuleForm 
              rule={editingRule || undefined}
              onSubmit={handleSubmitRule}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  settingsButton: {
    padding: layout.spacing.xs,
  },
  familyCard: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  familyName: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: layout.spacing.lg,
  },
  memberItem: {
    alignItems: 'center',
    width: 80,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: layout.spacing.xs,
  },
  memberName: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.sm,
  },
  roleText: {
    fontSize: fonts.sizes.xs,
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
  },
  addRuleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addRuleText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  emptyState: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.xl,
    alignItems: 'center',
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
    justifyContent: 'flex-end', // Размещение модального окна внизу экрана
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.borderRadius.lg,
    borderTopRightRadius: layout.borderRadius.lg,
    paddingTop: layout.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : layout.spacing.md,
    maxHeight: '80%', // Ограничение высоты модального окна
  },
});