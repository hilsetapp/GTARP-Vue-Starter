/**
 * Полная сборка → готовый server-files/ который остаётся скопировать
 * поверх скачанного RAGE MP сервера (см. GUIDE.md).
 *
 *   cef/dist        →  server-files/client_packages/cef/     (интерфейс)
 *   client bundle   →  server-files/client_packages/index.js (мост + HUD-цикл)
 *   server bundle   →  server-files/packages/rp/index.js     (логика сервера)
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { build } from 'esbuild';

const DEV = process.argv.includes('--dev-url');
const devUrl = process.env.CEF_DEV_URL || 'http://127.0.0.1:5173/';
const prodUrl = 'package://cef/index.html';

console.log('① собираю CEF (vite)…');
execSync('npx vite build', { cwd: 'cef', stdio: 'inherit' });

console.log('② собираю client_packages…');
rmSync('server-files', { recursive: true, force: true });
mkdirSync('server-files/client_packages', { recursive: true });
await build({
  entryPoints: ['client/src/main.ts'],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'chrome89',
  define: { __DEV_URL__: JSON.stringify(DEV ? devUrl : prodUrl) },
  outfile: 'server-files/client_packages/index.js',
});

console.log('③ собираю packages/rp…');
mkdirSync('server-files/packages/rp', { recursive: true });
await build({
  entryPoints: ['server/src/main.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  outfile: 'server-files/packages/rp/index.js',
});

console.log('④ копирую CEF → client_packages/cef…');
cpSync('cef/dist', 'server-files/client_packages/cef', { recursive: true });

console.log('\n✔ готово! Дальше:');
console.log('  • копируй содержимое server-files/ поверх папки скачанного RAGE MP сервера;');
console.log(DEV
  ? `  • игровой браузер смотрит на ${devUrl} (горячая перезагрузка, держи \`npm run dev\` запущенным)`
  : '  • интерфейс зашит в client_packages/cef (package://) - ничего запускать не надо;');
console.log('  • запускай ragemp-server.exe и заходи. Команда /veh - машина для теста HUD.');
