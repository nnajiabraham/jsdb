import assert from 'node:assert/strict';
import { after, beforeEach, describe, it } from 'node:test';
import fs from 'fs';
import path from 'path';
import Storage from './Storage';
import Record from '../Record/Record';

describe('Storage', () => {
  const testDbPath = path.join(__dirname, 'data.db');

  beforeEach(() => {
    // Empty out the file content
    // If the file exists, empty it. Otherwise, do nothing.
    // This allows us to test that Storage.ts creates the db file if it doesn't exist
    if (fs.existsSync(testDbPath)) {
      fs.writeFileSync(testDbPath, '', 'binary');
    }
  });

  // after(() => {
  //   // Remove the test db file after the tests are run
  //   if (fs.existsSync(testDbPath)) {
  //     fs.unlinkSync(testDbPath);
  //   }
  // });

  // Test cases will be added here
  it('should be able to create file for Storage class with the filename if not exists', () => {
    const filename = 'temp_data.db';
    const storage = new Storage(filename);
    
    assert.strictEqual(storage.filePath, path.join(__dirname, filename).toString());
    assert.ok(fs.existsSync(path.join(__dirname, filename)));
    assert.strictEqual(fs.readFileSync(path.join(__dirname, filename), 'binary'), '');
    
    // Cleanup
    fs.unlinkSync(path.join(__dirname, filename));
  });


  it('should be able to create a Storage class with the filename', () => {
    const filename = 'data.db';
    const storage = new Storage(filename);
    
    assert.strictEqual(storage.filePath, testDbPath);
    assert.ok(fs.existsSync(testDbPath));
    assert.strictEqual(fs.readFileSync(testDbPath, 'binary'), '');
  });

  it('should be able to store, count and read records', async () => {
    const filename = 'data.db';
    const storage = new Storage(filename);

    const recordsToAdd = [
      new Record(2, 'Bob', 'bob@example.com'),
      new Record(3, 'Charlie', 'charlie@example.com')
    ];

    // Store records
    await storage.writeRecordToFile(recordsToAdd[0]);
    await storage.writeRecordToFile(recordsToAdd[1]);

    // Count records
    assert.strictEqual(storage.countRecords(), 2);

    // Read records
    const fileRecords = await storage.readAllRecordsFromStorageFile();
    assert.deepStrictEqual(fileRecords, recordsToAdd);

    // Read records from in-memory records and compare with file records
    assert.deepStrictEqual(storage.inMemoryRecords, recordsToAdd);
  });

});


