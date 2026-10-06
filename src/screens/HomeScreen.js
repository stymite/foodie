import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CategoryBar from '../components/CategoryBar';
import MyRecipeItem from '../components/MyRecipeItem';
import RecipeCard from '../components/RecipeCard';
import { MY_FOOD_ID, useRecipes } from '../context/RecipeContext';
import { CATEGORIES } from '../data/recipes';
import { COLORS, SHADOW } from '../theme';
import { confirmAction } from '../utils/dialogs';

export const ALL_ID = 'all';
export const FAVORITES_ID = 'favorites';

const BAR_ITEMS = [
  { id: ALL_ID, name: 'All', icon: '🍽️' },
  { id: MY_FOOD_ID, name: 'My Food', icon: '👩‍🍳', highlight: true },
  { id: FAVORITES_ID, name: 'Favorites', icon: '❤️' },
  ...CATEGORIES,
];

const CATEGORY_NAMES = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

export default function HomeScreen({ navigation, selectedCategory, onSelectCategory }) {
  const { recipes, myRecipes, favorites, deleteRecipe } = useRecipes();

  const openRecipe = (recipe) => navigation.navigate('RecipeDetail', { recipeId: recipe.id });

  const confirmDelete = (recipe) =>
    confirmAction('Delete recipe', `Delete "${recipe.name}"? This cannot be undone.`, 'Delete', () =>
      deleteRecipe(recipe.id),
    );

  const { title, subtitle, data } = useMemo(() => {
    if (selectedCategory === MY_FOOD_ID) {
      return { title: 'My Recipes', subtitle: `${myRecipes.length} saved`, data: myRecipes };
    }
    if (selectedCategory === FAVORITES_ID) {
      return { title: 'Favorites', subtitle: `${favorites.length} saved`, data: favorites };
    }
    if (selectedCategory === ALL_ID) {
      return { title: 'Popular recipes', subtitle: `${recipes.length} recipes`, data: recipes };
    }
    const list = recipes.filter((r) => r.categoryId === selectedCategory);
    return {
      title: `${CATEGORY_NAMES[selectedCategory]} recipes`,
      subtitle: `${list.length} recipes`,
      data: list,
    };
  }, [selectedCategory, recipes, myRecipes, favorites]);

  const isMyFood = selectedCategory === MY_FOOD_ID;

  const renderItem = ({ item }) => {
    if (isMyFood) {
      return (
        <MyRecipeItem
          recipe={item}
          onPress={() => openRecipe(item)}
          onEdit={() => navigation.navigate('RecipeForm', { recipeId: item.id })}
          onDelete={() => confirmDelete(item)}
        />
      );
    }
    const categoryName = item.isMine
      ? 'My Food'
      : selectedCategory === ALL_ID || selectedCategory === FAVORITES_ID
        ? CATEGORY_NAMES[item.categoryId]
        : null;
    return <RecipeCard recipe={item} categoryName={categoryName} onPress={() => openRecipe(item)} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>
            Foodie<Text style={{ color: COLORS.primary }}>.</Text>
          </Text>
          <Text style={styles.tagline}>What are we cooking today?</Text>
        </View>
        <Pressable
          onPress={() => onSelectCategory(FAVORITES_ID)}
          style={({ pressed }) => [styles.favButton, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Show favorites"
        >
          <Ionicons name="heart" size={20} color={COLORS.heart} />
          {favorites.length > 0 ? (
            <View style={styles.favCount}>
              <Text style={styles.favCountText}>{favorites.length}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <CategoryBar items={BAR_ITEMS} selectedId={selectedCategory} onSelect={onSelectCategory} />

      <FlatList
        key={selectedCategory}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {isMyFood ? (
              <Pressable
                onPress={() => navigation.navigate('RecipeForm')}
                style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]}
                accessibilityRole="button"
                accessibilityLabel="Add New Recipe"
              >
                <Ionicons name="add-circle" size={24} color={COLORS.white} />
                <Text style={styles.addText}>Add New Recipe</Text>
              </Pressable>
            ) : null}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionSub}>{subtitle}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState type={selectedCategory} />}
      />
    </View>
  );
}

function EmptyState({ type }) {
  const content =
    type === MY_FOOD_ID
      ? { icon: '📝', text: 'You have not added any recipes yet.\nTap "Add New Recipe" to create your first one.' }
      : type === FAVORITES_ID
        ? { icon: '💔', text: 'No favorites yet.\nTap the heart on any recipe to save it here.' }
        : { icon: '🥄', text: 'No recipes in this category yet.' };
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>{content.icon}</Text>
      <Text style={styles.emptyText}>{content.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  logo: { fontSize: 30, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  favButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  favCount: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favCountText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  sectionSub: { fontSize: 13, color: COLORS.muted },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 20,
    ...SHADOW,
  },
  addText: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyText: { fontSize: 15, color: COLORS.muted, textAlign: 'center', lineHeight: 22 },
});
