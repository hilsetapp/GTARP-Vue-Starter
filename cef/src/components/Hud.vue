<script setup lang="ts">
import { useGameStore } from '../stores/game';
const store = useGameStore();
</script>

<template>
  <div class="hud" :class="{ off: !store.hud.inCar }">
    <div class="panel">
      <div class="speed">
        <b>{{ store.speedInt }}</b><small>км/ч</small>
      </div>
      <div class="rpm"><i :style="{ width: Math.min(100, store.hud.rpm * 100).toFixed(0) + '%' }"></i></div>
      <div class="row">
        <span class="gear">{{ store.hud.gear === 0 ? 'N' : store.hud.gear }}</span>
        <span class="flag" :class="{ on: store.hud.belt }" title="ремень">🎗</span>
        <span class="flag warn" :class="{ on: store.hud.engine }" title="двигатель">⚙</span>
      </div>
      <div class="fuel">
        <div class="bar"><i :style="{ width: store.hud.fuel + '%' }" :class="{ low: store.hud.fuel < 15 }"></i></div>
        <small>⛽ {{ Math.round(store.hud.fuel) }}</small>
      </div>
      <div class="street">{{ store.hud.street }}</div>
    </div>
  </div>
</template>

<style scoped>
.hud { position: absolute; right: 22px; bottom: 20px; transition: opacity .25s; }
.hud.off { opacity: 0; }
.panel {
  width: 210px; padding: 14px 16px 12px; border-radius: 16px;
  background: rgba(16, 14, 12, .78); border: 1px solid rgba(242, 234, 217, .14);
  backdrop-filter: blur(6px); color: #f2ead9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.speed { display: flex; align-items: baseline; gap: 8px; }
.speed b { font-size: 42px; line-height: 1; font-variant-numeric: tabular-nums; }
.speed small { color: #a89e8a; font-size: 13px; }
.rpm { height: 4px; margin: 8px 0 10px; border-radius: 99px; background: rgba(255, 255, 255, .08); overflow: hidden; }
.rpm i { display: block; height: 100%; background: linear-gradient(90deg, #ff8a2a, #ffcd57); border-radius: 99px; transition: width .1s linear; }
.row { display: flex; align-items: center; gap: 10px; }
.gear { font: 700 20px/1 ui-monospace, monospace; color: #ffcd57; min-width: 18px; text-align: center; }
.flag { opacity: .25; filter: grayscale(1); }
.flag.on { opacity: 1; filter: none; }
.flag.warn.on { color: #ff5959; animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: .35; } }
.fuel { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.fuel .bar { flex: 1; height: 5px; background: rgba(255, 255, 255, .08); border-radius: 99px; overflow: hidden; }
.fuel .bar i { display: block; height: 100%; background: #9ef24d; transition: width .2s; }
.fuel .bar i.low { background: #ff5959; }
.fuel small { color: #a89e8a; font-size: 11px; }
.street { margin-top: 6px; font: 600 10px ui-monospace, monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #a89e8a; }
</style>
