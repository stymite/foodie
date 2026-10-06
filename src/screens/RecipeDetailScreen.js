import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import HeartButton from '../components/HeartButton';
import RecipeImage from '../components/RecipeImage';
import { useRecipes } from '../context/RecipeContext';
import { CATEGORIES } from '../data/recipes';
import { COLORS, SHADOW } from '../theme';
import { confirmAction } from '../utils/dialogs';

const CATEGORY_NAMES = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

export default function RecipeDetailScreen({ navigation, route }) {
  const { getRecipe, deleteRecipe } = useRecipes();
  const recipe = getRecipe(route.params.recipeId);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Header title="Recipe" onBack={navigation.goBack} />
        <View style={styles.missing}>
          <Text style={styles.missingText}>This recipe is no longer available.</Text>
        </View>
      </View>
    );
  }

  const onDelete = () =>
    confirmAction('Delete recipe', `Delete "${recipe.name}"? This cannot be undone.`, 'Delete', () => {
      navigation.goBack();
      deleteRecipe(recipe.id);
    });

  const stats = [
    { icon: 'time-outline', label: 'Prep time', value: recipe.prepTime ? `${recipe.prepTime} min` : '—' },
    { icon: 'people-outline', label: 'Servings', value: recipe.servings ? String(recipe.servings) : '—' },
    { icon: 'flame-outline', label: 'Calories', value: recipe.calories ? `${recipe.calories} kcal` : '—' },
    { icon: 'speedometer-outline', label: 'Difficulty', value: recipe.difficulty || '—' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={recipe.isMine ? 'My Recipe' : 'Recipe'}
        onBack={navigation.goBack}
        right={<HeartButton recipeId={recipe.id} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <RecipeImage uri={recipe.image} style={styles.image} />

        <View style={styles.tags}>
          <Tag text={recipe.isMine ? 'My Food' : CATEGORY_NAMES[recipe.categoryId]} />
          {recipe.area ? <Tag text={recipe.area} /> : null}
        </View>
        <Text style={styles.name}>{recipe.name}</Text>

        <View style={styles.stats}>
          {stats.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Ionicons name={s.icon} size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Ingredients</Text>
        <View style={styles.box}>
          {recipe.ingredients.map((item, i) => (
            <View key={i} style={styles.ingredient}>
              <View style={styles.dot} />
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Instructions</Text>
        {recipe.instructions.map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {recipe.isMine ? (
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate('RecipeForm', { recipeId: recipe.id })}
              style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && { opacity: 0.8 }]}
              accessibilityRole="button"
            >
              <Ionicons name="create-outline" size={18} color={COLORS.white} />
              <Text style={styles.actionText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && { opacity: 0.8 }]}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              <Text style={[styles.actionText, { color: COLORS.danger }]}>Delete</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Tag({ text }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  image: { width: '100%', height: 240, borderRadius: 20, backgroundColor: COLORS.chip },
  tags: { flexDirection: 'row', marginTop: 16 },
  tag: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: { color: COLORS.primaryDark, fontSize: 12, fontWeight: '700' },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginTop: 8 },
  stats: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
    ...SHADOW,
  },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  statValue: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 6, textAlign: 'center' },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  section: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  box: { backgroundColor: COLORS.card, borderRadius: 16, padding: 14, ...SHADOW },
  ingredient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 10 },
  ingredientText: { flex: 1, fontSize: 15, color: COLORS.text },
  step: { flexDirection: 'row', marginBottom: 14 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNumText: { color: COLORS.white, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22, color: COLORS.text },
  actions: { flexDirection: 'row', marginTop: 16 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  editBtn: { backgroundColor: COLORS.primary, marginRight: 12 },
  deleteBtn: { backgroundColor: COLORS.dangerSoft },
  actionText: { marginLeft: 6, fontSize: 16, fontWeight: '700', color: COLORS.white },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 16, color: COLORS.muted },
});
