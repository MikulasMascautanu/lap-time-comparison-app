import { createClient } from "@libsql/client";

export const dbClient = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://certain-bazooka-mikulasmascautanu.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjkwMTk3NTksImlkIjoiZjMzMzEyMTUtODRhOS00MTcxLTkyNWEtNTdmN2M5MjllY2M2In0.c4QGbRDRTkBUSc5NwdonPsLVS6OJgVZ3qpBTHtZEV_NeZP_45z_3UeGemJLuGXN7AQ9f_fM3BOJaY0rfpfBmBgo',
});
