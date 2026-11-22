/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis, ee = dt.ShadowRoot && (dt.ShadyCSS === void 0 || dt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, oe = Symbol(), fe = /* @__PURE__ */ new WeakMap();
let Ye = class {
  constructor(t, e, o) {
    if (this._$cssResult$ = !0, o !== oe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ee && t === void 0) {
      const o = e !== void 0 && e.length === 1;
      o && (t = fe.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && fe.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Co = (s) => new Ye(typeof s == "string" ? s : s + "", void 0, oe), vt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((o, n, i) => o + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[i + 1], s[0]);
  return new Ye(e, s, oe);
}, xo = (s, t) => {
  if (ee) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const o = document.createElement("style"), n = dt.litNonce;
    n !== void 0 && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
  }
}, $e = ee ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const o of t.cssRules) e += o.cssText;
  return Co(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ro, defineProperty: To, getOwnPropertyDescriptor: Mo, getOwnPropertyNames: No, getOwnPropertySymbols: Oo, getPrototypeOf: Lo } = Object, bt = globalThis, ge = bt.trustedTypes, Po = ge ? ge.emptyScript : "", Do = bt.reactiveElementPolyfillSupport, Z = (s, t) => s, mt = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Po : null;
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
} }, se = (s, t) => !Ro(s, t), ye = { attribute: !0, type: String, converter: mt, reflect: !1, useDefault: !1, hasChanged: se };
Symbol.metadata ??= Symbol("metadata"), bt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ye) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const o = Symbol(), n = this.getPropertyDescriptor(t, o, e);
      n !== void 0 && To(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, o) {
    const { get: n, set: i } = Mo(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const c = n?.call(this);
      i?.call(this, r), this.requestUpdate(t, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ye;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const t = Lo(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const e = this.properties, o = [...No(e), ...Oo(e)];
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
      for (const n of o) e.unshift($e(n));
    } else t !== void 0 && e.push($e(t));
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
    return xo(t, this.constructor.elementStyles), t;
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
      const i = (o.converter?.toAttribute !== void 0 ? o.converter : mt).toAttribute(e, o.type);
      this._$Em = t, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const o = this.constructor, n = o._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const i = o.getPropertyOptions(n), r = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : mt;
      this._$Em = n;
      const c = r.fromAttribute(e, i.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, o, n = !1, i) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (i = this[t]), o ??= r.getPropertyOptions(t), !((o.hasChanged ?? se)(i, e) || o.useDefault && o.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, o)))) return;
      this.C(t, e, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: o, reflect: n, wrapped: i }, r) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), i !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: r } = i, c = this[n];
        r !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, i, c);
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[Z("elementProperties")] = /* @__PURE__ */ new Map(), k[Z("finalized")] = /* @__PURE__ */ new Map(), Do?.({ ReactiveElement: k }), (bt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = globalThis, Ae = (s) => s, pt = ne.trustedTypes, ve = pt ? pt.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, We = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, ze = "?" + T, Io = `<${ze}>`, I = document, q = () => I.createComment(""), Q = (s) => s === null || typeof s != "object" && typeof s != "function", ie = Array.isArray, Uo = (s) => ie(s) || typeof s?.[Symbol.iterator] == "function", Lt = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, be = /-->/g, we = />/g, O = RegExp(`>|${Lt}(?:([^\\s"'>=/]+)(${Lt}*=${Lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Se = /'/g, Ee = /"/g, je = /^(?:script|style|textarea|title)$/i, Ve = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), G = Ve(1), $ = Ve(2), H = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), Ce = /* @__PURE__ */ new WeakMap(), D = I.createTreeWalker(I, 129);
function Ze(s, t) {
  if (!ie(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ve !== void 0 ? ve.createHTML(t) : t;
}
const Bo = (s, t) => {
  const e = s.length - 1, o = [];
  let n, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = j;
  for (let c = 0; c < e; c++) {
    const a = s[c];
    let l, h, d = -1, _ = 0;
    for (; _ < a.length && (r.lastIndex = _, h = r.exec(a), h !== null); ) _ = r.lastIndex, r === j ? h[1] === "!--" ? r = be : h[1] !== void 0 ? r = we : h[2] !== void 0 ? (je.test(h[2]) && (n = RegExp("</" + h[2], "g")), r = O) : h[3] !== void 0 && (r = O) : r === O ? h[0] === ">" ? (r = n ?? j, d = -1) : h[1] === void 0 ? d = -2 : (d = r.lastIndex - h[2].length, l = h[1], r = h[3] === void 0 ? O : h[3] === '"' ? Ee : Se) : r === Ee || r === Se ? r = O : r === be || r === we ? r = j : (r = O, n = void 0);
    const y = r === O && s[c + 1].startsWith("/>") ? " " : "";
    i += r === j ? a + Io : d >= 0 ? (o.push(l), a.slice(0, d) + We + a.slice(d) + T + y) : a + T + (d === -2 ? c : y);
  }
  return [Ze(s, i + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class tt {
  constructor({ strings: t, _$litType$: e }, o) {
    let n;
    this.parts = [];
    let i = 0, r = 0;
    const c = t.length - 1, a = this.parts, [l, h] = Bo(t, e);
    if (this.el = tt.createElement(l, o), D.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = D.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(We)) {
          const _ = h[r++], y = n.getAttribute(d).split(T), w = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: i, name: w[2], strings: y, ctor: w[1] === "." ? Go : w[1] === "?" ? Ho : w[1] === "@" ? Ko : wt }), n.removeAttribute(d);
        } else d.startsWith(T) && (a.push({ type: 6, index: i }), n.removeAttribute(d));
        if (je.test(n.tagName)) {
          const d = n.textContent.split(T), _ = d.length - 1;
          if (_ > 0) {
            n.textContent = pt ? pt.emptyScript : "";
            for (let y = 0; y < _; y++) n.append(d[y], q()), D.nextNode(), a.push({ type: 2, index: ++i });
            n.append(d[_], q());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ze) a.push({ type: 2, index: i });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(T, d + 1)) !== -1; ) a.push({ type: 7, index: i }), d += T.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const o = I.createElement("template");
    return o.innerHTML = t, o;
  }
}
function K(s, t, e = s, o) {
  if (t === H) return t;
  let n = o !== void 0 ? e._$Co?.[o] : e._$Cl;
  const i = Q(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(s), n._$AT(s, e, o)), o !== void 0 ? (e._$Co ??= [])[o] = n : e._$Cl = n), n !== void 0 && (t = K(s, n._$AS(s, t.values), n, o)), t;
}
class ko {
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
    D.currentNode = n;
    let i = D.nextNode(), r = 0, c = 0, a = o[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let l;
        a.type === 2 ? l = new st(i, i.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(i, a.name, a.strings, this, t) : a.type === 6 && (l = new Fo(i, this, t)), this._$AV.push(l), a = o[++c];
      }
      r !== a?.index && (i = D.nextNode(), r++);
    }
    return D.currentNode = I, n;
  }
  p(t) {
    let e = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, e), e += o.strings.length - 2) : o._$AI(t[e])), e++;
  }
}
class st {
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
    t = K(this, t, e), Q(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== H && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Uo(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && Q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(I.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: o } = t, n = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = tt.createElement(Ze(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const i = new ko(n, this), r = i.u(this.options);
      i.p(e), this.T(r), this._$AH = i;
    }
  }
  _$AC(t) {
    let e = Ce.get(t.strings);
    return e === void 0 && Ce.set(t.strings, e = new tt(t)), e;
  }
  k(t) {
    ie(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let o, n = 0;
    for (const i of t) n === e.length ? e.push(o = new st(this.O(q()), this.O(q()), this, this.options)) : o = e[n], o._$AI(i), n++;
    n < e.length && (this._$AR(o && o._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const o = Ae(t).nextSibling;
      Ae(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
let wt = class {
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
    let r = !1;
    if (i === void 0) t = K(this, t, e, 0), r = !Q(t) || t !== this._$AH && t !== H, r && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = i[0], a = 0; a < i.length - 1; a++) l = K(this, c[o + a], e, a), l === H && (l = this._$AH[a]), r ||= !Q(l) || l !== this._$AH[a], l === p ? t = p : t !== p && (t += (l ?? "") + i[a + 1]), this._$AH[a] = l;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class Go extends wt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Ho extends wt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ko extends wt {
  constructor(t, e, o, n, i) {
    super(t, e, o, n, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = K(this, t, e, 0) ?? p) === H) return;
    const o = this._$AH, n = t === p && o !== p || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, i = t !== p && (o === p || n);
    n && this.element.removeEventListener(this.name, this, o), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Fo {
  constructor(t, e, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    K(this, t);
  }
}
const Yo = ne.litHtmlPolyfillSupport;
Yo?.(tt, st), (ne.litHtmlVersions ??= []).push("3.3.3");
const Wo = (s, t, e) => {
  const o = e?.renderBefore ?? t;
  let n = o._$litPart$;
  if (n === void 0) {
    const i = e?.renderBefore ?? null;
    o._$litPart$ = n = new st(t.insertBefore(q(), i), i, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis;
class N extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Wo(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return H;
  }
}
N._$litElement$ = !0, N.finalized = !0, re.litElementHydrateSupport?.({ LitElement: N });
const zo = re.litElementPolyfillSupport;
zo?.({ LitElement: N });
(re.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jo = { attribute: !0, type: String, converter: mt, reflect: !1, hasChanged: se }, Vo = (s = jo, t, e) => {
  const { kind: o, metadata: n } = e;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), o === "setter" && ((s = Object.create(s)).wrapped = !0), i.set(e.name, s), o === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, s, c), c;
    } };
  }
  if (o === "setter") {
    const { name: r } = e;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function nt(s) {
  return (t, e) => typeof e == "object" ? Vo(s, t, e) : ((o, n, i) => {
    const r = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, o), r ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(s) {
  return nt({ ...s, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zo = (s, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(s, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Je(s, t) {
  return (e, o, n) => {
    const i = (r) => r.renderRoot?.querySelector(s) ?? null;
    return Zo(e, o, { get() {
      return i(this);
    } });
  };
}
const Ft = {
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
}, Jo = {
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
}, Xo = {
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
function xe(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split("").map((t) => Jo[t] ?? Xo[t] ?? t).join("");
}
const Xe = 5, et = 7, ae = 6;
function qe(s) {
  return (Ft[s.toUpperCase()] ?? Ft[" "]).split(" ");
}
Object.keys(Ft).join("");
function C(s, t) {
  const e = [];
  for (const { x: o, y: n } of s)
    e.push(
      `M${(o - t).toFixed(2)} ${n.toFixed(2)}a${t} ${t} 0 1 0 ${(t * 2).toFixed(2)} 0a${t} ${t} 0 1 0 ${(-t * 2).toFixed(2)} 0`
    );
  return e.join("");
}
function Re(s, t, e, o) {
  const n = [];
  let i = 0;
  for (const r of o) {
    const c = qe(r);
    for (let a = 0; a < et; a++)
      for (let l = 0; l < Xe; l++)
        c[a][l] === "1" && n.push({ x: s + (i + l) * e, y: t + a * e });
    i += ae;
  }
  return n;
}
function Pt(s, t, e, o, n) {
  const i = [];
  let r = 0;
  for (const c of o) {
    if (r >= n) break;
    const a = qe(c);
    for (let l = 0; l < et; l++)
      for (let h = 0; h < Xe; h++)
        a[l][h] === "1" && r + h < n && i.push({ x: s + (r + h) * e, y: t + l * e });
    r += ae;
  }
  return i;
}
function Te(s) {
  return Math.max(0, Math.floor((s + 1) / ae));
}
const qo = [
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
], Qo = [
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
], ts = [
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
], es = [
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
], os = [
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
], ss = [
  [-45, 60],
  [-25, 70],
  [-20, 76],
  [-30, 83],
  [-50, 82],
  [-58, 75],
  [-55, 65]
], ns = [qo, Qo, ts, es, os, ss], rt = -170, Me = 180, at = 78, Ne = -56;
function is(s, t, e) {
  let o = !1;
  for (let n = 0, i = e.length; n < i; n++) {
    const [r, c] = e[n], [a, l] = e[(n + 1) % i];
    if (c > t != l > t) {
      const h = (a - r) * (t - c) / (l - c) + r;
      s < h && (o = !o);
    }
  }
  return o;
}
function rs(s, t, e, o, n, i) {
  const r = [];
  for (let a = 0; a < o; a++) {
    const l = at + (a + 0.5) / o * (Ne - at);
    for (let h = 0; h < e; h++) {
      const d = rt + (h + 0.5) / e * (Me - rt);
      ns.some((_) => is(d, l, _)) && r.push({ x: s + h * n, y: t + a * n });
    }
  }
  let c = null;
  if (i) {
    const a = Math.round((i[0] - rt) / (Me - rt) * e - 0.5), l = Math.round((i[1] - at) / (Ne - at) * o - 0.5);
    a >= 0 && a < e && l >= 0 && l < o && (c = { x: s + a * n, y: t + l * n });
  }
  return { land: r, pin: c };
}
const Yt = 1e3, Dt = 1414, as = "#0C0C0C", ce = "#F2DD00", J = "#FFFFFF", _t = "#C4C4C4", cs = "#3A3A3A", V = 70, Wt = 62, ft = 26, zt = 96, g = 9, Oe = 2.7, jt = 930 - (ft - 1) * g, ls = jt - 5 * g - 12, hs = 232, Vt = 87, ds = 9, us = 111, ms = 46, ps = 207, Qe = 1105, to = 3.4, eo = 22, _s = 58, oo = 1108, Zt = 2.85, fs = 1250, $s = 164, gs = 96, ys = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z", Le = "M100 0 L58 -36 L58 -15 L4 -15 L4 15 L58 15 L58 36 Z", As = ["ABCDEFGHIJ", "KLMNOPQRST", "UVWXYZ -. ", "0123456789"], vs = {
  yellow: ce,
  white: J,
  grey: _t,
  gray: _t
};
function so(s) {
  const t = s.row_count, e = s.show_header ? 0 : us, o = e + (s.show_column_labels ? 0 : ms), n = (ds - t) * Vt + o, i = hs - o, r = [i + (t - 1) * Vt + et * g];
  s.show_map && r.push(Qe + eo * to - n), s.show_legend && r.push(
    oo + 3 * 9 * Zt + et * Zt - n
  ), s.show_footer && r.push(fs - n);
  const c = s.show_map || s.show_legend || s.show_footer;
  return {
    topShift: o,
    bottomShift: n,
    labelsY: ps - e,
    rowsY0: i,
    height: Math.round(
      Math.max(...r) + (c ? $s : gs)
    )
  };
}
function bs(s, t) {
  const e = s.color;
  return e ? vs[e.toLowerCase()] ?? e : t % 2 === 0 ? ce : J;
}
function ws(s, t) {
  const e = Number(s), o = Number(t);
  return Number.isFinite(e) && Number.isFinite(o) ? e - o : s.localeCompare(t);
}
function Ss(s, t) {
  if (t === "none")
    return s;
  const e = [], o = [];
  for (const n of s)
    (n.year ? e : o).push(n);
  return e.sort((n, i) => {
    const r = ws(n.year, i.year);
    return t === "desc" ? -r : r;
  }), [...e, ...o];
}
function Es(s, t) {
  const e = s.rows.map((o) => {
    let n = o.dest ?? null;
    if (o.entity) {
      const r = t[o.entity], c = r ? o.attribute ? r.attributes[o.attribute] : r.state : null;
      n = c == null ? "" : String(c);
    }
    let i = o.year === void 0 ? null : o.year;
    if (o.year_entity) {
      const r = t[o.year_entity], c = r ? o.year_attribute ? r.attributes[o.year_attribute] : r.state : null;
      i = c == null ? "" : String(c);
    }
    return { row: o, dest: n, year: i };
  });
  return Ss(e, s.sort).map(({ row: o, dest: n, year: i }, r) => {
    const c = i === "" ? zt : Wt;
    return {
      dest: n === null ? null : xe(n).slice(0, Te(c)),
      year: i === null || i === "" ? i : xe(i).slice(0, Te(ft)),
      color: bs(o, r)
    };
  });
}
function It(s, t, e) {
  return $`<g transform="translate(${s - g / 2} ${t - g / 2})">
    <rect width=${e * g} height=${et * g} fill="url(#sc-dim)"/>
  </g>`;
}
function Cs(s, t, e) {
  const o = s.row_count, { bottomShift: n, labelsY: i, rowsY0: r, height: c } = so(s), a = s.accent_color, l = s.unlit_color, h = /* @__PURE__ */ new Map(), d = (u, m) => {
    const S = h.get(u);
    S ? S.push(...m) : h.set(u, [...m]);
  }, _ = [];
  for (let u = 0; u < o; u++) {
    const m = r + u * Vt, S = t[u], E = S?.dest ?? null, A = S?.year ?? null, b = S?.color ?? l;
    if (A === "") {
      _.push(It(V, m, zt)), E && d(b, Pt(V, m, g, E, zt));
      continue;
    }
    _.push(It(V, m, Wt)), E && d(b, Pt(V, m, g, E, Wt)), d(A ? b : l, Re(ls, m, g, "'")), _.push(It(jt, m, ft)), A && d(b, Pt(jt, m, g, A, ft));
  }
  let y = [];
  if (s.show_map) {
    const { land: u, pin: m } = rs(
      540,
      Qe - n,
      _s,
      eo,
      to,
      s.pin
    );
    y = [
      $`<path d=${C(u, 1.35)} fill="#575757"/>`,
      ...m ? [
        $`<circle cx=${m.x} cy=${m.y} r=${1.35 * 1.9} fill=${a}/>`
      ] : []
    ];
  }
  let w = "";
  if (s.show_legend) {
    const u = Zt, m = [];
    As.forEach((S, E) => {
      m.push(...Re(761, oo + E * 9 * u - n, u, S));
    }), w = C(m, 1.15);
  }
  return $`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${Yt} ${c}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${s.title}: ${t.filter((u) => u.dest).map((u) => [u.dest, u.year].filter(Boolean).join(" ")).join(", ")}`}
    >
      <defs>
        <pattern
          id="sc-dim"
          width=${g}
          height=${g}
          patternUnits="userSpaceOnUse"
        >
          <circle cx=${g / 2} cy=${g / 2} r=${Oe} fill=${l}/>
        </pattern>
      </defs>

      <rect width=${Yt} height=${c} fill=${s.background_color}/>

      ${s.show_header ? $`<g id="sc-header" transform="translate(${e.headerShift} 0)">
            <rect x="228" y="96" width="60" height="60" rx="14" fill=${a}/>
            <g transform="translate(258,126) scale(1.55) rotate(45) translate(-12,-12)">
              <path d=${ys} fill=${s.background_color}/>
            </g>
            <text x="306" y="148" font-size="62" font-weight="700"
                  letter-spacing="1.5" fill=${J}>${s.title}</text>
          </g>` : ""}

      ${s.show_column_labels ? $`
            <text x=${V} y=${i} font-size="25" letter-spacing="2.5"
                  fill=${_t}>${s.dest_label}</text>
            <text x="930" y=${i} font-size="25" letter-spacing="2.5"
                  text-anchor="end" fill=${_t}>${s.year_label}</text>` : ""}

      ${_}
      ${[...h.entries()].map(
    ([u, m]) => $`<path d=${C(m, Oe)} fill=${u}/>`
  )}

      ${s.show_footer ? $`
            <g transform="translate(122,${1128 - n}) rotate(-135) scale(0.46)">
              <path d=${Le} fill=${a}/>
            </g>
            <text x="185" y=${1130 - n} font-size="30" font-weight="600"
                  fill=${J}>${s.footer_title}</text>
            <text x="185" y=${1152 - n} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${s.footer_subtitle}</text>

            <g transform="translate(98,${1210 - n}) scale(0.46)">
              <path d=${Le} fill=${a}/>
            </g>
            <text x="185" y=${1218 - n} font-size="30" font-weight="600"
                  fill=${J}>${s.footer2_title}</text>
            <text x="185" y=${1240 - n} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${s.footer2_subtitle}</text>` : ""}

      ${y}
      ${w ? $`<path d=${w} fill=${a}/>` : ""}
    </svg>
  `;
}
const no = "1.1.2", le = "smaail-card", xs = "smaail-card-editor", Rs = "Smaailcard", he = "smaail-world-card", Ts = "smaail-world-card-editor", Ms = "Smaail World Map";
function St(s, t) {
  customElements.get(s) || customElements.define(s, t);
}
function io(s) {
  const t = window;
  t.customCards ??= [], t.customCards.some((e) => e.type === s.type) || t.customCards.push(s);
}
const L = 100, Jt = 40, Et = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"], ro = [18, 13, 39, 51, 47, 7], ot = [
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
], Ut = [
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
], M = 1e3, Ns = "#0C0C0C", Os = "#F2DD00", Ls = "#3A3A3A", Ps = "#FFFFFF", ao = "#8C8C8C", Pe = 48, ct = 42, R = 66, Bt = 300, Ds = 52, X = 9, ut = 2.7, Is = (L - 1) * X, Us = Math.round((M - Is) / 2), co = 150, $t = 6.6, lt = 2, lo = 4, ho = 13, ht = 26, uo = 46, mo = 18, Bs = 210, Xt = 15;
function ks(s, t, e, o) {
  const n = e * 0.13;
  return $`
    <g fill="none" stroke=${o} stroke-width=${n}>
      <circle cx=${s} cy=${t} r=${e} />
      <ellipse cx=${s} cy=${t} rx=${e * 0.42} ry=${e} />
      <line x1=${s - e} y1=${t} x2=${s + e} y2=${t} />
      <path d=${`M${s - e * 0.86} ${t - e * 0.5} Q ${s} ${t - e * 0.28} ${s + e * 0.86} ${t - e * 0.5}`} />
      <path d=${`M${s - e * 0.86} ${t + e * 0.5} Q ${s} ${t + e * 0.28} ${s + e * 0.86} ${t + e * 0.5}`} />
    </g>`;
}
let kt = null;
function Gs() {
  if (kt)
    return kt;
  const s = [];
  for (let t = 0; t < Ut.length; t += 2) {
    const e = Ut[t];
    for (let o = Ut[t + 1]; o > 0; o--)
      s.push(e);
  }
  return kt = s, s;
}
function po(s) {
  return Math.max(1, Math.ceil(s / lo));
}
function Hs(s) {
  return s.length * ho * 0.62;
}
function Gt(s) {
  const t = po(ro[s]) * $t;
  return Math.max(t, Hs(Et[s].toUpperCase()));
}
function De(s, t, e, o, n, i) {
  const r = ro[s], c = po(r);
  for (let a = 0; a < r; a++) {
    const l = a % c, h = Math.floor(a / c);
    i(a < n, [{ x: t + l * $t, y: o + h * $t }]);
  }
  return $`<text x=${t} y=${e} font-size=${ho}
    letter-spacing="0.5" fill=${ao}>${Et[s].toUpperCase()}</text>`;
}
function _o(s) {
  const e = (s.show_header ? co + (s.show_stats ? 22 : 0) : 56) + (Jt - 1) * X + ut;
  let o = e + 40;
  return s.show_meters && (o = e + uo + mo + lo * $t, s.show_overview && (o += Xt + 6)), { height: Math.round(o + 44) };
}
function Ks(s, t, e, o) {
  const n = s.accent_color, i = s.land_color, r = s.background_color, { height: c } = _o(s), a = s.show_header ? co + (s.show_stats ? 22 : 0) : 56, l = Gs(), h = [], d = [];
  for (let A = 0; A < l.length; A++) {
    const b = l[A];
    if (!b)
      continue;
    const it = {
      x: Us + A % L * X,
      y: a + Math.floor(A / L) * X
    };
    (t.cells.has(b) ? d : h).push(it);
  }
  const _ = [], y = [], w = [], u = { dim: [], lit: [] };
  let m = "";
  if (s.show_meters) {
    const b = a + (Jt - 1) * X + ut + uo, it = b + mo, me = (v, x) => (v ? w : y).push(...x), vo = [0, 1, 2], Rt = [3, 4, 5];
    let Tt = Pe;
    for (const v of vo)
      _.push(De(v, Tt, b, it, t.perContinent[v], me)), Tt += Gt(v) + ht;
    const Mt = Tt - ht, bo = Rt.reduce((v, x) => v + Gt(x), 0) + ht * (Rt.length - 1);
    let Nt = M - Pe - bo;
    const Ot = Nt;
    for (const v of Rt)
      _.push(
        De(v, Nt, b, it, t.perContinent[v], me)
      ), Nt += Gt(v) + ht;
    if (s.show_overview) {
      const v = Ot - Mt - 40, x = Math.max(1.2, Math.min(Bs, v) / (L - 1)), wo = (L - 1) * x, So = (Mt + Ot) / 2 - wo / 2, pe = b - 6;
      for (let z = 0; z < l.length; z++) {
        const _e = l[z];
        if (!_e)
          continue;
        const Eo = {
          x: So + z % L * x,
          y: pe + Math.floor(z / L) * x
        };
        (t.cells.has(_e) ? u.lit : u.dim).push(Eo);
      }
      s.caption && (m = $`<text x=${(Mt + Ot) / 2}
          y=${pe + Jt * x + Xt + 2} font-size=${Xt}
          letter-spacing="2" text-anchor="middle" fill=${ao}>${s.caption}</text>`);
    }
  }
  const S = `${e} ${e === 1 ? "COUNTRY" : "COUNTRIES"} · ${t.continentsTouched}/${Et.length} CONTINENTS`, E = [...t.indices].map((A) => ot[A].name).sort();
  return $`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${M} ${c}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${s.title}: ${e} countries visited${E.length ? " — " + E.join(", ") : ""}`}
    >
      <rect width=${M} height=${c} fill=${r} />

      ${s.show_header ? $`<g id="swc-header" transform="translate(${o.headerShift} 0)">
            <rect x=${Bt} y=${ct} width=${R} height=${R} rx="15" fill=${n}/>
            ${ks(Bt + R / 2, ct + R / 2, R * 0.34, r)}
            <text x=${Bt + R + 22} y=${ct + R * 0.74}
                  font-size=${Ds} font-weight="700" letter-spacing="2"
                  fill=${Ps}>${s.title}</text>
          </g>` : ""}

      ${s.show_header && s.show_stats ? $`<text x=${M / 2} y=${ct + R + 30} font-size="16"
              letter-spacing="3" text-anchor="middle" fill=${n}>${S}</text>` : ""}

      <path d=${C(h, ut)} fill=${i}/>
      <path d=${C(d, ut)} fill=${n}/>

      ${u.dim.length ? $`<path d=${C(u.dim, lt * 0.62)} fill=${i} opacity="0.7"/>` : ""}
      ${u.lit.length ? $`<path d=${C(u.lit, lt * 0.62)} fill=${n}/>` : ""}
      ${m}

      ${_}
      <path d=${C(y, lt)} fill=${i}/>
      <path d=${C(w, lt)} fill=${n}/>
    </svg>
  `;
}
const P = [5.12, 52.09], qt = {
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
  pin: P,
  footer_title: "Travel board",
  footer_subtitle: "Mapping memories, one destination at a time",
  footer2_title: "My next adventure",
  footer2_subtitle: "Just one ticket away",
  accent_color: ce,
  background_color: as,
  unlit_color: cs
}, Qt = {
  title: "WORLD MAP",
  countries: [],
  show_header: !0,
  show_meters: !0,
  show_overview: !0,
  show_stats: !0,
  caption: "",
  accent_color: Os,
  background_color: Ns,
  land_color: Ls
};
function fo(s, t, e) {
  const o = { ...s };
  for (const [n, i] of Object.entries(e))
    !(n in t) && o[n] === i && delete o[n];
  return o;
}
function $o(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]+/g, " ").trim();
}
const Fs = {
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
let Ht = null;
function Ys() {
  if (Ht)
    return Ht;
  const s = /* @__PURE__ */ new Map();
  ot.forEach((e, o) => {
    for (const n of [e.iso2, e.iso3, e.name]) {
      const i = $o(n);
      i && !s.has(i) && s.set(i, o);
    }
  });
  const t = new Map(ot.map((e, o) => [e.iso2, o]));
  for (const [e, o] of Object.entries(Fs)) {
    const n = t.get(o);
    n !== void 0 && !s.has(e) && s.set(e, n);
  }
  return Ht = s, s;
}
function Ws(s) {
  const t = Ys(), e = /* @__PURE__ */ new Set(), o = [], n = /* @__PURE__ */ new Set();
  for (const a of s) {
    const l = $o(String(a ?? ""));
    if (!l || n.has(l))
      continue;
    n.add(l);
    const h = t.get(l);
    h === void 0 ? o.push(String(a).trim()) : e.add(h);
  }
  const i = new Array(Et.length).fill(0);
  for (const a of e)
    i[ot[a].cont] += 1;
  const r = new Set([...e].map((a) => a + 1)), c = i.filter((a) => a > 0).length;
  return { cells: r, indices: e, perContinent: i, unknown: o, continentsTouched: c };
}
function zs(s) {
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
var js = Object.defineProperty, Ct = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, r; i >= 0; i--)
    (r = s[i]) && (n = r(t, e, n) || n);
  return n && js(t, e, n), n;
};
io({
  type: he,
  name: Ms,
  description: "Dot-matrix world map: the countries you have visited, lit up by continent.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const Vs = Qt, yt = class yt extends N {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => sn), document.createElement(
      "smaail-world-card-editor"
    );
  }
  static getStubConfig() {
    return {
      type: `custom:${he}`,
      countries: ["NL", "BE", "FR", "ES", "US", "MA", "JP", "AU", "BR", "ZA"]
    };
  }
  setConfig(t) {
    if (!t)
      throw new Error("Invalid configuration");
    if (t.countries !== void 0 && !Array.isArray(t.countries))
      throw new Error("`countries` must be a list");
    this._config = {
      ...Vs,
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
    return this._config ? _o(this._config).height : 700;
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
        e.push(...zs(n));
      }
    }
    return e;
  }
  render() {
    if (!this._config)
      return p;
    const t = Ws(this._visitedInputs());
    return G`
      <ha-card>
        ${Ks(this._config, t, t.indices.size, {
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
yt.version = no, yt.styles = vt`
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
let U = yt;
Ct([
  nt({ attribute: !1 })
], U.prototype, "hass");
Ct([
  W()
], U.prototype, "_config");
Ct([
  W()
], U.prototype, "_headerShift");
Ct([
  Je("#swc-header")
], U.prototype, "_header");
St(he, U);
var Zs = Object.defineProperty, xt = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, r; i >= 0; i--)
    (r = s[i]) && (n = r(t, e, n) || n);
  return n && Zs(t, e, n), n;
};
io({
  type: le,
  name: Rs,
  description: "Dot-matrix departures board: a travel poster of the places you have been.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const Kt = qt, At = class At extends N {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => dn), document.createElement("smaail-card-editor");
  }
  static getStubConfig() {
    return {
      type: `custom:${le}`,
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
      (n) => typeof n == "string" ? Xs(n) : n
    ), o = Js(
      t.row_count ?? Math.max(Kt.row_count, e.length),
      1,
      40
    );
    this._config = {
      ...Kt,
      ...t,
      rows: e,
      row_count: o,
      pin: t.pin === void 0 ? Kt.pin : t.pin
    }, this._measuredTitle = void 0;
  }
  getCardSize() {
    return Math.max(3, Math.round(this._height() / Dt * 14));
  }
  /** Sensible default footprint in a Sections dashboard. */
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round(this._height() / Dt * 16))
    };
  }
  _height() {
    return this._config ? so(this._config).height : Dt;
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
    const t = Es(this._config, this.hass?.states ?? {});
    return G`
      <ha-card>
        ${Cs(this._config, t, { headerShift: this._headerShift })}
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
    const n = Math.round((Yt / 2 - (o.x + o.width / 2)) * 100) / 100;
    n !== this._headerShift && (this._headerShift = n);
  }
};
At.version = no, At.styles = vt`
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
let B = At;
xt([
  nt({ attribute: !1 })
], B.prototype, "hass");
xt([
  W()
], B.prototype, "_config");
xt([
  W()
], B.prototype, "_headerShift");
xt([
  Je("#sc-header")
], B.prototype, "_header");
St(le, B);
function Js(s, t, e) {
  return Math.min(e, Math.max(t, s));
}
function Xs(s) {
  const t = s.indexOf("|");
  return t === -1 ? { dest: s } : { dest: s.slice(0, t), year: s.slice(t + 1) };
}
var Ie, Ue;
(function(s) {
  s.language = "language", s.system = "system", s.comma_decimal = "comma_decimal", s.decimal_comma = "decimal_comma", s.space_comma = "space_comma", s.none = "none";
})(Ie || (Ie = {})), function(s) {
  s.language = "language", s.system = "system", s.am_pm = "12", s.twenty_four = "24";
}(Ue || (Ue = {}));
var go = function(s, t, e, o) {
  o = o || {}, e = e ?? {};
  var n = new Event(t, { bubbles: o.bubbles === void 0 || o.bubbles, cancelable: !!o.cancelable, composed: o.composed === void 0 || o.composed });
  return n.detail = e, s.dispatchEvent(n), n;
};
const qs = {
  title: "Title",
  dest_label: "Destination heading",
  year_label: "Year heading",
  row_count: "Number of rows (including empty ones)",
  sort: "Order",
  sort_asc: "By year, oldest first",
  sort_desc: "By year, newest first",
  sort_none: "Don't sort (order below)",
  show_header: "Show header",
  show_column_labels: "Show column headings",
  show_footer: "Show footer",
  show_map: "Show world map",
  show_legend: "Show character set",
  footer_title: "Footer 1",
  footer_subtitle: "Subtitle 1",
  footer2_title: "Footer 2",
  footer2_subtitle: "Subtitle 2",
  accent_color: "Accent color",
  background_color: "Background color",
  unlit_color: "Color of unlit dots",
  rows: "Rows",
  rows_help: "Leave the year empty for an empty year column. Turn on full width to run the row across the whole board. Pick an entity to take the text from Home Assistant instead of fixed text.",
  add_row: "+ Add row",
  remove_row: "Remove row",
  remove_row_n: "Remove row {n}",
  dest: "Destination",
  year: "Year",
  entity: "Entity (instead of fixed text)",
  color: "Color",
  full_width: "Full width (no year column)",
  color_auto: "Alternating (default)",
  color_yellow: "Yellow",
  color_white: "White",
  color_grey: "Gray",
  pin_section: "Marker on the world map",
  pin_toggle: "Mark home base",
  longitude: "Longitude",
  latitude: "Latitude",
  show_stats: "Show counts",
  show_meters: "Show continent meters",
  show_overview: "Show overview map",
  caption: "Caption (below the overview map)",
  countries_entity: "Entity with a list of countries (optional)",
  countries_attribute: "Attribute of that entity (optional)",
  land_color: "Color of land not visited",
  countries: "Visited countries",
  countries_help: "Enter countries as an ISO code (NL, FR), ISO-3 (NLD), English name (Netherlands) or a known alias (USA, UK). Every visited country lights up on the map.",
  add_country: "+ Add country",
  country_n: "Country {n}",
  remove_country: "Remove",
  remove_country_n: "Remove country {n}"
}, Qs = {
  title: "Titel",
  dest_label: "Kop bestemmingskolom",
  year_label: "Kop jaartalkolom",
  row_count: "Aantal regels (incl. lege)",
  sort: "Volgorde",
  sort_asc: "Op jaartal, oudste eerst",
  sort_desc: "Op jaartal, nieuwste eerst",
  sort_none: "Niet sorteren (volgorde hieronder)",
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
  unlit_color: "Kleur gedoofde dots",
  rows: "Regels",
  rows_help: "Laat het jaar leeg voor een lege jaartalkolom. Zet volle breedte aan om de regel over het hele bord te laten lopen. Kies een entity om de tekst uit Home Assistant te halen in plaats van vaste tekst.",
  add_row: "+ Regel toevoegen",
  remove_row: "Regel verwijderen",
  remove_row_n: "Regel {n} verwijderen",
  dest: "Bestemming",
  year: "Jaar",
  entity: "Entity (in plaats van vaste tekst)",
  color: "Kleur",
  full_width: "Volle breedte (geen jaartalkolom)",
  color_auto: "Afwisselend (standaard)",
  color_yellow: "Geel",
  color_white: "Wit",
  color_grey: "Grijs",
  pin_section: "Markering op de wereldkaart",
  pin_toggle: "Thuisbasis markeren",
  longitude: "Lengtegraad",
  latitude: "Breedtegraad",
  show_stats: "Aantallen tonen",
  show_meters: "Continentmeters tonen",
  show_overview: "Overzichtskaartje tonen",
  caption: "Bijschrift (onder kaartje)",
  countries_entity: "Entity met landenlijst (optioneel)",
  countries_attribute: "Attribuut van die entity (optioneel)",
  land_color: "Kleur van land (niet bezocht)",
  countries: "Bezochte landen",
  countries_help: "Vul landen in als ISO-code (NL, FR), ISO-3 (NLD), Engelse naam (Netherlands) of een bekende alias (USA, UK). Elk bezocht land licht op de kaart op.",
  add_country: "+ Land toevoegen",
  country_n: "Land {n}",
  remove_country: "Verwijderen",
  remove_country_n: "Land {n} verwijderen"
};
function gt(s) {
  return (s?.language ?? "").toLowerCase().startsWith("nl") ? "nl" : "en";
}
function f(s, t, e = {}) {
  return ((s === "nl" ? Qs : qs)[t] ?? t).replace(
    /\{(\w+)\}/g,
    (n, i) => i in e ? String(e[i]) : n
  );
}
var tn = Object.defineProperty, yo = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, r; i >= 0; i--)
    (r = s[i]) && (n = r(t, e, n) || n);
  return n && tn(t, e, n), n;
};
const en = [
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
], on = {
  select: {
    mode: "dropdown",
    custom_value: !0,
    options: ot.map((s) => ({ value: s.iso2, label: s.name }))
  }
}, de = class de extends N {
  constructor() {
    super(...arguments), this._computeLabel = (t) => f(gt(this.hass), t.name);
  }
  setConfig(t) {
    this._config = t;
  }
  get _countries() {
    return this._config?.countries ?? [];
  }
  render() {
    if (!this.hass || !this._config)
      return p;
    const t = gt(this.hass);
    return G`
      <ha-form
        .hass=${this.hass}
        .data=${{ ...Qt, ...this._config }}
        .schema=${en}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title">${f(t, "countries")}</div>
        <p class="help">${f(t, "countries_help")}</p>

        ${this._countries.map((e, o) => this._renderCountry(t, e, o))}

        <div class="add">
          <button type="button" @click=${this._addCountry}>
            ${f(t, "add_country")}
          </button>
        </div>
      </div>
    `;
  }
  _renderCountry(t, e, o) {
    return G`
      <div class="row">
        <ha-selector
          .hass=${this.hass}
          .selector=${on}
          .value=${e}
          .label=${f(t, "country_n", { n: o + 1 })}
          .required=${!0}
          data-index=${o}
          @value-changed=${this._countryChanged}
        ></ha-selector>
        <button
          type="button"
          class="icon"
          title=${f(t, "remove_country")}
          aria-label=${f(t, "remove_country_n", { n: o + 1 })}
          data-index=${o}
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
    t.stopPropagation(), this._setCountry(Be(t), String(t.detail.value ?? "").trim());
  }
  _removeCountryClicked(t) {
    this._removeCountry(Be(t));
  }
  _formChanged(t) {
    t.stopPropagation(), this._emit(
      fo(
        { ...this._config, ...t.detail.value },
        this._config ?? {},
        Qt
      )
    );
  }
  _emit(t) {
    this._config = t, go(this, "config-changed", { config: t });
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
de.styles = vt`
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
    ha-selector {
      flex: 1;
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
let F = de;
yo([
  nt({ attribute: !1 })
], F.prototype, "hass");
yo([
  W()
], F.prototype, "_config");
function Be(s) {
  return Number(s.currentTarget.dataset.index);
}
St(Ts, F);
const sn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SmaailWorldCardEditor: F
}, Symbol.toStringTag, { value: "Module" }));
var nn = Object.defineProperty, Ao = (s, t, e, o) => {
  for (var n = void 0, i = s.length - 1, r; i >= 0; i--)
    (r = s[i]) && (n = r(t, e, n) || n);
  return n && nn(t, e, n), n;
};
const ke = /* @__PURE__ */ new Map();
function rn(s) {
  let t = ke.get(s);
  return t || (t = [
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
      required: !0,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "asc", label: f(s, "sort_asc") },
            { value: "desc", label: f(s, "sort_desc") },
            { value: "none", label: f(s, "sort_none") }
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
  ], ke.set(s, t)), t;
}
const te = "auto", an = [
  [te, "color_auto"],
  ["yellow", "color_yellow"],
  ["white", "color_white"],
  ["grey", "color_grey"]
], Ge = /* @__PURE__ */ new Map();
function cn(s) {
  let t = Ge.get(s);
  return t || (t = [
    { name: "pin_toggle", selector: { boolean: {} } },
    ...s ? [
      {
        name: "",
        type: "grid",
        schema: [
          {
            name: "longitude",
            required: !0,
            selector: {
              number: { min: -180, max: 180, step: 0.01, mode: "box" }
            }
          },
          {
            name: "latitude",
            required: !0,
            selector: {
              number: { min: -90, max: 90, step: 0.01, mode: "box" }
            }
          }
        ]
      }
    ] : []
  ], Ge.set(s, t)), t;
}
const He = /* @__PURE__ */ new Map();
function ln(s, t) {
  const e = an.map(([o, n]) => ({
    value: o,
    label: f(s, n)
  }));
  return e.some((o) => o.value === t) ? e : [...e, { value: t, label: t }];
}
function hn(s, t, e, o, n) {
  const i = `${s}|${t}|${e}|${o}|${n}`;
  let r = He.get(i);
  return r || (r = [
    {
      name: "",
      type: "grid",
      schema: [
        { name: "dest", disabled: e, selector: { text: {} } },
        ...t ? [] : [{ name: "year", disabled: o, selector: { text: {} } }]
      ]
    },
    { name: "entity", selector: { entity: {} } },
    {
      name: "",
      type: "grid",
      schema: [
        {
          name: "color",
          required: !0,
          selector: {
            select: {
              mode: "dropdown",
              options: ln(s, n)
            }
          }
        },
        { name: "full_width", selector: { boolean: {} } }
      ]
    }
  ], He.set(i, r)), r;
}
const ue = class ue extends N {
  constructor() {
    super(...arguments), this._computeLabel = (t) => f(gt(this.hass), t.name);
  }
  setConfig(t) {
    this._config = t;
  }
  get _rows() {
    return this._config?.rows ?? [];
  }
  render() {
    if (!this.hass || !this._config)
      return p;
    const t = gt(this.hass);
    return G`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${rn(t)}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title">${f(t, "rows")}</div>
        <p class="help">${f(t, "rows_help")}</p>

        ${this._rows.map((e, o) => this._renderRow(t, e, o))}

        <div class="add">
          <button type="button" @click=${this._addRow}>
            ${f(t, "add_row")}
          </button>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${f(t, "pin_section")}</div>
        <ha-form
          .hass=${this.hass}
          .data=${this._pinData()}
          .schema=${cn(this._config.pin !== null)}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._pinChanged}
        ></ha-form>
      </div>
    `;
  }
  _renderRow(t, e, o) {
    const n = e.year === "", i = {
      dest: e.dest ?? "",
      year: n ? "" : e.year ?? "",
      entity: e.entity ?? "",
      color: e.color ?? te,
      full_width: n
    };
    return G`
      <div class="row">
        <div class="row-head">
          <span class="num">${o + 1}</span>
          <button
            type="button"
            class="icon"
            title=${f(t, "remove_row")}
            aria-label=${f(t, "remove_row_n", { n: o + 1 })}
            data-index=${o}
            @click=${this._removeRowClicked}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${i}
          .schema=${hn(
      t,
      n,
      !!e.entity,
      !!e.year_entity,
      i.color
    )}
          .computeLabel=${this._computeLabel}
          data-index=${o}
          @value-changed=${this._rowChanged}
        ></ha-form>
      </div>
    `;
  }
  /* Template bindings pass methods, not arrow functions (lit/no-template-arrow,
     as in the Home Assistant frontend); the row comes from data-index. */
  _removeRowClicked(t) {
    this._removeRow(Ke(t));
  }
  _rowChanged(t) {
    t.stopPropagation();
    const e = Ke(t), o = t.detail.value, n = { ...this._rows[e] };
    Fe(n, "dest", o.dest), Fe(n, "entity", o.entity), o.color && o.color !== te ? n.color = o.color : delete n.color;
    const i = o.year?.trim();
    o.full_width ? n.year = "" : i ? n.year = i : delete n.year, this._updateRows(this._rows.map((r, c) => c === e ? n : r));
  }
  /** The marker as its form shows it; no `pin` in the config means the default. */
  _pinData() {
    const t = this._config?.pin;
    return {
      pin_toggle: t !== null,
      longitude: t?.[0] ?? P[0],
      latitude: t?.[1] ?? P[1]
    };
  }
  _pinChanged(t) {
    t.stopPropagation();
    const e = t.detail.value, o = { ...this._config };
    if (!e.pin_toggle)
      o.pin = null;
    else {
      const n = [
        Number(e.longitude ?? P[0]),
        Number(e.latitude ?? P[1])
      ];
      n[0] === P[0] && n[1] === P[1] && (this._config?.pin === void 0 || this._config?.pin === null) ? delete o.pin : o.pin = n;
    }
    this._emit(o);
  }
  /** Defaults the card uses, shown in the form when the config leaves them out. */
  _formDefaults() {
    return {
      ...qt,
      row_count: Math.max(qt.row_count, this._rows.length)
    };
  }
  _formData() {
    return { ...this._formDefaults(), ...this._config };
  }
  _formChanged(t) {
    t.stopPropagation(), this._emit(
      fo(
        { ...this._config, ...t.detail.value },
        this._config ?? {},
        this._formDefaults()
      )
    );
  }
  _emit(t) {
    this._config = t, go(this, "config-changed", { config: t });
  }
  _updateRows(t) {
    this._emit({ ...this._config, rows: t });
  }
  _addRow() {
    this._updateRows([...this._rows, { dest: "" }]);
  }
  _removeRow(t) {
    this._updateRows(this._rows.filter((e, o) => o !== t));
  }
};
ue.styles = vt`
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
let Y = ue;
Ao([
  nt({ attribute: !1 })
], Y.prototype, "hass");
Ao([
  W()
], Y.prototype, "_config");
function Ke(s) {
  return Number(s.currentTarget.dataset.index);
}
function Fe(s, t, e) {
  const o = e?.trim();
  o ? s[t] = o : delete s[t];
}
St(xs, Y);
const dn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SmaailcardEditor: Y
}, Symbol.toStringTag, { value: "Module" }));
export {
  B as Smaailcard
};
