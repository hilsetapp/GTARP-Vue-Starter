<script setup lang="ts">
import { onMounted, ref } from 'vue';

/**
 * Пример встраивания vanilla-библиотеки во Vue:
 * телефон из rp-ui-kit живёт своей жизнью, мы лишь монтируем его
 * в контейнер и пробрасываем события в типизированный мост.
 */
const host = ref<HTMLElement>();
let phone: any = null;

function toggle() {
  if (!phone) return;
  const ui = document.querySelector('.rpui-phone');
  const open = !(ui && ui.classList.contains('open'));
  open ? phone.open() : phone.close();
}

onMounted(() => {
  const RPUI = (window as any).RPUI;
  if (!RPUI || !host.value) return;
  phone = RPUI.Phone({ balance: 12450 });
  host.value.appendChild(phone.el);
});

defineExpose({ toggle });
</script>

<template>
  <div class="phonedemo">
    <button class="call" @click="toggle">📱 телефон</button>
    <div ref="host" class="host"></div>
  </div>
</template>

<style scoped>
.phonedemo { position: absolute; right: 22px; top: 84px; }
.call {
  padding: 8px 14px; border-radius: 12px; cursor: pointer; float: right;
  background: rgba(16, 14, 12, .8); border: 1px solid rgba(242, 234, 217, .2);
  color: #f2ead9; font: 600 12px ui-monospace, monospace; letter-spacing: 1px;
}
.call:hover { border-color: #ff8a2a; color: #ff8a2a; }
.host { position: fixed; inset: 0; pointer-events: none; z-index: 50; }
.host :deep(.rpui-phone) { pointer-events: auto; }
</style>
