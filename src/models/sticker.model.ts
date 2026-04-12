import { Timestamp } from 'firebase/firestore';
import { Item } from './item.model';

export enum StickerStatus {
  /** StickerGroup が登録された直後。Item は設定されていない。 */
  unset = 'unset',
  /** Sticker を Item に関連付けた直後の状態。 */
  set = 'set',
  /** Item を Storage に登録した状態。 */
  stored = 'stored',
  /** Sticker は使用済みで無効。 */
  void = 'void',
}

/**
 * Sticker は NFC タグ1枚に対応する。
 */
export type Sticker = {
  id: string;
  itemId?: Item['id'];
  setAt?: Timestamp;
  storedAt?: Timestamp;
  storageId?: string;
  setBy?: string;
  storedBy?: string;
  status: StickerStatus;
  groupId: string;
};
