import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { RecipeProvider } from './src/context/RecipeContext';
import HomeScreen, { ALL_ID } from './src/screens/HomeScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import RecipeFormScreen from './src/screens/RecipeFormScreen';
import { COLORS } from './src/theme';

const SCREENS = {
  Home: HomeScreen,
  RecipeDetail: RecipeDetailScreen,
  RecipeForm: RecipeFormScreen,
};

let routeKey = 0;

export default function App() {
  // A tiny stack navigator: every screen in the stack stays mounted (so the feed keeps
  // its scroll position), and only the top one is visible.
  const [stack, setStack] = useState([{ key: 'home', name: 'Home', params: {} }]);
  const [homeCategory, setHomeCategory] = useState(ALL_ID);

  const stackRef = useRef(stack);
  stackRef.current = stack;
  const categoryRef = useRef(homeCategory);
  categoryRef.current = homeCategory;

  const navigate = useCallback((name, params = {}) => {
    routeKey += 1;
    setStack((s) => [...s, { key: `${name}-${routeKey}`, name, params }]);
  }, []);

  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const navigation = useMemo(() => ({ navigate, goBack }), [navigate, goBack]);

  // Android hardware back: pop the stack, or return the feed to "All" before exiting.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stackRef.current.length > 1) {
        goBack();
        return true;
      }
      if (categoryRef.current !== ALL_ID) {
        setHomeCategory(ALL_ID);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [goBack]);

  return (
    <SafeAreaProvider>
      <RecipeProvider>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <StatusBar style="dark" />
          <View style={styles.app}>
            {stack.map((route, i) => {
              const Screen = SCREENS[route.name];
              const isTop = i === stack.length - 1;
              return (
                <View key={route.key} style={[styles.screen, !isTop && styles.hidden]}>
                  <Screen
                    navigation={navigation}
                    route={route}
                    selectedCategory={homeCategory}
                    onSelectCategory={setHomeCategory}
                  />
                </View>
              );
            })}
          </View>
        </SafeAreaView>
      </RecipeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  app: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  screen: { ...StyleSheet.absoluteFillObject },
  hidden: { display: 'none' },
});
