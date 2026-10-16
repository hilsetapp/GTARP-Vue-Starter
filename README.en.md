[Русский](README.md) | **English**

# RP VUE STARTER

A starter kit for RAGE MP / GTA RP servers: Vue 3 + Vite + TypeScript + Pinia.
You write the game UI as a normal website, and every event between the UI,
the game client and the server is typed.

## Why it exists

Every RP server sets up the same CEF wiring by hand, and events fly around as
bare strings - typo in a name and you hunt the bug for two hours.

Here all events live in `shared/events.ts`. Rename a field and TypeScript flags
every wrong producer/consumer across the UI, client and server.

Second thing: no game needed while developing. `npm run dev` opens the UI in the
browser with a mock-server panel - drag speed sliders, push chat messages, fake a
player join. Same event pipeline as in the actual game.

Ships with a small working UI: speedometer (speed, rpm, fuel, street), chat on `T`,
a player badge, plus a phone from [rp-ui-kit](https://github.com/hilsetapp/Gtarp-ui-kit)
as an example of embedding vanilla libs. Type `/veh` in game and drive - the HUD runs by itself.

## Try it

```bash
git clone https://github.com/hilsetapp/GTARP-Vue-Starter.git
cd rp-vue-starter
npm i
npm run dev
```

Open http://localhost:5173 - UI plus the mock panel.

## Deploy to a server

```bash
npm run build      # outputs server-files/ - copy it over your RAGE server folder
npm run build:dev  # same, but the CEF loads from vite: edits show in-game instantly
```

Full walkthrough (RU, beginner-paced): [GUIDE.md](GUIDE.md).

## Layout

```
cef/       the UI: Vue 3 + Vite + TS + Pinia
client/    game client script: event forwarding, speed loop, hotkeys
server/    game server script: spawn, chat relay, /veh command
shared/    events.ts - every event type in one file
types/     minimal RAGE MP typings, extend when you need more
scripts/   build.mjs - packs everything into server-files/
```

## Add an event

Three spots: one line in `shared/events.ts`, one sender, one `on(...)`.
Misspell anything and the compiler complains before you run it.

## License

MIT.
