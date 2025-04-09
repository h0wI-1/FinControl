import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoneyRequest } from '@/types/finance';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts } from '@/constants/fonts';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useUserStore } from '@/store/user-store';
import { useFinanceStore } from '@/store/finance-store';
import { Check, X, Clock, MessageCircle } from 'lucide-react-native';

interface MoneyRequestCardProps {
  request: MoneyRequest;
  onPress?: () => void;
}

export const MoneyRequestCard = ({ request, onPress }: MoneyRequestCardProps) => {
  const { family } = useUserStore();
  const { updateRequestStatus } = useFinanceStore();
  
  const child = family?.members.find(m => m.id === request.childId);
  
  const statusColors = {
    pending: colors.warning,
    approved: colors.success,
    rejected: colors.danger,
  };
  
  const statusIcons = {
    pending: <Clock size={16} color={statusColors.pending} />,
    approved: <Check size={16} color={statusColors.approved} />,
    rejected: <X size={16} color={statusColors.rejected} />,
  };

  const handleApprove = () => {
    updateRequestStatus(request.id, 'approved');
  };

  const handleReject = () => {
    updateRequestStatus(request.id, 'rejected');
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: statusColors[request.status] }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formatCurrency(request.amount)}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{request.category}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          {statusIcons[request.status]}
          <Text style={[styles.statusText, { color: statusColors[request.status] }]}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.childName}>{child?.name || 'Unknown Child'}</Text>
      <Text style={styles.reason}>{request.reason}</Text>
      
      {request.parentNote && (
        <View style={styles.noteContainer}>
          <MessageCircle size={14} color={colors.textLight} />
          <Text style={styles.noteText}>{request.parentNote}</Text>
        </View>
      )}
      
      <Text style={styles.date}>Requested on {formatDate(request.createdAt)}</Text>
      
      {request.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]} 
            onPress={handleApprove}
          >
            <Check size={16} color="white" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]} 
            onPress={handleReject}
          >
            <X size={16} color="white" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.sm,
  },
  amountContainer: {
    flexDirection: 'column',
  },
  amount: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  categoryBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
    marginTop: layout.spacing.xs,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: fonts.sizes.xs,
    color: colors.background,
    fontWeight: fonts.weights.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.xs,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  childName: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  reason: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.sm,
    gap: layout.spacing.xs,
  },
  noteText: {
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    flex: 1,
  },
  date: {
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginBottom: layout.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.spacing.sm,
    marginTop: layout.spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    flex: 1,
    gap: layout.spacing.xs,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
    fontSize: fonts.sizes.sm,
  },
});