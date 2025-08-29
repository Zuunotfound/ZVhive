import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://zvhive-bl7rhxlu9-ven-s-projects.vercel.app';

function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [url]);
  return { data, loading, error };
}

function HomeScreen({ navigation }) {
  const { data, loading } = useFetch(`${API_BASE}/health`);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>ZVHive Mobile</Text>
      {loading ? <ActivityIndicator /> : <Text>API: {data?.status}</Text>}
      <View style={{ height: 12 }} />
      <Button title="Reader" onPress={() => navigation.navigate('Reader')} />
    </View>
  );
}

function ReaderScreen() {
  const { data, loading } = useFetch(`${API_BASE}/api/content/series`);
  if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;
  const items = Array.isArray(data) ? data : [];
  return (
    <FlatList
      style={{ flex: 1 }}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: '600' }}>{item.title}</Text>
          <Text style={{ color: '#666' }}>{item.kind}</Text>
        </View>
      )}
    />
  );
}

const Stack = createNativeStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reader" component={ReaderScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Main" component={HomeStack} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
