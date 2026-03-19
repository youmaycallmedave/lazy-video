(function() {
  function getManagedVideos() {
    return Array.from(document.querySelectorAll('video')).filter(video => {
      return video.querySelector('source[data-src], source[data-src-desktop], source[data-src-tablet], source[data-src-mobile]');
    });
  }

  function getDataSrcAttr(source) {
    const width = window.innerWidth;
    const hasAdaptive = source.hasAttribute('data-src-desktop') ||
                        source.hasAttribute('data-src-tablet') || 
                        source.hasAttribute('data-src-mobile');

    if (!hasAdaptive) {
      return source.hasAttribute('data-src') ? 'data-src' : null;
    }

    if (width >= 992) {
      return source.hasAttribute('data-src-desktop') ? 'data-src-desktop' :
             source.hasAttribute('data-src') ? 'data-src' : null;
    } else if (width >= 768) {
      return source.hasAttribute('data-src-tablet') ? 'data-src-tablet' : null;
    } else {
      return source.hasAttribute('data-src-mobile') ? 'data-src-mobile' : null;
    }
  }

  function shouldAutoplay(video) {
    return video.hasAttribute('autoplay') || video.hasAttribute('data-autoplay');
  }

  function playWhenReady(video) {
    if (!shouldAutoplay(video)) return;

    const startPlayback = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      startPlayback()
      return;
    }

    video.addEventListener('canplay', startPlayback, { once: true });
  }

  function loadVideo(video) {
    if (video.dataset.initialized === 'true') return;

    const sources = video.querySelectorAll('source');
    if (!sources.length) return;

    let hasAny = false;
    sources.forEach(source => {
      const dataAttr = getDataSrcAttr(source);
      const videoUrl = dataAttr ? source.getAttribute(dataAttr) : null;

      if (videoUrl) {
        source.src = videoUrl;
        hasAny = true;
      } else {
        source.removeAttribute('src');
      }
    });

    if (!hasAny) return;

    video.dataset.initialized = 'true';
    video.load();
    playWhenReady(video);
  }

  function loadByPriority(videos, index) {
    if (index >= videos.length) return;

    const video = videos[index];

    let advanced = false;
    function next() {
      if (advanced) return;
      advanced = true;
      loadByPriority(videos, index + 1);
    }

    video.addEventListener('loadeddata', next, { once: true });
    setTimeout(next, 5000);

    loadVideo(video);

    if (video.dataset.initialized !== 'true') {
      next();
    }
  }

  function init() {
    const videos = getManagedVideos();

    loadByPriority(videos, 0);
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      getManagedVideos().forEach(video => {
        delete video.dataset.initialized;
      });
      init();
    }, 300);
  });

  window.addEventListener('orientationchange', () => {
    getManagedVideos().forEach(video => {
      delete video.dataset.initialized;
    });
    init();
  });
})();
