import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Record from './Record';

describe('Record', () => {
  // Test Record construction
  it('should create a Record with padded fields', () => {
    const record = new Record(1, 'John Doe', 'john@example.com');
    assert.strictEqual(record.id, '1         ');
    assert.strictEqual(record.name, 'John Doe' + ' '.repeat(42));
    assert.strictEqual(record.email, 'john@example.com' + ' '.repeat(84));
  });

  // Test Record size
  it('should have a static size of 160 for simple ascii fields', () => {
    const record = new Record(1, 'John Doe', 'john@example.com');
    assert.strictEqual(Record.size, 160);
    assert.strictEqual(record.serialize().length, Record.size);
  });

  // Test Record serialization
  it('should serialize to a buffer of correct size', () => {
    const record = new Record(1, 'John Doe', 'john@example.com');
    const buffer = record.serialize();
    assert.strictEqual(buffer.length, 160);
  });

  // Test Record deserialization
  it('should deserialize from a buffer correctly', () => {
    const originalRecord = new Record(1, 'John Doe', 'john@example.com');
    const buffer = originalRecord.serialize();
    const deserializedRecord = Record.deserialize(buffer);

    assert.strictEqual(deserializedRecord.id, '1         ');
    assert.strictEqual(deserializedRecord.name, 'John Doe' + ' '.repeat(42));
    assert.strictEqual(deserializedRecord.email, 'john@example.com' + ' '.repeat(84));
  });

  // Test Record with maximum length fields
  it('should handle maximum length fields', () => {
    const maxId = '9'.repeat(10);
    const maxName = 'A'.repeat(50);
    const maxEmail = 'B'.repeat(100);
    const record = new Record(maxId, maxName, maxEmail);

    assert.strictEqual(record.id, maxId);
    assert.strictEqual(record.name, maxName);
    assert.strictEqual(record.email, maxEmail);

    const deserializedRecord = Record.deserialize(record.serialize());
    assert.strictEqual(deserializedRecord.id, maxId);
    assert.strictEqual(deserializedRecord.name, maxName);
    assert.strictEqual(deserializedRecord.email, maxEmail);
  });
});
