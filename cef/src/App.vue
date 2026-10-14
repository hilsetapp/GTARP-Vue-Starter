<script setup lang="ts">
import Hud from './components/Hud.vue';
import Chat from './components/Chat.vue';
import PhoneDemo from './components/PhoneDemo.vue';
import DevPanel from './components/DevPanel.vue';
import { useGameStore } from './stores/game';
import { on, isBrowser } from './bridge';

const store = useGameStore();

/* F2 от клиента игры прилетает сюда; в браузере эмулируем локально */
on('hud:flip', () => { store.hudVisible = !store.hudVisible; });
if (isBrowser) {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'F2') { e.preventDefault(); store.hudVisible = !store.hudVisible; }
  });
}
</script>

<template>
  <div class="screen">
    <!-- Чат: левый верхний угол -->
    <Chat />

    <!-- HUD: правый нижний угол -->
    <Hud v-show="store.hudVisible" />

    <!-- Панель игрока: правый верхний угол -->
    <div class="whoami">
      <span class="id">ID {{ store.player.id }}</span>
      <b>{{ store.player.name }}</b>
      <span class="money">{{ store.moneyFmt }}</span>
    </div>

    <!-- Телефон из rp-ui-kit (пример встраивания vanilla-виджета) -->
    <PhoneDemo />

    <!-- Мок-панель сервера — только в разработке в браузере -->
    <DevPanel v-if="isBrowser" />

    <!-- Хоткеи-подсказка -->
    <div class="hint" v-if="isBrowser">F2 — скрыть/показать HUD · T/Enter — чат</div>
  </div>
</template>
