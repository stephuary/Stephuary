/**
 * Cloudflare Stream / HLS.js: sharper startup without heavy video preload.
 * — Higher default bandwidth estimate so ABR climbs faster
 * — After manifest: start on ~upper-mid rung (not the lowest ladder step)
 * Caller must load hls.js before this file.
 */
(function (global) {
  function attachHlsCine(video, manifestUrl) {
    if (!video || !manifestUrl || !global.Hls || !global.Hls.isSupported()) return null;
    var Hls = global.Hls;
    var hls = new Hls({
      capLevelToPlayerSize: true,
      maxBufferLength: 36,
      abrEwmaDefaultEstimate: 4500000,
      abrBandWidthUpFactor: 0.82
    });
    hls.loadSource(manifestUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      var lv = hls.levels;
      if (!lv || !lv.length) return;
      var idx =
        lv.length === 1 ? 0 : Math.min(lv.length - 1, Math.max(1, Math.floor(lv.length * 0.72)));
      hls.startLevel = idx;
    });
    return hls;
  }
  global.stephuaryAttachHlsCine = attachHlsCine;
})(typeof window !== 'undefined' ? window : this);
