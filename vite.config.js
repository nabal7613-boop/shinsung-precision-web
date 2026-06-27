import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// base: './' → 추후 그누보드5 스킨으로 포팅할 때 정적 자산 경로가 깨지지 않도록 상대경로로 빌드
// 멀티페이지 빌드: 제품별 상세 페이지를 별도 정적 .html로 분리 (그누보드5 다중 페이지 구조에 1:1 대응)
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        messageFromCeo: resolve(__dirname, 'message-from-ceo.html'),
        history: resolve(__dirname, 'history.html'),
        organization: resolve(__dirname, 'organization.html'),
        customerList: resolve(__dirname, 'customer-list.html'),
        productEvCell: resolve(__dirname, 'product-ev-cell.html'),
        productAerosolConeDome: resolve(__dirname, 'product-aerosol-cone-dome.html'),
        productAerosolTransferPress: resolve(__dirname, 'product-aerosol-transfer-press.html'),
        productAerosolLinerDryer: resolve(__dirname, 'product-aerosol-liner-dryer.html'),
        productTuna2pcsBody: resolve(__dirname, 'product-tuna-2pcs-body.html'),
        productTunaCncSheetFeederPress: resolve(__dirname, 'product-tuna-cnc-sheet-feeder-press.html'),
        productTunaDrdSheetFeederPressLine: resolve(__dirname, 'product-tuna-drd-sheet-feeder-press-line.html'),
        product18lSquareCan: resolve(__dirname, 'product-18l-square-can.html'),
        product18lSquareCanBodyMakingLine: resolve(__dirname, 'product-18l-square-can-body-making-line.html'),
        product18lSquareCanEndMakingLine: resolve(__dirname, 'product-18l-square-can-end-making-line.html'),
        product200lDrum: resolve(__dirname, 'product-200l-drum.html'),
        product200lDrumBodyMakingLine: resolve(__dirname, 'product-200l-drum-body-making-line.html'),
        product200lDrumEndMakingLine: resolve(__dirname, 'product-200l-drum-end-making-line.html'),
        productGasCanOthers: resolve(__dirname, 'product-gas-can-others.html'),
        productGasCanCncSheetFeederPress: resolve(__dirname, 'product-gas-can-cnc-sheet-feeder-press.html'),
        qualityPolicy: resolve(__dirname, 'quality-policy.html'),
        qualityWarranty: resolve(__dirname, 'quality-warranty.html'),
        catalog: resolve(__dirname, 'catalog.html'),
        news: resolve(__dirname, 'news.html'),
        inquiry: resolve(__dirname, 'inquiry.html'),
        directions: resolve(__dirname, 'directions.html'),
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
});
