/**
 * КЛИЕНТ ИГРЫ (мир #2): мост между сервером, игрой и CEF.
 *
 * Задачи:
 *  1. поднять браузер с нашим Vue-интерфейсом;
 *  2. пересылать события server → CEF и CEF → server, строго по типам shared/;
 *  3. HUD-цикл: каждые 100мс читать скорость из игры и кормить интерфейс;
 *  4. хоткеи: T — чат (с курсором), F2 — спрятать HUD.
 */
import type { CefToClient, ClientToCef, HudState } from '../../shared/events';

declare const __DEV_URL__: string; // подставляет esbuild при сборке

const browser = mp.browsers.new(__DEV_URL__);
browser.active = true;

/* ── типизированная отправка в CEF ── */
function sendCef<K extends keyof ClientToCef>(name: K, data: ClientToCef[K]) {
  const json = JSON.stringify(data ?? null);
  browser.execute(`window.__rp_on && window.__rp_on(${JSON.stringify(name)}, ${JSON.stringify(json)})`);
}

/* ── server → CEF: единая труба 'cef:emit' ── */
mp.events.add('cef:emit', (name: string, json: string) => {
  browser.execute(`window.__rp_on && window.__rp_on(${JSON.stringify(name)}, ${JSON.stringify(json)})`);
});

/* ── CEF → мир: интерфейс шлёт mp.trigger('cef:event', имя, json) ── */
mp.events.add('cef:event', (name: keyof CefToClient, json: string) => {
  // switch даёт автодополнение имён + напомнит обработать новое событие
  switch (name) {
    case 'ui:ready':
      mp.events.callRemote('ui:ready');
      break;
    case 'chat:send':
      mp.events.callRemote('chat:send', json);
      mp.gui.cursor.show(false, false);
      break;
    case 'chat:blur':
      mp.gui.cursor.show(false, false);
      break;
  }
});

/* ── T — открыть чат: фокус в CEF + курсор ── */
mp.keys.bind(0x54, true, () => {
  sendCef('chat:focus', undefined);
  mp.gui.cursor.show(true, true);
});

/* ── F2 — спрятать/показать HUD ── */
mp.keys.bind(0x71, true, () => sendCef('hud:flip', undefined));

/* ── HUD-цикл: 10 раз в секунду шарим скорость из игры в CEF ── */
let fuel = 80;
let lastTick = 0;
let wasInCar = false;

mp.events.add('render', () => {
  const now = Date.now();
  if (now - lastTick < 100) return;
  lastTick = now;

  const player = mp.players.local;
  const veh = player.vehicle;

  if (veh) {
    const speed = veh.getSpeed() * 3.6;
    const pos = player.position;
    const streetKey = mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z);
    const street = mp.game.ui.getLabelText(streetKey) || streetKey;
    const upd: Partial<HudState> = {
      inCar: true,
      speed,
      rpm: Math.min(1, speed / 230),
      gear: speed < 2 ? 0 : Math.min(6, Math.ceil(speed / 38)),
      fuel,
      street,
    };
    sendCef('hud:update', upd);
    wasInCar = true;
  } else if (wasInCar) {
    sendCef('hud:update', { inCar: false, speed: 0, rpm: 0 });
    wasInCar = false;
  }
});
