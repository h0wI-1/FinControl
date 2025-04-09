import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user-store";
import { useFinanceStore } from "@/store/finance-store";
import { colors } from "@/constants/colors";
import { layout } from "@/constants/layout";
import { fonts } from "@/constants/fonts";
import { MoneyRequestCard } from "@/components/MoneyRequestCard";
import { useRouter } from "expo-router";
import { Plus, Filter } from "lucide-react-native";
import { RequestStatus } from "@/types/finance";

export default function RequestsScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { requests } = useFinanceStore();
  
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  
  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isParent = currentUser.role === 'parent';
  
  // Filter requests based on user role and selected filter
  const filteredRequests = requests.filter(request => {
    // For parent, show all requests
    // For child, show only their requests
    const roleFilter = isParent ? true : request.childId === currentUser.id;
    
    // Apply status filter
    const statusFilterMatch = statusFilter === 'all' ? true : request.status === statusFilter;
    
    return roleFilter && statusFilterMatch;
  });
  
  const renderFilterButton = (status: RequestStatus | 'all', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        statusFilter === status && styles.filterButtonActive
      ]}
      onPress={() => setStatusFilter(status)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          statusFilter === status && styles.filterButtonTextActive
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Money Requests</Text>
        
        {!isParent && (
          <TouchableOpacity 
            style={styles.newButton}
            onPress={() => router.push('/requests/new')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.newButtonText}>New Request</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterIcon}>
          <Filter size={16} color={colors.textLight} />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {renderFilterButton('all', 'All')}
          {renderFilterButton('pending', 'Pending')}
          {renderFilterButton('approved', 'Approved')}
          {renderFilterButton('rejected', 'Rejected')}
        </ScrollView>
      </View>
      
      {filteredRequests.length > 0 ? (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MoneyRequestCard 
              request={item} 
              onPress={() => router.push(`/requests/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No requests found</Text>
          {!isParent && (
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/requests/new')}
            >
              <Text style={styles.emptyButtonText}>Create Request</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.sm,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.xs,
  },
  newButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  filterIcon: {
    marginRight: layout.spacing.sm,
  },
  filtersScroll: {
    paddingRight: layout.spacing.md,
    gap: layout.spacing.sm,
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  listContent: {
    padding: layout.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  emptyText: {
    fontSize: fonts.sizes.lg,
    color: colors.textLight,
    marginBottom: layout.spacing.md,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
});