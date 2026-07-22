// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Mengaktifkan globals seperti describe, it, expect tanpa import
    globals: true,

    // Environment: node (karena pakai process.stdout)
    environment: 'node',

    // Pola file test yang akan dijalankan
    include: ['**/*.test.ts'],

    // Opsional: coverage
    coverage: {
      provider: 'v8',          // atau 'istanbul'
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'], // sesuaikan dengan struktur folder
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    },

    // Jika perlu mengatur timeout atau lainnya
    // testTimeout: 5000,
  },

  // Jika menggunakan path alias, tambahkan di sini
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },
});
