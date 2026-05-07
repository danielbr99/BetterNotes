import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Storage } from "../src/services/storage";
import { setApiBaseUrl } from "../src/services/api";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    Storage.getServerUrl().then((url) => {
      if (url) setApiBaseUrl(url);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F2F2F7",
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "#D4A017",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mis Notas" }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
