import 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Storage } from "../src/services/storage";
import { api, setApiBaseUrl } from "../src/services/api";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { TamaguiProvider } from 'tamagui';
import config from '../src/theme/tamagui.config';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config as gluestackConfig } from "@gluestack-ui/config";
import { LucideFolder, LucideChevronRight } from 'lucide-react-native';

const queryClient = new QueryClient();

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await api.get('/folders');
      return response.data;
    },
  });

  const renderFolderItems = (parentId: number | null = null, level = 0) => {
    return folders
      ?.filter((f: any) => f.parent_id === parentId)
      .map((folder: any) => (
        <View key={folder.id}>
          <DrawerItem
            label={folder.name}
            onPress={() => router.push(`/folder/${folder.id}`)}
            icon={({ color, size }) => (
              <LucideFolder color={color} size={size - 4} style={{ marginLeft: level * 12 }} />
            )}
            labelStyle={{ fontSize: 14, marginLeft: -20 }}
            inactiveTintColor="#8E8E93"
            activeTintColor="#D4A017"
          />
          {renderFolderItems(folder.id, level + 1)}
        </View>
      ));
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#F2F2F7', marginTop: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', marginBottom: 8 }}>
          Carpetas
        </Text>
      </View>
      {renderFolderItems()}
    </DrawerContentScrollView>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    Storage.getServerUrl().then((url) => {
      if (url) setApiBaseUrl(url);
    });
  }, []);

  if (isAuthenticated === null) {
    return null; // Don't render until we know the auth state
  }

  if (!isAuthenticated) {
    if (segments[0] !== "auth") {
      import('expo-router').then(m => m.router.replace('/auth/login'));
      return <View style={{ flex: 1, backgroundColor: '#F2F2F7' }} />;
    }
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
      </Stack>
    );
  }

  if (isAuthenticated && segments[0] === "auth") {
    import('expo-router').then(m => m.router.replace('/'));
    return <View style={{ flex: 1, backgroundColor: '#F2F2F7' }} />;
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F2F2F7",
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "#D4A017",
        drawerActiveTintColor: "#D4A017",
        drawerInactiveTintColor: "#8E8E93",
      }}
    >
      <Drawer.Screen 
        name="index" 
        options={{ 
          drawerLabel: "Todas las Notas",
          title: "Mis Notas" 
        }} 
      />
      <Drawer.Screen 
        name="folders" 
        options={{ 
          drawerLabel: "Carpetas",
          title: "Mis Carpetas" 
        }} 
      />
      <Drawer.Screen 
        name="kanban" 
        options={{ 
          drawerLabel: "Tablero Kanban",
          title: "Tablero Kanban" 
        }} 
      />
      <Drawer.Screen 
        name="trash" 
        options={{ 
          drawerLabel: "Papelera",
          title: "Papelera" 
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          drawerLabel: "Ajustes",
          title: "Configuración" 
        }} 
      />
      <Drawer.Screen
        name="entry/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Detalles",
        }}
      />
      <Drawer.Screen
        name="folder/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Carpeta",
        }}
      />
      <Drawer.Screen
        name="auth/login"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Login",
        }}
      />
      <Drawer.Screen
        name="auth/register"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Registro",
        }}
      />
    </Drawer>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme="light">
        <GluestackUIProvider config={gluestackConfig}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
