import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Header from '../components/Header';
import { useRecipes } from '../context/RecipeContext';
import { COLORS, SHADOW } from '../theme';
import { showMessage } from '../utils/dialogs';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function RecipeFormScreen({ navigation, route }) {
  const { getRecipe, addRecipe, updateRecipe } = useRecipes();
  const existing = route.params.recipeId ? getRecipe(route.params.recipeId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [image, setImage] = useState(existing?.image ?? '');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState(existing?.ingredients?.length ? existing.ingredients : ['']);
  const [steps, setSteps] = useState(existing?.instructions?.length ? existing.instructions : ['']);
  const [prepTime, setPrepTime] = useState(existing?.prepTime ? String(existing.prepTime) : '');
  const [servings, setServings] = useState(existing?.servings ? String(existing.servings) : '');
  const [calories, setCalories] = useState(existing?.calories ? String(existing.calories) : '');
  const [difficulty, setDifficulty] = useState(existing?.difficulty ?? '');
  const [errors, setErrors] = useState({});

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showMessage('Permission needed', 'Please allow photo access to upload a recipe image.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
      });
      if (!result.canceled && result.assets?.length) setImage(result.assets[0].uri);
    } catch (e) {
      showMessage('Could not open photos', String(e?.message || e));
    }
  };

  const applyImageUrl = () => {
    const url = imageUrl.trim();
    if (/^https?:\/\/\S+$/i.test(url)) {
      setImage(url);
      setImageUrl('');
    } else {
      showMessage('Invalid link', 'Please paste a full image link starting with http:// or https://');
    }
  };

  const clearError = (key) => errors[key] && setErrors((e) => ({ ...e, [key]: undefined }));
  const updateAt = (setter, index, value) => setter((list) => list.map((v, i) => (i === index ? value : v)));
  const removeAt = (setter, index) => setter((list) => (list.length > 1 ? list.filter((_, i) => i !== index) : ['']));

  const toNumber = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const save = () => {
    const cleanIngredients = ingredients.map((s) => s.trim()).filter(Boolean);
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Please enter a recipe name.';
    if (!cleanIngredients.length) nextErrors.ingredients = 'Add at least one ingredient.';
    if (!cleanSteps.length) nextErrors.steps = 'Add at least one step.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const data = {
      name: name.trim(),
      image: image || null,
      ingredients: cleanIngredients,
      instructions: cleanSteps,
      prepTime: toNumber(prepTime),
      servings: toNumber(servings),
      calories: toNumber(calories),
      difficulty: difficulty || null,
    };
    if (existing) updateRecipe(existing.id, data);
    else addRecipe(data);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={existing ? 'Edit Recipe' : 'Add New Recipe'} onBack={navigation.goBack} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Label text="Recipe name" required />
          <TextInput
            value={name}
            onChangeText={(v) => {
              setName(v);
              clearError('name');
            }}
            placeholder="e.g. Grandma's apple pie"
            placeholderTextColor={COLORS.muted}
            style={[styles.input, errors.name && styles.inputError]}
          />
          <ErrorText text={errors.name} />

          <Label text="Recipe image" />
          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [styles.imageBox, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Upload image"
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
            ) : (
              <View style={styles.imageEmpty}>
                <Ionicons name="cloud-upload-outline" size={34} color={COLORS.primary} />
                <Text style={styles.imageEmptyText}>Tap to upload a photo</Text>
              </View>
            )}
          </Pressable>
          <View style={styles.row}>
            <SmallButton icon="image-outline" text={image ? 'Change photo' : 'Upload image'} onPress={pickImage} />
            {image ? <SmallButton icon="close" text="Remove" onPress={() => setImage('')} danger /> : null}
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="…or paste an image link"
              placeholderTextColor={COLORS.muted}
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <SmallButton text="Use link" onPress={applyImageUrl} />
          </View>

          <Label text="Ingredients" required />
          {ingredients.map((item, i) => (
            <View key={i} style={styles.listRow}>
              <View style={styles.bullet} />
              <TextInput
                value={item}
                onChangeText={(v) => {
                  updateAt(setIngredients, i, v);
                  clearError('ingredients');
                }}
                placeholder={`Ingredient ${i + 1} (e.g. 2 cups flour)`}
                placeholderTextColor={COLORS.muted}
                style={[styles.input, styles.flex]}
              />
              <RemoveButton onPress={() => removeAt(setIngredients, i)} />
            </View>
          ))}
          <ErrorText text={errors.ingredients} />
          <AddRowButton text="Add ingredient" onPress={() => setIngredients((l) => [...l, ''])} />

          <Label text="Step-by-step instructions" required />
          {steps.map((step, i) => (
            <View key={i} style={styles.listRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <TextInput
                value={step}
                onChangeText={(v) => {
                  updateAt(setSteps, i, v);
                  clearError('steps');
                }}
                placeholder={`Describe step ${i + 1}`}
                placeholderTextColor={COLORS.muted}
                multiline
                style={[styles.input, styles.flex, styles.multiline]}
              />
              <RemoveButton onPress={() => removeAt(setSteps, i)} />
            </View>
          ))}
          <ErrorText text={errors.steps} />
          <AddRowButton text="Add step" onPress={() => setSteps((l) => [...l, ''])} />

          <Label text="Details (optional)" />
          <View style={styles.row}>
            <NumberField label="Prep (min)" value={prepTime} onChange={setPrepTime} />
            <NumberField label="Servings" value={servings} onChange={setServings} />
            <NumberField label="Calories" value={calories} onChange={setCalories} last />
          </View>
          <Text style={styles.subLabel}>Difficulty</Text>
          <View style={styles.row}>
            {DIFFICULTIES.map((d) => {
              const active = d === difficulty;
              return (
                <Pressable
                  key={d}
                  onPress={() => setDifficulty(active ? '' : d)}
                  style={[styles.segment, active && styles.segmentActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{d}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={save}
            style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel="Save Recipe"
          >
            <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
            <Text style={styles.saveText}>Save Recipe</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Label({ text, required }) {
  return (
    <Text style={styles.label}>
      {text}
      {required ? <Text style={{ color: COLORS.primary }}> *</Text> : null}
    </Text>
  );
}

function ErrorText({ text }) {
  return text ? <Text style={styles.error}>{text}</Text> : null;
}

function SmallButton({ icon, text, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.smallBtn, danger && styles.smallBtnDanger, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
    >
      {icon ? <Ionicons name={icon} size={16} color={danger ? COLORS.danger : COLORS.text} /> : null}
      <Text style={[styles.smallBtnText, danger && { color: COLORS.danger }]}>{text}</Text>
    </Pressable>
  );
}

function RemoveButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.remove}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel="Remove"
    >
      <Ionicons name="close-circle" size={24} color={COLORS.muted} />
    </Pressable>
  );
}

function AddRowButton({ text, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.addRow, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
    >
      <Ionicons name="add" size={18} color={COLORS.primary} />
      <Text style={styles.addRowText}>{text}</Text>
    </Pressable>
  );
}

function NumberField({ label, value, onChange, last }) {
  return (
    <View style={[styles.flex, !last && { marginRight: 8 }]}>
      <Text style={styles.subLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        placeholder="—"
        placeholderTextColor={COLORS.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 48 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginTop: 20, marginBottom: 8 },
  subLabel: { fontSize: 13, fontWeight: '600', color: COLORS.muted, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.danger },
  multiline: { minHeight: 64, textAlignVertical: 'top' },
  error: { color: COLORS.danger, fontSize: 13, marginTop: 4 },
  imageBox: {
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    marginBottom: 10,
  },
  preview: { width: '100%', height: '100%' },
  imageEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageEmptyText: { marginTop: 6, color: COLORS.primaryDark, fontWeight: '600' },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chip,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  smallBtnDanger: { backgroundColor: COLORS.dangerSoft },
  smallBtnText: { marginLeft: 4, fontWeight: '600', color: COLORS.text },
  listRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 10 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepNumText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  remove: { marginLeft: 6 },
  addRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  addRowText: { color: COLORS.primary, fontWeight: '700', marginLeft: 4 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.chip,
  },
  segmentActive: { backgroundColor: COLORS.primary },
  segmentText: { fontWeight: '600', color: COLORS.text },
  segmentTextActive: { color: COLORS.white },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 28,
    ...SHADOW,
  },
  saveText: { color: COLORS.white, fontSize: 17, fontWeight: '800', marginLeft: 8 },
});
