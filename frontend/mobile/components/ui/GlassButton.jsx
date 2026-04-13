import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export function GlassButton({ icon, label, onPress, size = 60, color = "#C1673A" }) {
  return (
    <View className="items-center mx-2">
      <TouchableOpacity
        style={{
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: 'rgba(255,255,255,0.4)',
          justifyContent: 'center', alignItems: 'center',
          borderWidth: 1.5, borderColor: color,
          shadowColor: '#2D2D2D', shadowOpacity: 0.05, shadowRadius: 5,
          marginBottom: 8,
        }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <FontAwesome name={icon} size={size * 0.4} color={color} />
      </TouchableOpacity>
      {label && <Text className="text-xs text-leather font-semibold">{label}</Text>}
    </View>
  );
}
