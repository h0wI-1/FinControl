import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { User } from '@/types/user';

export const UserSwitcher = () => {
  const { currentUser, family, switchUser } = useUserStore();

  if (!family || !currentUser) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family Members</Text>
      <View style={styles.userList}>
        {family.members.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.userItem,
              currentUser.id === user.id && styles.activeUser,
            ]}
            onPress={() => switchUser(user.id)}
          >
            <Image
              source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.spacing.md,
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    marginBottom: layout.spacing.sm,
    color: colors.text,
  },
  userList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.spacing.md,
  },
  userItem: {
    alignItems: 'center',
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 80,
  },
  activeUser: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: layout.spacing.xs,
  },
  userName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    textAlign: 'center',
    color: colors.text,
  },
  roleBadge: {
    marginTop: layout.spacing.xs,
    paddingHorizontal: layout.spacing.xs,
    paddingVertical: 2,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.sm,
  },
  roleText: {
    fontSize: fonts.sizes.xs,
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
});