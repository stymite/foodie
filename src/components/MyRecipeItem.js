import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import RecipeImage from './RecipeImage';
import { COLORS, SHADOW } from '../theme';

export default function MyRecipeItem({ recipe, onPress, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.main, pressed && { opacity: 0.7 }]}
        accessibilityRole="button"
        accessibilityLabel={`Open recipe ${recipe.name}`}
      >
        <RecipeImage uri={recipe.image} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {recipe.name}
          </Text>
          <Text style={styles.sub}>
            {recipe.ingredients.length} ingredients · {recipe.instructions.length} steps
          </Text>
          <Text style={styles.open}>View recipe ›</Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.btn, styles.editBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${recipe.name}`}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.text} />
          <Text style={styles.btnText}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [styles.btn, styles.deleteBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${recipe.name}`}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={[styles.btnText, { color: COLORS.danger }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    ...SHADOW,
  },
  thumb: { width: 96, height: 96, borderRadius: 12, backgroundColor: COLORS.chip },
  main: { flexDirection: 'row' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  open: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginTop: 6 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  sub: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  editBtn: { backgroundColor: COLORS.chip },
  deleteBtn: { backgroundColor: COLORS.dangerSoft },
  btnText: { marginLeft: 4, fontSize: 13, fontWeight: '600', color: COLORS.text },
});
