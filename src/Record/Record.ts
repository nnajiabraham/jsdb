import bin from 'typed-binary';

export const RecordStruct = bin.object({
  id: bin.chars(10),
  name: bin.chars(50),
  email: bin.chars(100),
});

export type RecordData = bin.Parsed<typeof RecordStruct>;

class Record {
  readonly id_bytes: Buffer;
  readonly name_bytes: Buffer;
  readonly email_bytes: Buffer;

  constructor(recordData: RecordData) {
    const buffer = Record.serialize(recordData);

    this.id_bytes = buffer.subarray(0, 10);
    this.name_bytes = buffer.subarray(10, 60);
    this.email_bytes = buffer.subarray(60, 160);
  }

  static get size(): number {
    return RecordStruct.maxSize; // 10 + 50 + 100
  }

  get data_bytes(): Buffer {
    return Buffer.concat([this.id_bytes, this.name_bytes, this.email_bytes]);
  }

  // TODO: Performance Improvement: Consider making this a static method to avoid creating
  // a new Record object for every record added to storage. This would allow a single
  // Record class to handle byte conversion for all records, potentially improving efficiency.
  static serialize(recordData: RecordData): Buffer {
    const buffer = Buffer.alloc(Record.size);
    const writer = new bin.BufferWriter(buffer);

    RecordStruct.write(writer, {
      id: recordData.id.toString().padEnd(RecordStruct.properties.id.length),
      name: recordData.name.toString().padEnd(RecordStruct.properties.name.length),
      email: recordData.email.toString().padEnd(RecordStruct.properties.email.length),
    });
    return buffer;
  }

  static validate(recordData: RecordData): void {
    const fields = ['id', 'name', 'email'] as const;
    const invalidFields = [];
    for (const field of fields) {
      if (recordData[field].length > RecordStruct.properties[field].length) {
        invalidFields.push(`${field} (exceeds maximum length of ${RecordStruct.properties[field].length} characters)`);
      }
    }
    if (invalidFields.length > 0) {
      throw new Error(`Invalid record data: ${invalidFields.join(', ')}`);
    }
  }

  static validateBuffer(buffer: Buffer): void {
    if (buffer.length !== Record.size) {
      throw new Error('Invalid buffer size');
    }

    //validate the buffer content
    const reader = new bin.BufferReader(buffer);
    const result = RecordStruct.read(reader);
    Record.validate(result);
  }

  static deserialize(buffer: Buffer): RecordData {
    Record.validateBuffer(buffer);
    const reader = new bin.BufferReader(buffer);
    const result = RecordStruct.read(reader);
    return result;
  }
}

export default Record;