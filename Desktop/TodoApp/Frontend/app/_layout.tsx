import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { CategoryProvider } from "./Category/CategoryContext"; // <-- Import your provider

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CategoryProvider>
        <Stack>
          <Stack.Screen name="onboarding/start" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="onboarding/manage" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </CategoryProvider>
    </ThemeProvider>
  );
}

// import { Header } from "@react-navigation/elements";
// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack>
//       {/* <Stack.Screen name="login" options={{ headerShown: false }} />
//       <Stack.Screen name="signup" options={{ headerShown: false }} /> */}

//       {/* <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} /> */}
//       <Stack.Screen name="onboarding/start" options={{ headerShown: false }} />
//       {/* <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
//       <Stack.Screen name="onboarding/order" options={{ headerShown: false }} />
//       <Stack.Screen name="onboarding/payment" options={{ headerShown: false }} />
//       <Stack.Screen name="onboarding/delivery" options={{ headerShown: false }} />
//       <Stack.Screen name="onboarding/Registration" options={{ headerShown: false }} />
//       <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
//       <Stack.Screen name="onboarding/signin" options={{ headerShown: false }} />
//       <Stack.Screen name="HomeScreen/home" options={{ headerShown: false }} />
//       <Stack.Screen name="categories/[id]" options={{ headerShown: false }} />
//       <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} /> */}

//       {/* ADD THIS LINE - This was missing! */}
//       {/* <Stack.Screen name="restaurants" options={{ headerShown: false }} /> */}
//     </Stack>
//   );
// }
