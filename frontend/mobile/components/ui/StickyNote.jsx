import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Soft warm sticky note colors — one is picked per note
const NOTE_COLORS = [
  { bg: '#FFF3B0', dot: '#F4C430', text: '#5C4A00' },  // warm yellow
  { bg: '#D5F5E3', dot: '#27AE60', text: '#0E4727' },  // mint green
  { bg: '#EAD8FC', dot: '#9B59B6', text: '#3B0764' },  // soft lavender
  { bg: '#FFD6CC', dot: '#E74C3C', text: '#6B1010' },  // coral
  { bg: '#CFE8FF', dot: '#2980B9', text: '#0A2F5A' },  // sky blue
];

export function StickyNote({ content, index = 0, delay = 200 }) {
  const theme = NOTE_COLORS[index % NOTE_COLORS.length];

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={s.wrapper}>
      {/* Tape strip at top */}
      <View style={[s.tape, { backgroundColor: theme.dot + '55' }]} />

      {/* Note body */}
      <View style={[s.note, { backgroundColor: theme.bg }]}>
        {/* Pin dot */}
        <View style={[s.pin, { backgroundColor: theme.dot }]} />

        {/* From header */}
        <Text style={[s.from, { color: theme.dot }]}>from Monager</Text>

        {/* Content */}
        <Text style={[s.content, { color: theme.text }]}>{content}</Text>

        {/* Signature */}
        <Text style={[s.sig, { color: theme.text + 'AA' }]}>— M</Text>
      </View>

      {/* Fold corner */}
      <View style={[s.fold, { borderBottomColor: theme.bg, borderRightColor: theme.dot + '40' }]} />
    </Animated.View>
  );
}

// Multi-note stack: renders up to 3 notes in a slight fan/offset layout
export function StickyNoteStack({ notes = [], delay = 100 }) {
  if (!notes || notes.length === 0) {
    return (
      <StickyNote
        content={'"Everything looks quiet today. Stay the course, your budget is healthy."'}
        index={0}
        delay={delay}
      />
    );
  }

  return (
    <View style={s.stack}>
      {notes.slice(0, 3).map((note, i) => (
        <Animated.View
          key={i}
          entering={FadeInUp.delay(delay + i * 80).springify()}
          style={[
            s.stackLayer,
            i === 0 && { zIndex: 3 },
            i === 1 && { zIndex: 2, top: -6, left: 8, transform: [{ rotate: '2deg' }] },
            i === 2 && { zIndex: 1, top: -12, left: -8, transform: [{ rotate: '-1.5deg' }] },
          ]}
        >
          <View style={[s.note, { backgroundColor: NOTE_COLORS[i % NOTE_COLORS.length].bg }]}>
            <View style={[s.pin, { backgroundColor: NOTE_COLORS[i % NOTE_COLORS.length].dot }]} />
            <Text style={[s.from, { color: NOTE_COLORS[i % NOTE_COLORS.length].dot }]}>from Monager</Text>
            <Text style={[s.content, { color: NOTE_COLORS[i % NOTE_COLORS.length].text }]}>
              {note.content}
            </Text>
            <Text style={[s.sig, { color: NOTE_COLORS[i % NOTE_COLORS.length].text + 'AA' }]}>— M</Text>
            <View style={[s.fold, {
              borderBottomColor: NOTE_COLORS[i % NOTE_COLORS.length].bg,
              borderRightColor: NOTE_COLORS[i % NOTE_COLORS.length].dot + '40'
            }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { marginBottom: 4, position: 'relative' },
  tape: {
    width: 48, height: 14, borderRadius: 3, alignSelf: 'center',
    position: 'absolute', top: -7, zIndex: 10,
  },
  note: {
    borderRadius: 4, padding: 20, paddingTop: 24,
    shadowColor: '#000', shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 5,
    position: 'relative', overflow: 'hidden',
  },
  pin: {
    width: 10, height: 10, borderRadius: 5,
    alignSelf: 'center', marginBottom: 12,
  },
  from: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  content: {
    fontSize: 16, lineHeight: 26, fontWeight: '500',
    fontStyle: 'italic',
  },
  sig: { fontSize: 13, fontWeight: '700', marginTop: 12, textAlign: 'right' },
  fold: {
    position: 'absolute', bottom: 0, right: 0,
    width: 0, height: 0,
    borderStyle: 'solid',
    borderRightWidth: 24, borderBottomWidth: 24,
    borderBottomColor: 'transparent', borderRightColor: 'transparent',
    // Actual fold colors set inline per theme
  },
  // Stack layout
  stack: { position: 'relative', height: 200, marginBottom: 12 },
  stackLayer: { position: 'absolute', left: 0, right: 0 },
});
