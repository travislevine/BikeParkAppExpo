import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, router } from 'expo-router';
import { ChevronLeft, Pencil, RefreshCcw, Search, Ticket, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DropOffRecord = {
  id: string;
  ticketNumber: string;
  patronName: string;
  devicesTotal: number;
  devicesRemaining: number;
  notes?: string;
  timestamp: Date;
};

const INITIAL_RECORDS: DropOffRecord[] = [
  {
    id: 'dor-1',
    ticketNumber: '2001',
    patronName: 'Alice Thompson',
    devicesTotal: 3,
    devicesRemaining: 1,
    notes: 'One bike still in rack',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'dor-2',
    ticketNumber: '2002',
    patronName: 'Bob Wilson',
    devicesTotal: 2,
    devicesRemaining: 2,
    notes: '',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'dor-3',
    ticketNumber: '2003',
    patronName: 'Carol Martinez',
    devicesTotal: 4,
    devicesRemaining: 0,
    notes: 'All devices picked up',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'dor-4',
    ticketNumber: '2004',
    patronName: 'David Lee',
    devicesTotal: 1,
    devicesRemaining: 1,
    notes: 'Waiting for pickup',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'dor-5',
    ticketNumber: '2005',
    patronName: 'Eva Johansson',
    devicesTotal: 2,
    devicesRemaining: 0,
    notes: 'Picked up this morning',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export default function CheckTicketScreen() {
  const [records, setRecords] = useState<DropOffRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [recordToEdit, setRecordToEdit] = useState<DropOffRecord | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [recordToDelete, setRecordToDelete] = useState<DropOffRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return records;

    return records.filter(
      (record) =>
        record.ticketNumber.includes(query) || record.patronName.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  const refreshRecords = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }));
    }, 700);
  };

  const startEditNotes = (record: DropOffRecord) => {
    setRecordToEdit(record);
    setNotesDraft(record.notes ?? '');
  };

  const saveNotes = () => {
    if (!recordToEdit) return;
    setRecords((current) =>
      current.map((record) =>
        record.id === recordToEdit.id ? { ...record, notes: notesDraft.trim() } : record
      )
    );
    setRecordToEdit(null);
    setNotesDraft('');
  };

  const confirmDeleteRecord = () => {
    if (!recordToDelete) return;
    setRecords((current) =>
      current.filter((currentRecord) => currentRecord.id !== recordToDelete.id)
    );
    setRecordToDelete(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Check Ticket' }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="border-b border-border px-5 pb-3 pt-2">
          <Button
            variant="outline"
            className="mb-4 h-11 flex-row items-center gap-2 self-start px-3"
            onPress={() => router.push('/')}>
            <Icon as={ChevronLeft} size={16} />
            <Text>Back to Dashboard</Text>
          </Button>
          <Text className="text-3xl font-bold text-foreground">Check Ticket</Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-5 py-5 pb-8">
          <View className="rounded-lg border border-border bg-card p-3">
            <View className="flex-row items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
              <Icon as={Search} size={16} className="text-muted-foreground" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by ticket number or patron name"
                placeholderTextColor="#71717A"
                className="flex-1 text-base text-foreground"
              />
            </View>

            <View className="mt-3 flex-row items-center justify-between">
              <Button variant="outline" className="h-10 px-3" onPress={refreshRecords} disabled={isRefreshing}>
                <Icon as={RefreshCcw} size={14} className="text-foreground" />
                <Text>{isRefreshing ? 'Refreshing...' : 'Refresh'}</Text>
              </Button>
              <Text className="text-xs text-muted-foreground">
                {lastRefresh ? `Updated ${lastRefresh}` : 'Not refreshed yet'}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {filteredRecords.length === 0 ? (
              <View className="rounded-lg border border-border bg-card p-4">
                <Text className="text-muted-foreground">No matching records found.</Text>
              </View>
            ) : (
              filteredRecords.map((record) => (
                <View key={record.id} className="rounded-lg border border-border bg-card p-4">
                  <View className="mb-3 flex-row items-center justify-between gap-3">
                    <View className="flex-row items-center gap-2 rounded-md bg-primary px-3 py-1">
                      <Icon as={Ticket} size={14} className="text-primary-foreground" />
                      <Text className="font-bold text-primary-foreground">{record.ticketNumber}</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onPress={() => startEditNotes(record)}>
                        <Icon as={Pencil} size={14} className="text-foreground" />
                        <Text>Edit</Text>
                      </Button>
                      <Button
                        variant="destructive"
                        className="h-9 px-3"
                        onPress={() => setRecordToDelete(record)}>
                        <Icon as={Trash2} size={14} className="text-white" />
                        <Text>Delete</Text>
                      </Button>
                    </View>
                  </View>

                  <View className="gap-1">
                    <InfoRow label="Patron Name" value={record.patronName} />
                    <InfoRow label="Devices Total" value={`${record.devicesTotal}`} />
                    <InfoRow label="Devices Remaining" value={`${record.devicesRemaining}`} />
                    <InfoRow label="Notes" value={record.notes?.trim() ? record.notes : 'No notes'} />
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <EditNotesModal
          visible={!!recordToEdit}
          ticketNumber={recordToEdit?.ticketNumber ?? null}
          patronName={recordToEdit?.patronName ?? null}
          notesDraft={notesDraft}
          onChangeNotes={setNotesDraft}
          onClose={() => {
            setRecordToEdit(null);
            setNotesDraft('');
          }}
          onSave={saveNotes}
        />

        <DeleteConfirmModal
          visible={!!recordToDelete}
          ticketNumber={recordToDelete?.ticketNumber ?? null}
          onCancel={() => setRecordToDelete(null)}
          onConfirm={confirmDeleteRecord}
        />
      </SafeAreaView>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text className="max-w-[65%] text-right text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}

type EditNotesModalProps = {
  visible: boolean;
  ticketNumber: string | null;
  patronName: string | null;
  notesDraft: string;
  onChangeNotes: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

function EditNotesModal({
  visible,
  ticketNumber,
  patronName,
  notesDraft,
  onChangeNotes,
  onClose,
  onSave,
}: EditNotesModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-2xl bg-background px-5 pb-7 pt-4">
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-muted" />
          <Text className="text-xl font-semibold text-foreground">Edit Notes</Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            Ticket {ticketNumber ?? 'N/A'} {patronName ? `(${patronName})` : ''}
          </Text>

          <TextInput
            value={notesDraft}
            onChangeText={onChangeNotes}
            multiline
            numberOfLines={4}
            placeholder="Add or edit notes..."
            placeholderTextColor="#71717A"
            className="mt-5 min-h-28 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground"
          />

          <View className="mt-6 flex-row gap-3">
            <Button variant="outline" className="h-12 flex-1" onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button className="h-12 flex-1" onPress={onSave}>
              <Text>Save Notes</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type DeleteConfirmModalProps = {
  visible: boolean;
  ticketNumber: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteConfirmModal({ visible, ticketNumber, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/40 px-5">
        <View className="w-full rounded-xl border border-border bg-card p-6">
          <Text className="text-xl font-semibold text-foreground">Delete Record</Text>
          <Text className="mt-2 text-muted-foreground">
            Delete ticket {ticketNumber ?? 'N/A'}? This action cannot be undone.
          </Text>
          <View className="mt-6 flex-row gap-3">
            <Button variant="outline" className="h-12 flex-1" onPress={onCancel}>
              <Text>Cancel</Text>
            </Button>
            <Button variant="destructive" className="h-12 flex-1" onPress={onConfirm}>
              <Text>Delete</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
