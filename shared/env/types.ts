export interface SharedEnv {
  VITE_BACKEND_PORT: number;
  VITE_BACKEND_HOST: string;
  SQLITE_DATABASE_PATH: string;
}

export type ClientEnv = Omit<SharedEnv, "SQLITE_DATABASE_PATH">;
export type ServerEnv = SharedEnv;
