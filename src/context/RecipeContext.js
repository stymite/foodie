import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RECIPES } from '../data/recipes';

const FAVORITES_KEY = 'foodie:favorites';
const MY_RECIPES_KEY = 'foodie:myRecipes';

export const MY_FOOD_ID = 'my-food';

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [fav, mine] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(MY_RECIPES_KEY),
        ]);
        if (fav) setFavoriteIds(JSON.parse(fav));
        if (mine) setMyRecipes(JSON.parse(mine));
      } catch (e) {
        // Start with empty data if storage is unavailable or corrupted.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds)).catch(() => {});
  }, [favoriteIds, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(MY_RECIPES_KEY, JSON.stringify(myRecipes)).catch(() => {});
  }, [myRecipes, loaded]);

  const allRecipes = useMemo(() => [...myRecipes, ...RECIPES], [myRecipes]);

  const getRecipe = useCallback((id) => allRecipes.find((r) => r.id === id), [allRecipes]);

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]));
  }, []);

  const favorites = useMemo(
    () => favoriteIds.map((id) => allRecipes.find((r) => r.id === id)).filter(Boolean),
    [favoriteIds, allRecipes],
  );

  const addRecipe = useCallback((data) => {
    const recipe = {
      ...data,
      id: `my-${Date.now()}`,
      categoryId: MY_FOOD_ID,
      isMine: true,
      createdAt: Date.now(),
    };
    setMyRecipes((list) => [recipe, ...list]);
    return recipe;
  }, []);

  const updateRecipe = useCallback((id, data) => {
    setMyRecipes((list) => list.map((r) => (r.id === id ? { ...r, ...data, updatedAt: Date.now() } : r)));
  }, []);

  const deleteRecipe = useCallback((id) => {
    setMyRecipes((list) => list.filter((r) => r.id !== id));
    setFavoriteIds((ids) => ids.filter((x) => x !== id));
  }, []);

  const value = useMemo(
    () => ({
      loaded,
      recipes: RECIPES,
      myRecipes,
      favorites,
      getRecipe,
      isFavorite,
      toggleFavorite,
      addRecipe,
      updateRecipe,
      deleteRecipe,
    }),
    [loaded, myRecipes, favorites, getRecipe, isFavorite, toggleFavorite, addRecipe, updateRecipe, deleteRecipe],
  );

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error('useRecipes must be used inside RecipeProvider');
  return ctx;
}
