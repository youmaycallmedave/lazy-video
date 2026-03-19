# lazy-video

## Как это работает

Скрипт находит все `video` с `source[data-*]`, подставляет нужный `src` и вызывает `video.load()`.

Видео обрабатываются по порядку в HTML.

## Какие атрибуты использовать

- `data-src` — один файл на все устройства
- `data-src-desktop` — только для десктопа `>= 992px`
- `data-src-tablet` — только для планшета `768–991px`
- `data-src-mobile` — только для мобайла `< 768px`
- `autoplay` или `data-autoplay` — включить автозапуск после загрузки

## Примеры

Один файл для всех устройств:

```html
<video muted playsinline autoplay loop>
  <source data-src="video.webm" type="video/webm">
</video>
```

Разные файлы по брейкпоинтам:

```html
<video muted playsinline autoplay loop>
  <source data-src-desktop="desktop.webm" type="video/webm">
  <source data-src-tablet="tablet.webm" type="video/webm">
  <source data-src-mobile="mobile.mp4" type="video/mp4">
</video>
```

Если нужен autoplay, обычно нужны `muted` и `playsinline`.
