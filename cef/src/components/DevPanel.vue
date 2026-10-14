<script setup lang="ts">
import { ref } from 'vue';
import { emitLocal } from '../bridge';

/**
 * МОК-ПАНЕЛЬ СЕРВЕРА — главная DX-фишка разработки без игры.
 * Видна только в браузере (npm run dev). Двигаешь ползунки — события
 * идут по ТОМУ ЖЕ типизированному пайплайну, что и в игре.
 */
const speed = ref(0);
const rpm = ref(0);
const fuel = ref(80);

function applyCar() {
  emitLocal('hud:update', { speed: speed.value, rpm: rpm.value / 100, fuel: fuel.value, inCar: speed.value > 0, street: 'Вайнвуд-Хиллз' });
}
function randomNg() {
  const s = Math.floor(Math.random() * 180);
  speed.value = s; rpm.value = Math.min(100, Math.round(s / 1.8 + Math.random() * 20));
  applyCar();
}
function sysMsg() {
  emitLocal('chat:push', { tag: 'SYS', text: 'очередь на сервер: 3 · тик: ' + new Date().toLocaleTimeString('ru-RU'), cls: 'system' });
}
function playerMsg() {
  const names = ['Коль Гжегож', 'Макс Фрай', 'Витёк PD'];
  emitLocal('chat:push', { nick: names[(Math.random() * names.length) | 0], text: 'yy, едь на точку ' + ((Math.random() * 9 + 1) | 0) });
}
function fuelAlarm() {
  fuel.value = 12; applyCar();
  emitLocal('chat:push', { tag: 'АЗС', text: 'топливо на исходе, ближайшая заправка отмечена на карте', cls: 'admin' });
}
function joinMsg() {
  emitLocal('player:spawned', { id: 7, name: 'Санёк Гроза', money: 12450 });
  emitLocal('chat:push', { tag: 'SYS', text: 'Санёк Гроза подключился к серверу', cls: 'system' });
}
</script>

<template>
  <div class="devpanel">
    <div class="title">⚙ МОК СЕРВЕРА <small>в игре видно не будет</small></div>

    <label>скорость: {{ speed }} км/ч
      <input type="range" min="0" max="220" v-model.number="speed" @input="applyCar" />
    </label>
    <label>rpm: {{ rpm }}%
      <input type="range" min="0" max="100" v-model.number="rpm" @input="applyCar" />
    </label>
    <label>топливо: {{ fuel }}
      <input type="range" min="0" max="100" v-model.number="fuel" @input="applyCar" />
    </label>

    <div class="btns">
      <button @click="randomNg">🎲 рандом езда</button>
      <button @click="sysMsg">SYS сообщение</button>
      <button @click="playerMsg">игрок пишет</button>
      <button @click="fuelAlarm">⛽ тревога топливо</button>
      <button @click="joinMsg">игрок зашёл</button>
    </div>
  </div>
</template>

<style scoped>
.devpanel {
  position: absolute; left: 22px; bottom: 20px; width: 300px; padding: 14px;
  border-radius: 14px; border: 1px dashed rgba(255, 138, 42, .55);
  background: rgba(20, 17, 14, .9); color: #f2ead9;
  font-family: 'Segoe UI', system-ui, sans-serif; font-size: 12px;
}
.title { font: 700 11px ui-monospace, monospace; letter-spacing: 1px; color: #ff8a2a; margin-bottom: 10px; }
.title small { color: #a89e8a; font-weight: 400; letter-spacing: 0; }
label { display: block; margin-bottom: 6px; color: #cfc4ae; }
input[type='range'] { width: 100%; accent-color: #ff8a2a; }
.btns { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
button {
  padding: 6px 10px; border-radius: 9px; border: 1px solid rgba(242, 234, 217, .2);
  background: rgba(255, 138, 42, .12); color: #f2ead9; cursor: pointer; font-size: 11px;
}
button:hover { background: rgba(255, 138, 42, .3); }
</style>
