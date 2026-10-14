import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { on, send } from './bridge';
import { useGameStore } from './stores/game';
import './style.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');

/* Подписки на события из игры - раскладываем по стору */
const store = useGameStore(pinia);

on('hud:update', (d) => Object.assign(store.hud, d));
on('chat:push', (m) => {
  store.chat.push(m);
  if (store.chat.length > 14) store.chat.shift();
});
on('player:spawned', (p) => { store.player = p; });

/* Говорим игре: интерфейс готов, слушаем */
send('ui:ready', undefined);
