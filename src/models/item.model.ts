import { Timestamp } from 'firebase/firestore';
import { Storage } from './storage.model';

export type DialogType = '追加' | '編集';

export type Item = {
  id: string;
  name: string;
  total: number;
  storedCount: { [storageId: Storage['id']]: number };
  notifyCount: number;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ItemWithoutTimestamp = Omit<Item, 'updatedAt'>;

export type ItemDialogData = {
  type: DialogType;
  item: Partial<Item>;
};
