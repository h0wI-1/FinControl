import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { FamilyRule } from '@/types/user';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react-native';
import { useUserStore } from '@/store/user-store';
import { getTranslation } from '@/constants/localization';
import { useSettingsStore } from '@/store/settings-store';

interface FamilyRuleCardProps {
  rule: FamilyRule;
  onEdit: (rule: FamilyRule) => void;
}

export const FamilyRuleCard = ({ rule, onEdit }: FamilyRuleCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { toggleFamilyRule, deleteFamilyRule, currentUser } = useUserStore();
  const { language } = useSettingsStore();
  
  const t = (key: string) => getTranslation(key, language);
  
  const isParent = currentUser?.role === 'parent';
  
  const handleToggle = (value: boolean) => {
    if (!isParent) return;
    toggleFamilyRule(rule.id, value);
  };
  
  const handleDelete = () => {
    if (!isParent) return;
    
    Alert.alert(
      t('deleteRule'),
      t('deleteRuleConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('delete'),
          onPress: () => deleteFamilyRule(rule.id),
          style: 'destructive'
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{rule.title}</Text>
        <View style={styles.headerRight}>
          <Switch
            value={rule.isActive}
            onValueChange={handleToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
            ios_backgroundColor={colors.border}
            disabled={!isParent}
          />
          {expanded ? (
            <ChevronUp size={20} color={colors.text} />
          ) : (
            <ChevronDown size={20} color={colors.text} />
          )}
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.description}>{rule.description}</Text>
          
          {isParent && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onEdit(rule)}
              >
                <Edit size={16} color={colors.primary} />
                <Text style={styles.editButtonText}>{t('edit')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Trash2 size={16} color={colors.danger} />
                <Text style={styles.deleteButtonText}>{t('delete')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  content: {
    padding: layout.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  description: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
    marginBottom: layout.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: layout.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.sm,
    gap: 4,
  },
  editButton: {
    backgroundColor: colors.highlight,
  },
  deleteButton: {
    backgroundColor: 'rgba(231, 111, 81, 0.1)',
  },
  editButtonText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
  },
  deleteButtonText: {
    fontSize: fonts.sizes.sm,
    color: colors.danger,
  },
});