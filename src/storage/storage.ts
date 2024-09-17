import fs from 'fs';
import path from 'path';
import Record, { RecordData } from '../Record/Record';


class Storage {
  private _filePath: string;
  private _records: Record[];

  constructor(filename: string) {
    this._filePath = path.join(__dirname, filename);
    // Initialize file if it doesn't exist
    if (!fs.existsSync(this._filePath)) {
      fs.writeFileSync(this._filePath, '', { encoding: 'binary' });
    }
    this._records = [];
  }

  get filePath(): string {
    return this._filePath;
  }

  get inMemoryRecords(): Record[] {
    return this._records;
  }

  async writeRecordToFile(record: Record) {
    const serialized = record.data_bytes;
    // console.log(serialized);
    await fs.promises.appendFile(this.filePath, serialized , { encoding: 'binary' });
    this.writeToInMemoryRecords(record);
  }

  writeToInMemoryRecords(record: Record) {
    this._records.push(record);
  }

  async readAllRecordsFromStorageFile(): Promise<RecordData[]> {
    const storage_data = await fs.promises.readFile(this.filePath);
    const records: RecordData[] = [];
    for (let i = 0; i < storage_data.length; i += Record.size) {
      const individual_record = storage_data.subarray(i, i + Record.size);
      if (individual_record.length > 0 && individual_record.some(byte => byte !== 0)) {
        records.push(Record.deserialize(individual_record));
      }
    }
    return records;
  }

  countRecords(): number {
    return this.inMemoryRecords.length;
  }
}

export default Storage;
