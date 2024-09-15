export interface RecordData {
  id: string;
  name: string;
  email: string;
}

class Record implements RecordData {
  readonly id: string;
  readonly name: string;
  readonly email: string;

  constructor(id: string | number, name: string, email: string) {
    this.id = id.toString().padEnd(10);
    this.name = name.padEnd(50);
    this.email = email.padEnd(100);
  }

  static get size(): number {
    return 160; // 10 + 50 + 100
  }

  serialize(): Buffer {
    return Buffer.from(this.id + this.name + this.email);
  }

  static deserialize(buffer: Buffer): Record {
    console.log("buffer", buffer);
    const id = buffer.toString('utf8', 0, 10).trim();
    const name = buffer.toString('utf8', 10, 60).trim();
    const email = buffer.toString('utf8', 60, 160).trim();
    return new Record(id, name, email);
  }
}

export default Record;