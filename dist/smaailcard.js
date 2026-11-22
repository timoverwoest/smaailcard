/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht = globalThis, Xt = ht.ShadowRoot && (ht.ShadyCSS === void 0 || ht.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qt = Symbol(), ue = /* @__PURE__ */ new WeakMap();
let Ie = class {
  constructor(t, e, o) {
    if (this._$cssResult$ = !0, o !== qt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Xt && t === void 0) {
      const o = e !== void 0 && e.length === 1;
      o && (t = ue.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && ue.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const fo = (s) => new Ie(typeof s == "string" ? s : s + "", void 0, qt), bt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((o, n, i) => o + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[i + 1], s[0]);
  return new Ie(e, s, qt);
}, $o = (s, t) => {
  if (Xt) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const o = document.createElement("style"), n = ht.litNonce;
    n !== void 0 && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
  }
}, pe = Xt ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const o of t.cssRules) e += o.cssText;
  return fo(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: go, defineProperty: bo, getOwnPropertyDescriptor: Ao, getOwnPropertyNames: yo, getOwnPropertySymbols: vo, getPrototypeOf: wo } = Object, At = globalThis, me = At.trustedTypes, So = me ? me.emptyScript : "", Eo = At.reactiveElementPolyfillSupport, V = (s, t) => s, ut = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? So : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, Qt = (s, t) => !go(s, t), _e = { attribute: !0, type: String, converter: ut, reflect: !1, useDefault: !1, hasChanged: Qt };
Symbol.metadata ??= Symbol("metadata"), At.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let D = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = _e) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const o = Symbol(), n = this.getPropertyDescriptor(t, o, e);
      n !== void 0 && bo(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, o) {
    const { get: n, set: i } = Ao(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: n, set(a) {
      const c = n?.call(this);
      i?.call(this, a), this.requestUpdate(t, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? _e;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const t = wo(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const e = this.properties, o = [...yo(e), ...vo(e)];
      for (const n of o) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [o, n] of e) this.elementProperties.set(o, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, o] of this.elementProperties) {
      const n = this._$Eu(e, o);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const n of o) e.unshift(pe(n));
    } else t !== void 0 && e.push(pe(t));
    return e;
  }
  static _$Eu(t, e) {
    const o = e.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const o of e.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $o(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, o) {
    this._$AK(t, o);
  }
  _$ET(t, e) {
    const o = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, o);
    if (n !== void 0 && o.reflect === !0) {
      const i = (o.converter?.toAttribute !== void 0 ? o.converter : ut).toAttribute(e, o.type);
      this._$Em = t, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const o = this.constructor, n = o._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const i = o.getPropertyOptions(n), a = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : ut;
      this._$Em = n;
      const c = a.fromAttribute(e, i.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, o, n = !1, i) {
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (i = this[t]), o ??= a.getPropertyOptions(t), !((o.hasChanged ?? Qt)(i, e) || o.useDefault && o.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, o)))) return;
      this.C(t, e, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: o, reflect: n, wrapped: i }, a) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), i !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [n, i] of o) {
        const { wrapped: a } = i, c = this[n];
        a !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, i, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[V("elementProperties")] = /* @__PURE__ */ new Map(), D[V("finalized")] = /* @__PURE__ */ new Map(), Eo?.({ ReactiveElement: D }), (At.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis, fe = (s) => s, pt = te.trustedTypes, $e = pt ? pt.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Be = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, Ue = "?" + T, Co = `<${Ue}>`, I = document, X = () => I.createComment(""), q = (s) => s === null || typeof s != "object" && typeof s != "function", ee = Array.isArray, xo = (s) => ee(s) || typeof s?.[Symbol.iterator] == "function", Nt = `[ 	
\f\r]`, Y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, be = />/g, O = RegExp(`>|${Nt}(?:([^\\s"'>=/]+)(${Nt}*=${Nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ae = /'/g, ye = /"/g, ke = /^(?:script|style|textarea|title)$/i, De = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), C = De(1), f = De(2), G = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), P = I.createTreeWalker(I, 129);
function Ge(s, t) {
  if (!ee(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $e !== void 0 ? $e.createHTML(t) : t;
}
const Ro = (s, t) => {
  const e = s.length - 1, o = [];
  let n, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Y;
  for (let c = 0; c < e; c++) {
    const r = s[c];
    let l, h, d = -1, _ = 0;
    for (; _ < r.length && (a.lastIndex = _, h = a.exec(r), h !== null); ) _ = a.lastIndex, a === Y ? h[1] === "!--" ? a = ge : h[1] !== void 0 ? a = be : h[2] !== void 0 ? (ke.test(h[2]) && (n = RegExp("</" + h[2], "g")), a = O) : h[3] !== void 0 && (a = O) : a === O ? h[0] === ">" ? (a = n ?? Y, d = -1) : h[1] === void 0 ? d = -2 : (d = a.lastIndex - h[2].length, l = h[1], a = h[3] === void 0 ? O : h[3] === '"' ? ye : Ae) : a === ye || a === Ae ? a = O : a === ge || a === be ? a = Y : (a = O, n = void 0);
    const g = a === O && s[c + 1].startsWith("/>") ? " " : "";
    i += a === Y ? r + Co : d >= 0 ? (o.push(l), r.slice(0, d) + Be + r.slice(d) + T + g) : r + T + (d === -2 ? c : g);
  }
  return [Ge(s, i + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class Q {
  constructor({ strings: t, _$litType$: e }, o) {
    let n;
    this.parts = [];
    let i = 0, a = 0;
    const c = t.length - 1, r = this.parts, [l, h] = Ro(t, e);
    if (this.el = Q.createElement(l, o), P.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = P.nextNode()) !== null && r.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(Be)) {
          const _ = h[a++], g = n.getAttribute(d).split(T), v = /([.?@])?(.*)/.exec(_);
          r.push({ type: 1, index: i, name: v[2], strings: g, ctor: v[1] === "." ? Mo : v[1] === "?" ? No : v[1] === "@" ? Oo : yt }), n.removeAttribute(d);
        } else d.startsWith(T) && (r.push({ type: 6, index: i }), n.removeAttribute(d));
        if (ke.test(n.tagName)) {
          const d = n.textContent.split(T), _ = d.length - 1;
          if (_ > 0) {
            n.textContent = pt ? pt.emptyScript : "";
            for (let g = 0; g < _; g++) n.append(d[g], X()), P.nextNode(), r.push({ type: 2, index: ++i });
            n.append(d[_], X());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ue) r.push({ type: 2, index: i });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(T, d + 1)) !== -1; ) r.push({ type: 7, index: i }), d += T.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const o = I.createElement("template");
    return o.innerHTML = t, o;
  }
}
function H(s, t, e = s, o) {
  if (t === G) return t;
  let n = o !== void 0 ? e._$Co?.[o] : e._$Cl;
  const i = q(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(s), n._$AT(s, e, o)), o !== void 0 ? (e._$Co ??= [])[o] = n : e._$Cl = n), n !== void 0 && (t = H(s, n._$AS(s, t.values), n, o)), t;
}
class To {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: o } = this._$AD, n = (t?.creationScope ?? I).importNode(e, !0);
    P.currentNode = n;
    let i = P.nextNode(), a = 0, c = 0, r = o[0];
    for (; r !== void 0; ) {
      if (a === r.index) {
        let l;
        r.type === 2 ? l = new ot(i, i.nextSibling, this, t) : r.type === 1 ? l = new r.ctor(i, r.name, r.strings, this, t) : r.type === 6 && (l = new Lo(i, this, t)), this._$AV.push(l), r = o[++c];
      }
      a !== r?.index && (i = P.nextNode(), a++);
    }
    return P.currentNode = I, n;
  }
  p(t) {
    let e = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, e), e += o.strings.length - 2) : o._$AI(t[e])), e++;
  }
}
class ot {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, o, n) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = o, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = H(this, t, e), q(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== G && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : xo(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(I.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: o } = t, n = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = Q.createElement(Ge(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const i = new To(n, this), a = i.u(this.options);
      i.p(e), this.T(a), this._$AH = i;
    }
  }
  _$AC(t) {
    let e = ve.get(t.strings);
    return e === void 0 && ve.set(t.strings, e = new Q(t)), e;
  }
  k(t) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let o, n = 0;
    for (const i of t) n === e.length ? e.push(o = new ot(this.O(X()), this.O(X()), this, this.options)) : o = e[n], o._$AI(i), n++;
    n < e.length && (this._$AR(o && o._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const o = fe(t).nextSibling;
      fe(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
let yt = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, o, n, i) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = i, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = p;
  }
  _$AI(t, e = this, o, n) {
    const i = this.strings;
    let a = !1;
    if (i === void 0) t = H(this, t, e, 0), a = !q(t) || t !== this._$AH && t !== G, a && (this._$AH = t);
    else {
      const c = t;
      let r, l;
      for (t = i[0], r = 0; r < i.length - 1; r++) l = H(this, c[o + r], e, r), l === G && (l = this._$AH[r]), a ||= !q(l) || l !== this._$AH[r], l === p ? t = p : t !== p && (t += (l ?? "") + i[r + 1]), this._$AH[r] = l;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class Mo extends yt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class No extends yt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Oo extends yt {
  constructor(t, e, o, n, i) {
    super(t, e, o, n, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = H(this, t, e, 0) ?? p) === G) return;
    const o = this._$AH, n = t === p && o !== p || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, i = t !== p && (o === p || n);
    n && this.element.removeEventListener(this.name, this, o), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Lo {
  constructor(t, e, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const Po = te.litHtmlPolyfillSupport;
Po?.(Q, ot), (te.litHtmlVersions ??= []).push("3.3.3");
const Io = (s, t, e) => {
  const o = e?.renderBefore ?? t;
  let n = o._$litPart$;
  if (n === void 0) {
    const i = e?.renderBefore ?? null;
    o._$litPart$ = n = new ot(t.insertBefore(X(), i), i, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis;
class N extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Io(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return G;
  }
}
N._$litElement$ = !0, N.finalized = !0, oe.litElementHydrateSupport?.({ LitElement: N });
const Bo = oe.litElementPolyfillSupport;
Bo?.({ LitElement: N });
(oe.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Uo = { attribute: !0, type: String, converter: ut, reflect: !1, hasChanged: Qt }, ko = (s = Uo, t, e) => {
  const { kind: o, metadata: n } = e;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), o === "setter" && ((s = Object.create(s)).wrapped = !0), i.set(e.name, s), o === "accessor") {
    const { name: a } = e;
    return { set(c) {
      const r = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(a, r, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, s, c), c;
    } };
  }
  if (o === "setter") {
    const { name: a } = e;
    return function(c) {
      const r = this[a];
      t.call(this, c), this.requestUpdate(a, r, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function st(s) {
  return (t, e) => typeof e == "object" ? ko(s, t, e) : ((o, n, i) => {
    const a = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, o), a ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(s) {
  return st({ ...s, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Do = (s, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(s, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function He(s, t) {
  return (e, o, n) => {
    const i = (a) => a.renderRoot?.querySelector(s) ?? null;
    return Do(e, o, { get() {
      return i(this);
    } });
  };
}
const Kt = {
  A: "01110 10001 10001 11111 10001 10001 10001",
  B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110",
  D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 10000 11110 10000 10000 11111",
  F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111",
  H: "10001 10001 10001 11111 10001 10001 10001",
  I: "11111 00100 00100 00100 00100 00100 11111",
  J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001",
  L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001",
  N: "10001 11001 10101 10011 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110",
  P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101",
  R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110",
  T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110",
  V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 11011 10001",
  X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 01010 00100 00100 00100 00100",
  Z: "11111 00001 00010 00100 01000 10000 11111",
  0: "01110 10001 10011 10101 11001 10001 01110",
  1: "00100 01100 00100 00100 00100 00100 01110",
  2: "01110 10001 00001 00010 00100 01000 11111",
  3: "11111 00010 00100 00010 00001 10001 01110",
  4: "00010 00110 01010 10010 11111 00010 00010",
  5: "11111 10000 11110 00001 00001 10001 01110",
  6: "00110 01000 10000 11110 10001 10001 01110",
  7: "11111 00001 00010 00100 01000 01000 01000",
  8: "01110 10001 10001 01110 10001 10001 01110",
  9: "01110 10001 10001 01111 00001 00010 01100",
  " ": "00000 00000 00000 00000 00000 00000 00000",
  "-": "00000 00000 00000 11111 00000 00000 00000",
  ".": "00000 00000 00000 00000 00000 01100 01100",
  "?": "01110 10001 00001 00010 00100 00000 00100",
  "'": "00100 00100 01000 00000 00000 00000 00000"
}, Go = {
  "‘": "'",
  // ‘ left single quote
  "’": "'",
  // ’ right single quote (what iOS/macOS types)
  "‛": "'",
  // ‛ reversed
  ʼ: "'",
  // ʼ modifier letter apostrophe
  "´": "'",
  // ´ acute accent used as apostrophe
  "′": "'",
  // ′ prime
  "–": "-",
  // – en dash
  "—": "-",
  // — em dash
  "‐": "-",
  // ‐ hyphen
  "‑": "-",
  // ‑ non-breaking hyphen
  "−": "-",
  // − minus
  "…": "...",
  // … ellipsis
  " ": " "
  // non-breaking space
}, Ho = {
  Ø: "O",
  Æ: "AE",
  Œ: "OE",
  Þ: "TH",
  Ð: "D",
  Đ: "D",
  Ł: "L",
  ı: "I"
  // ı dotless i
};
function we(s) {
  return s.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split("").map((t) => Go[t] ?? Ho[t] ?? t).join("");
}
const Ke = 5, tt = 7, se = 6;
function ze(s) {
  return (Kt[s.toUpperCase()] ?? Kt[" "]).split(" ");
}
Object.keys(Kt).join("");
function E(s, t) {
  const e = [];
  for (const { x: o, y: n } of s)
    e.push(
      `M${(o - t).toFixed(2)} ${n.toFixed(2)}a${t} ${t} 0 1 0 ${(t * 2).toFixed(2)} 0a${t} ${t} 0 1 0 ${(-t * 2).toFixed(2)} 0`
    );
  return e.join("");
}
function Se(s, t, e, o) {
  const n = [];
  let i = 0;
  for (const a of o) {
    const c = ze(a);
    for (let r = 0; r < tt; r++)
      for (let l = 0; l < Ke; l++)
        c[r][l] === "1" && n.push({ x: s + (i + l) * e, y: t + r * e });
    i += se;
  }
  return n;
}
function Ot(s, t, e, o, n) {
  const i = [];
  let a = 0;
  for (const c of o) {
    if (a >= n) break;
    const r = ze(c);
    for (let l = 0; l < tt; l++)
      for (let h = 0; h < Ke; h++)
        r[l][h] === "1" && a + h < n && i.push({ x: s + (a + h) * e, y: t + l * e });
    a += se;
  }
  return i;
}
function Ee(s) {
  return Math.max(0, Math.floor((s + 1) / se));
}
const Ko = [
  [-17, 15],
  [-16, 21],
  [-10, 30],
  [0, 35],
  [11, 37],
  [20, 32],
  [25, 32],
  [33, 31],
  [37, 22],
  [43, 12],
  [51, 12],
  [48, 2],
  [41, -5],
  [40, -15],
  [35, -24],
  [28, -33],
  [20, -35],
  [18, -30],
  [12, -18],
  [9, -1],
  [2, 5],
  [-8, 4],
  [-13, 9]
], zo = [
  [-10, 36],
  [-9, 44],
  [-2, 48],
  [2, 51],
  [5, 58],
  [11, 58],
  [10, 64],
  [21, 70],
  [30, 70],
  [40, 68],
  [55, 68],
  [70, 72],
  [85, 74],
  [100, 76],
  [115, 73],
  [130, 72],
  [140, 70],
  [160, 68],
  [170, 66],
  [180, 65],
  [180, 58],
  [160, 57],
  [150, 59],
  [142, 53],
  [135, 44],
  [129, 42],
  [126, 37],
  [122, 31],
  [120, 23],
  [110, 20],
  [105, 10],
  [100, 5],
  [98, 8],
  [95, 16],
  [90, 22],
  [80, 10],
  [76, 8],
  [72, 20],
  [68, 24],
  [60, 25],
  [56, 26],
  [50, 28],
  [45, 35],
  [36, 36],
  [28, 37],
  [20, 40],
  [15, 40],
  [12, 45],
  [3, 43],
  [-3, 37]
], Wo = [
  [-168, 66],
  [-160, 58],
  [-150, 60],
  [-140, 60],
  [-130, 54],
  [-124, 48],
  [-124, 40],
  [-117, 32],
  [-105, 22],
  [-97, 18],
  [-92, 15],
  [-84, 10],
  [-78, 8],
  [-82, 15],
  [-88, 21],
  [-90, 29],
  [-82, 25],
  [-80, 32],
  [-75, 35],
  [-70, 42],
  [-60, 45],
  [-55, 50],
  [-65, 60],
  [-78, 62],
  [-95, 68],
  [-110, 70],
  [-130, 70],
  [-155, 71]
], Fo = [
  [-78, 8],
  [-72, 12],
  [-62, 10],
  [-52, 5],
  [-44, -3],
  [-35, -6],
  [-38, -13],
  [-48, -25],
  [-58, -35],
  [-62, -40],
  [-65, -50],
  [-70, -55],
  [-73, -45],
  [-71, -33],
  [-72, -20],
  [-77, -8],
  [-80, 0]
], Yo = [
  [113, -22],
  [114, -33],
  [126, -32],
  [135, -35],
  [140, -38],
  [147, -38],
  [150, -35],
  [153, -28],
  [145, -15],
  [137, -12],
  [130, -12],
  [122, -17]
], jo = [
  [-45, 60],
  [-25, 70],
  [-20, 76],
  [-30, 83],
  [-50, 82],
  [-58, 75],
  [-55, 65]
], Vo = [Ko, zo, Wo, Fo, Yo, jo], it = -170, Ce = 180, at = 78, xe = -56;
function Zo(s, t, e) {
  let o = !1;
  for (let n = 0, i = e.length; n < i; n++) {
    const [a, c] = e[n], [r, l] = e[(n + 1) % i];
    if (c > t != l > t) {
      const h = (r - a) * (t - c) / (l - c) + a;
      s < h && (o = !o);
    }
  }
  return o;
}
function Jo(s, t, e, o, n, i) {
  const a = [];
  for (let r = 0; r < o; r++) {
    const l = at + (r + 0.5) / o * (xe - at);
    for (let h = 0; h < e; h++) {
      const d = it + (h + 0.5) / e * (Ce - it);
      Vo.some((_) => Zo(d, l, _)) && a.push({ x: s + h * n, y: t + r * n });
    }
  }
  let c = null;
  if (i) {
    const r = Math.round((i[0] - it) / (Ce - it) * e - 0.5), l = Math.round((i[1] - at) / (xe - at) * o - 0.5);
    r >= 0 && r < e && l >= 0 && l < o && (c = { x: s + r * n, y: t + l * n });
  }
  return { land: a, pin: c };
}
const zt = 1e3, Lt = 1414, Xo = "#0C0C0C", ne = "#F2DD00", Z = "#FFFFFF", mt = "#C4C4C4", qo = "#3A3A3A", j = 70, Wt = 62, _t = 26, Ft = 96, $ = 9, Re = 2.7, Yt = 930 - (_t - 1) * $, Qo = Yt - 5 * $ - 12, ts = 232, jt = 87, es = 9, os = 111, ss = 46, ns = 207, We = 1105, Fe = 3.4, Ye = 22, is = 58, je = 1108, Vt = 2.85, as = 1250, rs = 164, cs = 96, ls = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z", Te = "M100 0 L58 -36 L58 -15 L4 -15 L4 15 L58 15 L58 36 Z", hs = ["ABCDEFGHIJ", "KLMNOPQRST", "UVWXYZ -. ", "0123456789"], ds = {
  yellow: ne,
  white: Z,
  grey: mt,
  gray: mt
};
function Ve(s) {
  const t = s.row_count, e = s.show_header ? 0 : os, o = e + (s.show_column_labels ? 0 : ss), n = (es - t) * jt + o, i = ts - o, a = [i + (t - 1) * jt + tt * $];
  s.show_map && a.push(We + Ye * Fe - n), s.show_legend && a.push(
    je + 3 * 9 * Vt + tt * Vt - n
  ), s.show_footer && a.push(as - n);
  const c = s.show_map || s.show_legend || s.show_footer;
  return {
    topShift: o,
    bottomShift: n,
    labelsY: ns - e,
    rowsY0: i,
    height: Math.round(
      Math.max(...a) + (c ? rs : cs)
    )
  };
}
function us(s, t) {
  const e = s.color;
  return e ? ds[e.toLowerCase()] ?? e : t % 2 === 0 ? ne : Z;
}
function ps(s, t) {
  const e = Number(s), o = Number(t);
  return Number.isFinite(e) && Number.isFinite(o) ? e - o : s.localeCompare(t);
}
function ms(s, t) {
  if (t === "none")
    return s;
  const e = [], o = [];
  for (const n of s)
    (n.year ? e : o).push(n);
  return e.sort((n, i) => {
    const a = ps(n.year, i.year);
    return t === "desc" ? -a : a;
  }), [...e, ...o];
}
function _s(s, t) {
  const e = s.rows.map((o) => {
    let n = o.dest ?? null;
    if (o.entity) {
      const a = t[o.entity], c = a ? o.attribute ? a.attributes[o.attribute] : a.state : null;
      n = c == null ? "" : String(c);
    }
    let i = o.year === void 0 ? null : o.year;
    if (o.year_entity) {
      const a = t[o.year_entity], c = a ? o.year_attribute ? a.attributes[o.year_attribute] : a.state : null;
      i = c == null ? "" : String(c);
    }
    return { row: o, dest: n, year: i };
  });
  return ms(e, s.sort).map(({ row: o, dest: n, year: i }, a) => {
    const c = i === "" ? Ft : Wt;
    return {
      dest: n === null ? null : we(n).slice(0, Ee(c)),
      year: i === null || i === "" ? i : we(i).slice(0, Ee(_t)),
      color: us(o, a)
    };
  });
}
function Pt(s, t, e) {
  return f`<g transform="translate(${s - $ / 2} ${t - $ / 2})">
    <rect width=${e * $} height=${tt * $} fill="url(#sc-dim)"/>
  </g>`;
}
function fs(s, t, e) {
  const o = s.row_count, { bottomShift: n, labelsY: i, rowsY0: a, height: c } = Ve(s), r = s.accent_color, l = s.unlit_color, h = /* @__PURE__ */ new Map(), d = (u, m) => {
    const w = h.get(u);
    w ? w.push(...m) : h.set(u, [...m]);
  }, _ = [];
  for (let u = 0; u < o; u++) {
    const m = a + u * jt, w = t[u], S = w?.dest ?? null, b = w?.year ?? null, y = w?.color ?? l;
    if (b === "") {
      _.push(Pt(j, m, Ft)), S && d(y, Ot(j, m, $, S, Ft));
      continue;
    }
    _.push(Pt(j, m, Wt)), S && d(y, Ot(j, m, $, S, Wt)), d(b ? y : l, Se(Qo, m, $, "'")), _.push(Pt(Yt, m, _t)), b && d(y, Ot(Yt, m, $, b, _t));
  }
  let g = [];
  if (s.show_map) {
    const { land: u, pin: m } = Jo(
      540,
      We - n,
      is,
      Ye,
      Fe,
      s.pin
    );
    g = [
      f`<path d=${E(u, 1.35)} fill="#575757"/>`,
      ...m ? [
        f`<circle cx=${m.x} cy=${m.y} r=${1.35 * 1.9} fill=${r}/>`
      ] : []
    ];
  }
  let v = "";
  if (s.show_legend) {
    const u = Vt, m = [];
    hs.forEach((w, S) => {
      m.push(...Se(761, je + S * 9 * u - n, u, w));
    }), v = E(m, 1.15);
  }
  return f`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${zt} ${c}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${s.title}: ${t.filter((u) => u.dest).map((u) => [u.dest, u.year].filter(Boolean).join(" ")).join(", ")}`}
    >
      <defs>
        <pattern
          id="sc-dim"
          width=${$}
          height=${$}
          patternUnits="userSpaceOnUse"
        >
          <circle cx=${$ / 2} cy=${$ / 2} r=${Re} fill=${l}/>
        </pattern>
      </defs>

      <rect width=${zt} height=${c} fill=${s.background_color}/>

      ${s.show_header ? f`<g id="sc-header" transform="translate(${e.headerShift} 0)">
            <rect x="228" y="96" width="60" height="60" rx="14" fill=${r}/>
            <g transform="translate(258,126) scale(1.55) rotate(45) translate(-12,-12)">
              <path d=${ls} fill=${s.background_color}/>
            </g>
            <text x="306" y="148" font-size="62" font-weight="700"
                  letter-spacing="1.5" fill=${Z}>${s.title}</text>
          </g>` : ""}

      ${s.show_column_labels ? f`
            <text x=${j} y=${i} font-size="25" letter-spacing="2.5"
                  fill=${mt}>${s.dest_label}</text>
            <text x="930" y=${i} font-size="25" letter-spacing="2.5"
                  text-anchor="end" fill=${mt}>${s.year_label}</text>` : ""}

      ${_}
      ${[...h.entries()].map(
    ([u, m]) => f`<path d=${E(m, Re)} fill=${u}/>`
  )}

      ${s.show_footer ? f`
            <g transform="translate(122,${1128 - n}) rotate(-135) scale(0.46)">
              <path d=${Te} fill=${r}/>
            </g>
            <text x="185" y=${1130 - n} font-size="30" font-weight="600"
                  fill=${Z}>${s.footer_title}</text>
            <text x="185" y=${1152 - n} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${s.footer_subtitle}</text>

            <g transform="translate(98,${1210 - n}) scale(0.46)">
              <path d=${Te} fill=${r}/>
            </g>
            <text x="185" y=${1218 - n} font-size="30" font-weight="600"
                  fill=${Z}>${s.footer2_title}</text>
            <text x="185" y=${1240 - n} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${s.footer2_subtitle}</text>` : ""}

      ${g}
      ${v ? f`<path d=${v} fill=${r}/>` : ""}
    </svg>
  `;
}
const Ze = "1.0.2", ie = "smaail-card", $s = "smaail-card-editor", gs = "Smaailcard", ae = "smaail-world-card", bs = "smaail-world-card-editor", As = "Smaail World Map";
function vt(s, t) {
  customElements.get(s) || customElements.define(s, t);
}
function Je(s) {
  const t = window;
  t.customCards ??= [], t.customCards.some((e) => e.type === s.type) || t.customCards.push(s);
}
const L = 100, Zt = 40, wt = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"], Xe = [18, 13, 39, 51, 47, 7], et = [
  { iso2: "FJ", iso3: "FJI", name: "Fiji", cont: 5 },
  { iso2: "TZ", iso3: "TZA", name: "Tanzania", cont: 3 },
  { iso2: "EH", iso3: "ESH", name: "Western Sahara", cont: 3 },
  { iso2: "CA", iso3: "CAN", name: "Canada", cont: 0 },
  { iso2: "US", iso3: "USA", name: "United States", cont: 0 },
  { iso2: "KZ", iso3: "KAZ", name: "Kazakhstan", cont: 4 },
  { iso2: "UZ", iso3: "UZB", name: "Uzbekistan", cont: 4 },
  { iso2: "PG", iso3: "PNG", name: "Papua New Guinea", cont: 5 },
  { iso2: "ID", iso3: "IDN", name: "Indonesia", cont: 4 },
  { iso2: "AR", iso3: "ARG", name: "Argentina", cont: 1 },
  { iso2: "CL", iso3: "CHL", name: "Chile", cont: 1 },
  { iso2: "CD", iso3: "COD", name: "Democratic Republic of the Congo", cont: 3 },
  { iso2: "SO", iso3: "SOM", name: "Somalia", cont: 3 },
  { iso2: "KE", iso3: "KEN", name: "Kenya", cont: 3 },
  { iso2: "SD", iso3: "SDN", name: "Sudan", cont: 3 },
  { iso2: "TD", iso3: "TCD", name: "Chad", cont: 3 },
  { iso2: "HT", iso3: "HTI", name: "Haiti", cont: 0 },
  { iso2: "DO", iso3: "DOM", name: "Dominican Republic", cont: 0 },
  { iso2: "RU", iso3: "RUS", name: "Russian Federation", cont: 2 },
  { iso2: "BS", iso3: "BHS", name: "Bahamas", cont: 0 },
  { iso2: "FK", iso3: "FLK", name: "Falkland Islands / Malvinas", cont: 1 },
  { iso2: "NO", iso3: "NOR", name: "Norway", cont: 2 },
  { iso2: "GL", iso3: "GRL", name: "Greenland", cont: 0 },
  { iso2: "TL", iso3: "TLS", name: "Timor-Leste", cont: 4 },
  { iso2: "ZA", iso3: "ZAF", name: "South Africa", cont: 3 },
  { iso2: "LS", iso3: "LSO", name: "Lesotho", cont: 3 },
  { iso2: "MX", iso3: "MEX", name: "Mexico", cont: 0 },
  { iso2: "UY", iso3: "URY", name: "Uruguay", cont: 1 },
  { iso2: "BR", iso3: "BRA", name: "Brazil", cont: 1 },
  { iso2: "BO", iso3: "BOL", name: "Bolivia", cont: 1 },
  { iso2: "PE", iso3: "PER", name: "Peru", cont: 1 },
  { iso2: "CO", iso3: "COL", name: "Colombia", cont: 1 },
  { iso2: "PA", iso3: "PAN", name: "Panama", cont: 0 },
  { iso2: "CR", iso3: "CRI", name: "Costa Rica", cont: 0 },
  { iso2: "NI", iso3: "NIC", name: "Nicaragua", cont: 0 },
  { iso2: "HN", iso3: "HND", name: "Honduras", cont: 0 },
  { iso2: "SV", iso3: "SLV", name: "El Salvador", cont: 0 },
  { iso2: "GT", iso3: "GTM", name: "Guatemala", cont: 0 },
  { iso2: "BZ", iso3: "BLZ", name: "Belize", cont: 0 },
  { iso2: "VE", iso3: "VEN", name: "Venezuela", cont: 1 },
  { iso2: "GY", iso3: "GUY", name: "Guyana", cont: 1 },
  { iso2: "SR", iso3: "SUR", name: "Suriname", cont: 1 },
  { iso2: "FR", iso3: "FRA", name: "France", cont: 2 },
  { iso2: "EC", iso3: "ECU", name: "Ecuador", cont: 1 },
  { iso2: "PR", iso3: "PRI", name: "Puerto Rico", cont: 0 },
  { iso2: "JM", iso3: "JAM", name: "Jamaica", cont: 0 },
  { iso2: "CU", iso3: "CUB", name: "Cuba", cont: 0 },
  { iso2: "ZW", iso3: "ZWE", name: "Zimbabwe", cont: 3 },
  { iso2: "BW", iso3: "BWA", name: "Botswana", cont: 3 },
  { iso2: "NA", iso3: "NAM", name: "Namibia", cont: 3 },
  { iso2: "SN", iso3: "SEN", name: "Senegal", cont: 3 },
  { iso2: "ML", iso3: "MLI", name: "Mali", cont: 3 },
  { iso2: "MR", iso3: "MRT", name: "Mauritania", cont: 3 },
  { iso2: "BJ", iso3: "BEN", name: "Benin", cont: 3 },
  { iso2: "NE", iso3: "NER", name: "Niger", cont: 3 },
  { iso2: "NG", iso3: "NGA", name: "Nigeria", cont: 3 },
  { iso2: "CM", iso3: "CMR", name: "Cameroon", cont: 3 },
  { iso2: "TG", iso3: "TGO", name: "Togo", cont: 3 },
  { iso2: "GH", iso3: "GHA", name: "Ghana", cont: 3 },
  { iso2: "CI", iso3: "CIV", name: "Côte d'Ivoire", cont: 3 },
  { iso2: "GN", iso3: "GIN", name: "Guinea", cont: 3 },
  { iso2: "GW", iso3: "GNB", name: "Guinea-Bissau", cont: 3 },
  { iso2: "LR", iso3: "LBR", name: "Liberia", cont: 3 },
  { iso2: "SL", iso3: "SLE", name: "Sierra Leone", cont: 3 },
  { iso2: "BF", iso3: "BFA", name: "Burkina Faso", cont: 3 },
  { iso2: "CF", iso3: "CAF", name: "Central African Republic", cont: 3 },
  { iso2: "CG", iso3: "COG", name: "Republic of the Congo", cont: 3 },
  { iso2: "GA", iso3: "GAB", name: "Gabon", cont: 3 },
  { iso2: "GQ", iso3: "GNQ", name: "Equatorial Guinea", cont: 3 },
  { iso2: "ZM", iso3: "ZMB", name: "Zambia", cont: 3 },
  { iso2: "MW", iso3: "MWI", name: "Malawi", cont: 3 },
  { iso2: "MZ", iso3: "MOZ", name: "Mozambique", cont: 3 },
  { iso2: "SZ", iso3: "SWZ", name: "Kingdom of eSwatini", cont: 3 },
  { iso2: "AO", iso3: "AGO", name: "Angola", cont: 3 },
  { iso2: "BI", iso3: "BDI", name: "Burundi", cont: 3 },
  { iso2: "IL", iso3: "ISR", name: "Israel", cont: 4 },
  { iso2: "LB", iso3: "LBN", name: "Lebanon", cont: 4 },
  { iso2: "MG", iso3: "MDG", name: "Madagascar", cont: 3 },
  { iso2: "PS", iso3: "PSE", name: "Palestine", cont: 4 },
  { iso2: "GM", iso3: "GMB", name: "The Gambia", cont: 3 },
  { iso2: "TN", iso3: "TUN", name: "Tunisia", cont: 3 },
  { iso2: "DZ", iso3: "DZA", name: "Algeria", cont: 3 },
  { iso2: "JO", iso3: "JOR", name: "Jordan", cont: 4 },
  { iso2: "AE", iso3: "ARE", name: "United Arab Emirates", cont: 4 },
  { iso2: "QA", iso3: "QAT", name: "Qatar", cont: 4 },
  { iso2: "KW", iso3: "KWT", name: "Kuwait", cont: 4 },
  { iso2: "IQ", iso3: "IRQ", name: "Iraq", cont: 4 },
  { iso2: "OM", iso3: "OMN", name: "Oman", cont: 4 },
  { iso2: "VU", iso3: "VUT", name: "Vanuatu", cont: 5 },
  { iso2: "KH", iso3: "KHM", name: "Cambodia", cont: 4 },
  { iso2: "TH", iso3: "THA", name: "Thailand", cont: 4 },
  { iso2: "LA", iso3: "LAO", name: "Lao PDR", cont: 4 },
  { iso2: "MM", iso3: "MMR", name: "Myanmar", cont: 4 },
  { iso2: "VN", iso3: "VNM", name: "Vietnam", cont: 4 },
  { iso2: "KP", iso3: "PRK", name: "Dem. Rep. Korea", cont: 4 },
  { iso2: "KR", iso3: "KOR", name: "Republic of Korea", cont: 4 },
  { iso2: "MN", iso3: "MNG", name: "Mongolia", cont: 4 },
  { iso2: "IN", iso3: "IND", name: "India", cont: 4 },
  { iso2: "BD", iso3: "BGD", name: "Bangladesh", cont: 4 },
  { iso2: "BT", iso3: "BTN", name: "Bhutan", cont: 4 },
  { iso2: "NP", iso3: "NPL", name: "Nepal", cont: 4 },
  { iso2: "PK", iso3: "PAK", name: "Pakistan", cont: 4 },
  { iso2: "AF", iso3: "AFG", name: "Afghanistan", cont: 4 },
  { iso2: "TJ", iso3: "TJK", name: "Tajikistan", cont: 4 },
  { iso2: "KG", iso3: "KGZ", name: "Kyrgyzstan", cont: 4 },
  { iso2: "TM", iso3: "TKM", name: "Turkmenistan", cont: 4 },
  { iso2: "IR", iso3: "IRN", name: "Iran", cont: 4 },
  { iso2: "SY", iso3: "SYR", name: "Syria", cont: 4 },
  { iso2: "AM", iso3: "ARM", name: "Armenia", cont: 4 },
  { iso2: "SE", iso3: "SWE", name: "Sweden", cont: 2 },
  { iso2: "BY", iso3: "BLR", name: "Belarus", cont: 2 },
  { iso2: "UA", iso3: "UKR", name: "Ukraine", cont: 2 },
  { iso2: "PL", iso3: "POL", name: "Poland", cont: 2 },
  { iso2: "AT", iso3: "AUT", name: "Austria", cont: 2 },
  { iso2: "HU", iso3: "HUN", name: "Hungary", cont: 2 },
  { iso2: "MD", iso3: "MDA", name: "Moldova", cont: 2 },
  { iso2: "RO", iso3: "ROU", name: "Romania", cont: 2 },
  { iso2: "LT", iso3: "LTU", name: "Lithuania", cont: 2 },
  { iso2: "LV", iso3: "LVA", name: "Latvia", cont: 2 },
  { iso2: "EE", iso3: "EST", name: "Estonia", cont: 2 },
  { iso2: "DE", iso3: "DEU", name: "Germany", cont: 2 },
  { iso2: "BG", iso3: "BGR", name: "Bulgaria", cont: 2 },
  { iso2: "GR", iso3: "GRC", name: "Greece", cont: 2 },
  { iso2: "TR", iso3: "TUR", name: "Turkey", cont: 4 },
  { iso2: "AL", iso3: "ALB", name: "Albania", cont: 2 },
  { iso2: "HR", iso3: "HRV", name: "Croatia", cont: 2 },
  { iso2: "CH", iso3: "CHE", name: "Switzerland", cont: 2 },
  { iso2: "LU", iso3: "LUX", name: "Luxembourg", cont: 2 },
  { iso2: "BE", iso3: "BEL", name: "Belgium", cont: 2 },
  { iso2: "NL", iso3: "NLD", name: "Netherlands", cont: 2 },
  { iso2: "PT", iso3: "PRT", name: "Portugal", cont: 2 },
  { iso2: "ES", iso3: "ESP", name: "Spain", cont: 2 },
  { iso2: "IE", iso3: "IRL", name: "Ireland", cont: 2 },
  { iso2: "NC", iso3: "NCL", name: "New Caledonia", cont: 5 },
  { iso2: "SB", iso3: "SLB", name: "Solomon Islands", cont: 5 },
  { iso2: "NZ", iso3: "NZL", name: "New Zealand", cont: 5 },
  { iso2: "AU", iso3: "AUS", name: "Australia", cont: 5 },
  { iso2: "LK", iso3: "LKA", name: "Sri Lanka", cont: 4 },
  { iso2: "CN", iso3: "CHN", name: "China", cont: 4 },
  { iso2: "TW", iso3: "TWN", name: "Taiwan", cont: 4 },
  { iso2: "IT", iso3: "ITA", name: "Italy", cont: 2 },
  { iso2: "DK", iso3: "DNK", name: "Denmark", cont: 2 },
  { iso2: "GB", iso3: "GBR", name: "United Kingdom", cont: 2 },
  { iso2: "IS", iso3: "ISL", name: "Iceland", cont: 2 },
  { iso2: "AZ", iso3: "AZE", name: "Azerbaijan", cont: 4 },
  { iso2: "GE", iso3: "GEO", name: "Georgia", cont: 4 },
  { iso2: "PH", iso3: "PHL", name: "Philippines", cont: 4 },
  { iso2: "MY", iso3: "MYS", name: "Malaysia", cont: 4 },
  { iso2: "BN", iso3: "BRN", name: "Brunei Darussalam", cont: 4 },
  { iso2: "SI", iso3: "SVN", name: "Slovenia", cont: 2 },
  { iso2: "FI", iso3: "FIN", name: "Finland", cont: 2 },
  { iso2: "SK", iso3: "SVK", name: "Slovakia", cont: 2 },
  { iso2: "CZ", iso3: "CZE", name: "Czech Republic", cont: 2 },
  { iso2: "ER", iso3: "ERI", name: "Eritrea", cont: 3 },
  { iso2: "JP", iso3: "JPN", name: "Japan", cont: 4 },
  { iso2: "PY", iso3: "PRY", name: "Paraguay", cont: 1 },
  { iso2: "YE", iso3: "YEM", name: "Yemen", cont: 4 },
  { iso2: "SA", iso3: "SAU", name: "Saudi Arabia", cont: 4 },
  { iso2: "XB", iso3: "XBB", name: "Northern Cyprus", cont: 4 },
  { iso2: "CY", iso3: "CYP", name: "Cyprus", cont: 4 },
  { iso2: "MA", iso3: "MAR", name: "Morocco", cont: 3 },
  { iso2: "EG", iso3: "EGY", name: "Egypt", cont: 3 },
  { iso2: "LY", iso3: "LBY", name: "Libya", cont: 3 },
  { iso2: "ET", iso3: "ETH", name: "Ethiopia", cont: 3 },
  { iso2: "DJ", iso3: "DJI", name: "Djibouti", cont: 3 },
  { iso2: "XA", iso3: "XAA", name: "Somaliland", cont: 3 },
  { iso2: "UG", iso3: "UGA", name: "Uganda", cont: 3 },
  { iso2: "RW", iso3: "RWA", name: "Rwanda", cont: 3 },
  { iso2: "BA", iso3: "BIH", name: "Bosnia and Herzegovina", cont: 2 },
  { iso2: "MK", iso3: "MKD", name: "North Macedonia", cont: 2 },
  { iso2: "RS", iso3: "SRB", name: "Serbia", cont: 2 },
  { iso2: "ME", iso3: "MNE", name: "Montenegro", cont: 2 },
  { iso2: "XK", iso3: "XKX", name: "Kosovo", cont: 2 },
  { iso2: "TT", iso3: "TTO", name: "Trinidad and Tobago", cont: 0 },
  { iso2: "SS", iso3: "SSD", name: "South Sudan", cont: 3 }
], It = [
  0,
  22,
  4,
  6,
  0,
  1,
  23,
  14,
  0,
  72,
  4,
  1,
  0,
  4,
  4,
  1,
  0,
  1,
  4,
  3,
  0,
  2,
  23,
  14,
  0,
  10,
  22,
  1,
  0,
  1,
  22,
  1,
  0,
  58,
  4,
  2,
  0,
  17,
  23,
  10,
  0,
  21,
  19,
  1,
  0,
  8,
  19,
  6,
  0,
  26,
  5,
  2,
  0,
  9,
  4,
  4,
  0,
  2,
  4,
  1,
  0,
  1,
  4,
  5,
  0,
  6,
  23,
  8,
  0,
  13,
  22,
  1,
  0,
  7,
  19,
  1,
  0,
  2,
  19,
  2,
  0,
  1,
  19,
  23,
  0,
  10,
  5,
  7,
  4,
  16,
  0,
  3,
  4,
  2,
  0,
  3,
  23,
  6,
  0,
  13,
  110,
  2,
  151,
  2,
  19,
  3,
  0,
  1,
  19,
  8,
  0,
  1,
  19,
  30,
  0,
  4,
  5,
  6,
  4,
  14,
  0,
  1,
  4,
  2,
  0,
  2,
  4,
  2,
  0,
  4,
  23,
  3,
  0,
  5,
  144,
  1,
  0,
  7,
  22,
  1,
  110,
  3,
  151,
  2,
  19,
  42,
  0,
  3,
  5,
  6,
  0,
  1,
  5,
  1,
  4,
  13,
  0,
  4,
  4,
  3,
  0,
  6,
  23,
  1,
  0,
  13,
  22,
  2,
  110,
  2,
  118,
  1,
  151,
  1,
  120,
  1,
  19,
  35,
  0,
  2,
  19,
  2,
  0,
  16,
  4,
  12,
  0,
  4,
  4,
  4,
  0,
  15,
  143,
  1,
  0,
  3,
  142,
  1,
  110,
  1,
  152,
  1,
  0,
  1,
  119,
  2,
  19,
  30,
  0,
  5,
  19,
  2,
  0,
  19,
  4,
  13,
  0,
  1,
  4,
  6,
  0,
  13,
  133,
  1,
  0,
  1,
  143,
  1,
  128,
  1,
  130,
  1,
  121,
  2,
  113,
  3,
  111,
  2,
  19,
  8,
  6,
  5,
  19,
  12,
  139,
  1,
  19,
  5,
  0,
  3,
  19,
  1,
  0,
  21,
  4,
  16,
  0,
  19,
  43,
  1,
  129,
  1,
  121,
  1,
  153,
  2,
  113,
  1,
  112,
  5,
  19,
  2,
  6,
  11,
  19,
  1,
  97,
  5,
  19,
  1,
  97,
  1,
  19,
  1,
  139,
  2,
  19,
  5,
  0,
  26,
  5,
  11,
  4,
  3,
  5,
  1,
  4,
  2,
  0,
  17,
  43,
  2,
  141,
  2,
  126,
  1,
  115,
  1,
  117,
  2,
  116,
  1,
  112,
  1,
  0,
  1,
  19,
  3,
  0,
  1,
  6,
  8,
  139,
  2,
  97,
  7,
  139,
  5,
  19,
  1,
  0,
  27,
  5,
  12,
  4,
  1,
  5,
  2,
  0,
  17,
  132,
  3,
  43,
  1,
  127,
  1,
  43,
  1,
  141,
  1,
  114,
  1,
  172,
  1,
  122,
  2,
  160,
  1,
  0,
  2,
  146,
  1,
  19,
  1,
  109,
  1,
  0,
  1,
  7,
  3,
  6,
  2,
  105,
  2,
  139,
  5,
  97,
  4,
  139,
  5,
  0,
  3,
  155,
  1,
  0,
  26,
  5,
  13,
  0,
  18,
  131,
  1,
  132,
  2,
  0,
  2,
  141,
  1,
  150,
  1,
  141,
  1,
  123,
  1,
  125,
  1,
  124,
  5,
  145,
  2,
  0,
  1,
  106,
  3,
  7,
  1,
  104,
  1,
  139,
  13,
  0,
  2,
  95,
  1,
  0,
  30,
  5,
  13,
  0,
  19,
  161,
  1,
  0,
  1,
  82,
  2,
  81,
  1,
  169,
  1,
  170,
  1,
  171,
  1,
  173,
  1,
  0,
  1,
  79,
  1,
  77,
  1,
  108,
  1,
  87,
  2,
  107,
  4,
  103,
  3,
  102,
  1,
  139,
  12,
  0,
  2,
  96,
  1,
  0,
  2,
  155,
  1,
  0,
  28,
  27,
  1,
  5,
  10,
  0,
  19,
  161,
  3,
  82,
  2,
  81,
  1,
  163,
  1,
  0,
  4,
  159,
  1,
  76,
  1,
  83,
  1,
  87,
  2,
  107,
  4,
  103,
  2,
  102,
  2,
  98,
  1,
  139,
  12,
  0,
  2,
  155,
  1,
  0,
  32,
  27,
  3,
  5,
  1,
  0,
  4,
  5,
  1,
  0,
  17,
  3,
  1,
  0,
  1,
  161,
  1,
  82,
  5,
  163,
  4,
  162,
  3,
  158,
  3,
  86,
  1,
  107,
  3,
  102,
  3,
  98,
  2,
  101,
  1,
  139,
  1,
  100,
  1,
  139,
  1,
  98,
  1,
  139,
  7,
  0,
  36,
  27,
  3,
  0,
  4,
  5,
  1,
  20,
  1,
  0,
  17,
  161,
  1,
  53,
  1,
  82,
  5,
  163,
  4,
  162,
  3,
  158,
  4,
  85,
  1,
  84,
  1,
  0,
  1,
  102,
  3,
  98,
  6,
  93,
  1,
  139,
  6,
  140,
  1,
  0,
  37,
  27,
  2,
  0,
  1,
  39,
  1,
  0,
  3,
  47,
  1,
  0,
  16,
  161,
  1,
  53,
  2,
  52,
  2,
  82,
  2,
  55,
  2,
  16,
  1,
  163,
  2,
  15,
  3,
  0,
  1,
  158,
  4,
  88,
  1,
  0,
  3,
  98,
  6,
  99,
  1,
  93,
  2,
  94,
  2,
  139,
  1,
  0,
  40,
  27,
  4,
  37,
  1,
  0,
  2,
  46,
  1,
  17,
  1,
  18,
  1,
  45,
  1,
  0,
  12,
  80,
  1,
  53,
  3,
  52,
  3,
  55,
  3,
  16,
  3,
  15,
  4,
  158,
  2,
  157,
  1,
  88,
  2,
  0,
  4,
  98,
  3,
  0,
  3,
  93,
  1,
  91,
  1,
  92,
  1,
  0,
  4,
  147,
  1,
  0,
  40,
  38,
  1,
  36,
  2,
  34,
  1,
  0,
  17,
  51,
  2,
  52,
  3,
  55,
  4,
  16,
  2,
  15,
  4,
  164,
  1,
  154,
  1,
  157,
  2,
  0,
  7,
  98,
  1,
  0,
  5,
  91,
  2,
  92,
  1,
  0,
  3,
  147,
  1,
  0,
  42,
  35,
  1,
  0,
  3,
  40,
  1,
  0,
  2,
  174,
  1,
  0,
  11,
  62,
  1,
  61,
  2,
  65,
  2,
  54,
  1,
  56,
  3,
  16,
  2,
  15,
  4,
  164,
  2,
  165,
  1,
  166,
  1,
  0,
  7,
  98,
  1,
  0,
  5,
  93,
  1,
  90,
  1,
  94,
  1,
  0,
  4,
  147,
  1,
  0,
  42,
  33,
  1,
  32,
  2,
  40,
  3,
  41,
  1,
  0,
  12,
  64,
  1,
  61,
  1,
  60,
  1,
  59,
  1,
  54,
  1,
  56,
  2,
  57,
  1,
  16,
  1,
  66,
  2,
  175,
  2,
  164,
  4,
  13,
  1,
  0,
  8,
  138,
  1,
  0,
  4,
  91,
  1,
  0,
  6,
  147,
  1,
  0,
  43,
  32,
  3,
  40,
  2,
  41,
  1,
  42,
  1,
  43,
  1,
  0,
  10,
  63,
  1,
  0,
  2,
  58,
  1,
  0,
  2,
  57,
  2,
  66,
  1,
  12,
  3,
  175,
  1,
  14,
  1,
  164,
  2,
  13,
  1,
  0,
  15,
  148,
  1,
  0,
  2,
  149,
  1,
  9,
  1,
  0,
  45,
  32,
  3,
  29,
  5,
  0,
  16,
  69,
  1,
  68,
  1,
  67,
  1,
  12,
  3,
  167,
  1,
  14,
  2,
  13,
  1,
  0,
  15,
  9,
  2,
  0,
  1,
  9,
  6,
  0,
  42,
  44,
  1,
  31,
  1,
  32,
  1,
  29,
  7,
  0,
  15,
  67,
  1,
  12,
  4,
  75,
  1,
  2,
  1,
  14,
  1,
  0,
  17,
  9,
  1,
  0,
  2,
  9,
  1,
  0,
  6,
  9,
  1,
  0,
  38,
  31,
  3,
  29,
  10,
  0,
  13,
  74,
  2,
  12,
  3,
  2,
  3,
  0,
  18,
  9,
  1,
  0,
  3,
  24,
  1,
  0,
  4,
  9,
  1,
  8,
  3,
  0,
  36,
  31,
  2,
  29,
  10,
  0,
  14,
  74,
  2,
  12,
  2,
  70,
  1,
  2,
  2,
  0,
  23,
  9,
  1,
  0,
  6,
  8,
  1,
  0,
  2,
  135,
  1,
  0,
  34,
  31,
  2,
  30,
  2,
  29,
  6,
  0,
  14,
  74,
  3,
  70,
  3,
  71,
  1,
  72,
  1,
  0,
  2,
  78,
  1,
  0,
  22,
  137,
  2,
  0,
  1,
  137,
  1,
  0,
  40,
  31,
  1,
  30,
  3,
  29,
  5,
  0,
  14,
  74,
  3,
  70,
  2,
  48,
  1,
  72,
  2,
  0,
  1,
  78,
  2,
  0,
  20,
  137,
  4,
  0,
  1,
  137,
  1,
  0,
  6,
  89,
  1,
  0,
  2,
  1,
  1,
  0,
  30,
  11,
  1,
  30,
  2,
  156,
  1,
  29,
  5,
  0,
  15,
  50,
  2,
  49,
  1,
  48,
  2,
  72,
  1,
  0,
  2,
  78,
  1,
  0,
  20,
  137,
  8,
  0,
  4,
  134,
  1,
  0,
  34,
  11,
  1,
  10,
  2,
  156,
  2,
  29,
  2,
  0,
  17,
  50,
  1,
  49,
  2,
  25,
  2,
  72,
  1,
  0,
  2,
  78,
  1,
  0,
  18,
  137,
  11,
  0,
  38,
  11,
  1,
  10,
  3,
  156,
  1,
  29,
  1,
  0,
  18,
  50,
  1,
  25,
  4,
  73,
  1,
  0,
  22,
  137,
  10,
  0,
  38,
  10,
  4,
  29,
  2,
  0,
  19,
  25,
  3,
  26,
  1,
  0,
  23,
  137,
  10,
  0,
  38,
  11,
  1,
  10,
  3,
  28,
  1,
  0,
  20,
  25,
  1,
  0,
  26,
  137,
  1,
  0,
  5,
  137,
  4,
  0,
  38,
  10,
  4,
  0,
  55,
  137,
  2,
  0,
  7,
  136,
  2,
  0,
  29,
  11,
  1,
  10,
  2,
  0,
  58,
  137,
  1,
  0,
  7,
  136,
  1,
  0,
  30,
  11,
  1,
  10,
  2,
  0,
  64,
  136,
  2,
  0,
  31,
  11,
  1,
  10,
  2,
  0,
  97,
  11,
  1,
  10,
  1,
  0,
  2,
  21,
  1,
  0,
  169
], M = 1e3, ys = "#0C0C0C", vs = "#F2DD00", ws = "#3A3A3A", Ss = "#FFFFFF", qe = "#8C8C8C", Me = 48, rt = 42, R = 66, Bt = 300, Es = 52, J = 9, dt = 2.7, Cs = (L - 1) * J, xs = Math.round((M - Cs) / 2), Qe = 150, ft = 6.6, ct = 2, to = 4, eo = 13, lt = 26, oo = 46, so = 18, Rs = 210, Jt = 15;
function Ts(s, t, e, o) {
  const n = e * 0.13;
  return f`
    <g fill="none" stroke=${o} stroke-width=${n}>
      <circle cx=${s} cy=${t} r=${e} />
      <ellipse cx=${s} cy=${t} rx=${e * 0.42} ry=${e} />
      <line x1=${s - e} y1=${t} x2=${s + e} y2=${t} />
      <path d=${`M${s - e * 0.86} ${t - e * 0.5} Q ${s} ${t - e * 0.28} ${s + e * 0.86} ${t - e * 0.5}`} />
      <path d=${`M${s - e * 0.86} ${t + e * 0.5} Q ${s} ${t + e * 0.28} ${s + e * 0.86} ${t + e * 0.5}`} />
    </g>`;
}
let Ut = null;
function Ms() {
  if (Ut)
    return Ut;
  const s = [];
  for (let t = 0; t < It.length; t += 2) {
    const e = It[t];
    for (let o = It[t + 1]; o > 0; o--)
      s.push(e);
  }
  return Ut = s, s;
}
function no(s) {
  return Math.max(1, Math.ceil(s / to));
}
function Ns(s) {
  return s.length * eo * 0.62;
}
function kt(s) {
  const t = no(Xe[s]) * ft;
  return Math.max(t, Ns(wt[s].toUpperCase()));
}
function Ne(s, t, e, o, n, i) {
  const a = Xe[s], c = no(a);
  for (let r = 0; r < a; r++) {
    const l = r % c, h = Math.floor(r / c);
    i(r < n, [{ x: t + l * ft, y: o + h * ft }]);
  }
  return f`<text x=${t} y=${e} font-size=${eo}
    letter-spacing="0.5" fill=${qe}>${wt[s].toUpperCase()}</text>`;
}
function io(s) {
  const e = (s.show_header ? Qe + (s.show_stats ? 22 : 0) : 56) + (Zt - 1) * J + dt;
  let o = e + 40;
  return s.show_meters && (o = e + oo + so + to * ft, s.show_overview && (o += Jt + 6)), { height: Math.round(o + 44) };
}
function Os(s, t, e, o) {
  const n = s.accent_color, i = s.land_color, a = s.background_color, { height: c } = io(s), r = s.show_header ? Qe + (s.show_stats ? 22 : 0) : 56, l = Ms(), h = [], d = [];
  for (let b = 0; b < l.length; b++) {
    const y = l[b];
    if (!y)
      continue;
    const nt = {
      x: xs + b % L * J,
      y: r + Math.floor(b / L) * J
    };
    (t.cells.has(y) ? d : h).push(nt);
  }
  const _ = [], g = [], v = [], u = { dim: [], lit: [] };
  let m = "";
  if (s.show_meters) {
    const y = r + (Zt - 1) * J + dt + oo, nt = y + so, le = (A, x) => (A ? v : g).push(...x), ho = [0, 1, 2], Ct = [3, 4, 5];
    let xt = Me;
    for (const A of ho)
      _.push(Ne(A, xt, y, nt, t.perContinent[A], le)), xt += kt(A) + lt;
    const Rt = xt - lt, uo = Ct.reduce((A, x) => A + kt(x), 0) + lt * (Ct.length - 1);
    let Tt = M - Me - uo;
    const Mt = Tt;
    for (const A of Ct)
      _.push(
        Ne(A, Tt, y, nt, t.perContinent[A], le)
      ), Tt += kt(A) + lt;
    if (s.show_overview) {
      const A = Mt - Rt - 40, x = Math.max(1.2, Math.min(Rs, A) / (L - 1)), po = (L - 1) * x, mo = (Rt + Mt) / 2 - po / 2, he = y - 6;
      for (let F = 0; F < l.length; F++) {
        const de = l[F];
        if (!de)
          continue;
        const _o = {
          x: mo + F % L * x,
          y: he + Math.floor(F / L) * x
        };
        (t.cells.has(de) ? u.lit : u.dim).push(_o);
      }
      s.caption && (m = f`<text x=${(Rt + Mt) / 2}
          y=${he + Zt * x + Jt + 2} font-size=${Jt}
          letter-spacing="2" text-anchor="middle" fill=${qe}>${s.caption}</text>`);
    }
  }
  const w = `${e} ${e === 1 ? "COUNTRY" : "COUNTRIES"} · ${t.continentsTouched}/${wt.length} CONTINENTS`, S = [...t.indices].map((b) => et[b].name).sort();
  return f`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${M} ${c}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${s.title}: ${e} countries visited${S.length ? " — " + S.join(", ") : ""}`}
    >
      <rect width=${M} height=${c} fill=${a} />

      ${s.show_header ? f`<g id="swc-header" transform="translate(${o.headerShift} 0)">
            <rect x=${Bt} y=${rt} width=${R} height=${R} rx="15" fill=${n}/>
            ${Ts(Bt + R / 2, rt + R / 2, R * 0.34, a)}
            <text x=${Bt + R + 22} y=${rt + R * 0.74}
                  font-size=${Es} font-weight="700" letter-spacing="2"
                  fill=${Ss}>${s.title}</text>
          </g>` : ""}

      ${s.show_header && s.show_stats ? f`<text x=${M / 2} y=${rt + R + 30} font-size="16"
              letter-spacing="3" text-anchor="middle" fill=${n}>${w}</text>` : ""}

      <path d=${E(h, dt)} fill=${i}/>
      <path d=${E(d, dt)} fill=${n}/>

      ${u.dim.length ? f`<path d=${E(u.dim, ct * 0.62)} fill=${i} opacity="0.7"/>` : ""}
      ${u.lit.length ? f`<path d=${E(u.lit, ct * 0.62)} fill=${n}/>` : ""}
      ${m}

      ${_}
      <path d=${E(g, ct)} fill=${i}/>
      <path d=${E(v, ct)} fill=${n}/>
    </svg>
  `;
}
function ao(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]+/g, " ").trim();
}
const Ls = {
  USA: "US",
  "UNITED STATES OF AMERICA": "US",
  AMERICA: "US",
  UK: "GB",
  BRITAIN: "GB",
  "GREAT BRITAIN": "GB",
  ENGLAND: "GB",
  SCOTLAND: "GB",
  WALES: "GB",
  HOLLAND: "NL",
  UAE: "AE",
  RUSSIA: "RU",
  KOREA: "KR",
  "SOUTH KOREA": "KR",
  "NORTH KOREA": "KP",
  DPRK: "KP",
  LAOS: "LA",
  BRUNEI: "BN",
  "IVORY COAST": "CI",
  CZECHIA: "CZ",
  GAMBIA: "GM",
  ESWATINI: "SZ",
  SWAZILAND: "SZ",
  "EAST TIMOR": "TL",
  BURMA: "MM",
  TURKIYE: "TR",
  DRC: "CD",
  "DR CONGO": "CD",
  "CONGO KINSHASA": "CD",
  CONGO: "CG",
  "CONGO BRAZZAVILLE": "CG",
  MACEDONIA: "MK",
  BOSNIA: "BA",
  FALKLANDS: "FK",
  MALVINAS: "FK",
  VATICAN: "VA"
  // not in the 110m data; resolves to unknown, listed as such
};
let Dt = null;
function Ps() {
  if (Dt)
    return Dt;
  const s = /* @__PURE__ */ new Map();
  et.forEach((e, o) => {
    for (const n of [e.iso2, e.iso3, e.name]) {
      const i = ao(n);
      i && !s.has(i) && s.set(i, o);
    }
  });
  const t = new Map(et.map((e, o) => [e.iso2, o]));
  for (const [e, o] of Object.entries(Ls)) {
    const n = t.get(o);
    n !== void 0 && !s.has(e) && s.set(e, n);
  }
  return Dt = s, s;
}
function Is(s) {
  const t = Ps(), e = /* @__PURE__ */ new Set(), o = [], n = /* @__PURE__ */ new Set();
  for (const r of s) {
    const l = ao(String(r ?? ""));
    if (!l || n.has(l))
      continue;
    n.add(l);
    const h = t.get(l);
    h === void 0 ? o.push(String(r).trim()) : e.add(h);
  }
  const i = new Array(wt.length).fill(0);
  for (const r of e)
    i[et[r].cont] += 1;
  const a = new Set([...e].map((r) => r + 1)), c = i.filter((r) => r > 0).length;
  return { cells: a, indices: e, perContinent: i, unknown: o, continentsTouched: c };
}
function Bs(s) {
  if (Array.isArray(s))
    return s.map((o) => String(o));
  const t = String(s ?? "").trim();
  if (!t)
    return [];
  if (t.startsWith("["))
    try {
      const o = JSON.parse(t);
      if (Array.isArray(o))
        return o.map((n) => String(n));
    } catch {
    }
  const e = t.split(/[,;\n]+/).map((o) => o.trim()).filter(Boolean);
  if (e.length === 1 && /\s/.test(e[0])) {
    const o = e[0].split(/\s+/);
    if (o.every((n) => n.length <= 3))
      return o;
  }
  return e;
}
var Us = Object.defineProperty, St = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, a; i >= 0; i--)
    (a = s[i]) && (n = a(t, e, n) || n);
  return n && Us(t, e, n), n;
};
Je({
  type: ae,
  name: As,
  description: "Dot-matrix world map: the countries you have visited, lit up by continent.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const ks = {
  title: "WORLD MAP",
  countries: [],
  show_header: !0,
  show_meters: !0,
  show_overview: !0,
  show_stats: !0,
  caption: "",
  accent_color: vs,
  background_color: ys,
  land_color: ws
}, $t = class $t extends N {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => js), document.createElement(
      "smaail-world-card-editor"
    );
  }
  static getStubConfig() {
    return {
      type: `custom:${ae}`,
      countries: ["NL", "BE", "FR", "ES", "US", "MA", "JP", "AU", "BR", "ZA"]
    };
  }
  setConfig(t) {
    if (!t)
      throw new Error("Invalid configuration");
    if (t.countries !== void 0 && !Array.isArray(t.countries))
      throw new Error("`countries` must be a list");
    this._config = {
      ...ks,
      ...t,
      countries: (t.countries ?? []).map((e) => String(e))
    }, this._measuredTitle = void 0;
  }
  getCardSize() {
    return Math.max(3, Math.round(this._height() / M * 14));
  }
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round(this._height() / M * 20))
    };
  }
  _height() {
    return this._config ? io(this._config).height : 700;
  }
  shouldUpdate(t) {
    if (!this._config)
      return !1;
    if (t.has("_config") || t.has("_headerShift"))
      return !0;
    const e = t.get("hass");
    if (!e || !this._config.countries_entity)
      return !e;
    const o = this._config.countries_entity;
    return e.states[o] !== this.hass?.states[o];
  }
  /** Merge the configured country list with any entity-provided list. */
  _visitedInputs() {
    const t = this._config;
    if (!t)
      return [];
    const e = [...t.countries];
    if (t.countries_entity && this.hass) {
      const o = this.hass.states[t.countries_entity];
      if (o) {
        const n = t.countries_attribute ? o.attributes[t.countries_attribute] : o.state;
        e.push(...Bs(n));
      }
    }
    return e;
  }
  render() {
    if (!this._config)
      return p;
    const t = Is(this._visitedInputs());
    return C`
      <ha-card>
        ${Os(this._config, t, t.indices.size, {
      headerShift: this._headerShift
    })}
      </ha-card>
    `;
  }
  updated() {
    this._centreHeader();
  }
  /** Measure the rendered header group once per title and centre it on the board. */
  _centreHeader() {
    const t = this._config;
    if (!t?.show_header || this._measuredTitle === t.title)
      return;
    const e = this._header;
    if (!e)
      return;
    let o;
    try {
      o = e.getBBox();
    } catch {
      return;
    }
    if (!o.width)
      return;
    this._measuredTitle = t.title;
    const n = Math.round((M / 2 - (o.x + o.width / 2)) * 100) / 100;
    n !== this._headerShift && (this._headerShift = n);
  }
};
$t.version = Ze, $t.styles = bt`
    ha-card {
      overflow: hidden;
      padding: 0;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    text {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
  `;
let B = $t;
St([
  st({ attribute: !1 })
], B.prototype, "hass");
St([
  W()
], B.prototype, "_config");
St([
  W()
], B.prototype, "_headerShift");
St([
  He("#swc-header")
], B.prototype, "_header");
vt(ae, B);
var Ds = Object.defineProperty, Et = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, a; i >= 0; i--)
    (a = s[i]) && (n = a(t, e, n) || n);
  return n && Ds(t, e, n), n;
};
Je({
  type: ie,
  name: gs,
  description: "Dot-matrix departures board: a travel poster of the places you have been.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const Gt = {
  title: "DEPARTURES",
  dest_label: "DESTINATION",
  year_label: "YEAR",
  row_count: 9,
  sort: "asc",
  show_header: !0,
  show_column_labels: !0,
  show_footer: !0,
  show_map: !0,
  show_legend: !0,
  pin: [5.12, 52.09],
  footer_title: "Travel board",
  footer_subtitle: "Mapping memories, one destination at a time",
  footer2_title: "My next adventure",
  footer2_subtitle: "Just one ticket away",
  accent_color: ne,
  background_color: Xo,
  unlit_color: qo
}, gt = class gt extends N {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => tn), document.createElement("smaail-card-editor");
  }
  static getStubConfig() {
    return {
      type: `custom:${ie}`,
      rows: [
        { dest: "NEW YORK", year: "1997" },
        { dest: "MADRID", year: "2000" },
        { dest: "REYKJAVIK", year: "2011" },
        { dest: "CAPE TOWN", year: "2015" },
        { dest: "TOKYO", year: "2019" },
        { dest: "WHAT'S NEXT?", year: "" }
      ]
    };
  }
  setConfig(t) {
    if (!t)
      throw new Error("Invalid configuration");
    if (t.rows !== void 0 && !Array.isArray(t.rows))
      throw new Error("`rows` must be a list");
    const e = (t.rows ?? []).map(
      (n) => typeof n == "string" ? Hs(n) : n
    ), o = Gs(
      t.row_count ?? Math.max(Gt.row_count, e.length),
      1,
      40
    );
    this._config = {
      ...Gt,
      ...t,
      rows: e,
      row_count: o,
      pin: t.pin === void 0 ? Gt.pin : t.pin
    }, this._measuredTitle = void 0;
  }
  getCardSize() {
    return Math.max(3, Math.round(this._height() / Lt * 14));
  }
  /** Sensible default footprint in a Sections dashboard. */
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round(this._height() / Lt * 16))
    };
  }
  _height() {
    return this._config ? Ve(this._config).height : Lt;
  }
  shouldUpdate(t) {
    if (!this._config)
      return !1;
    if (t.has("_config") || t.has("_headerShift"))
      return !0;
    const e = t.get("hass");
    return e ? this._entities().some(
      (o) => e.states[o] !== this.hass?.states[o]
    ) : !0;
  }
  _entities() {
    const t = [];
    for (const e of this._config?.rows ?? [])
      e.entity && t.push(e.entity), e.year_entity && t.push(e.year_entity);
    return t;
  }
  render() {
    if (!this._config)
      return p;
    const t = _s(this._config, this.hass?.states ?? {});
    return C`
      <ha-card>
        ${fs(this._config, t, { headerShift: this._headerShift })}
      </ha-card>
    `;
  }
  updated() {
    this._centreHeader();
  }
  /**
   * The poster hard-codes the header position for the word "DEPARTURES", which
   * would sit off-centre for any other title. Measure the rendered group once
   * per title and shift it so the icon + text block is centred on the board.
   */
  _centreHeader() {
    const t = this._config;
    if (!t?.show_header || this._measuredTitle === t.title)
      return;
    const e = this._header;
    if (!e)
      return;
    let o;
    try {
      o = e.getBBox();
    } catch {
      return;
    }
    if (!o.width)
      return;
    this._measuredTitle = t.title;
    const n = Math.round((zt / 2 - (o.x + o.width / 2)) * 100) / 100;
    n !== this._headerShift && (this._headerShift = n);
  }
};
gt.version = Ze, gt.styles = bt`
    ha-card {
      overflow: hidden;
      /* The board brings its own background; let it run to the card edges. */
      padding: 0;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    text {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
  `;
let U = gt;
Et([
  st({ attribute: !1 })
], U.prototype, "hass");
Et([
  W()
], U.prototype, "_config");
Et([
  W()
], U.prototype, "_headerShift");
Et([
  He("#sc-header")
], U.prototype, "_header");
vt(ie, U);
function Gs(s, t, e) {
  return Math.min(e, Math.max(t, s));
}
function Hs(s) {
  const t = s.indexOf("|");
  return t === -1 ? { dest: s } : { dest: s.slice(0, t), year: s.slice(t + 1) };
}
var Oe, Le;
(function(s) {
  s.language = "language", s.system = "system", s.comma_decimal = "comma_decimal", s.decimal_comma = "decimal_comma", s.space_comma = "space_comma", s.none = "none";
})(Oe || (Oe = {})), function(s) {
  s.language = "language", s.system = "system", s.am_pm = "12", s.twenty_four = "24";
}(Le || (Le = {}));
var ro = function(s, t, e, o) {
  o = o || {}, e = e ?? {};
  var n = new Event(t, { bubbles: o.bubbles === void 0 || o.bubbles, cancelable: !!o.cancelable, composed: o.composed === void 0 || o.composed });
  return n.detail = e, s.dispatchEvent(n), n;
}, Ks = Object.defineProperty, co = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, a; i >= 0; i--)
    (a = s[i]) && (n = a(t, e, n) || n);
  return n && Ks(t, e, n), n;
};
const zs = [
  { name: "title", selector: { text: {} } },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_stats", selector: { boolean: {} } },
      { name: "show_meters", selector: { boolean: {} } },
      { name: "show_overview", selector: { boolean: {} } }
    ]
  },
  { name: "caption", selector: { text: {} } },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "countries_entity", selector: { entity: {} } },
      { name: "countries_attribute", selector: { text: {} } }
    ]
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "accent_color", selector: { text: {} } },
      { name: "background_color", selector: { text: {} } },
      { name: "land_color", selector: { text: {} } }
    ]
  }
], Ws = et.map(
  (s) => C`<option value=${s.iso2}>${s.name}</option>`
), Fs = {
  title: "Titel",
  show_header: "Kop tonen",
  show_stats: "Aantallen tonen",
  show_meters: "Continentmeters tonen",
  show_overview: "Overzichtskaartje tonen",
  caption: "Bijschrift (onder kaartje)",
  countries_entity: "Entity met landenlijst (optioneel)",
  countries_attribute: "Attribuut van die entity (optioneel)",
  accent_color: "Accentkleur",
  background_color: "Achtergrondkleur",
  land_color: "Kleur van land (niet bezocht)"
}, re = class re extends N {
  constructor() {
    super(...arguments), this._computeLabel = (t) => Fs[t.name] ?? t.name;
  }
  setConfig(t) {
    this._config = t;
  }
  get _countries() {
    return this._config?.countries ?? [];
  }
  render() {
    return !this.hass || !this._config ? p : C`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${zs}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title">Bezochte landen</div>
        <p class="help">
          Vul landen in als ISO-code (<em>NL</em>, <em>FR</em>), ISO-3
          (<em>NLD</em>), naam (<em>Netherlands</em>) of een bekende alias
          (<em>USA</em>, <em>UK</em>). Elk bezocht land licht op de kaart op.
        </p>

        ${this._countries.map((t, e) => this._renderCountry(t, e))}

        <div class="add">
          <button type="button" @click=${this._addCountry}>
            + Land toevoegen
          </button>
        </div>
      </div>

      <datalist id="swc-countries">${Ws}</datalist>
    `;
  }
  _renderCountry(t, e) {
    return C`
      <div class="row">
        <input
          type="text"
          list="swc-countries"
          aria-label=${`Land ${e + 1}`}
          .value=${t}
          data-index=${e}
          @change=${this._countryChanged}
        />
        <button
          type="button"
          class="icon"
          title="Verwijderen"
          aria-label=${`Land ${e + 1} verwijderen`}
          data-index=${e}
          @click=${this._removeCountryClicked}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    `;
  }
  /* Template bindings pass methods, not arrow functions (lit/no-template-arrow,
     as in the Home Assistant frontend); the row comes from data-index. */
  _countryChanged(t) {
    this._setCountry(Pe(t), Ys(t));
  }
  _removeCountryClicked(t) {
    this._removeCountry(Pe(t));
  }
  _formChanged(t) {
    t.stopPropagation(), this._emit({ ...this._config, ...t.detail.value });
  }
  _emit(t) {
    this._config = t, ro(this, "config-changed", { config: t });
  }
  _updateCountries(t) {
    this._emit({ ...this._config, countries: t });
  }
  _setCountry(t, e) {
    const o = this._countries.map((n, i) => i === t ? e : n);
    this._updateCountries(o);
  }
  _addCountry() {
    this._updateCountries([...this._countries, ""]);
  }
  _removeCountry(t) {
    this._updateCountries(this._countries.filter((e, o) => o !== t));
  }
};
re.styles = bt`
    .section {
      margin-block-start: var(--ha-space-5, 20px);
      border-block-start: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-block-start: var(--ha-space-3, 12px);
    }
    .section-title {
      font-weight: 500;
      margin-block-end: var(--ha-space-1, 4px);
    }
    .help {
      margin: 0 0 var(--ha-space-3, 12px);
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--secondary-text-color, #727272);
    }
    .row {
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      margin-block-end: var(--ha-space-2, 8px);
    }
    input[type="text"] {
      font: inherit;
      font-size: 0.95rem;
      color: var(--primary-text-color, #212121);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      border-radius: var(--ha-border-radius-sm, 4px);
      padding: var(--ha-space-2, 8px);
      flex: 1;
      box-sizing: border-box;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: var(--ha-border-radius-sm, 4px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    }
    button.icon {
      border: none;
      background: none;
      font-size: 1rem;
      min-width: 36px;
      min-height: 36px;
      padding: 0;
      color: var(--secondary-text-color, #727272);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    button:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add {
      margin-block-start: var(--ha-space-1, 4px);
    }
    datalist {
      display: none;
    }
  `;
let K = re;
co([
  st({ attribute: !1 })
], K.prototype, "hass");
co([
  W()
], K.prototype, "_config");
function Pe(s) {
  return Number(s.currentTarget.dataset.index);
}
function Ys(s) {
  return s.target.value.trim();
}
vt(bs, K);
const js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SmaailWorldCardEditor: K
}, Symbol.toStringTag, { value: "Module" }));
var Vs = Object.defineProperty, lo = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, a; i >= 0; i--)
    (a = s[i]) && (n = a(t, e, n) || n);
  return n && Vs(t, e, n), n;
};
const Zs = [
  { name: "title", selector: { text: {} } },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "dest_label", selector: { text: {} } },
      { name: "year_label", selector: { text: {} } }
    ]
  },
  {
    name: "row_count",
    selector: { number: { min: 1, max: 40, mode: "box", step: 1 } }
  },
  {
    name: "sort",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "asc", label: "Op jaartal, oudste eerst" },
          { value: "desc", label: "Op jaartal, nieuwste eerst" },
          { value: "none", label: "Niet sorteren (volgorde hieronder)" }
        ]
      }
    }
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_column_labels", selector: { boolean: {} } },
      { name: "show_footer", selector: { boolean: {} } },
      { name: "show_map", selector: { boolean: {} } },
      { name: "show_legend", selector: { boolean: {} } }
    ]
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "footer_title", selector: { text: {} } },
      { name: "footer_subtitle", selector: { text: {} } },
      { name: "footer2_title", selector: { text: {} } },
      { name: "footer2_subtitle", selector: { text: {} } }
    ]
  },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "accent_color", selector: { text: {} } },
      { name: "background_color", selector: { text: {} } },
      { name: "unlit_color", selector: { text: {} } }
    ]
  }
], Js = {
  title: "Titel",
  dest_label: "Kop bestemmingskolom",
  year_label: "Kop jaartalkolom",
  row_count: "Aantal regels (incl. lege)",
  sort: "Volgorde",
  show_header: "Kop tonen",
  show_column_labels: "Kolomkoppen tonen",
  show_footer: "Voettekst tonen",
  show_map: "Wereldkaart tonen",
  show_legend: "Tekenset tonen",
  footer_title: "Voettekst 1",
  footer_subtitle: "Ondertitel 1",
  footer2_title: "Voettekst 2",
  footer2_subtitle: "Ondertitel 2",
  accent_color: "Accentkleur",
  background_color: "Achtergrondkleur",
  unlit_color: "Kleur gedoofde dots"
}, Xs = { entity: {} }, qs = [
  { value: "", label: "Afwisselend (standaard)" },
  { value: "yellow", label: "Geel" },
  { value: "white", label: "Wit" },
  { value: "grey", label: "Grijs" }
], ce = class ce extends N {
  constructor() {
    super(...arguments), this._computeLabel = (t) => Js[t.name] ?? t.name;
  }
  setConfig(t) {
    this._config = t;
  }
  get _rows() {
    return this._config?.rows ?? [];
  }
  render() {
    return !this.hass || !this._config ? p : C`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Zs}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title">Regels</div>
        <p class="help">
          Laat <em>jaar</em> leeg voor een lege jaartalkolom. Vink
          <em>volle breedte</em> aan om de regel over het hele bord te laten
          lopen. Vul een <em>entity</em> in om de tekst uit Home Assistant te
          halen in plaats van vaste tekst.
        </p>

        ${this._rows.map((t, e) => this._renderRow(t, e))}

        <div class="add">
          <button type="button" @click=${this._addRow}>
            + Regel toevoegen
          </button>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Markering op de wereldkaart</div>
        <label class="check">
          <input
            type="checkbox"
            .checked=${this._config.pin !== null}
            @change=${this._togglePin}
          />
          Thuisbasis markeren
        </label>
        ${this._config.pin !== null ? C`<div class="grid2">
                <label
                  >Lengtegraad
                  <input
                    type="number"
                    step="0.01"
                    .value=${String(this._config.pin?.[0] ?? 5.12)}
                    data-axis="0"
                    @change=${this._pinChanged}
                  />
                </label>
                <label
                  >Breedtegraad
                  <input
                    type="number"
                    step="0.01"
                    .value=${String(this._config.pin?.[1] ?? 52.09)}
                    data-axis="1"
                    @change=${this._pinChanged}
                  />
                </label>
              </div>` : p}
      </div>
    `;
  }
  _renderRow(t, e) {
    const o = t.year === "";
    return C`
      <div class="row">
        <div class="row-head">
          <span class="num">${e + 1}</span>
          <button
            type="button"
            class="icon"
            title="Regel verwijderen"
            aria-label=${`Regel ${e + 1} verwijderen`}
            data-index=${e}
            @click=${this._removeRowClicked}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div class="grid2">
          <label
            >Bestemming
            <input
              type="text"
              .value=${t.dest ?? ""}
              ?disabled=${!!t.entity}
              data-index=${e}
              @change=${this._destChanged}
            />
          </label>
          <label
            >Jaar
            <input
              type="text"
              .value=${o ? "" : t.year ?? ""}
              ?disabled=${o || !!t.year_entity}
              data-index=${e}
              @change=${this._yearChanged}
            />
          </label>
        </div>

        <div class="grid2">
          <ha-selector
            .hass=${this.hass}
            .selector=${Xs}
            .value=${t.entity ?? ""}
            .label=${"Entity (bestemming, optioneel)"}
            .required=${!1}
            data-index=${e}
            @value-changed=${this._entityChanged}
          ></ha-selector>
          <label
            >Kleur
            <select
              .value=${t.color ?? ""}
              data-index=${e}
              @change=${this._colorChanged}
            >
              ${qs.map(
      (n) => C`<option
                    value=${n.value}
                    ?selected=${(t.color ?? "") === n.value}
                  >
                    ${n.label}
                  </option>`
    )}
            </select>
          </label>
        </div>

        <label class="check">
          <input
            type="checkbox"
            .checked=${o}
            data-index=${e}
            @change=${this._fullWidthChanged}
          />
          Volle breedte (geen jaartalkolom)
        </label>
      </div>
    `;
  }
  /* Template bindings pass methods, not arrow functions (lit/no-template-arrow,
     as in the Home Assistant frontend); the row comes from data-index. */
  _removeRowClicked(t) {
    this._removeRow(k(t));
  }
  _destChanged(t) {
    this._setRow(k(t), "dest", Ht(t));
  }
  _yearChanged(t) {
    this._setYear(k(t), Ht(t));
  }
  _entityChanged(t) {
    t.stopPropagation(), this._setRow(k(t), "entity", t.detail.value || void 0);
  }
  _colorChanged(t) {
    this._setRow(k(t), "color", Ht(t) || void 0);
  }
  _fullWidthChanged(t) {
    this._setFullWidth(k(t), Qs(t));
  }
  _pinChanged(t) {
    const e = t.currentTarget.dataset.axis === "1" ? 1 : 0;
    this._setPin(e, t);
  }
  _formChanged(t) {
    t.stopPropagation(), this._emit({ ...this._config, ...t.detail.value });
  }
  _emit(t) {
    this._config = t, ro(this, "config-changed", { config: t });
  }
  _updateRows(t) {
    this._emit({ ...this._config, rows: t });
  }
  _setRow(t, e, o) {
    const n = this._rows.map(
      (i, a) => a === t ? { ...i, [e]: o } : i
    );
    (o === void 0 || o === "") && delete n[t][e], this._updateRows(n);
  }
  _setYear(t, e) {
    const o = this._rows.map((n) => ({ ...n }));
    e === "" ? delete o[t].year : o[t].year = e, this._updateRows(o);
  }
  _setFullWidth(t, e) {
    const o = this._rows.map((n) => ({ ...n }));
    e ? o[t].year = "" : delete o[t].year, this._updateRows(o);
  }
  _addRow() {
    this._updateRows([...this._rows, { dest: "" }]);
  }
  _removeRow(t) {
    this._updateRows(this._rows.filter((e, o) => o !== t));
  }
  _togglePin(t) {
    const e = t.target.checked;
    this._emit({
      ...this._config,
      pin: e ? [5.12, 52.09] : null
    });
  }
  _setPin(t, e) {
    const o = [
      this._config?.pin?.[0] ?? 5.12,
      this._config?.pin?.[1] ?? 52.09
    ];
    o[t] = Number(e.target.value), this._emit({ ...this._config, pin: o });
  }
};
ce.styles = bt`
    .section {
      margin-block-start: var(--ha-space-5, 20px);
      border-block-start: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-block-start: var(--ha-space-3, 12px);
    }
    .section-title {
      font-weight: 500;
      margin-block-end: var(--ha-space-1, 4px);
    }
    .help {
      margin: 0 0 var(--ha-space-3, 12px);
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--secondary-text-color, #727272);
    }
    .row {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--ha-border-radius-md, 8px);
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px)
        var(--ha-space-3, 12px);
      margin-block-end: var(--ha-space-2, 8px);
    }
    .row-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-block-end: var(--ha-space-2, 8px);
    }
    .num {
      font-weight: 500;
      color: var(--secondary-text-color, #727272);
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ha-space-2, 8px);
      margin-block-end: var(--ha-space-2, 8px);
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      color: var(--secondary-text-color, #727272);
      gap: var(--ha-space-1, 4px);
    }
    label.check {
      flex-direction: row;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      font-size: 0.85rem;
    }
    input[type="text"],
    input[type="number"],
    select {
      font: inherit;
      font-size: 0.95rem;
      color: var(--primary-text-color, #212121);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      border-radius: var(--ha-border-radius-sm, 4px);
      padding: var(--ha-space-2, 8px);
      width: 100%;
      box-sizing: border-box;
    }
    input:disabled {
      opacity: 0.5;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: var(--ha-border-radius-sm, 4px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    }
    button.icon {
      border: none;
      background: none;
      font-size: 1rem;
      min-width: 36px;
      min-height: 36px;
      padding: 0;
      color: var(--secondary-text-color, #727272);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    button:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add {
      margin-block-start: var(--ha-space-1, 4px);
    }
  `;
let z = ce;
lo([
  st({ attribute: !1 })
], z.prototype, "hass");
lo([
  W()
], z.prototype, "_config");
function Ht(s) {
  return s.target.value.trim();
}
function k(s) {
  return Number(s.currentTarget.dataset.index);
}
function Qs(s) {
  return s.target.checked;
}
vt($s, z);
const tn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SmaailcardEditor: z
}, Symbol.toStringTag, { value: "Module" }));
export {
  U as Smaailcard
};
