/**
 * ЕДИНСТВЕННЫЙ ИСТОЧНИК ПРАВДЫ: все события между тремя мирами.
 *
 *   CEF (Vue)  ⇄  client (игра)  ⇄  server (Node)
 *
 * Поменяешь поле здесь — TypeScript подсветит ошибку во ВСЕХ местах,
 * где это событие отправляют или принимают. Это и есть фишка стартера.
 */

/** Состояние HUD — то, что рисует спидометр */
export interface HudState {
  speed: number;      // км/ч
  rpm: number;        // 0..1 — обороты
  fuel: number;       // 0..100
  gear: number;       // 0 = N, 1..6
  belt: boolean;      // ремень пристёгнут
  engine: boolean;    // лампа check-engine (true = горит/тревога)
  inCar: boolean;     // игрок за рулём
  street: string;     // название улицы / района
}

/** Профиль игрока, прилетает при спавне */
export interface PlayerInfo {
  id: number;
  name: string;
  money: number;
}

/** Сообщение в чат */
export interface ChatMsg {
  tag?: string;       // [SYS], [ID 3] и т.п.
  nick?: string;
  text: string;
  cls?: string;       // 'admin' | 'system' | undefined
}

/* ── События: CEF → client (интерфейс просит игру) ── */
export interface CefToClient {
  'ui:ready': undefined;          // Vue примонтировался, можно слать данные
  'chat:send': { text: string };  // игрок отправил сообщение
  'chat:blur': undefined;         // инпут чата закрыт — убрать курсор
}

/* ── События: client/server → CEF (игра говорит интерфейсу) ── */
export interface ClientToCef {
  'hud:update': Partial<HudState>; // можно обновлять частями
  'hud:flip': undefined;           // F2: спрятать/показать HUD
  'chat:push': ChatMsg;
  'chat:focus': undefined;         // T: открыть инпут чата
  'player:spawned': PlayerInfo;
}

/* ── Маршрутизация server → CEF:
     сервер зовёт player.call('cef:emit', [имя, json]) — клиент честно
     доставляет в CEF по типам ClientToCef выше. ── */
