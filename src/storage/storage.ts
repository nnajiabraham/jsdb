import fs from 'fs';
import path from 'path';
import Record from '../Record/Record';


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
    const serialized = record.serialize();
    // console.log(serialized);
    await fs.promises.appendFile(this.filePath, serialized , { encoding: 'binary' });
    this._records.push(record);
  }

  async readAllRecordsFromStorageFile(): Promise<Record[]> {
    const data = await fs.promises.readFile(this.filePath);
    console.log("data", data);
    const records: Record[] = [];
    for (let i = 0; i < data.length; i += Record.size) {
      const recordBuffer = Buffer.from(data.slice(i, i + Record.size));
      if (recordBuffer.length > 0 && recordBuffer.some(byte => byte !== 0)) {
        records.push(Record.deserialize(recordBuffer));
      }
    }
    return records;
  }

  countRecords(): number {
    return this.inMemoryRecords.length;
  }
}

export default Storage;
