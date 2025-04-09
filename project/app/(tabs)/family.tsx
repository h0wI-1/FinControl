import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user-store";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { FamilyRuleCard } from "@/components/FamilyRuleCard";
import { FamilyRule } from "@/types/user";
import { UserSwitcher } from "@/components/UserSwitcher";
import { PlusCircle, Settings } from "lucide-react-native";

export default function FamilyScreen() {
  const { currentUser, family } = useUserStore();
  const [rules, setRules] = useState<FamilyRule[]>(family?.rules || []);
  
  if (!currentUser || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isParent = currentUser.role === 'parent';
  
  const handleToggleRule = (ruleId: string, isActive: boolean) => {
    if (!isParent) return; // Only parents can toggle rules
    
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive } : rule
      )
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Family</Text>
          
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
                  <Text style={styles.roleText}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <UserSwitcher />
        
        <View style={styles.rulesHeader}>
          <Text style={styles.sectionTitle}>Family Rules</Text>
          
          {isParent && (
            <TouchableOpacity style={styles.addRuleButton}>
              <PlusCircle size={20} color={colors.primary} />
              <Text style={styles.addRuleText}>Add Rule</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {rules.map(rule => (
          <FamilyRuleCard 
            key={rule.id} 
            rule={rule} 
            onToggle={handleToggleRule} 
          />
        ))}
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
});