declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly SERVER_PORT: string;
    readonly SERVER_DATABASE_NAME: string;
    readonly PRISMA_DATABASE_URL: string;
  }
}
