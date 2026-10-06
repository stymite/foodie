import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../theme';

export default function Header({ title, onBack, right }) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  side: { width: 92, flexDirection: 'row', alignItems: 'center' },
  right: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: COLORS.text },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: COLORS.chip,
  },
  backText: { marginLeft: 4, fontSize: 15, fontWeight: '600', color: COLORS.text },
  pressed: { opacity: 0.6 },
});
