import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme';

// Shows the recipe photo, or a placeholder when a user recipe has no image.
export default function RecipeImage({ uri, style }) {
  // Built-in recipes use bundled images (require() results); user recipes store a URI string.
  if (uri) return <Image source={typeof uri === 'string' ? { uri } : uri} style={style} resizeMode="cover" />;
  return (
    <View style={[style, styles.placeholder]}>
      <Text style={styles.emoji}>🍲</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primarySoft },
  emoji: { fontSize: 40 },
});
