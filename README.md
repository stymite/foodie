# Foodie 🍽️

Foodie is a React Native (Expo) recipe app. You can browse recipes by category, open a recipe for full details, save favorites, and manage your own recipes.

## Features

- **Main feed** with a horizontal, scrollable category bar: All, My Food, Favorites, plus 12 recipe categories (Beef, Chicken, Dessert, Lamb, Pasta, Pork, Seafood, Side, Starter, Vegan, Vegetarian, Breakfast).
- **Category filtering**: tap a category to load only its recipes.
- **Recipe details**: image, ingredients, step-by-step instructions, prep time, servings, calories and difficulty level.
- **Favorites**: a heart icon on every recipe toggles favorite on and off. Favorites appear under the **Favorites** category (or tap the heart in the top-right corner).
- **My Food**: an **Add New Recipe** form with recipe name, image upload (photo library or image link), ingredients list, step-by-step instructions, optional prep time / servings / calories / difficulty, and a **Save Recipe** button.
- **My Recipes**: every recipe you add is listed here with **Edit** and **Delete** buttons. Tap a recipe to see its full details.
- **Back button** on every inner screen (the Android hardware back button works too).
- Favorites and your own recipes are saved on the device with AsyncStorage.

## Run it

### Snack Expo (no install)

1. Go to <https://snack.expo.dev>.
2. Open the **⋮** menu → **Import Git repository**, then paste this repository's URL.
3. Run it in the **Web** preview, or scan the QR code with **Expo Go**.

### Locally

```bash
npm install
npx expo start        # then press w for web, or scan the QR code with Expo Go
```

Built for Expo SDK 54.

## Project structure

```
App.js                     # app root + small stack navigator with back handling
src/context/RecipeContext  # favorites & my-recipes state (persisted)
src/screens/               # Home (feed), RecipeDetail, RecipeForm (add/edit)
src/components/            # CategoryBar, RecipeCard, MyRecipeItem, HeartButton, Header…
src/data/recipes.js        # built-in categories and recipes
assets/recipes/            # bundled recipe photos
```

Recipe data and photos come from [TheMealDB](https://www.themealdb.com). Prep time, servings, calories and difficulty are illustrative values.
