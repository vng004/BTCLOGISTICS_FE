import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'], // Đảm bảo Vite tối ưu hóa các thư viện này
  },
  resolve: {
    alias: {
      // Nếu cần alias để xử lý các vấn đề import
    },
  },
});