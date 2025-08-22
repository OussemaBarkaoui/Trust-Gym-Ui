import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
}

export const Header = memo<HeaderProps>(({
  title,
  onBackPress,
  rightComponent,
  showBackButton = true,
}) => (
  <View style={styles.container}>
    {showBackButton ? (
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
    ) : (
      <View style={styles.spacer} />
    )}
    
    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>
    
    <View style={styles.rightContainer}>
      {rightComponent || <View style={styles.spacer} />}
    </View>
  </View>
));

Header.displayName = 'Header';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    minHeight: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  spacer: {
    width: 40,
  },
});
