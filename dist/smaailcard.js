/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, _t = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ft = Symbol(), St = /* @__PURE__ */ new WeakMap();
let Vt = class {
  constructor(t, s, o) {
    if (this._$cssResult$ = !0, o !== ft) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (_t && t === void 0) {
      const o = s !== void 0 && s.length === 1;
      o && (t = St.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && St.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const le = (e) => new Vt(typeof e == "string" ? e : e + "", void 0, ft), Gt = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((o, i, r) => o + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[r + 1], e[0]);
  return new Vt(s, e, ft);
}, ce = (e, t) => {
  if (_t) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const o = document.createElement("style"), i = G.litNonce;
    i !== void 0 && o.setAttribute("nonce", i), o.textContent = s.cssText, e.appendChild(o);
  }
}, Ct = _t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const o of t.cssRules) s += o.cssText;
  return le(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: he, defineProperty: de, getOwnPropertyDescriptor: ue, getOwnPropertyNames: pe, getOwnPropertySymbols: _e, getPrototypeOf: fe } = Object, Z = globalThis, Ot = Z.trustedTypes, $e = Ot ? Ot.emptyScript : "", me = Z.reactiveElementPolyfillSupport, U = (e, t) => e, K = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? $e : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, $t = (e, t) => !he(e, t), Pt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ??= Symbol("metadata"), Z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = Pt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const o = Symbol(), i = this.getPropertyDescriptor(t, o, s);
      i !== void 0 && de(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, s, o) {
    const { get: i, set: r } = ue(this.prototype, t) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      r?.call(this, n), this.requestUpdate(t, l, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = fe(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const s = this.properties, o = [...pe(s), ..._e(s)];
      for (const i of o) this.createProperty(i, s[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [o, i] of s) this.elementProperties.set(o, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, o] of this.elementProperties) {
      const i = this._$Eu(s, o);
      i !== void 0 && this._$Eh.set(i, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const i of o) s.unshift(Ct(i));
    } else t !== void 0 && s.push(Ct(t));
    return s;
  }
  static _$Eu(t, s) {
    const o = s.attribute;
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
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const o of s.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ce(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, o) {
    this._$AK(t, o);
  }
  _$ET(t, s) {
    const o = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, o);
    if (i !== void 0 && o.reflect === !0) {
      const r = (o.converter?.toAttribute !== void 0 ? o.converter : K).toAttribute(s, o.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const o = this.constructor, i = o._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = o.getPropertyOptions(i), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : K;
      this._$Em = i;
      const l = n.fromAttribute(s, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, s, o, i = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (r = this[t]), o ??= n.getPropertyOptions(t), !((o.hasChanged ?? $t)(r, s) || o.useDefault && o.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, o)))) return;
      this.C(t, s, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: o, reflect: i, wrapped: r }, n) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? s ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (s = void 0), this._$AL.set(t, s)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [i, r] of o) {
        const { wrapped: n } = r, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[U("elementProperties")] = /* @__PURE__ */ new Map(), S[U("finalized")] = /* @__PURE__ */ new Map(), me?.({ ReactiveElement: S }), (Z.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, Rt = (e) => e, q = mt.trustedTypes, Mt = q ? q.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Kt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, qt = "?" + v, ge = `<${qt}>`, x = document, H = () => x.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", gt = Array.isArray, ye = (e) => gt(e) || typeof e?.[Symbol.iterator] == "function", et = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Tt = /-->/g, Nt = />/g, A = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Lt = /'/g, Ut = /"/g, Jt = /^(?:script|style|textarea|title)$/i, Xt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), C = Xt(1), g = Xt(2), P = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), kt = /* @__PURE__ */ new WeakMap(), w = x.createTreeWalker(x, 129);
function Zt(e, t) {
  if (!gt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Mt !== void 0 ? Mt.createHTML(t) : t;
}
const be = (e, t) => {
  const s = e.length - 1, o = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = N;
  for (let l = 0; l < s; l++) {
    const a = e[l];
    let c, h, d = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, h = n.exec(a), h !== null); ) f = n.lastIndex, n === N ? h[1] === "!--" ? n = Tt : h[1] !== void 0 ? n = Nt : h[2] !== void 0 ? (Jt.test(h[2]) && (i = RegExp("</" + h[2], "g")), n = A) : h[3] !== void 0 && (n = A) : n === A ? h[0] === ">" ? (n = i ?? N, d = -1) : h[1] === void 0 ? d = -2 : (d = n.lastIndex - h[2].length, c = h[1], n = h[3] === void 0 ? A : h[3] === '"' ? Ut : Lt) : n === Ut || n === Lt ? n = A : n === Tt || n === Nt ? n = N : (n = A, i = void 0);
    const m = n === A && e[l + 1].startsWith("/>") ? " " : "";
    r += n === N ? a + ge : d >= 0 ? (o.push(c), a.slice(0, d) + Kt + a.slice(d) + v + m) : a + v + (d === -2 ? l : m);
  }
  return [Zt(e, r + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class j {
  constructor({ strings: t, _$litType$: s }, o) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const l = t.length - 1, a = this.parts, [c, h] = be(t, s);
    if (this.el = j.createElement(c, o), w.currentNode = this.el.content, s === 2 || s === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = w.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Kt)) {
          const f = h[n++], m = i.getAttribute(d).split(v), y = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: r, name: y[2], strings: m, ctor: y[1] === "." ? Ae : y[1] === "?" ? we : y[1] === "@" ? xe : Q }), i.removeAttribute(d);
        } else d.startsWith(v) && (a.push({ type: 6, index: r }), i.removeAttribute(d));
        if (Jt.test(i.tagName)) {
          const d = i.textContent.split(v), f = d.length - 1;
          if (f > 0) {
            i.textContent = q ? q.emptyScript : "";
            for (let m = 0; m < f; m++) i.append(d[m], H()), w.nextNode(), a.push({ type: 2, index: ++r });
            i.append(d[f], H());
          }
        }
      } else if (i.nodeType === 8) if (i.data === qt) a.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(v, d + 1)) !== -1; ) a.push({ type: 7, index: r }), d += v.length - 1;
      }
      r++;
    }
  }
  static createElement(t, s) {
    const o = x.createElement("template");
    return o.innerHTML = t, o;
  }
}
function R(e, t, s = e, o) {
  if (t === P) return t;
  let i = o !== void 0 ? s._$Co?.[o] : s._$Cl;
  const r = D(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(e), i._$AT(e, s, o)), o !== void 0 ? (s._$Co ??= [])[o] = i : s._$Cl = i), i !== void 0 && (t = R(e, i._$AS(e, t.values), i, o)), t;
}
class ve {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: o } = this._$AD, i = (t?.creationScope ?? x).importNode(s, !0);
    w.currentNode = i;
    let r = w.nextNode(), n = 0, l = 0, a = o[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new z(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new Ee(r, this, t)), this._$AV.push(c), a = o[++l];
      }
      n !== a?.index && (r = w.nextNode(), n++);
    }
    return w.currentNode = x, i;
  }
  p(t) {
    let s = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, s), s += o.strings.length - 2) : o._$AI(t[s])), s++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, o, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = o, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = R(this, t, s), D(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ye(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: o } = t, i = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = j.createElement(Zt(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === i) this._$AH.p(s);
    else {
      const r = new ve(i, this), n = r.u(this.options);
      r.p(s), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let s = kt.get(t.strings);
    return s === void 0 && kt.set(t.strings, s = new j(t)), s;
  }
  k(t) {
    gt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let o, i = 0;
    for (const r of t) i === s.length ? s.push(o = new z(this.O(H()), this.O(H()), this, this.options)) : o = s[i], o._$AI(r), i++;
    i < s.length && (this._$AR(o && o._$AB.nextSibling, i), s.length = i);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const o = Rt(t).nextSibling;
      Rt(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
let Q = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, o, i, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = s, this._$AM = i, this.options = r, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = u;
  }
  _$AI(t, s = this, o, i) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = R(this, t, s, 0), n = !D(t) || t !== this._$AH && t !== P, n && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = R(this, l[o + a], s, a), c === P && (c = this._$AH[a]), n ||= !D(c) || c !== this._$AH[a], c === u ? t = u : t !== u && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class Ae extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class we extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class xe extends Q {
  constructor(t, s, o, i, r) {
    super(t, s, o, i, r), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = R(this, t, s, 0) ?? u) === P) return;
    const o = this._$AH, i = t === u && o !== u || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, r = t !== u && (o === u || i);
    i && this.element.removeEventListener(this.name, this, o), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ee {
  constructor(t, s, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const Se = mt.litHtmlPolyfillSupport;
Se?.(j, z), (mt.litHtmlVersions ??= []).push("3.3.3");
const Ce = (e, t, s) => {
  const o = s?.renderBefore ?? t;
  let i = o._$litPart$;
  if (i === void 0) {
    const r = s?.renderBefore ?? null;
    o._$litPart$ = i = new z(t.insertBefore(H(), r), r, void 0, s ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis;
class O extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ce(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return P;
  }
}
O._$litElement$ = !0, O.finalized = !0, yt.litElementHydrateSupport?.({ LitElement: O });
const Oe = yt.litElementPolyfillSupport;
Oe?.({ LitElement: O });
(yt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pe = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: $t }, Re = (e = Pe, t, s) => {
  const { kind: o, metadata: i } = s;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(s.name, e), o === "accessor") {
    const { name: n } = s;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, e, l), l;
    } };
  }
  if (o === "setter") {
    const { name: n } = s;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function bt(e) {
  return (t, s) => typeof s == "object" ? Re(e, t, s) : ((o, i, r) => {
    const n = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, o), n ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function vt(e) {
  return bt({ ...e, state: !0, attribute: !1 });
}
const at = {
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
}, Me = {
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
}, Te = {
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
function Ht(e) {
  return e.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split("").map((t) => Me[t] ?? Te[t] ?? t).join("");
}
const te = 5, I = 7, At = 6;
function ee(e) {
  return (at[e.toUpperCase()] ?? at[" "]).split(" ");
}
Object.keys(at).join("");
function st(e, t) {
  const s = [];
  for (const { x: o, y: i } of e)
    s.push(
      `M${(o - t).toFixed(2)} ${i.toFixed(2)}a${t} ${t} 0 1 0 ${(t * 2).toFixed(2)} 0a${t} ${t} 0 1 0 ${(-t * 2).toFixed(2)} 0`
    );
  return s.join("");
}
function Dt(e, t, s, o) {
  const i = [];
  let r = 0;
  for (const n of o) {
    const l = ee(n);
    for (let a = 0; a < I; a++)
      for (let c = 0; c < te; c++)
        l[a][c] === "1" && i.push({ x: e + (r + c) * s, y: t + a * s });
    r += At;
  }
  return i;
}
function ot(e, t, s, o, i) {
  const r = [];
  let n = 0;
  for (const l of o) {
    if (n >= i) break;
    const a = ee(l);
    for (let c = 0; c < I; c++)
      for (let h = 0; h < te; h++)
        a[c][h] === "1" && n + h < i && r.push({ x: e + (n + h) * s, y: t + c * s });
    n += At;
  }
  return r;
}
function jt(e) {
  return Math.max(0, Math.floor((e + 1) / At));
}
const Ne = [
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
], Le = [
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
], Ue = [
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
], ke = [
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
], He = [
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
], De = [
  [-45, 60],
  [-25, 70],
  [-20, 76],
  [-30, 83],
  [-50, 82],
  [-58, 75],
  [-55, 65]
], je = [Ne, Le, Ue, ke, He, De], F = -170, It = 180, Y = 78, zt = -56;
function Ie(e, t, s) {
  let o = !1;
  for (let i = 0, r = s.length; i < r; i++) {
    const [n, l] = s[i], [a, c] = s[(i + 1) % r];
    if (l > t != c > t) {
      const h = (a - n) * (t - l) / (c - l) + n;
      e < h && (o = !o);
    }
  }
  return o;
}
function ze(e, t, s, o, i, r) {
  const n = [];
  for (let a = 0; a < o; a++) {
    const c = Y + (a + 0.5) / o * (zt - Y);
    for (let h = 0; h < s; h++) {
      const d = F + (h + 0.5) / s * (It - F);
      je.some((f) => Ie(d, c, f)) && n.push({ x: e + h * i, y: t + a * i });
    }
  }
  let l = null;
  if (r) {
    const a = Math.round((r[0] - F) / (It - F) * s - 0.5), c = Math.round((r[1] - Y) / (zt - Y) * o - 0.5);
    a >= 0 && a < s && c >= 0 && c < o && (l = { x: e + a * i, y: t + c * i });
  }
  return { land: n, pin: l };
}
const lt = 1e3, it = 1414, Be = "#0C0C0C", wt = "#F2DD00", k = "#FFFFFF", J = "#C4C4C4", We = "#3A3A3A", L = 70, ct = 62, X = 26, ht = 96, $ = 9, Bt = 2.7, dt = 930 - (X - 1) * $, Fe = dt - 5 * $ - 12, Ye = 232, ut = 87, Ve = 9, Ge = 111, Ke = 46, qe = 207, se = 1105, oe = 3.4, ie = 22, Je = 58, re = 1108, pt = 2.85, Xe = 1250, Ze = 164, Qe = 96, ts = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z", Wt = "M100 0 L58 -36 L58 -15 L4 -15 L4 15 L58 15 L58 36 Z", es = ["ABCDEFGHIJ", "KLMNOPQRST", "UVWXYZ -. ", "0123456789"], ss = {
  yellow: wt,
  white: k,
  grey: J,
  gray: J
};
function ne(e) {
  const t = e.row_count, s = e.show_header ? 0 : Ge, o = s + (e.show_column_labels ? 0 : Ke), i = (Ve - t) * ut + o, r = Ye - o, n = [r + (t - 1) * ut + I * $];
  e.show_map && n.push(se + ie * oe - i), e.show_legend && n.push(
    re + 3 * 9 * pt + I * pt - i
  ), e.show_footer && n.push(Xe - i);
  const l = e.show_map || e.show_legend || e.show_footer;
  return {
    topShift: o,
    bottomShift: i,
    labelsY: qe - s,
    rowsY0: r,
    height: Math.round(
      Math.max(...n) + (l ? Ze : Qe)
    )
  };
}
function os(e, t) {
  const s = e.color;
  return s ? ss[s.toLowerCase()] ?? s : t % 2 === 0 ? wt : k;
}
function is(e, t) {
  const s = Number(e), o = Number(t);
  return Number.isFinite(s) && Number.isFinite(o) ? s - o : e.localeCompare(t);
}
function rs(e, t) {
  if (t === "none")
    return e;
  const s = [], o = [];
  for (const i of e)
    (i.year ? s : o).push(i);
  return s.sort((i, r) => {
    const n = is(i.year, r.year);
    return t === "desc" ? -n : n;
  }), [...s, ...o];
}
function ns(e, t) {
  const s = e.rows.map((o) => {
    let i = o.dest ?? null;
    if (o.entity) {
      const n = t[o.entity], l = n ? o.attribute ? n.attributes[o.attribute] : n.state : null;
      i = l == null ? "" : String(l);
    }
    let r = o.year === void 0 ? null : o.year;
    if (o.year_entity) {
      const n = t[o.year_entity], l = n ? o.year_attribute ? n.attributes[o.year_attribute] : n.state : null;
      r = l == null ? "" : String(l);
    }
    return { row: o, dest: i, year: r };
  });
  return rs(s, e.sort).map(({ row: o, dest: i, year: r }, n) => {
    const l = r === "" ? ht : ct;
    return {
      dest: i === null ? null : Ht(i).slice(0, jt(l)),
      year: r === null || r === "" ? r : Ht(r).slice(0, jt(X)),
      color: os(o, n)
    };
  });
}
function rt(e, t, s) {
  return g`<g transform="translate(${e - $ / 2} ${t - $ / 2})">
    <rect width=${s * $} height=${I * $} fill="url(#sc-dim)"/>
  </g>`;
}
function as(e, t, s) {
  const o = e.row_count, { bottomShift: i, labelsY: r, rowsY0: n, height: l } = ne(e), a = e.accent_color, c = e.unlit_color, h = /* @__PURE__ */ new Map(), d = (p, _) => {
    const b = h.get(p);
    b ? b.push(..._) : h.set(p, [..._]);
  }, f = [];
  for (let p = 0; p < o; p++) {
    const _ = n + p * ut, b = t[p], E = b?.dest ?? null, B = b?.year ?? null, W = b?.color ?? c;
    if (B === "") {
      f.push(rt(L, _, ht)), E && d(W, ot(L, _, $, E, ht));
      continue;
    }
    f.push(rt(L, _, ct)), E && d(W, ot(L, _, $, E, ct)), d(B ? W : c, Dt(Fe, _, $, "'")), f.push(rt(dt, _, X)), B && d(W, ot(dt, _, $, B, X));
  }
  let m = [];
  if (e.show_map) {
    const { land: p, pin: _ } = ze(
      540,
      se - i,
      Je,
      ie,
      oe,
      e.pin
    );
    m = [
      g`<path d=${st(p, 1.35)} fill="#575757"/>`,
      ..._ ? [g`<circle cx=${_.x} cy=${_.y} r=${1.35 * 1.9} fill=${a}/>`] : []
    ];
  }
  let y = "";
  if (e.show_legend) {
    const p = pt, _ = [];
    es.forEach((b, E) => {
      _.push(...Dt(761, re + E * 9 * p - i, p, b));
    }), y = st(_, 1.15);
  }
  return g`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${lt} ${l}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${e.title}: ${t.filter((p) => p.dest).map((p) => [p.dest, p.year].filter(Boolean).join(" ")).join(", ")}`}
    >
      <defs>
        <pattern
          id="sc-dim"
          width=${$}
          height=${$}
          patternUnits="userSpaceOnUse"
        >
          <circle cx=${$ / 2} cy=${$ / 2} r=${Bt} fill=${c}/>
        </pattern>
      </defs>

      <rect width=${lt} height=${l} fill=${e.background_color}/>

      ${e.show_header ? g`<g id="sc-header" transform="translate(${s.headerShift} 0)">
            <rect x="228" y="96" width="60" height="60" rx="14" fill=${a}/>
            <g transform="translate(258,126) scale(1.55) rotate(45) translate(-12,-12)">
              <path d=${ts} fill=${e.background_color}/>
            </g>
            <text x="306" y="148" font-size="62" font-weight="700"
                  letter-spacing="1.5" fill=${k}>${e.title}</text>
          </g>` : ""}

      ${e.show_column_labels ? g`
            <text x=${L} y=${r} font-size="25" letter-spacing="2.5"
                  fill=${J}>${e.dest_label}</text>
            <text x="930" y=${r} font-size="25" letter-spacing="2.5"
                  text-anchor="end" fill=${J}>${e.year_label}</text>` : ""}

      ${f}
      ${[...h.entries()].map(
    ([p, _]) => g`<path d=${st(_, Bt)} fill=${p}/>`
  )}

      ${e.show_footer ? g`
            <g transform="translate(122,${1128 - i}) rotate(-135) scale(0.46)">
              <path d=${Wt} fill=${a}/>
            </g>
            <text x="185" y=${1130 - i} font-size="30" font-weight="600"
                  fill=${k}>${e.footer_title}</text>
            <text x="185" y=${1152 - i} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${e.footer_subtitle}</text>

            <g transform="translate(98,${1210 - i}) scale(0.46)">
              <path d=${Wt} fill=${a}/>
            </g>
            <text x="185" y=${1218 - i} font-size="30" font-weight="600"
                  fill=${k}>${e.footer2_title}</text>
            <text x="185" y=${1240 - i} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${e.footer2_subtitle}</text>` : ""}

      ${m}
      ${y ? g`<path d=${y} fill=${a}/>` : ""}
    </svg>
  `;
}
const ls = "0.2.1", xt = "smaail-card", ae = "Smaailcard";
var cs = Object.defineProperty, hs = Object.getOwnPropertyDescriptor, tt = (e, t, s, o) => {
  for (var i = o > 1 ? void 0 : o ? hs(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (i = (o ? n(t, s, i) : n(i)) || i);
  return o && i && cs(t, s, i), i;
};
console.info(
  `%c ${ae.toUpperCase()} %c ${ls} `,
  "color: #0C0C0C; background: #F2DD00; font-weight: 700;",
  "color: #F2DD00; background: #0C0C0C; font-weight: 700;"
);
window.customCards ??= [];
window.customCards.push({
  type: xt,
  name: ae,
  description: "Dot-matrix departures board — a travel poster of the places you have been.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const nt = {
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
  accent_color: wt,
  background_color: Be,
  unlit_color: We
};
let M = class extends O {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => bs), document.createElement("smaail-card-editor");
  }
  static getStubConfig() {
    return {
      type: `custom:${xt}`,
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
  setConfig(e) {
    if (!e)
      throw new Error("Invalid configuration");
    if (e.rows !== void 0 && !Array.isArray(e.rows))
      throw new Error("`rows` must be a list");
    const t = (e.rows ?? []).map(
      (o) => typeof o == "string" ? us(o) : o
    ), s = ds(
      e.row_count ?? Math.max(nt.row_count, t.length),
      1,
      40
    );
    this._config = {
      ...nt,
      ...e,
      rows: t,
      row_count: s,
      pin: e.pin === void 0 ? nt.pin : e.pin
    }, this._measuredTitle = void 0;
  }
  getCardSize() {
    return Math.max(3, Math.round(this._height() / it * 14));
  }
  /** Sensible default footprint in a Sections dashboard. */
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round(this._height() / it * 16))
    };
  }
  _height() {
    return this._config ? ne(this._config).height : it;
  }
  shouldUpdate(e) {
    if (!this._config)
      return !1;
    if (e.has("_config") || e.has("_headerShift"))
      return !0;
    const t = e.get("hass");
    return t ? this._entities().some(
      (s) => t.states[s] !== this.hass?.states[s]
    ) : !0;
  }
  _entities() {
    const e = [];
    for (const t of this._config?.rows ?? [])
      t.entity && e.push(t.entity), t.year_entity && e.push(t.year_entity);
    return e;
  }
  render() {
    if (!this._config)
      return u;
    const e = ns(this._config, this.hass?.states ?? {});
    return C`
      <ha-card>
        ${as(this._config, e, { headerShift: this._headerShift })}
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
    const e = this._config;
    if (!e?.show_header || this._measuredTitle === e.title)
      return;
    const t = this.renderRoot?.querySelector("#sc-header");
    if (!t)
      return;
    let s;
    try {
      s = t.getBBox();
    } catch {
      return;
    }
    if (!s.width)
      return;
    this._measuredTitle = e.title;
    const o = Math.round((lt / 2 - (s.x + s.width / 2)) * 100) / 100;
    o !== this._headerShift && (this._headerShift = o);
  }
};
M.styles = Gt`
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
tt([
  bt({ attribute: !1 })
], M.prototype, "hass", 2);
tt([
  vt()
], M.prototype, "_config", 2);
tt([
  vt()
], M.prototype, "_headerShift", 2);
M = tt([
  Qt(xt)
], M);
function ds(e, t, s) {
  return Math.min(s, Math.max(t, e));
}
function us(e) {
  const t = e.indexOf("|");
  return t === -1 ? { dest: e } : { dest: e.slice(0, t), year: e.slice(t + 1) };
}
var Ft, Yt;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(Ft || (Ft = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(Yt || (Yt = {}));
var ps = function(e, t, s, o) {
  o = o || {}, s = s ?? {};
  var i = new Event(t, { bubbles: o.bubbles === void 0 || o.bubbles, cancelable: !!o.cancelable, composed: o.composed === void 0 || o.composed });
  return i.detail = s, e.dispatchEvent(i), i;
}, _s = Object.defineProperty, fs = Object.getOwnPropertyDescriptor, Et = (e, t, s, o) => {
  for (var i = o > 1 ? void 0 : o ? fs(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (i = (o ? n(t, s, i) : n(i)) || i);
  return o && i && _s(t, s, i), i;
};
const $s = [
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
], ms = {
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
}, gs = [
  { value: "", label: "Afwisselend (standaard)" },
  { value: "yellow", label: "Geel" },
  { value: "white", label: "Wit" },
  { value: "grey", label: "Grijs" }
];
let T = class extends O {
  constructor() {
    super(...arguments), this._computeLabel = (e) => ms[e.name] ?? e.name;
  }
  setConfig(e) {
    this._config = e;
  }
  get _rows() {
    return this._config?.rows ?? [];
  }
  render() {
    return !this.hass || !this._config ? u : C`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${$s}
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

        ${this._rows.map((e, t) => this._renderRow(e, t))}

        <div class="add">
          <button @click=${this._addRow}>+ Regel toevoegen</button>
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
                  @change=${(e) => this._setPin(0, e)}
                />
              </label>
              <label
                >Breedtegraad
                <input
                  type="number"
                  step="0.01"
                  .value=${String(this._config.pin?.[1] ?? 52.09)}
                  @change=${(e) => this._setPin(1, e)}
                />
              </label>
            </div>` : u}
      </div>

      <datalist id="sc-entities">
        ${Object.keys(this.hass.states).map(
      (e) => C`<option value=${e}></option>`
    )}
      </datalist>
    `;
  }
  _renderRow(e, t) {
    const s = e.year === "";
    return C`
      <div class="row">
        <div class="row-head">
          <span class="num">${t + 1}</span>
          <button
            class="icon"
            title="Regel verwijderen"
            @click=${() => this._removeRow(t)}
          >
            ✕
          </button>
        </div>

        <div class="grid2">
          <label
            >Bestemming
            <input
              type="text"
              .value=${e.dest ?? ""}
              ?disabled=${!!e.entity}
              @change=${(o) => this._setRow(t, "dest", V(o))}
            />
          </label>
          <label
            >Jaar
            <input
              type="text"
              .value=${s ? "" : e.year ?? ""}
              ?disabled=${s || !!e.year_entity}
              @change=${(o) => this._setYear(t, V(o))}
            />
          </label>
        </div>

        <div class="grid2">
          <label
            >Entity (bestemming)
            <input
              type="text"
              list="sc-entities"
              placeholder="optioneel"
              .value=${e.entity ?? ""}
              @change=${(o) => this._setRow(t, "entity", V(o) || void 0)}
            />
          </label>
          <label
            >Kleur
            <select
              .value=${e.color ?? ""}
              @change=${(o) => this._setRow(t, "color", V(o) || void 0)}
            >
              ${gs.map(
      (o) => C`<option
                    value=${o.value}
                    ?selected=${(e.color ?? "") === o.value}
                  >
                    ${o.label}
                  </option>`
    )}
            </select>
          </label>
        </div>

        <label class="check">
          <input
            type="checkbox"
            .checked=${s}
            @change=${(o) => this._setFullWidth(t, ys(o))}
          />
          Volle breedte (geen jaartalkolom)
        </label>
      </div>
    `;
  }
  _formChanged(e) {
    e.stopPropagation(), this._emit({ ...this._config, ...e.detail.value });
  }
  _emit(e) {
    this._config = e, ps(this, "config-changed", { config: e });
  }
  _updateRows(e) {
    this._emit({ ...this._config, rows: e });
  }
  _setRow(e, t, s) {
    const o = this._rows.map(
      (i, r) => r === e ? { ...i, [t]: s } : i
    );
    (s === void 0 || s === "") && delete o[e][t], this._updateRows(o);
  }
  _setYear(e, t) {
    const s = this._rows.map((o) => ({ ...o }));
    t === "" ? delete s[e].year : s[e].year = t, this._updateRows(s);
  }
  _setFullWidth(e, t) {
    const s = this._rows.map((o) => ({ ...o }));
    t ? s[e].year = "" : delete s[e].year, this._updateRows(s);
  }
  _addRow() {
    this._updateRows([...this._rows, { dest: "" }]);
  }
  _removeRow(e) {
    this._updateRows(this._rows.filter((t, s) => s !== e));
  }
  _togglePin(e) {
    const t = e.target.checked;
    this._emit({
      ...this._config,
      pin: t ? [5.12, 52.09] : null
    });
  }
  _setPin(e, t) {
    const s = [
      this._config?.pin?.[0] ?? 5.12,
      this._config?.pin?.[1] ?? 52.09
    ];
    s[e] = Number(t.target.value), this._emit({ ...this._config, pin: s });
  }
};
T.styles = Gt`
    .section {
      margin-top: 20px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-top: 12px;
    }
    .section-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    .help {
      margin: 0 0 12px;
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--secondary-text-color, #727272);
    }
    .row {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      padding: 10px 12px 12px;
      margin-bottom: 10px;
    }
    .row-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .num {
      font-weight: 500;
      color: var(--secondary-text-color, #727272);
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 8px;
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      color: var(--secondary-text-color, #727272);
      gap: 4px;
    }
    label.check {
      flex-direction: row;
      align-items: center;
      gap: 8px;
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
      border-radius: 4px;
      padding: 7px 8px;
      width: 100%;
      box-sizing: border-box;
    }
    input:disabled {
      opacity: 0.5;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      padding: 7px 12px;
    }
    button.icon {
      border: none;
      background: none;
      font-size: 1rem;
      padding: 2px 6px;
      color: var(--secondary-text-color, #727272);
    }
    button:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add {
      margin-top: 4px;
    }
    datalist {
      display: none;
    }
  `;
Et([
  bt({ attribute: !1 })
], T.prototype, "hass", 2);
Et([
  vt()
], T.prototype, "_config", 2);
T = Et([
  Qt("smaail-card-editor")
], T);
function V(e) {
  return e.target.value.trim();
}
function ys(e) {
  return e.target.checked;
}
const bs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get SmaailcardEditor() {
    return T;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  M as Smaailcard
};
