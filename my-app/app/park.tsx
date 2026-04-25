import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function ParkPlaceholderScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Park' }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center gap-4 px-5">
          <Text className="text-2xl font-bold text-foreground">Park - Drop Off</Text>
          <Text className="text-center text-base text-muted-foreground">
            Placeholder screen wired. We will build this flow next.
          </Text>
          <Button size="lg" className="h-12 px-6" onPress={() => router.back()}>
            <Text>Back to Dashboard</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
