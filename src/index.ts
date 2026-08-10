// src/index.ts
export * from "./internal/warning/warning_flags";

import { printf, sprintf } from "./io/printf";

// Tambahkan tipe eksplisit agar isolatedDeclarations bisa bekerja
export const std: {
  printf: typeof printf;
  sprintf: typeof sprintf;
} = {
  printf,
  sprintf,
};
