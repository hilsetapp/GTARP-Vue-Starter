/** Глобалы игрового браузера и vendor-библиотеки */
declare global {
  interface Window {
    /** RAGE MP клиентский объект - есть только в игре */
    mp?: { trigger: (name: string, ...args: any[]) => void };
    /** крючок из нашего моста - игра вызывает через browser.execute */
    __rp_on?: (name: string, json: string) => void;
    /** rp-ui-kit (vanilla, грузится с index.html) */
    RPUI?: any;
  }
}

export {};
