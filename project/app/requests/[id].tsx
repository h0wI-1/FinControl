import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { useFinanceStore } from "@/store/finance-store";
import { useUserStore } from "@/store/user-store";
import { formatCurrency, formatDateWithTime } from "@/utils/formatters";
import { Check, X, MessageCircle } from "lucide-react-native";

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { requests, updateRequestStatus } = useFinanceStore();
  const { currentUser, family } = useUserStore();
  
  const [parentNote, setParentNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  const request = requests.find(r => r.id === id);
  
  if (!request || !currentUser || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const isParent = currentUser.role === 'parent';
  const isPending = request.status === 'pending';
  const child = family.members.find(m => m.id === request.childId);
  
  const statusColors = {
    pending: colors.warning,
    approved: colors.success,
    rejected: colors.danger,
  };
  
  const handleApprove = () => {
    updateRequestStatus(request.id, 'approved', parentNote);
    Alert.alert(
      "Request Approved",
      "The money has been added to the child's balance.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };
  
  const handleReject = () => {
    updateRequestStatus(request.id, 'rejected', parentNote);
    Alert.alert(
      "Request Rejected",
      "The request has been rejected.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: "Request Details",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { borderLeftColor: statusColors[request.status] }]}>
          <View style={styles.header}>
            <Text style={styles.amount}>{formatCurrency(request.amount)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[request.status] }]}>
              <Text style={styles.statusText}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{child?.name || 'Unknown Child'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Category:</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{request.category}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Requested:</Text>
            <Text style={styles.value}>{formatDateWithTime(request.createdAt)}</Text>
          </View>
          
          {request.status !== 'pending' && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Processed:</Text>
              <Text style={styles.value}>{formatDateWithTime(request.updatedAt)}</Text>
            </View>
          )}
          
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Reason for request:</Text>
            <Text style={styles.reasonText}>{request.reason}</Text>
          </View>
          
          {request.parentNote && (
            <View style={styles.noteContainer}>
              <View style={styles.noteHeader}>
                <MessageCircle size={16} color={colors.textLight} />
                <Text style={styles.noteHeaderText}>Parent Note</Text>
              </View>
              <Text style={styles.noteText}>{request.parentNote}</Text>
            </View>
          )}
          
          {isParent && isPending && (
            <View style={styles.actionSection}>
              {!showNoteInput ? (
                <TouchableOpacity 
                  style={styles.addNoteButton}
                  onPress={() => setShowNoteInput(true)}
                >
                  <MessageCircle size={16} color={colors.primary} />
                  <Text style={styles.addNoteText}>Add Note</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.noteInputContainer}>
                  <TextInput
                    style={styles.noteInput}
                    value={parentNote}
                    onChangeText={setParentNote}
                    placeholder="Add a note to the child..."
                    multiline
                    numberOfLines={3}
                    placeholderTextColor={colors.placeholder}
                  />
                  <TouchableOpacity 
                    style={styles.doneButton}
                    onPress={() => setShowNoteInput(false)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.rejectButton]} 
                  onPress={handleReject}
                >
                  <X size={20} color="white" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.approveButton]} 
                  onPress={handleApprove}
                >
                  <Check size={20} color="white" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
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
  card: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  amount: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
  },
  statusText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
    fontSize: fonts.sizes.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  label: {
    width: 100,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
  },
  value: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: fonts.weights.medium,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.sm,
  },
  categoryText: {
    fontSize: fonts.sizes.sm,
    color: 'white',
    textTransform: 'capitalize',
  },
  reasonContainer: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.lg,
    padding: layout.spacing.md,
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.md,
  },
  reasonLabel: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  reasonText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  noteContainer: {
    marginBottom: layout.spacing.lg,
    padding: layout.spacing.md,
    backgroundColor: colors.highlight,
    borderRadius: layout.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
    gap: layout.spacing.xs,
  },
  noteHeaderText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
  },
  noteText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  actionSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: layout.spacing.md,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.xs,
    marginBottom: layout.spacing.md,
  },
  addNoteText: {
    fontSize: fonts.sizes.md,
    color: colors.primary,
  },
  noteInputContainer: {
    marginBottom: layout.spacing.md,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: layout.spacing.xs,
  },
  doneButton: {
    alignSelf: 'flex-end',
  },
  doneButtonText: {
    fontSize: fonts.sizes.md,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.sm,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.md,
  },
});