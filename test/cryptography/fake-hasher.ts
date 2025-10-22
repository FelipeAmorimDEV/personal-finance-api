import { HashComparer } from "@/domain/application/repositories/hash-comparer";
import { HashGenerator } from "@/domain/application/repositories/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("-hashed") === hash;
  }
}

