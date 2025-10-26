import { type ScanHistory, type InsertScanHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getScanHistory(): Promise<ScanHistory[]>;
  addToHistory(scan: InsertScanHistory): Promise<ScanHistory>;
}

export class MemStorage implements IStorage {
  private scanHistory: Map<string, ScanHistory>;

  constructor() {
    this.scanHistory = new Map();
  }

  async getScanHistory(): Promise<ScanHistory[]> {
    return Array.from(this.scanHistory.values()).sort(
      (a, b) => b.scannedAt.getTime() - a.scannedAt.getTime()
    );
  }

  async addToHistory(insertScan: InsertScanHistory): Promise<ScanHistory> {
    const id = randomUUID();
    const scan: ScanHistory = {
      barcode: insertScan.barcode,
      productName: insertScan.productName,
      brand: insertScan.brand ?? null,
      imageUrl: insertScan.imageUrl ?? null,
      calories: insertScan.calories ?? null,
      id,
      scannedAt: new Date(),
    };
    this.scanHistory.set(id, scan);
    return scan;
  }
}

export const storage = new MemStorage();
