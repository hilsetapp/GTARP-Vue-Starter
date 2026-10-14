/**
 * Типизированный мост между Vue-интерфейсом и игрой (RAGE MP).
 *
 * В игре события уходят через mp.trigger и приходят через browser.execute.
 * В обычном браузере (npm run dev) работает МОК: события крутятся локально,
 * а панель разработчика играет роль сервера.
 *
 * Использование:
 *   import { send, on } from '@/bridge';
 *   send('chat:send', { text: 'привет' });            // типизировано!
 *   on('hud:update', (d) => store.hud = { ...store.hud, ...d });
 */
import type { CefToClient, ClientToCef } from '@shared/events';

/** true, когда страница открыта НЕ в игре - включаем мок-режим */
export const isBrowser = !(window as any).mp;

type Handler<T> = (data: T) => void;
const handlers: { [K in keyof ClientToCef]?: Handler<ClientToCef[K]>[] } = {};

/** Доставить событие в подписчиков (внутреннее - зовут игра или мок) */
function dispatch<K extends keyof ClientToCef>(name: K, data: ClientToCef[K]) {
  const list = (handlers[name] || []) as Handler<ClientToCef[K]>[];
  list.forEach((fn) => fn(data));
}

/**
 * Входная точка для игры. RAGE дергает browser.execute и вызывает
 * window.__rp_on("hud:update", {...}) - мы разносим по подписчикам.
 */
function installGlobalHook() {
  (window as any).__rp_on = (name: string, json: string) => {
    try {
      dispatch(name as keyof ClientToCef, JSON.parse(json));
    } catch (e) {
      console.warn('[bridge] не смог распарсить событие', name, e);
    }
  };
}

/** Отправить событие в игру. В браузере - просто предупреждение в консоль. */
export function send<K extends keyof CefToClient>(name: K, data: CefToClient[K]) {
  const mp = (window as any).mp;
  if (mp && typeof mp.trigger === 'function') {
    mp.trigger('cef:event', name, JSON.stringify(data ?? null));
  } else {
    console.info('[bridge/mock] CEF → client:', name, data);
    // мок отвечает как сервер: эхо чата и профиль при готовности
    if (name === 'ui:ready') emitLocal('player:spawned', { id: 1, name: 'Тестер_Один', money: 12450 });
    if (name === 'chat:send') emitLocal('chat:push', { nick: 'Тестер_Один', text: (data as { text: string }).text });
  }
}

/** Подписаться на событие из игры */
export function on<K extends keyof ClientToCef>(name: K, fn: Handler<ClientToCef[K]>) {
  const list = (handlers[name] ||= []) as Handler<ClientToCef[K]>[];
  list.push(fn);
}

/** Мок-панель зовёт это, притворяясь сервером */
export function emitLocal<K extends keyof ClientToCef>(name: K, data: ClientToCef[K]) {
  if (isBrowser) dispatch(name, data);
}

installGlobalHook();
