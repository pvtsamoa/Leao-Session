import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: 'rgba(255,255,255,0.1)',
        },
        tabBarActiveTintColor: '#ffe45c',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      }}
    >
      <Tabs.Screen
        name="spaces"
        options={{
          title: 'Spaces',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📡</Text>,
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: 'Music',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🎵</Text>,
        }}
      />
      <Tabs.Screen
        name="soundboard"
        options={{
          title: 'Soundboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✨</Text>,
        }}
      />
    </Tabs>
  );
}
