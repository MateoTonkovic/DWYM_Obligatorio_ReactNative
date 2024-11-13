import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

export function TabBarIcon({ style, ...props }) {
  return <Ionicons size={28} style={[styles.icon, style]} {...props} />;
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
