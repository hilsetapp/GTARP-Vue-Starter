/**
 * Минимальные и честные типы RAGE MP API — ровно то, что использует стартер.
 * Полные типы сообщества можешь подключить позже; эти — читаемые, расширяй их.
 */

interface MpVector3 { x: number; y: number; z: number }

interface MpBrowser {
  active: boolean;
  /** выполнить JS внутри CEF-страницы */
  execute(code: string): void;
}

interface MpVehicle { getSpeed(): number }

interface MpPlayer {
  id: number;
  name: string;
  position: MpVector3;
  vehicle: MpVehicle | null;
  model: number;
  dimension: number;
  spawn(pos: MpVector3): void;
  call(name: string, args?: any[]): void;
  putIntoVehicle(veh: MpVehicle, seat: number): void;
}

declare const mp: {
  events: {
    add(name: string, cb: (...args: any[]) => void): void;
    call(name: string, ...args: any[]): void;
    callRemote(name: string, ...args: any[]): void;
    addCommand(name: string, cb: (player: MpPlayer, fullText: string, ...args: string[]) => void): void;
  };
  browsers: { new: (url: string) => MpBrowser };
  players: {
    local: MpPlayer;
    forEach(cb: (p: MpPlayer) => void): void;
  };
  vehicles: { new: (model: number, pos: MpVector3, opts?: { dimension?: number; heading?: number }) => MpVehicle };
  keys: { bind(keyCode: number, keyDown: boolean, cb: () => void): void };
  gui: {
    cursor: { show(show: boolean, toggleControls: boolean): void };
    chat: { push(msg: string): void };
  };
  game: {
    zone: { getNameOfZone(x: number, y: number, z: number): string };
    ui: { getLabelText(key: string): string };
  };
  Vector3: new (x: number, y: number, z: number) => MpVector3;
  joaat(name: string): number;
};
