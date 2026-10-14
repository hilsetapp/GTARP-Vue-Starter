import { defineStore } from 'pinia';
import type { HudState, ChatMsg } from '@shared/events';

export const useGameStore = defineStore('game', {
  state: () => ({
    player: { id: 0, name: '-', money: 0 },
    hud: {
      speed: 0, rpm: 0, fuel: 0, gear: 0,
      belt: false, engine: false, inCar: false, street: 'Los Santos',
    } as HudState,
    hudVisible: true,
    chat: [
      { tag: 'SYS', text: 'добро пожаловать на rp-vue-starter!', cls: 'system' },
    ] as ChatMsg[],
    phoneOpen: false,
  }),
  getters: {
    moneyFmt: (s) => '$' + s.player.money.toLocaleString('ru-RU'),
    speedInt: (s) => Math.round(s.hud.speed),
  },
});
