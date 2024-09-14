import fs from 'fs';
import path from 'path';

type Record = {
  id: number;
  name: string;
  age: number;
};

class Storage {
  private _filePath: string;
  private _recordSize: number;
  private _records: Record[];

  constructor(filename: string) {
    this._filePath = path.join(__dirname, filename);
    // Initialize file if it doesn't exist
    if (!fs.existsSync(this._filePath)) {
      fs.writeFileSync(this._filePath, '', 'utf-8');
    }
    this._recordSize = 28; // 4 + 20 + 4 bytes
    this._records = this.readAllRecordsFromStorageFile();
  }

  get filePath(): string {
    return this._filePath;
  }

  get recordSize(): number {
    return this._recordSize;
  }

  get inMemoryRecords(): Record[] {
    return this._records;
  }

  // Convert a record object to a fixed-length string
  serialize(record: Record) {
    let id = record.id.toString().padStart(4, '0');
    let name = record.name.padEnd(20, ' ');
    let age = record.age.toString().padStart(4, '0');
    return `${id}${name}${age}`;
  }

  // Convert a fixed-length string to a record object
  deserialize(recordStr: string) {
    let id = parseInt(recordStr.slice(0, 4));
    let name = recordStr.slice(4, 24).trim();
    let age = parseInt(recordStr.slice(24, 28));
    return { id, name, age };
  }

  appendRecord(record: Record) {
    const serialized = this.serialize(record);
    fs.appendFileSync(this.filePath, serialized, 'utf-8');
    this._records.push(record);
  }

  readAllRecordsFromStorageFile(): Record[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    const records: Record[] = [];
    for (let i = 0; i < data.length; i += this.recordSize) {
      const recordStr = data.substr(i, this.recordSize);
      if (recordStr.trim()) {
        records.push(this.deserialize(recordStr));
      }
    }
    return records;
  }

  countRecords(): number {
    return this.inMemoryRecords.length;
  }
}

export default Storage;
