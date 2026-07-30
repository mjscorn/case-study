/*!
 * <adyen-ai-mark> — Adyen Intelligence prop-to-icon animation
 * ---------------------------------------------------------------------------
 * A self-contained custom element (shadow DOM, no dependencies) that renders
 * the 4-petal "ai prop" flower and morphs it into the "ai" icon:
 *
 *   idle      four petals, scaled to the footprint of the finished mark,
 *             gently flickering like a candle flame every 5s
 *   play()    the flower shrinks to size while three petals swirl counter-
 *             clockwise around a shared hinge and fold under the fixed
 *             top-right anchor petal; the "a" then grows out from behind the
 *             letter gap while the "i" stem rises into the anchor (which
 *             becomes the i-dot) — settling into the mark, still flickering
 *
 * USAGE
 *   <script src="ai-mark.js"></script>
 *   <adyen-ai-mark></adyen-ai-mark>
 *
 * ATTRIBUTES
 *   size           CSS width of the mark            (default "26px")
 *   duration       length of the morph              (default "1s")
 *   color          fill colour                      (default "#00D16A")
 *   autoplay       play once on connect             (boolean)
 *   click-to-play  clicking the mark replays it     (boolean)
 *
 * METHODS
 *   el.play()      run the morph from the top (safe to call repeatedly)
 *   el.reset()     return to the idle flower
 *
 * EXAMPLES
 *   <adyen-ai-mark size="26px" duration="1s" autoplay></adyen-ai-mark>
 *   <adyen-ai-mark size="120px" click-to-play></adyen-ai-mark>
 *   document.querySelector('adyen-ai-mark').play();
 */
