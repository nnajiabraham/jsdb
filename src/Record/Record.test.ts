import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Record from './Record';

const VALID_TEST_DATA = { id: '1', name: 'John Doe', email: 'john@example.com' };
const INVALID_TEST_DATA = { id: '12345678901', name: 'John Doe', email: 'john@example.com' };
describe('Record', () => {
  // Test Record construction
  it('should create a Record with padded fields serialized', () => {
    const record = new Record(VALID_TEST_DATA);
    const serializedRecord = Record.serialize(VALID_TEST_DATA);
    const deserializedRecord = Record.deserialize(serializedRecord);

    //check if the record is the same as the serialized record
    assert.deepStrictEqual(record.data_bytes, serializedRecord);

    //check if the deserialized record is the same as the original data
    assert.strictEqual(deserializedRecord.id, '1         ');
    assert.strictEqual(deserializedRecord.name, 'John Doe' + ' '.repeat(42));
    assert.strictEqual(deserializedRecord.email, 'john@example.com' + ' '.repeat(84));
  });

  // Test Record size
  it('should have a static size of 160 for simple ascii fields', () => {
    const record = new Record(VALID_TEST_DATA);
    assert.strictEqual(Record.size, 160);
    assert.strictEqual(record.data_bytes.length, Record.size);
  });

  // Test Record size for invalid data with invalid data size
  it('should throw an error for invalid data', () => {
    assert.throws(() => new Record(INVALID_TEST_DATA));
  });

  // Test Record serialization
  it('static serialize should serialize to a buffer of correct size', () => {
    const buffer = Record.serialize(VALID_TEST_DATA);
    assert.strictEqual(buffer.length, 160);
  });

  // Test Record deserialization
  it('should deserialize from a Record buffer type correctly', () => {
    const {data_bytes: buffer} = new Record({ id: '1', name: 'John Doe', email: 'john@example.com' });
    const deserializedRecord = Record.deserialize(buffer);

    assert.strictEqual(deserializedRecord.id, '1         ');
    assert.strictEqual(deserializedRecord.name, 'John Doe' + ' '.repeat(42));
    assert.strictEqual(deserializedRecord.email, 'john@example.com' + ' '.repeat(84));
  });

  // Test Invalid Record deserialization
  it('should throw an error for invalid Record buffer type', () => {
    const invalidBuffer = Buffer.from('invalid');
    assert.throws(() => Record.deserialize(invalidBuffer));
  });

  //Test Record with maximum length fields
  it('should be able to handle records with maximum length fields', () => {
    const maxId = '9'.repeat(10);
    const maxName = 'A'.repeat(50);
    const maxEmail = 'B'.repeat(100);
    const record = new Record({ id: maxId, name: maxName, email: maxEmail });
    const deserializedRecord = Record.deserialize(record.data_bytes);

    assert.strictEqual(deserializedRecord.id, maxId);
    assert.strictEqual(deserializedRecord.name, maxName);
    assert.strictEqual(deserializedRecord.email, maxEmail);
  });
});
