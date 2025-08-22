import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingState = memo<LoadingStateProps>(({ 
  message = 'Loading...', 
  size = 'large' 
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={Colors.primary} />
    <Text style={styles.message}>{message}</Text>
  </View>
));

LoadingState.displayName = 'LoadingState';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = memo<EmptyStateProps>(({
  icon = 'document-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <Ionicons name={icon as any} size={80} color={Colors.textSubtle} />
    <Text style={styles.title}>{title}</Text>
    {message && <Text style={styles.message}>{message}</Text>}
    {actionLabel && onAction && (
      <TouchableOpacity style={styles.actionButton} onPress={onAction}>
        <Text style={styles.actionButtonText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
));

EmptyState.displayName = 'EmptyState';

interface ErrorStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorState = memo<ErrorStateProps>(({
  title = 'Something went wrong',
  message,
  actionLabel = 'Try Again',
  onAction,
}) => (
  <View style={styles.container}>
    <Ionicons name="alert-circle" size={80} color={Colors.error} />
    <Text style={[styles.title, { color: Colors.error }]}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {onAction && (
      <TouchableOpacity style={[styles.actionButton, styles.errorButton]} onPress={onAction}>
        <Text style={[styles.actionButtonText, { color: Colors.white }]}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
));

ErrorState.displayName = 'ErrorState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  errorButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
});
