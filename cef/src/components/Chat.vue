<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useGameStore } from '../stores/game';
import { send, on } from '../bridge';

const store = useGameStore();
const inputOpen = ref(false);
const draft = ref('');
const listEl = ref<HTMLElement>();

watch(() => store.chat.length, async () => {
  await nextTick();
  listEl.value?.scrollTo({ top: listEl.value.scrollHeight });
});

/* игра попросила открыть чат (клиент поймал T) */
on('chat:focus', () => { inputOpen.value = true; });

/* в браузерной разработке эмулируем T локально (не мешаем инпутам телефона) */
window.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'е') && !inputOpen.value && !(e.target as HTMLElement)?.closest?.('input,textarea')) {
    inputOpen.value = true;
    e.preventDefault();
  } else if (e.key === 'Escape' && inputOpen.value) {
    close();
  }
});

function close() {
  inputOpen.value = false;
  send('chat:blur', undefined);
}

function submit() {
  const text = draft.value.trim();
  if (text) send('chat:send', { text });
  draft.value = '';
  close();
}
</script>

<template>
  <div class="chat">
    <div class="list" ref="listEl">
      <div v-for="(m, i) in store.chat" :key="i" class="msg" :class="m.cls">
        <b v-if="m.tag" class="tag">{{ m.tag }}</b>
        <b v-if="m.nick" class="nick">{{ m.nick }}:</b>
        <span>{{ m.text }}</span>
      </div>
    </div>
    <input
      v-if="inputOpen" v-model="draft" class="input" maxlength="140" autofocus
      placeholder="Сообщение… (Enter — отправить, Esc — закрыть)"
      @keydown.enter.stop="submit" @keydown.esc.stop="close"
    />
  </div>
</template>

<style scoped>
.chat { position: absolute; left: 22px; top: 20px; width: 380px; font-family: 'Segoe UI', system-ui, sans-serif; }
.list { max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; }
.list::-webkit-scrollbar { width: 0; }
.msg {
  padding: 7px 12px; border-radius: 10px; font-size: 13px; width: fit-content; max-width: 100%;
  background: rgba(16, 14, 12, .72); color: #f2ead9; border: 1px solid rgba(242, 234, 217, .1);
  animation: in .18s ease;
}
@keyframes in { from { opacity: 0; transform: translateY(6px); } }
.msg.system { border-color: rgba(255, 138, 42, .4); }
.msg.admin { border-color: rgba(255, 89, 89, .5); }
.tag { color: #ff8a2a; margin-right: 8px; font-size: 11px; }
.nick { color: #ffcd57; margin-right: 6px; }
.input {
  margin-top: 8px; width: 100%; padding: 10px 14px; border-radius: 12px; outline: none;
  background: rgba(16, 14, 12, .88); border: 1px solid #ff8a2a; color: #f2ead9; font-size: 13px;
}
</style>
