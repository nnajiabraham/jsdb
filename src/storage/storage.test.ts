import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import fs from 'fs';
import path from 'path';
import Storage from './storage';

describe('Storage', () => {
  const testDbPath = path.join(__dirname, 'data.db');

  beforeEach(() => {
    // Empty out the file content
    // If the file exists, empty it. Otherwise, do nothing.
    // This allows us to test that Storage.ts creates the db file if it doesn't exist
    if (fs.existsSync(testDbPath)) {
      fs.writeFileSync(testDbPath, '', 'utf-8');
    }
  });

  // Test cases will be added here
  it('should be able to create file for Storage class with the filename if not exists', () => {
    const filename = 'temp_data.db';
    const storage = new Storage(filename);
    
    assert.strictEqual(storage.filePath, path.join(__dirname, filename).toString());
    assert.ok(fs.existsSync(path.join(__dirname, filename)));
    assert.strictEqual(fs.readFileSync(path.join(__dirname, filename), 'utf-8'), '');
    assert.strictEqual(storage.recordSize, 28);

    // Cleanup
    fs.unlinkSync(path.join(__dirname, filename));
  });


  it('should be able to create a Storage class with the filename', () => {
    const filename = 'data.db';
    const storage = new Storage(filename);
    
    assert.strictEqual(storage.filePath, testDbPath);
    assert.ok(fs.existsSync(testDbPath));
    assert.strictEqual(fs.readFileSync(testDbPath, 'utf-8'), '');
    assert.strictEqual(storage.recordSize, 28);
  });

  it('should be able to store, count and read records', () => {
    const filename = 'data.db';
    const storage = new Storage(filename);

    const recordsToAdd = [
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 28 }
    ]

    // Store records
    storage.appendRecord(recordsToAdd[0]);
    storage.appendRecord(recordsToAdd[1]);

    // Count records
    assert.strictEqual(storage.countRecords(), 2);

    // Read records
    const fileRecords = storage.readAllRecordsFromStorageFile();
    assert.deepStrictEqual(fileRecords, recordsToAdd);

    // Read records from in-memory records and compare with file records
    assert.deepStrictEqual(storage.inMemoryRecords, recordsToAdd);
  });

});


