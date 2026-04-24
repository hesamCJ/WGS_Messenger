import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style
}) => {
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        isSmall && styles.smallButton,
        isMedium && styles.mediumButton,
        isLarge && styles.largeButton,
        (disabled || loading) && styles.disabledButton,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? '#0084ff' : '#fff'}
        />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={variant === 'secondary' ? '#0084ff' : '#fff'}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.buttonText,
              variant === 'secondary' && styles.secondaryButtonText
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const Badge = ({ count, style }) => {
  if (count === 0) return null;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

export const Divider = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

export const TypingIndicator = () => {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </View>
  );
};

export const EmptyState = ({ icon, title, description }) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={60}
        color="#ccc"
      />
      <Text style={styles.emptyTitle}>{title}</Text>
      {description && (
        <Text style={styles.emptyDescription}>{description}</Text>
      )}
    </View>
  );
};

export const LoadingSpinner = () => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="#0084ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  primaryButton: {
    backgroundColor: '#0084ff'
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  dangerButton: {
    backgroundColor: '#ff3b30'
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 20
  },
  disabledButton: {
    opacity: 0.6
  },
  icon: {
    marginRight: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  secondaryButtonText: {
    color: '#0084ff'
  },
  badge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12
  },
  emptyDescription: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center'
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