(function () {
  'use strict';

  var TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = [
    '<style>',
    ':host { display: inline-block; line-height: 0; }',
    '.mark { width: var(--ai-mark-size, 26px); height: auto; overflow: visible; display: block; }',
    ':host([click-to-play]) .mark { cursor: pointer; }',

    /* --- idle: i and a wait off-crop; flower scaled up + flickering --- */
    '.mark:not(.run) .istem { transform: translateY(40px); }',
    '.mark:not(.run) .a { transform: translateX(65px); }',
    '.fscale, .fflicker { transform-box: view-box; transform-origin: 70px 24.5px; }',
    '.mark:not(.run) .fscale { transform: translate(-20px, 8.5px) scale(1.6); }',
    '.mark:not(.run) .fflicker { animation: flame 5s ease-in-out infinite; }',
    '.mark.run .fscale { animation: fshrink var(--ai-mark-dur, 1s) cubic-bezier(.4,0,.2,1) 1 forwards; }',
    '@keyframes fshrink {',
    '  0%   { transform: translate(-20px, 8.5px) scale(1.6); }',
    '  38%  { transform: translate(0px, 0px) scale(1); }',
    '  100% { transform: translate(0px, 0px) scale(1); }',
    '}',

    /* --- transform setup: petals orbit the shared hinge at (70, 24.5) --- */
    '.mark .p-tl, .mark .p-bl, .mark .p-br, .mark .p-tr {',
    '  transform-box: view-box; transform-origin: 70px 24.5px;',
    '}',
    '.mark .istem { transform-box: fill-box; transform-origin: center bottom; }',
    '.mark .a { transform-box: fill-box; transform-origin: center; }',

    '.mark.run .p-tl  { animation: swirlTL var(--ai-mark-dur, 1s) linear 1 forwards; }',
    '.mark.run .p-bl  { animation: swirlBL var(--ai-mark-dur, 1s) linear 1 forwards; }',
    '.mark.run .p-br  { animation: swirlBR var(--ai-mark-dur, 1s) linear 1 forwards; }',
    '.mark.run .p-tr  { animation: anchor  var(--ai-mark-dur, 1s) linear 1 forwards; }',
    '.mark.run .istem { animation: istem   var(--ai-mark-dur, 1s) cubic-bezier(.3,0,.2,1) 1 forwards; }',
    '.mark.run .a     { animation: aslide  var(--ai-mark-dur, 1s) cubic-bezier(.35,0,.15,1) 1 forwards; }',

    /* Three lighter petals start together at 8% and rotate at the same constant
       angular speed. Over their final 40deg each eases into a corrective
       translate+scale so it comes to rest perfectly centred UNDER the anchor
       petal, fully covered — then its opacity is cut silently. */
    '@keyframes swirlTL {',
    '  0%    { opacity: 0; transform: rotate(0deg) translate(0px, 0px) scale(1); }',
    '  8%    { opacity: 1; transform: rotate(0deg) translate(0px, 0px) scale(1); }',
    '  45.5% { opacity: 1; transform: rotate(-230deg) translate(0px, 0px) scale(1); }',
    '  52%   { opacity: 1; transform: rotate(-270deg) translate(-4.4px, -9.1px) scale(.55); }',
    '  53.5% { opacity: 0; transform: rotate(-270deg) translate(-4.4px, -9.1px) scale(.55); }',
    '  100%  { opacity: 0; transform: rotate(-270deg) translate(-4.4px, -9.1px) scale(.55); }',
    '}',
    '@keyframes swirlBL {',
    '  0%    { opacity: 0; transform: rotate(0deg) translate(0px, 0px) scale(1); }',
    '  8%    { opacity: 1; transform: rotate(0deg) translate(0px, 0px) scale(1); }',
    '  30.8% { opacity: 1; transform: rotate(-140deg) translate(0px, 0px) scale(1); }',
    '  37.3% { opacity: 1; transform: rotate(-180deg) translate(-7.4px, 6.1px) scale(.55); }',
    '  38.8% { opacity: 0; transform: rotate(-180deg) translate(-7.4px, 6.1px) scale(.55); }',
    '  100%  { opacity: 0; transform: rotate(-180deg) translate(-7.4px, 6.1px) scale(.55); }',
    '}',
    '@keyframes swirlBR {',
    '  0%    { opacity: 0; transform: rotate(0deg) translate(0px, 0px) scale(1); }',
    '  8%    { opacity: 1; transform: rotate(0deg) translate(0px, 0px) scale(1); }',
    '  16.2% { opacity: 1; transform: rotate(-50deg) translate(0px, 0px) scale(1); }',
    '  22.7% { opacity: 1; transform: rotate(-90deg) translate(4.4px, 9.1px) scale(.55); }',
    '  24.2% { opacity: 0; transform: rotate(-90deg) translate(4.4px, 9.1px) scale(.55); }',
    '  100%  { opacity: 0; transform: rotate(-90deg) translate(4.4px, 9.1px) scale(.55); }',
    '}',
    /* anchor petal = the i-dot: never moves or resizes, just holds */
    '@keyframes anchor {',
    '  0%   { opacity: 0; }',
    '  6%   { opacity: 1; }',
    '  100% { opacity: 1; }',
    '}',

    /* Staggered so neither collides with the TL petal's sweep: the "a" emerges
       once TL has cleared the left corridor, the i rises once TL is at rest. */
    '@keyframes istem {',
    '  0%, 56% { opacity: 1; transform: translateY(40px); }',
    '  92%     { opacity: 1; transform: translateY(0); }',
    '  100%    { opacity: 1; transform: translateY(0); }',
    '}',
    '@keyframes aslide {',
    '  0%, 44% { transform: translateX(65px); }',
    '  74%     { transform: translateX(0); }',
    '  100%    { transform: translateX(0); }',
    '}',

    /* Candle-flame idle on the anchor petal, pivoting at its base */
    '.flame { transform-box: view-box; transform-origin: 73px 21.5px; }',
    '.mark.settled .flame { animation: flame 5s ease-in-out infinite; }',
    '@keyframes flame {',
    '  0%   { transform: rotate(0deg) scale(1); }',
    '  6%   { transform: rotate(2.6deg) scale(1.015); }',
    '  12%  { transform: rotate(-1.9deg) scale(.995); }',
    '  18%  { transform: rotate(1.1deg) scale(1.008); }',
    '  24%  { transform: rotate(0deg) scale(1); }',
    '  100% { transform: rotate(0deg) scale(1); }',
    '}',

    '@media (prefers-reduced-motion: reduce) {',
    '  .mark * { animation: none !important; }',
    '  .mark:not(.run) .fscale { transform: none; }',
    '  .mark:not(.run) .istem { transform: none; }',
    '  .mark:not(.run) .a { transform: none; }',
    '  .mark:not(.run) .p-tl, .mark:not(.run) .p-bl, .mark:not(.run) .p-br { opacity: 0; }',
    '}',
    '</style>',

    '<svg class="mark" part="mark" viewBox="0 0 101 66" fill="none" xmlns="http://www.w3.org/2000/svg">',
    '  <defs>',
    /* keeps the "a" hidden in the letter gap until it grows out */
    '    <clipPath id="aClip"><rect x="-40" y="-30" width="105" height="130" shape-rendering="crispEdges"/></clipPath>',
    /* hides the i-stem below its resting baseline (y=65.5) as it rises */
    '    <clipPath id="iClip"><rect x="60" y="-40" width="60" height="105.5" shape-rendering="crispEdges"/></clipPath>',
    '  </defs>',
    '  <g clip-path="url(#aClip)">',
    '    <path class="a" d="M53 0.5H0.5V16.5H37.5V48.5H26.5V27H0.5V53.5C0.5 60.1274 5.87259 65.5 12.5 65.5H65V12.5C65 5.87258 59.6274 0.5 53 0.5Z"/>',
    '  </g>',
    '  <g clip-path="url(#iClip)">',
    '    <path class="istem" d="M88 27.5H73V65.5H100V39.5C100 32.8726 94.6274 27.5 88 27.5Z"/>',
    '  </g>',
    '  <g class="fscale"><g class="fflicker">',
    '    <g class="p-tl"><path transform="translate(24 -15.5)" d="M31 16H16V25C16 31.6274 21.3726 37 28 37H43V28C43 21.3726 37.6274 16 31 16Z" opacity="0.4"/></g>',
    '    <g class="p-bl"><path transform="translate(24 -15.5)" d="M28 43H43V52C43 58.6274 37.6274 64 31 64H16V55C16 48.3726 21.3726 43 28 43Z" opacity="0.6"/></g>',
    '    <g class="p-br"><path transform="translate(24 -15.5)" d="M64 43H49V52C49 58.6274 54.3726 64 61 64H76V55C76 48.3726 70.6274 43 64 43Z" opacity="0.8"/></g>',
    '    <g class="p-tr"><g class="flame"><path transform="translate(24 -15.5)" d="M61 16H76V25C76 31.6274 70.6274 37 64 37H49V28C49 21.3726 54.3726 16 61 16Z"/></g></g>',
    '  </g></g>',
    '</svg>'
  ].join('\n');

  var _uid = 0;
  var AdyenAiMark = function () {
    var self = Reflect.construct(HTMLElement, [], AdyenAiMark);
    var root = self.attachShadow({ mode: 'open' });
    root.appendChild(TEMPLATE.content.cloneNode(true));
    self._mark = root.querySelector('.mark');
    self._settleTimer = null;
    var id = ++_uid;
    var aC = root.querySelector('#aClip');
    var iC = root.querySelector('#iClip');
    if (aC) { aC.id = 'aClip' + id; root.querySelector('[clip-path="url(#aClip)"]').setAttribute('clip-path', 'url(#aClip' + id + ')'); }
    if (iC) { iC.id = 'iClip' + id; root.querySelector('[clip-path="url(#iClip)"]').setAttribute('clip-path', 'url(#iClip' + id + ')'); }
    return self;
  };
  AdyenAiMark.prototype = Object.create(HTMLElement.prototype);
  AdyenAiMark.prototype.constructor = AdyenAiMark;
  Object.setPrototypeOf(AdyenAiMark, HTMLElement);

  AdyenAiMark.observedAttributes = ['size', 'duration', 'color'];

  AdyenAiMark.prototype._sync = function () {
    this.style.setProperty('--ai-mark-size', this.getAttribute('size') || '26px');
    this.style.setProperty('--ai-mark-dur', this.getAttribute('duration') || '1s');
    var color = this.getAttribute('color') || '#00D16A';
    this.shadowRoot.querySelectorAll('path').forEach(function (p) {
      p.setAttribute('fill', color);
    });
  };

  AdyenAiMark.prototype.attributeChangedCallback = function () { this._sync(); };

  AdyenAiMark.prototype.connectedCallback = function () {
    this._sync();
    if (!this._bound) {
      this._bound = true;
      var self = this;
      this._mark.addEventListener('click', function () {
        if (self.hasAttribute('click-to-play')) self.play();
      });
    }
    if (this.hasAttribute('autoplay')) this.play();
  };

  /** Duration of the morph, in milliseconds. */
  AdyenAiMark.prototype._durationMs = function () {
    var d = (this.getAttribute('duration') || '1s').trim();
    var n = parseFloat(d) || 1;
    return /ms$/.test(d) ? n : n * 1000;
  };

  /** Run the morph from the top. Safe to call repeatedly. */
  AdyenAiMark.prototype.play = function () {
    var mark = this._mark;
    var self = this;
    mark.classList.remove('settled');
    mark.classList.remove('run');
    // SVG elements have no offsetWidth, so cancel in-flight animations and
    // flush layout on an HTML element to guarantee a clean restart.
    mark.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    void document.body.offsetWidth;
    mark.classList.add('run');

    clearTimeout(this._settleTimer);
    this._settleTimer = setTimeout(function () {
      mark.classList.add('settled');
      self.dispatchEvent(new CustomEvent('settled'));
    }, this._durationMs() + 50);
  };

  /** Return to the idle flower. */
  AdyenAiMark.prototype.reset = function () {
    clearTimeout(this._settleTimer);
    this._mark.classList.remove('run', 'settled');
    this._mark.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
  };

  if (!customElements.get('adyen-ai-mark')) {
    customElements.define('adyen-ai-mark', AdyenAiMark);
  }
})();
