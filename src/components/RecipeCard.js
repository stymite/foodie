import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HeartButton from './HeartButton';
import RecipeImage from './RecipeImage';
import { COLORS, SHADOW } from '../theme';

export default function RecipeCard({ recipe, categoryName, onPress }) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
        accessibilityRole="button"
        accessibilityLabel={`Open recipe ${recipe.name}`}
      >
        <RecipeImage uri={recipe.image} style={styles.image} />
        {categoryName ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{categoryName}</Text>
          </View>
        ) : null}
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {recipe.name}
          </Text>
          <View style={styles.meta}>
            {recipe.prepTime ? <Meta icon="time-outline" text={`${recipe.prepTime} min`} /> : null}
            {recipe.calories ? <Meta icon="flame-outline" text={`${recipe.calories} kcal`} /> : null}
            {recipe.difficulty ? <Meta icon="speedometer-outline" text={recipe.difficulty} /> : null}
          </View>
        </View>
      </Pressable>
      <HeartButton recipeId={recipe.id} style={styles.heart} />
    </View>
  );
}

function Meta({ icon, text }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color={COLORS.muted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 18, marginBottom: 16, overflow: 'hidden', ...SHADOW },
  pressed: { opacity: 0.85 },
  image: { width: '100%', height: 180, backgroundColor: COLORS.chip },
  heart: { position: 'absolute', top: 12, right: 12 },
  badge: {
    position: 'absolute',
    left: 12,
    top: 148,
    backgroundColor: 'rgba(43,33,24,0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  body: { padding: 14 },
  name: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  meta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  metaText: { marginLeft: 4, fontSize: 13, color: COLORS.muted },
});
