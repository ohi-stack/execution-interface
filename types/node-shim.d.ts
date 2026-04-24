declare module "node:crypto" {
  export function createHash(algorithm: string): {
    update(data: string): { digest(format: "hex"): string };
    digest(format: "hex"): string;
  };
  export function createHmac(algorithm: string, key: unknown): {
    update(data: string): { digest(format: "hex"): string };
    digest(format: "hex"): string;
  };
  export function createVerify(algorithm: string): {
    update(data: string): void;
    end(): void;
    verify(publicKey: string, signature: Uint8Array): boolean;
  };
  export function randomUUID(): string;
}

declare module "node:fs/promises" {
  export function appendFile(path: string, data: string, encoding: string): Promise<void>;
}

declare const Buffer: {
  from(data: string, encoding: string): Uint8Array;
};
