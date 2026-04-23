declare module "dotenv" {
  export interface DotenvConfigOptions {
    path?: string;
  }

  export interface DotenvConfigOutput {
    parsed?: Record<string, string>;
    error?: Error;
  }

  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;

  const dotenv: { config: typeof config };
  export default dotenv;
}

declare module "helmet" {
  import { RequestHandler } from "express";
  export default function helmet(): RequestHandler;
}

declare module "morgan" {
  import { RequestHandler } from "express";
  type Format = "combined" | "dev";
  export default function morgan(format: Format): RequestHandler;
}

declare module "cors" {
  import { RequestHandler } from "express";

  export type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;
  export type CorsOrigin =
    | boolean
    | string
    | RegExp
    | Array<string | RegExp>
    | ((origin: string | undefined, callback: CorsOriginCallback) => void);

  export interface CorsOptions {
    origin?: CorsOrigin;
  }

  export default function cors(options?: CorsOptions): RequestHandler;
}
