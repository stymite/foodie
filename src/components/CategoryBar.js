import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme';

export default function CategoryBar({ items, selectedId, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.bar}>
      {items.map((item) => {
        const active = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} category`}
            accessibilityState={{ selected: active }}
          >
            <View style={[styles.circle, item.highlight && styles.circleHighlight, active && styles.circleActive]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: { flexGrow: 0, flexShrink: 0 },
  row: { paddingHorizontal: 12, paddingVertical: 12 },
  item: { alignItems: 'center', width: 76, marginHorizontal: 2 },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chip,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circleHighlight: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary, borderStyle: 'dashed' },
  circleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryDark, borderStyle: 'solid' },
  icon: { fontSize: 28 },
  label: { marginTop: 6, fontSize: 12, fontWeight: '600', color: COLORS.muted },
  labelActive: { color: COLORS.primary },
});
