import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, router } from 'expo-router';
import { Check, ChevronLeft, Search, Ticket } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ParkedDevice = {
  id: string;
  patronId: string;
  ticketNumber: string;
  patronName: string;
  mobile: string;
  devicesRemaining: number;
  parkedAt: Date;
};

const INITIAL_PARKED_DEVICES: ParkedDevice[] = [
  {
    id: 'pd-1',
    patronId: '1',
    ticketNumber: '1001',
    patronName: 'John Smith',
    mobile: '555-0101',
    devicesRemaining: 2,
    parkedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'pd-2',
    patronId: '2',
    ticketNumber: '1002',
    patronName: 'Sarah Johnson',
    mobile: '555-0102',
    devicesRemaining: 1,
    parkedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'pd-3',
    patronId: '3',
    ticketNumber: '1003',
    patronName: 'Michael Chen',
    mobile: '555-0103',
    devicesRemaining: 3,
    parkedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'pd-4',
    patronId: '4',
    ticketNumber: '1004',
    patronName: 'Emma Davis',
    mobile: '555-0104',
    devicesRemaining: 2,
    parkedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'pd-5',
    patronId: '5',
    ticketNumber: '1005',
    patronName: 'Lucas Rodriguez',
    mobile: '555-0105',
    devicesRemaining: 1,
    parkedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export default function PickupScreen() {
  const [devices, setDevices] = useState<ParkedDevice[]>(INITIAL_PARKED_DEVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<ParkedDevice | null>(null);
  const [devicesPickedUp, setDevicesPickedUp] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCompletedTicket, setLastCompletedTicket] = useState<string | null>(null);

  const filteredDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return devices;

    return devices.filter(
      (device) =>
        device.ticketNumber.includes(query) ||
        device.patronName.toLowerCase().includes(query) ||
        device.mobile.includes(query)
    );
  }, [devices, searchQuery]);

  const openPickupModal = (device: ParkedDevice) => {
    setSelectedDevice(device);
    setDevicesPickedUp(1);
  };

  const closePickupModal = () => {
    setSelectedDevice(null);
    setDevicesPickedUp(1);
  };

  const completePickup = () => {
    if (!selectedDevice) return;

    const remaining = selectedDevice.devicesRemaining - devicesPickedUp;
    setLastCompletedTicket(selectedDevice.ticketNumber);

    if (remaining <= 0) {
      setDevices((current) => current.filter((device) => device.id !== selectedDevice.id));
    } else {
      setDevices((current) =>
        current.map((device) =>
          device.id === selectedDevice.id ? { ...device, devicesRemaining: remaining } : device
        )
      );
    }

    closePickupModal();
    setShowSuccess(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Pick Up' }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="border-b border-border px-5 pb-3 pt-2">
          <Button
            variant="outline"
            className="mb-4 h-11 flex-row items-center gap-2 self-start px-3"
            onPress={() => router.push('/')}>
            <Icon as={ChevronLeft} size={16} />
            <Text>Back to Dashboard</Text>
          </Button>
          <Text className="text-3xl font-bold text-foreground">Pick Up</Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-5 py-5 pb-8">
          <View className="flex-row items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
            <Icon as={Search} size={16} className="text-muted-foreground" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by ticket ID, name, or mobile..."
              placeholderTextColor="#71717A"
              className="flex-1 text-base text-foreground"
            />
          </View>

          <View className="gap-3">
            {filteredDevices.length === 0 ? (
              <View className="rounded-lg border border-border bg-card p-4">
                <Text className="text-muted-foreground">No parked devices found.</Text>
              </View>
            ) : (
              filteredDevices.map((device) => (
                <Pressable
                  key={device.id}
                  onPress={() => openPickupModal(device)}
                  className="rounded-lg border border-border bg-card p-4 active:opacity-80">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="rounded-md bg-primary px-3 py-1">
                      <Text className="text-lg font-bold text-primary-foreground">{device.ticketNumber}</Text>
                    </View>
                    <Text className="text-sm font-medium text-emerald-700">
                      {device.devicesRemaining} device{device.devicesRemaining === 1 ? '' : 's'} remaining
                    </Text>
                  </View>
                  <View className="mt-3">
                    <Text className="text-base font-semibold text-foreground">{device.patronName}</Text>
                    <Text className="mt-1 text-sm text-muted-foreground">{device.mobile}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>

        <PickupModal
          device={selectedDevice}
          devicesPickedUp={devicesPickedUp}
          onSelectCount={setDevicesPickedUp}
          onClose={closePickupModal}
          onComplete={completePickup}
        />

        {showSuccess && (
          <SuccessModal
            ticketNumber={lastCompletedTicket}
            onBackToList={() => setShowSuccess(false)}
            onReturnDashboard={() => {
              setShowSuccess(false);
              router.push('/');
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
}

type PickupModalProps = {
  device: ParkedDevice | null;
  devicesPickedUp: number;
  onSelectCount: (value: number) => void;
  onClose: () => void;
  onComplete: () => void;
};

function PickupModal({
  device,
  devicesPickedUp,
  onSelectCount,
  onClose,
  onComplete,
}: PickupModalProps) {
  return (
    <Modal visible={!!device} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-2xl bg-background px-5 pb-7 pt-4">
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-muted" />
          <Text className="text-xl font-semibold text-foreground">Verify Device</Text>
          <Text className="mt-1 text-sm text-muted-foreground">Confirm the device being picked up</Text>

          {device && (
            <>
              <View className="mt-5 rounded-lg bg-secondary p-4">
                <Text className="mb-2 text-sm text-muted-foreground">Verify device is</Text>
                <View className="flex-row items-center gap-2">
                  <Icon as={Ticket} size={16} className="text-primary" />
                  <Text className="text-4xl font-bold text-primary">{device.ticketNumber}</Text>
                </View>
              </View>

              <View className="mt-4 rounded-lg border border-border bg-card p-4">
                <Text className="text-sm text-muted-foreground">
                  Devices remaining for this ticket: {device.devicesRemaining}
                </Text>
              </View>

              <View className="mt-5">
                <Text className="mb-2 text-sm font-medium text-foreground">
                  How many devices are being picked up?
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {Array.from({ length: device.devicesRemaining }, (_, i) => i + 1).map((count) => (
                    <Pressable
                      key={`pickup-count-${count}`}
                      onPress={() => onSelectCount(count)}
                      className={`rounded-md border px-4 py-2 ${
                        devicesPickedUp === count ? 'border-primary bg-primary' : 'border-input bg-background'
                      }`}>
                      <Text
                        className={`text-sm font-medium ${
                          devicesPickedUp === count ? 'text-primary-foreground' : 'text-foreground'
                        }`}>
                        {count}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          <View className="mt-6 flex-row gap-3">
            <Button variant="outline" className="h-12 flex-1" onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button className="h-12 flex-1" onPress={onComplete}>
              <Text>Complete Pick-Up</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type SuccessModalProps = {
  ticketNumber: string | null;
  onBackToList: () => void;
  onReturnDashboard: () => void;
};

function SuccessModal({ ticketNumber, onBackToList, onReturnDashboard }: SuccessModalProps) {
  return (
    <Modal visible animationType="fade" transparent onRequestClose={onBackToList}>
      <View className="flex-1 items-center justify-center bg-black/40 px-5">
        <View className="w-full rounded-xl border border-border bg-card p-6">
          <View className="mb-3 flex-row items-center gap-2">
            <Icon as={Check} size={20} className="text-emerald-600" />
            <Text className="text-xl font-semibold text-foreground">Pick-Up Complete</Text>
          </View>
          <Text className="mb-6 text-muted-foreground">
            Ticket {ticketNumber ?? 'N/A'} updated successfully.
          </Text>
          <View className="gap-3">
            <Button className="h-12" onPress={onBackToList}>
              <Text>Back to List</Text>
            </Button>
            <Button variant="outline" className="h-12" onPress={onReturnDashboard}>
              <Text>Return to Dashboard</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
