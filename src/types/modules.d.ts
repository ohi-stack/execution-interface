declare module "helmet" {
  import { RequestHandler } from "express";
  export default function helmet(): RequestHandler;
}

declare module "cors" {
  import { RequestHandler } from "express";

  type CorsCallback = (error: Error | null, allow?: boolean) => void;

  interface CorsOptions {
    origin?:
      | boolean
      | string
      | RegExp
      | Array<string | RegExp>
      | ((origin: string | undefined, callback: CorsCallback) => void);
  }

  export default function cors(options?: CorsOptions): RequestHandler;
}

declare module "dotenv" {
  interface DotenvResult {
    error?: Error;
    parsed?: Record<string, string>;
  }

  interface DotenvConfigOptions {
    path?: string;
  }

  export function config(options?: DotenvConfigOptions): DotenvResult;

  const dotenv: {
    config: typeof config;
  };

  export default dotenv;
}
