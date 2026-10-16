# Как помочь

Проект маленький, правила простые.

## У себя

```bash
git clone https://github.com/hilsetapp/GTARP-Vue-Starter.git
cd rp-vue-starter
npm i
npm run dev
```

## Перед PR

```bash
npm run check
npm run build
```

Интерфейс проверь в мок-режиме. Если трогал client/ или server/ - хорошо бы прогнать
в игре по GUIDE.md, но если негде, просто напиши об этом в PR, это нормально.

## Правила

- Код и комментарии по-русски.
- Новые события только через `shared/events.ts` и типизированные send/on/emitTo.
  Прямой mp.trigger со строковым именем не приму.
- README или GUIDE подправь в том же PR, если правилось поведение.
- Сомневаешься насчёт задачи - лучше Issue, чем PR наперевес.
