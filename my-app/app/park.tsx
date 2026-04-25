import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, router } from 'expo-router';
import {
  Check,
  ChevronLeft,
  Pencil,
  RefreshCcw,
  Search,
  Trash2,
  UserPlus2,
  Users,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ViewMode = 'selection' | 'preregistered' | 'blankentry' | 'success';

type Patron = {
  id: string;
  ticketNumber: string;
  name: string;
  mobile: string;
  email: string;
  numDevices: number;
  deviceType: string;
  color: string;
  notes?: string;
};

type FormState = Omit<Patron, 'id'>;

const DEVICE_TYPES = ['Bike', 'eBike', 'Scooter', 'Skateboard'];
const COLORS = ['Red', 'Blue', 'Black', 'Green', 'Yellow', 'White', 'Orange', 'Purple'];

const INITIAL_PATRONS: Patron[] = [
  {
    id: '1',
    ticketNumber: 'BK101',
    name: 'Alex Chen',
    mobile: '0401234567',
    email: 'alex@example.com',
    numDevices: 2,
    deviceType: 'Bike',
    color: 'Black',
    notes: 'Road bikes',
  },
  {
    id: '2',
    ticketNumber: 'BK102',
    name: 'Jamie Lee',
    mobile: '0402234567',
    email: 'jamie@example.com',
    numDevices: 1,
    deviceType: 'eBike',
    color: 'Blue',
    notes: '',
  },
  {
    id: '3',
    ticketNumber: 'BK103',
    name: 'Morgan Diaz',
    mobile: '0403234567',
    email: 'morgan@example.com',
    numDevices: 3,
    deviceType: 'Scooter',
    color: 'Red',
    notes: 'Family group',
  },
  {
    id: '4',
    ticketNumber: 'BK104',
    name: 'Taylor Singh',
    mobile: '0404234567',
    email: 'taylor@example.com',
    numDevices: 1,
    deviceType: 'Skateboard',
    color: 'White',
    notes: '',
  },
  {
    id: '5',
    ticketNumber: 'BK105',
    name: 'Jordan Kim',
    mobile: '0405234567',
    email: 'jordan@example.com',
    numDevices: 2,
    deviceType: 'Bike',
    color: 'Green',
    notes: '',
  },
];

const EMPTY_FORM: FormState = {
  ticketNumber: '',
  name: '',
  mobile: '',
  email: '',
  numDevices: 1,
  deviceType: '',
  color: '',
  notes: '',
};

export default function ParkScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [patrons, setPatrons] = useState<Patron[]>(INITIAL_PATRONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [editingPatron, setEditingPatron] = useState<Patron | null>(null);
  const [blankEntry, setBlankEntry] = useState<FormState>(EMPTY_FORM);

  const filteredPatrons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return patrons;
    return patrons.filter(
      (patron) =>
        patron.name.toLowerCase().includes(query) || patron.mobile.includes(query)
    );
  }, [patrons, searchQuery]);

  const startEditPatron = (patron: Patron) => {
    setEditingPatron({ ...patron });
  };

  const saveEditedPatron = () => {
    if (!editingPatron) return;
    if (!editingPatron.ticketNumber.trim() || !editingPatron.deviceType.trim()) {
      Alert.alert('Missing required fields', 'Ticket number and device type are required.');
      return;
    }
    setPatrons((current) => current.map((p) => (p.id === editingPatron.id ? editingPatron : p)));
    setEditingPatron(null);
  };

  const deletePatron = (patron: Patron) => {
    Alert.alert('Delete Patron', `Delete ${patron.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setPatrons((current) => current.filter((p) => p.id !== patron.id)),
      },
    ]);
  };

  const refreshPatrons = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }));
    }, 700);
  };

  const submitBlankEntry = () => {
    if (!blankEntry.ticketNumber.trim() || !blankEntry.deviceType.trim()) {
      Alert.alert('Missing required fields', 'Ticket number and device type are required.');
      return;
    }
    setViewMode('success');
  };

  const resetBlankEntry = () => setBlankEntry(EMPTY_FORM);

  const submitStyle = !blankEntry.ticketNumber.trim() || !blankEntry.deviceType.trim() ? 'outline' : 'default';

  return (
    <>
      <Stack.Screen options={{ title: 'Park - Drop Off' }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="border-b border-border px-5 pb-3 pt-2">
          <Button
            variant="outline"
            className="mb-4 h-11 flex-row items-center gap-2 self-start px-3"
            onPress={() => router.push('/')}>
            <Icon as={ChevronLeft} size={16} />
            <Text>Back to Dashboard</Text>
          </Button>
          <Text className="text-3xl font-bold text-foreground">Park - Drop Off</Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-5 py-5 pb-8">
          {viewMode === 'selection' && (
            <>
              <Text className="text-lg font-semibold text-foreground">Select Drop-Off Method</Text>
              <Pressable
                onPress={() => setViewMode('preregistered')}
                className="rounded-lg border-2 border-border bg-card p-4 active:opacity-80">
                <View className="flex-row items-center gap-3">
                  <View className="size-6 items-center justify-center rounded-full border-2 border-primary">
                    <View className="size-3 rounded-full bg-primary" />
                  </View>
                  <Icon as={Users} size={20} className="text-foreground" />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">Pre-Registered</Text>
                    <Text className="text-sm text-muted-foreground">Select from existing patrons</Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setViewMode('blankentry')}
                className="rounded-lg border-2 border-border bg-card p-4 active:opacity-80">
                <View className="flex-row items-center gap-3">
                  <View className="size-6 rounded-full border-2 border-muted-foreground" />
                  <Icon as={UserPlus2} size={20} className="text-foreground" />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">Blank Entry</Text>
                    <Text className="text-sm text-muted-foreground">Create new patron record</Text>
                  </View>
                </View>
              </Pressable>
            </>
          )}

          {viewMode === 'preregistered' && (
            <>
              <Button variant="outline" className="h-11 self-start px-3" onPress={() => setViewMode('selection')}>
                <Text>Back to Selection</Text>
              </Button>

              <View className="rounded-lg border border-border bg-card p-3">
                <View className="flex-row items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                  <Icon as={Search} size={16} className="text-muted-foreground" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by name or mobile"
                    placeholderTextColor="#71717A"
                    className="flex-1 text-base text-foreground"
                  />
                </View>
                <View className="mt-3 flex-row items-center justify-between">
                  <Button variant="outline" className="h-10 px-3" onPress={refreshPatrons} disabled={isRefreshing}>
                    <Icon as={RefreshCcw} size={14} className="text-foreground" />
                    <Text>{isRefreshing ? 'Refreshing...' : 'Refresh'}</Text>
                  </Button>
                  <Text className="text-xs text-muted-foreground">
                    {lastRefresh ? `Updated ${lastRefresh}` : 'Not refreshed yet'}
                  </Text>
                </View>
              </View>

              <View className="gap-3">
                {filteredPatrons.length === 0 ? (
                  <View className="rounded-lg border border-border bg-card p-4">
                    <Text className="text-muted-foreground">No patrons match this search.</Text>
                  </View>
                ) : (
                  filteredPatrons.map((patron) => (
                    <View key={patron.id} className="rounded-lg border border-border bg-card p-4">
                      <Text className="text-lg font-semibold text-foreground">{patron.name}</Text>
                      <Text className="mt-1 text-sm text-muted-foreground">{patron.mobile}</Text>
                      <View className="mt-3 flex-row gap-2">
                        <Button variant="outline" className="h-10 flex-1" onPress={() => startEditPatron(patron)}>
                          <Icon as={Pencil} size={14} className="text-foreground" />
                          <Text>Edit</Text>
                        </Button>
                        <Button variant="destructive" className="h-10 flex-1" onPress={() => deletePatron(patron)}>
                          <Icon as={Trash2} size={14} className="text-white" />
                          <Text>Delete</Text>
                        </Button>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </>
          )}

          {viewMode === 'blankentry' && (
            <>
              <Button variant="outline" className="h-11 self-start px-3" onPress={() => setViewMode('selection')}>
                <Text>Back to Selection</Text>
              </Button>

              <View className="gap-4 rounded-lg border border-border bg-card p-4">
                <FormInput label="Name" value={blankEntry.name} onChangeText={(value) => setBlankEntry((current) => ({ ...current, name: value }))} />
                <FormInput label="Mobile" keyboardType="phone-pad" value={blankEntry.mobile} onChangeText={(value) => setBlankEntry((current) => ({ ...current, mobile: value }))} />
                <FormInput label="Email" keyboardType="email-address" autoCapitalize="none" value={blankEntry.email} onChangeText={(value) => setBlankEntry((current) => ({ ...current, email: value }))} />
                <FormInput
                  label="Ticket Number *"
                  value={blankEntry.ticketNumber}
                  onChangeText={(value) => setBlankEntry((current) => ({ ...current, ticketNumber: value }))}
                />

                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Number of Devices</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((count) => (
                      <ChoiceChip
                        key={`count-${count}`}
                        label={`${count}`}
                        selected={blankEntry.numDevices === count}
                        onPress={() => setBlankEntry((current) => ({ ...current, numDevices: count }))}
                      />
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Device Type *</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {DEVICE_TYPES.map((deviceType) => (
                      <ChoiceChip
                        key={deviceType}
                        label={deviceType}
                        selected={blankEntry.deviceType === deviceType}
                        onPress={() => setBlankEntry((current) => ({ ...current, deviceType }))}
                      />
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Device Color</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <ChoiceChip
                        key={color}
                        label={color}
                        selected={blankEntry.color === color}
                        onPress={() => setBlankEntry((current) => ({ ...current, color }))}
                      />
                    ))}
                  </View>
                </View>

                <FormInput
                  label="Notes"
                  multiline
                  numberOfLines={4}
                  value={blankEntry.notes ?? ''}
                  onChangeText={(value) => setBlankEntry((current) => ({ ...current, notes: value }))}
                />

                <Button variant={submitStyle} size="lg" className="mt-2 h-14" onPress={submitBlankEntry}>
                  <Text className="text-lg font-semibold">Confirm Drop-Off</Text>
                </Button>
              </View>
            </>
          )}

          {viewMode === 'success' && (
            <View className="rounded-lg border border-border bg-card p-6">
              <View className="mb-4 flex-row items-center gap-2">
                <Icon as={Check} size={20} className="text-emerald-600" />
                <Text className="text-xl font-semibold text-foreground">Drop-Off Complete</Text>
              </View>
              <Text className="mb-6 text-muted-foreground">
                Ticket {blankEntry.ticketNumber || 'N/A'} registered successfully.
              </Text>
              <View className="gap-3">
                <Button
                  size="lg"
                  className="h-12"
                  onPress={() => {
                    resetBlankEntry();
                    setViewMode('selection');
                  }}>
                  <Text>Continue Drop-Offs</Text>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onPress={() => {
                    resetBlankEntry();
                    router.push('/');
                  }}>
                  <Text>Return to Dashboard</Text>
                </Button>
              </View>
            </View>
          )}
        </ScrollView>

        <EditPatronModal
          patron={editingPatron}
          onClose={() => setEditingPatron(null)}
          onSave={saveEditedPatron}
          onChange={setEditingPatron}
        />
      </SafeAreaView>
    </>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function FormInput({
  label,
  value,
  onChangeText,
  multiline,
  numberOfLines,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: FormInputProps) {
  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#71717A"
        className={`rounded-md border border-input bg-background px-3 py-2 text-base text-foreground ${
          multiline ? 'min-h-24 align-top' : ''
        }`}
      />
    </View>
  );
}

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function ChoiceChip({ label, selected, onPress }: ChoiceChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-md border px-3 py-2 ${selected ? 'border-primary bg-primary' : 'border-input bg-background'}`}>
      <Text className={`text-sm font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

type EditModalProps = {
  patron: Patron | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (value: Patron) => void;
};

function EditPatronModal({ patron, onClose, onSave, onChange }: EditModalProps) {
  return (
    <Modal visible={!!patron} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[92%] rounded-t-2xl bg-background px-5 pb-7 pt-4">
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-muted" />
          <Text className="mb-4 text-xl font-semibold text-foreground">Edit Patron</Text>
          <ScrollView contentContainerClassName="gap-4 pb-4">
            {patron && (
              <>
                <FormInput
                  label="Ticket Number *"
                  value={patron.ticketNumber}
                  onChangeText={(ticketNumber) => onChange({ ...patron, ticketNumber })}
                />
                <FormInput label="Name" value={patron.name} onChangeText={(name) => onChange({ ...patron, name })} />
                <FormInput
                  label="Mobile"
                  keyboardType="phone-pad"
                  value={patron.mobile}
                  onChangeText={(mobile) => onChange({ ...patron, mobile })}
                />
                <FormInput
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={patron.email}
                  onChangeText={(email) => onChange({ ...patron, email })}
                />
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Number of Devices</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((count) => (
                      <ChoiceChip
                        key={`edit-count-${count}`}
                        label={`${count}`}
                        selected={patron.numDevices === count}
                        onPress={() => onChange({ ...patron, numDevices: count })}
                      />
                    ))}
                  </View>
                </View>
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Device Type *</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {DEVICE_TYPES.map((deviceType) => (
                      <ChoiceChip
                        key={`edit-${deviceType}`}
                        label={deviceType}
                        selected={patron.deviceType === deviceType}
                        onPress={() => onChange({ ...patron, deviceType })}
                      />
                    ))}
                  </View>
                </View>
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Device Color</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <ChoiceChip
                        key={`edit-${color}`}
                        label={color}
                        selected={patron.color === color}
                        onPress={() => onChange({ ...patron, color })}
                      />
                    ))}
                  </View>
                </View>
                <FormInput label="Notes" multiline value={patron.notes ?? ''} onChangeText={(notes) => onChange({ ...patron, notes })} />
              </>
            )}
          </ScrollView>
          <View className="mt-2 flex-row gap-3">
            <Button variant="outline" className="h-12 flex-1" onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button className="h-12 flex-1" onPress={onSave}>
              <Text>Save</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
