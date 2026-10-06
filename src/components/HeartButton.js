import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRecipes } from '../context/RecipeContext';
import { COLORS, SHADOW } from '../theme';

export default function HeartButton({ recipeId, size = 22, style }) {
  const { isFavorite, toggleFavorite } = useRecipes();
  const active = isFavorite(recipeId);
  return (
    <Pressable
      onPress={() => toggleFavorite(recipeId)}
      style={({ pressed }) => [styles.button, style, pressed && { transform: [{ scale: 0.9 }] }]}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ selected: active }}
      hitSlop={8}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={size} color={active ? COLORS.heart : COLORS.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
});
