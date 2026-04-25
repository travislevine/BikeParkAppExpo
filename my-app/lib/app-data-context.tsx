import * as React from 'react';

export type Patron = {
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

export type ParkedDevice = {
  id: string;
  patronId: string;
  ticketNumber: string;
  patronName: string;
  mobile: string;
  devicesRemaining: number;
  parkedAt: Date;
};

export type DropOffRecord = {
  id: string;
  ticketNumber: string;
  patronName: string;
  devicesTotal: number;
  devicesRemaining: number;
  notes?: string;
  timestamp: Date;
};

export type BlankEntryInput = Omit<Patron, 'id'>;

export const DEVICE_TYPES = ['Bike', 'eBike', 'Scooter', 'Skateboard'];
export const COLORS = ['Red', 'Blue', 'Black', 'Green', 'Yellow', 'White', 'Orange', 'Purple'];

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

const INITIAL_PARKED_DEVICES: ParkedDevice[] = INITIAL_PATRONS.map((patron) => ({
  id: `pd-${patron.id}`,
  patronId: patron.id,
  ticketNumber: patron.ticketNumber,
  patronName: patron.name,
  mobile: patron.mobile,
  devicesRemaining: patron.numDevices,
  parkedAt: new Date(),
}));

const INITIAL_DROP_OFF_RECORDS: DropOffRecord[] = INITIAL_PATRONS.map((patron) => ({
  id: `dor-${patron.id}`,
  ticketNumber: patron.ticketNumber,
  patronName: patron.name,
  devicesTotal: patron.numDevices,
  devicesRemaining: patron.numDevices,
  notes: patron.notes ?? '',
  timestamp: new Date(),
}));

type AppDataContextValue = {
  patrons: Patron[];
  setPatrons: React.Dispatch<React.SetStateAction<Patron[]>>;
  parkedDevices: ParkedDevice[];
  setParkedDevices: React.Dispatch<React.SetStateAction<ParkedDevice[]>>;
  dropOffRecords: DropOffRecord[];
  setDropOffRecords: React.Dispatch<React.SetStateAction<DropOffRecord[]>>;
  addBlankEntry: (entry: BlankEntryInput) => void;
};

const AppDataContext = React.createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [patrons, setPatrons] = React.useState<Patron[]>(INITIAL_PATRONS);
  const [parkedDevices, setParkedDevices] = React.useState<ParkedDevice[]>(INITIAL_PARKED_DEVICES);
  const [dropOffRecords, setDropOffRecords] = React.useState<DropOffRecord[]>(INITIAL_DROP_OFF_RECORDS);

  const addBlankEntry = React.useCallback((entry: BlankEntryInput) => {
    const id = `${Date.now()}`;
    const patron: Patron = { id, ...entry };
    const parkedDevice: ParkedDevice = {
      id: `pd-${id}`,
      patronId: id,
      ticketNumber: entry.ticketNumber,
      patronName: entry.name || `Patron ${entry.ticketNumber}`,
      mobile: entry.mobile,
      devicesRemaining: entry.numDevices,
      parkedAt: new Date(),
    };
    const record: DropOffRecord = {
      id: `dor-${id}`,
      ticketNumber: entry.ticketNumber,
      patronName: entry.name || `Patron ${entry.ticketNumber}`,
      devicesTotal: entry.numDevices,
      devicesRemaining: entry.numDevices,
      notes: entry.notes ?? '',
      timestamp: new Date(),
    };

    setPatrons((current) => [patron, ...current]);
    setParkedDevices((current) => [parkedDevice, ...current]);
    setDropOffRecords((current) => [record, ...current]);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        patrons,
        setPatrons,
        parkedDevices,
        setParkedDevices,
        dropOffRecords,
        setDropOffRecords,
        addBlankEntry,
      }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = React.useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
