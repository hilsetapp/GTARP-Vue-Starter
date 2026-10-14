/**
 * СЕРВЕР (мир #3): Node-пакет RAGE MP.
 *
 * Минимальный рабочий демо-контур:
 *  - игрок заходит → спавн, моделькa, приветствие в его CEF;
 *  - /veh sultan - выдать машину (сел → HUD в CEF оживает сам,
 *    данные ему шлёт клиентский цикл);
 *  - чат: CEF игрока прислал текст → рассылаем всем.
 *
 * События в CEF отправляем ТОЛЬКО через помощника emitTo -
 * так типы снова проверяет TypeScript.
 */
import type { ClientToCef } from '../../shared/events';

/** Типизированная отправка события прямо в CEF игрока */
function emitTo<K extends keyof ClientToCef>(player: MpPlayer, name: K, data: ClientToCef[K]) {
  player.call('cef:emit', [name, JSON.stringify(data ?? null)]);
}

/** Рассылка события в CEF всех игроков */
function emitAll<K extends keyof ClientToCef>(name: K, data: ClientToCef[K]) {
  const json = JSON.stringify(data ?? null);
  mp.players.forEach((p) => p.call('cef:emit', [name, json]));
}

/* ── игрок зашёл ── */
mp.events.add('playerJoin', (player: MpPlayer) => {
  player.model = mp.joaat('a_m_y_skater_01');
  player.dimension = 0;
  // координаты спавна - поменяй под свой проект
  player.spawn(new mp.Vector3(-1037.6, -2738.3, 20.2));

  // ui:ready придёт позже, чем playerJoin → шлём с небольшой задержкой
  setTimeout(() => {
    emitTo(player, 'player:spawned', { id: player.id, name: player.name, money: 12450 });
    emitTo(player, 'chat:push', { tag: 'SYS', text: `привет, ${player.name}! Это rp-vue-starter. Дай себе машину: /veh - и катайся, HUD оживёт.`, cls: 'system' });
  }, 1500);

  emitAll('chat:push', { tag: 'SYS', text: `${player.name} подключился к серверу`, cls: 'system' });
});

/* ── CEF сказал «я готов» (полезно для дозакрузки данных) ── */
mp.events.add('ui:ready', (player: MpPlayer) => {
  emitTo(player, 'chat:push', { tag: 'SYS', text: 'интерфейс поднят, мост работает ✔', cls: 'system' });
});

/* ── чат из CEF → всем ── */
mp.events.add('chat:send', (player: MpPlayer, json: string) => {
  const { text } = JSON.parse(json) as { text: string };
  if (!text) return;
  emitAll('chat:push', { nick: player.name, text });
});

/* ── /veh [модель] - демо-команда выдачи машины ── */
mp.events.addCommand('veh', (player: MpPlayer, _full: string, model?: string) => {
  const name = model || 'sultan';
  const pos = player.position;
  const veh = mp.vehicles.new(mp.joaat(name), new mp.Vector3(pos.x + 3, pos.y, pos.z + 0.5), {
    heading: 0,
    dimension: player.dimension,
  });
  player.putIntoVehicle(veh, 0);
  emitTo(player, 'chat:push', { tag: 'SYS', text: `выдал тебе ${name}. Катайся!`, cls: 'system' });
});

console.log('[rp-vue-starter] пакет загружен ✔ жду игроков');
