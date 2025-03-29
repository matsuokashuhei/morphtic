import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person.crop.circle', title: 'Profile', action: () => {} },
        { icon: 'icloud', title: 'Sync Settings', action: () => {} },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { icon: 'paintbrush', title: 'Theme', action: () => {} },
        { icon: 'textformat.size', title: 'Text Size', action: () => {} },
      ]
    },
    {
      title: 'Widget',
      items: [
        { icon: 'rectangle.on.rectangle', title: 'Widget Settings', action: () => {} },
        { icon: 'bell', title: 'Notifications', action: () => {} },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: 'info.circle', title: 'App Info', action: () => {} },
        { icon: 'questionmark.circle', title: 'Help & Support', action: () => {} },
      ]
    },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      
      {settingsSections.map((section, sectionIndex) => (
        <ThemedView key={sectionIndex} style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
          
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity 
              key={itemIndex} 
              style={styles.settingItem}
              onPress={item.action}
            >
              <IconSymbol 
                name={item.icon} 
                size={22} 
                color={Colors[colorScheme ?? 'light'].tint} 
                style={styles.itemIcon}
              />
              <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
              <IconSymbol 
                name="chevron.right" 
                size={16} 
                color="#8E8E93" 
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
