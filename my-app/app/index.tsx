import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { RefreshCcw, Wifi, WifiOff } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeviceCard = {
  category: string;
  count: number;
};

const DEVICE_BREAKDOWN: DeviceCard[] = [
  { category: 'Bikes', count: 48 },
  { category: 'eBikes', count: 32 },
  { category: 'Scooters', count: 25 },
  { category: 'Skateboards', count: 18 },
];

const SUMMARY = {
  droppedOff: 123,
  remaining: 98,
};

function formatSyncTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const metricTextSize = width > 420 ? 'text-4xl' : 'text-3xl';
  const breakdownTextSize = width > 420 ? 'text-4xl' : 'text-3xl';
  const [isOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const runManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    // Placeholder sync behavior until database integration is wired.
    setTimeout(() => {
      setLastSync(new Date());
      setIsSyncing(false);
    }, 900);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="flex-1 bg-background">
          <View className="border-b border-border px-5 pb-4 pt-2">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-3xl font-bold text-foreground">BikePark Dashboard</Text>
              <Button
                variant="outline"
                className="h-10 flex-row items-center gap-2 rounded-full px-3"
                onPress={runManualSync}
                disabled={isSyncing}>
                {isOnline ? (
                  <Icon as={Wifi} size={14} className="text-emerald-600" />
                ) : (
                  <Icon as={WifiOff} size={14} className="text-destructive" />
                )}
                <Icon as={RefreshCcw} size={14} className={isSyncing ? 'text-primary' : 'text-muted-foreground'} />
                <Text className="text-xs font-medium text-muted-foreground">
                  {isSyncing ? 'Syncing...' : `Sync ${formatSyncTime(lastSync)}`}
                </Text>
              </Button>
            </View>

            <View className="flex-row gap-3">
              <Link href="/park" asChild>
                <Button size="lg" className="h-14 flex-1">
                  <Text className="text-lg font-semibold">Park</Text>
                </Button>
              </Link>
              <Link href="/pickup" asChild>
                <Button size="lg" className="h-14 flex-1">
                  <Text className="text-lg font-semibold">Pick Up</Text>
                </Button>
              </Link>
            </View>
          </View>

          <ScrollView className="flex-1" contentContainerClassName="gap-5 px-5 py-5 pb-8">
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-lg border border-border bg-card p-4">
                <Text className="mb-2 text-sm font-medium text-muted-foreground">Total Dropped Off</Text>
                <Text className={`${metricTextSize} font-bold text-primary`}>{SUMMARY.droppedOff}</Text>
              </View>
              <View className="flex-1 rounded-lg border border-border bg-card p-4">
                <Text className="mb-2 text-sm font-medium text-muted-foreground">Devices Remaining</Text>
                <Text className={`${metricTextSize} font-bold text-primary`}>{SUMMARY.remaining}</Text>
              </View>
            </View>

            <View className="rounded-lg border border-border bg-card p-4">
              <Text className="mb-4 text-lg font-semibold text-foreground">Device Breakdown</Text>
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {DEVICE_BREAKDOWN.map((device) => (
                  <View
                    key={device.category}
                    className="w-[48.5%] items-center rounded-lg bg-secondary px-2 py-3">
                    <Text className="mb-2 text-center text-sm font-medium text-foreground">
                      {device.category}
                    </Text>
                    <Text className={`${breakdownTextSize} font-bold text-primary`}>{device.count}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="border-t border-border px-5 pb-4 pt-3">
            <Link href="/check-ticket" asChild>
              <Button size="lg" className="h-14">
                <Text className="text-lg font-semibold">Check Ticket</Text>
              </Button>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
