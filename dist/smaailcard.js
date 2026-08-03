/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht = globalThis, Vt = ht.ShadowRoot && (ht.ShadyCSS === void 0 || ht.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Zt = Symbol(), le = /* @__PURE__ */ new WeakMap();
let Ne = class {
  constructor(t, o, s) {
    if (this._$cssResult$ = !0, s !== Zt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = o;
  }
  get styleSheet() {
    let t = this.o;
    const o = this.t;
    if (Vt && t === void 0) {
      const s = o !== void 0 && o.length === 1;
      s && (t = le.get(o)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && le.set(o, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const lo = (e) => new Ne(typeof e == "string" ? e : e + "", void 0, Zt), $t = (e, ...t) => {
  const o = e.length === 1 ? e[0] : t.reduce((s, i, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[n + 1], e[0]);
  return new Ne(o, e, Zt);
}, ho = (e, t) => {
  if (Vt) e.adoptedStyleSheets = t.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of t) {
    const s = document.createElement("style"), i = ht.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = o.cssText, e.appendChild(s);
  }
}, he = Vt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let o = "";
  for (const s of t.cssRules) o += s.cssText;
  return lo(o);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: uo, defineProperty: mo, getOwnPropertyDescriptor: po, getOwnPropertyNames: _o, getOwnPropertySymbols: fo, getPrototypeOf: $o } = Object, gt = globalThis, de = gt.trustedTypes, go = de ? de.emptyScript : "", Ao = gt.reactiveElementPolyfillSupport, j = (e, t) => e, ut = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? go : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let o = e;
  switch (t) {
    case Boolean:
      o = e !== null;
      break;
    case Number:
      o = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(e);
      } catch {
        o = null;
      }
  }
  return o;
} }, Jt = (e, t) => !uo(e, t), ue = { attribute: !0, type: String, converter: ut, reflect: !1, useDefault: !1, hasChanged: Jt };
Symbol.metadata ??= Symbol("metadata"), gt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let I = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, o = ue) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(t, o), !o.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, o);
      i !== void 0 && mo(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, o, s) {
    const { get: i, set: n } = po(this.prototype, t) ?? { get() {
      return this[o];
    }, set(r) {
      this[o] = r;
    } };
    return { get: i, set(r) {
      const c = i?.call(this);
      n?.call(this, r), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const t = $o(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const o = this.properties, s = [..._o(o), ...fo(o)];
      for (const i of s) this.createProperty(i, o[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const o = litPropertyMetadata.get(t);
      if (o !== void 0) for (const [s, i] of o) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, s] of this.elementProperties) {
      const i = this._$Eu(o, s);
      i !== void 0 && this._$Eh.set(i, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const o = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) o.unshift(he(i));
    } else t !== void 0 && o.push(he(t));
    return o;
  }
  static _$Eu(t, o) {
    const s = o.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const s of o.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ho(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, o, s) {
    this._$AK(t, s);
  }
  _$ET(t, o) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : ut).toAttribute(o, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, o) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ut;
      this._$Em = i;
      const c = r.fromAttribute(o, n.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, o, s, i = !1, n) {
    if (t !== void 0) {
      const r = this.constructor;
      if (i === !1 && (n = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? Jt)(n, o) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, o, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, o, { useDefault: s, reflect: i, wrapped: n }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? o ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (o = void 0), this._$AL.set(t, o)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
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
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: r } = n, c = this[i];
        r !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, n, c);
      }
    }
    let t = !1;
    const o = this._$AL;
    try {
      t = this.shouldUpdate(o), t ? (this.willUpdate(o), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(o)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((o) => o.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((o) => this._$ET(o, this[o])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[j("elementProperties")] = /* @__PURE__ */ new Map(), I[j("finalized")] = /* @__PURE__ */ new Map(), Ao?.({ ReactiveElement: I }), (gt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = globalThis, me = (e) => e, mt = Xt.trustedTypes, pe = mt ? mt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Te = "$lit$", O = `lit$${Math.random().toFixed(9).slice(2)}$`, Le = "?" + O, bo = `<${Le}>`, D = document, J = () => D.createComment(""), X = (e) => e === null || typeof e != "object" && typeof e != "function", qt = Array.isArray, yo = (e) => qt(e) || typeof e?.[Symbol.iterator] == "function", Ot = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, fe = />/g, T = RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $e = /'/g, ge = /"/g, Pe = /^(?:script|style|textarea|title)$/i, De = (e) => (t, ...o) => ({ _$litType$: e, strings: t, values: o }), w = De(1), f = De(2), B = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), Ae = /* @__PURE__ */ new WeakMap(), P = D.createTreeWalker(D, 129);
function Ie(e, t) {
  if (!qt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pe !== void 0 ? pe.createHTML(t) : t;
}
const vo = (e, t) => {
  const o = e.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = z;
  for (let c = 0; c < o; c++) {
    const a = e[c];
    let l, h, d = -1, _ = 0;
    for (; _ < a.length && (r.lastIndex = _, h = r.exec(a), h !== null); ) _ = r.lastIndex, r === z ? h[1] === "!--" ? r = _e : h[1] !== void 0 ? r = fe : h[2] !== void 0 ? (Pe.test(h[2]) && (i = RegExp("</" + h[2], "g")), r = T) : h[3] !== void 0 && (r = T) : r === T ? h[0] === ">" ? (r = i ?? z, d = -1) : h[1] === void 0 ? d = -2 : (d = r.lastIndex - h[2].length, l = h[1], r = h[3] === void 0 ? T : h[3] === '"' ? ge : $e) : r === ge || r === $e ? r = T : r === _e || r === fe ? r = z : (r = T, i = void 0);
    const g = r === T && e[c + 1].startsWith("/>") ? " " : "";
    n += r === z ? a + bo : d >= 0 ? (s.push(l), a.slice(0, d) + Te + a.slice(d) + O + g) : a + O + (d === -2 ? c : g);
  }
  return [Ie(e, n + (e[o] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class q {
  constructor({ strings: t, _$litType$: o }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const c = t.length - 1, a = this.parts, [l, h] = vo(t, o);
    if (this.el = q.createElement(l, s), P.currentNode = this.el.content, o === 2 || o === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = P.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Te)) {
          const _ = h[r++], g = i.getAttribute(d).split(O), v = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: v[2], strings: g, ctor: v[1] === "." ? wo : v[1] === "?" ? Eo : v[1] === "@" ? Co : At }), i.removeAttribute(d);
        } else d.startsWith(O) && (a.push({ type: 6, index: n }), i.removeAttribute(d));
        if (Pe.test(i.tagName)) {
          const d = i.textContent.split(O), _ = d.length - 1;
          if (_ > 0) {
            i.textContent = mt ? mt.emptyScript : "";
            for (let g = 0; g < _; g++) i.append(d[g], J()), P.nextNode(), a.push({ type: 2, index: ++n });
            i.append(d[_], J());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Le) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(O, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += O.length - 1;
      }
      n++;
    }
  }
  static createElement(t, o) {
    const s = D.createElement("template");
    return s.innerHTML = t, s;
  }
}
function U(e, t, o = e, s) {
  if (t === B) return t;
  let i = s !== void 0 ? o._$Co?.[s] : o._$Cl;
  const n = X(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(e), i._$AT(e, o, s)), s !== void 0 ? (o._$Co ??= [])[s] = i : o._$Cl = i), i !== void 0 && (t = U(e, i._$AS(e, t.values), i, s)), t;
}
class So {
  constructor(t, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: o }, parts: s } = this._$AD, i = (t?.creationScope ?? D).importNode(o, !0);
    P.currentNode = i;
    let n = P.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let l;
        a.type === 2 ? l = new et(n, n.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (l = new xo(n, this, t)), this._$AV.push(l), a = s[++c];
      }
      r !== a?.index && (n = P.nextNode(), r++);
    }
    return P.currentNode = D, i;
  }
  p(t) {
    let o = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, o), o += s.strings.length - 2) : s._$AI(t[o])), o++;
  }
}
class et {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, o, s, i) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = o, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && t?.nodeType === 11 && (t = o.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, o = this) {
    t = U(this, t, o), X(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== B && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : yo(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && X(this._$AH) ? this._$AA.nextSibling.data = t : this.T(D.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: o, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = q.createElement(Ie(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(o);
    else {
      const n = new So(i, this), r = n.u(this.options);
      n.p(o), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let o = Ae.get(t.strings);
    return o === void 0 && Ae.set(t.strings, o = new q(t)), o;
  }
  k(t) {
    qt(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let s, i = 0;
    for (const n of t) i === o.length ? o.push(s = new et(this.O(J()), this.O(J()), this, this.options)) : s = o[i], s._$AI(n), i++;
    i < o.length && (this._$AR(s && s._$AB.nextSibling, i), o.length = i);
  }
  _$AR(t = this._$AA.nextSibling, o) {
    for (this._$AP?.(!1, !0, o); t !== this._$AB; ) {
      const s = me(t).nextSibling;
      me(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
let At = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, o, s, i, n) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = o, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(t, o = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = U(this, t, o, 0), r = !X(t) || t !== this._$AH && t !== B, r && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = n[0], a = 0; a < n.length - 1; a++) l = U(this, c[s + a], o, a), l === B && (l = this._$AH[a]), r ||= !X(l) || l !== this._$AH[a], l === m ? t = m : t !== m && (t += (l ?? "") + n[a + 1]), this._$AH[a] = l;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class wo extends At {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class Eo extends At {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class Co extends At {
  constructor(t, o, s, i, n) {
    super(t, o, s, i, n), this.type = 5;
  }
  _$AI(t, o = this) {
    if ((t = U(this, t, o, 0) ?? m) === B) return;
    const s = this._$AH, i = t === m && s !== m || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== m && (s === m || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class xo {
  constructor(t, o, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    U(this, t);
  }
}
const Ro = Xt.litHtmlPolyfillSupport;
Ro?.(q, et), (Xt.litHtmlVersions ??= []).push("3.3.3");
const Oo = (e, t, o) => {
  const s = o?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = o?.renderBefore ?? null;
    s._$litPart$ = i = new et(t.insertBefore(J(), n), n, void 0, o ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis;
class N extends I {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Oo(o, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return B;
  }
}
N._$litElement$ = !0, N.finalized = !0, Qt.litElementHydrateSupport?.({ LitElement: N });
const Mo = Qt.litElementPolyfillSupport;
Mo?.({ LitElement: N });
(Qt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = (e) => (t, o) => {
  o !== void 0 ? o.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const No = { attribute: !0, type: String, converter: ut, reflect: !1, hasChanged: Jt }, To = (e = No, t, o) => {
  const { kind: s, metadata: i } = o;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(o.name, e), s === "accessor") {
    const { name: r } = o;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, e, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = o;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ot(e) {
  return (t, o) => typeof o == "object" ? To(e, t, o) : ((s, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(e, t, o);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(e) {
  return ot({ ...e, state: !0, attribute: !1 });
}
const Gt = {
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
}, Lo = {
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
}, Po = {
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
function be(e) {
  return e.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split("").map((t) => Lo[t] ?? Po[t] ?? t).join("");
}
const Be = 5, Q = 7, te = 6;
function Ue(e) {
  return (Gt[e.toUpperCase()] ?? Gt[" "]).split(" ");
}
Object.keys(Gt).join("");
function C(e, t) {
  const o = [];
  for (const { x: s, y: i } of e)
    o.push(
      `M${(s - t).toFixed(2)} ${i.toFixed(2)}a${t} ${t} 0 1 0 ${(t * 2).toFixed(2)} 0a${t} ${t} 0 1 0 ${(-t * 2).toFixed(2)} 0`
    );
  return o.join("");
}
function ye(e, t, o, s) {
  const i = [];
  let n = 0;
  for (const r of s) {
    const c = Ue(r);
    for (let a = 0; a < Q; a++)
      for (let l = 0; l < Be; l++)
        c[a][l] === "1" && i.push({ x: e + (n + l) * o, y: t + a * o });
    n += te;
  }
  return i;
}
function Mt(e, t, o, s, i) {
  const n = [];
  let r = 0;
  for (const c of s) {
    if (r >= i) break;
    const a = Ue(c);
    for (let l = 0; l < Q; l++)
      for (let h = 0; h < Be; h++)
        a[l][h] === "1" && r + h < i && n.push({ x: e + (r + h) * o, y: t + l * o });
    r += te;
  }
  return n;
}
function ve(e) {
  return Math.max(0, Math.floor((e + 1) / te));
}
const Do = [
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
], Io = [
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
], Bo = [
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
], Uo = [
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
], Go = [
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
], Ho = [
  [-45, 60],
  [-25, 70],
  [-20, 76],
  [-30, 83],
  [-50, 82],
  [-58, 75],
  [-55, 65]
], ko = [Do, Io, Bo, Uo, Go, Ho], it = -170, Se = 180, nt = 78, we = -56;
function Ko(e, t, o) {
  let s = !1;
  for (let i = 0, n = o.length; i < n; i++) {
    const [r, c] = o[i], [a, l] = o[(i + 1) % n];
    if (c > t != l > t) {
      const h = (a - r) * (t - c) / (l - c) + r;
      e < h && (s = !s);
    }
  }
  return s;
}
function Wo(e, t, o, s, i, n) {
  const r = [];
  for (let a = 0; a < s; a++) {
    const l = nt + (a + 0.5) / s * (we - nt);
    for (let h = 0; h < o; h++) {
      const d = it + (h + 0.5) / o * (Se - it);
      ko.some((_) => Ko(d, l, _)) && r.push({ x: e + h * i, y: t + a * i });
    }
  }
  let c = null;
  if (n) {
    const a = Math.round((n[0] - it) / (Se - it) * o - 0.5), l = Math.round((n[1] - nt) / (we - nt) * s - 0.5);
    a >= 0 && a < o && l >= 0 && l < s && (c = { x: e + a * i, y: t + l * i });
  }
  return { land: r, pin: c };
}
const Ht = 1e3, Nt = 1414, Fo = "#0C0C0C", ee = "#F2DD00", V = "#FFFFFF", pt = "#C4C4C4", zo = "#3A3A3A", Y = 70, kt = 62, _t = 26, Kt = 96, $ = 9, Ee = 2.7, Wt = 930 - (_t - 1) * $, Yo = Wt - 5 * $ - 12, jo = 232, Ft = 87, Vo = 9, Zo = 111, Jo = 46, Xo = 207, Ge = 1105, He = 3.4, ke = 22, qo = 58, Ke = 1108, zt = 2.85, Qo = 1250, ts = 164, es = 96, os = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z", Ce = "M100 0 L58 -36 L58 -15 L4 -15 L4 15 L58 15 L58 36 Z", ss = ["ABCDEFGHIJ", "KLMNOPQRST", "UVWXYZ -. ", "0123456789"], is = {
  yellow: ee,
  white: V,
  grey: pt,
  gray: pt
};
function We(e) {
  const t = e.row_count, o = e.show_header ? 0 : Zo, s = o + (e.show_column_labels ? 0 : Jo), i = (Vo - t) * Ft + s, n = jo - s, r = [n + (t - 1) * Ft + Q * $];
  e.show_map && r.push(Ge + ke * He - i), e.show_legend && r.push(
    Ke + 3 * 9 * zt + Q * zt - i
  ), e.show_footer && r.push(Qo - i);
  const c = e.show_map || e.show_legend || e.show_footer;
  return {
    topShift: s,
    bottomShift: i,
    labelsY: Xo - o,
    rowsY0: n,
    height: Math.round(
      Math.max(...r) + (c ? ts : es)
    )
  };
}
function ns(e, t) {
  const o = e.color;
  return o ? is[o.toLowerCase()] ?? o : t % 2 === 0 ? ee : V;
}
function rs(e, t) {
  const o = Number(e), s = Number(t);
  return Number.isFinite(o) && Number.isFinite(s) ? o - s : e.localeCompare(t);
}
function as(e, t) {
  if (t === "none")
    return e;
  const o = [], s = [];
  for (const i of e)
    (i.year ? o : s).push(i);
  return o.sort((i, n) => {
    const r = rs(i.year, n.year);
    return t === "desc" ? -r : r;
  }), [...o, ...s];
}
function cs(e, t) {
  const o = e.rows.map((s) => {
    let i = s.dest ?? null;
    if (s.entity) {
      const r = t[s.entity], c = r ? s.attribute ? r.attributes[s.attribute] : r.state : null;
      i = c == null ? "" : String(c);
    }
    let n = s.year === void 0 ? null : s.year;
    if (s.year_entity) {
      const r = t[s.year_entity], c = r ? s.year_attribute ? r.attributes[s.year_attribute] : r.state : null;
      n = c == null ? "" : String(c);
    }
    return { row: s, dest: i, year: n };
  });
  return as(o, e.sort).map(({ row: s, dest: i, year: n }, r) => {
    const c = n === "" ? Kt : kt;
    return {
      dest: i === null ? null : be(i).slice(0, ve(c)),
      year: n === null || n === "" ? n : be(n).slice(0, ve(_t)),
      color: ns(s, r)
    };
  });
}
function Tt(e, t, o) {
  return f`<g transform="translate(${e - $ / 2} ${t - $ / 2})">
    <rect width=${o * $} height=${Q * $} fill="url(#sc-dim)"/>
  </g>`;
}
function ls(e, t, o) {
  const s = e.row_count, { bottomShift: i, labelsY: n, rowsY0: r, height: c } = We(e), a = e.accent_color, l = e.unlit_color, h = /* @__PURE__ */ new Map(), d = (u, p) => {
    const S = h.get(u);
    S ? S.push(...p) : h.set(u, [...p]);
  }, _ = [];
  for (let u = 0; u < s; u++) {
    const p = r + u * Ft, S = t[u], E = S?.dest ?? null, A = S?.year ?? null, y = S?.color ?? l;
    if (A === "") {
      _.push(Tt(Y, p, Kt)), E && d(y, Mt(Y, p, $, E, Kt));
      continue;
    }
    _.push(Tt(Y, p, kt)), E && d(y, Mt(Y, p, $, E, kt)), d(A ? y : l, ye(Yo, p, $, "'")), _.push(Tt(Wt, p, _t)), A && d(y, Mt(Wt, p, $, A, _t));
  }
  let g = [];
  if (e.show_map) {
    const { land: u, pin: p } = Wo(
      540,
      Ge - i,
      qo,
      ke,
      He,
      e.pin
    );
    g = [
      f`<path d=${C(u, 1.35)} fill="#575757"/>`,
      ...p ? [f`<circle cx=${p.x} cy=${p.y} r=${1.35 * 1.9} fill=${a}/>`] : []
    ];
  }
  let v = "";
  if (e.show_legend) {
    const u = zt, p = [];
    ss.forEach((S, E) => {
      p.push(...ye(761, Ke + E * 9 * u - i, u, S));
    }), v = C(p, 1.15);
  }
  return f`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${Ht} ${c}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${e.title}: ${t.filter((u) => u.dest).map((u) => [u.dest, u.year].filter(Boolean).join(" ")).join(", ")}`}
    >
      <defs>
        <pattern
          id="sc-dim"
          width=${$}
          height=${$}
          patternUnits="userSpaceOnUse"
        >
          <circle cx=${$ / 2} cy=${$ / 2} r=${Ee} fill=${l}/>
        </pattern>
      </defs>

      <rect width=${Ht} height=${c} fill=${e.background_color}/>

      ${e.show_header ? f`<g id="sc-header" transform="translate(${o.headerShift} 0)">
            <rect x="228" y="96" width="60" height="60" rx="14" fill=${a}/>
            <g transform="translate(258,126) scale(1.55) rotate(45) translate(-12,-12)">
              <path d=${os} fill=${e.background_color}/>
            </g>
            <text x="306" y="148" font-size="62" font-weight="700"
                  letter-spacing="1.5" fill=${V}>${e.title}</text>
          </g>` : ""}

      ${e.show_column_labels ? f`
            <text x=${Y} y=${n} font-size="25" letter-spacing="2.5"
                  fill=${pt}>${e.dest_label}</text>
            <text x="930" y=${n} font-size="25" letter-spacing="2.5"
                  text-anchor="end" fill=${pt}>${e.year_label}</text>` : ""}

      ${_}
      ${[...h.entries()].map(
    ([u, p]) => f`<path d=${C(p, Ee)} fill=${u}/>`
  )}

      ${e.show_footer ? f`
            <g transform="translate(122,${1128 - i}) rotate(-135) scale(0.46)">
              <path d=${Ce} fill=${a}/>
            </g>
            <text x="185" y=${1130 - i} font-size="30" font-weight="600"
                  fill=${V}>${e.footer_title}</text>
            <text x="185" y=${1152 - i} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${e.footer_subtitle}</text>

            <g transform="translate(98,${1210 - i}) scale(0.46)">
              <path d=${Ce} fill=${a}/>
            </g>
            <text x="185" y=${1218 - i} font-size="30" font-weight="600"
                  fill=${V}>${e.footer2_title}</text>
            <text x="185" y=${1240 - i} font-size="13" letter-spacing="0.4"
                  fill="#8C8C8C">${e.footer2_subtitle}</text>` : ""}

      ${g}
      ${v ? f`<path d=${v} fill=${a}/>` : ""}
    </svg>
  `;
}
const Fe = "0.2.2", oe = "smaail-card", ze = "Smaailcard", se = "smaail-world-card", Ye = "Smaail World Map", L = 100, Yt = 40, yt = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"], je = [18, 13, 39, 51, 47, 7], tt = [
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
], Lt = [
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
], M = 1e3, hs = "#0C0C0C", ds = "#F2DD00", us = "#3A3A3A", ms = "#FFFFFF", Ve = "#8C8C8C", xe = 48, rt = 42, R = 66, Pt = 300, ps = 52, Z = 9, dt = 2.7, _s = (L - 1) * Z, fs = Math.round((M - _s) / 2), Ze = 150, ft = 6.6, at = 2, Je = 4, Xe = 13, ct = 26, qe = 46, Qe = 18, $s = 210, jt = 15;
function gs(e, t, o, s) {
  const i = o * 0.13;
  return f`
    <g fill="none" stroke=${s} stroke-width=${i}>
      <circle cx=${e} cy=${t} r=${o} />
      <ellipse cx=${e} cy=${t} rx=${o * 0.42} ry=${o} />
      <line x1=${e - o} y1=${t} x2=${e + o} y2=${t} />
      <path d=${`M${e - o * 0.86} ${t - o * 0.5} Q ${e} ${t - o * 0.28} ${e + o * 0.86} ${t - o * 0.5}`} />
      <path d=${`M${e - o * 0.86} ${t + o * 0.5} Q ${e} ${t + o * 0.28} ${e + o * 0.86} ${t + o * 0.5}`} />
    </g>`;
}
let Dt = null;
function As() {
  if (Dt)
    return Dt;
  const e = [];
  for (let t = 0; t < Lt.length; t += 2) {
    const o = Lt[t];
    for (let s = Lt[t + 1]; s > 0; s--)
      e.push(o);
  }
  return Dt = e, e;
}
function to(e) {
  return Math.max(1, Math.ceil(e / Je));
}
function bs(e) {
  return e.length * Xe * 0.62;
}
function It(e) {
  const t = to(je[e]) * ft;
  return Math.max(t, bs(yt[e].toUpperCase()));
}
function Re(e, t, o, s, i, n) {
  const r = je[e], c = to(r);
  for (let a = 0; a < r; a++) {
    const l = a % c, h = Math.floor(a / c);
    n(a < i, [{ x: t + l * ft, y: s + h * ft }]);
  }
  return f`<text x=${t} y=${o} font-size=${Xe}
    letter-spacing="0.5" fill=${Ve}>${yt[e].toUpperCase()}</text>`;
}
function eo(e) {
  const o = (e.show_header ? Ze + (e.show_stats ? 22 : 0) : 56) + (Yt - 1) * Z + dt;
  let s = o + 40;
  return e.show_meters && (s = o + qe + Qe + Je * ft, e.show_overview && (s += jt + 6)), { height: Math.round(s + 44) };
}
function ys(e, t, o, s) {
  const i = e.accent_color, n = e.land_color, r = e.background_color, { height: c } = eo(e), a = e.show_header ? Ze + (e.show_stats ? 22 : 0) : 56, l = As(), h = [], d = [];
  for (let A = 0; A < l.length; A++) {
    const y = l[A];
    if (!y)
      continue;
    const st = {
      x: fs + A % L * Z,
      y: a + Math.floor(A / L) * Z
    };
    (t.cells.has(y) ? d : h).push(st);
  }
  const _ = [], g = [], v = [], u = { dim: [], lit: [] };
  let p = "";
  if (e.show_meters) {
    const y = a + (Yt - 1) * Z + dt + qe, st = y + Qe, re = (b, x) => (b ? v : g).push(...x), io = [0, 1, 2], wt = [3, 4, 5];
    let Et = xe;
    for (const b of io)
      _.push(Re(b, Et, y, st, t.perContinent[b], re)), Et += It(b) + ct;
    const Ct = Et - ct, no = wt.reduce((b, x) => b + It(x), 0) + ct * (wt.length - 1);
    let xt = M - xe - no;
    const Rt = xt;
    for (const b of wt)
      _.push(Re(b, xt, y, st, t.perContinent[b], re)), xt += It(b) + ct;
    if (e.show_overview) {
      const b = Rt - Ct - 40, x = Math.max(
        1.2,
        Math.min($s, b) / (L - 1)
      ), ro = (L - 1) * x, ao = (Ct + Rt) / 2 - ro / 2, ae = y - 6;
      for (let F = 0; F < l.length; F++) {
        const ce = l[F];
        if (!ce)
          continue;
        const co = {
          x: ao + F % L * x,
          y: ae + Math.floor(F / L) * x
        };
        (t.cells.has(ce) ? u.lit : u.dim).push(co);
      }
      e.caption && (p = f`<text x=${(Ct + Rt) / 2}
          y=${ae + Yt * x + jt + 2} font-size=${jt}
          letter-spacing="2" text-anchor="middle" fill=${Ve}>${e.caption}</text>`);
    }
  }
  const S = `${o} ${o === 1 ? "COUNTRY" : "COUNTRIES"} · ${t.continentsTouched}/${yt.length} CONTINENTS`, E = [...t.indices].map((A) => tt[A].name).sort();
  return f`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${M} ${c}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label=${`${e.title}: ${o} countries visited${E.length ? " — " + E.join(", ") : ""}`}
    >
      <rect width=${M} height=${c} fill=${r} />

      ${e.show_header ? f`<g id="swc-header" transform="translate(${s.headerShift} 0)">
            <rect x=${Pt} y=${rt} width=${R} height=${R} rx="15" fill=${i}/>
            ${gs(Pt + R / 2, rt + R / 2, R * 0.34, r)}
            <text x=${Pt + R + 22} y=${rt + R * 0.74}
                  font-size=${ps} font-weight="700" letter-spacing="2"
                  fill=${ms}>${e.title}</text>
          </g>` : ""}

      ${e.show_header && e.show_stats ? f`<text x=${M / 2} y=${rt + R + 30} font-size="16"
              letter-spacing="3" text-anchor="middle" fill=${i}>${S}</text>` : ""}

      <path d=${C(h, dt)} fill=${n}/>
      <path d=${C(d, dt)} fill=${i}/>

      ${u.dim.length ? f`<path d=${C(u.dim, at * 0.62)} fill=${n} opacity="0.7"/>` : ""}
      ${u.lit.length ? f`<path d=${C(u.lit, at * 0.62)} fill=${i}/>` : ""}
      ${p}

      ${_}
      <path d=${C(g, at)} fill=${n}/>
      <path d=${C(v, at)} fill=${i}/>
    </svg>
  `;
}
function oo(e) {
  return e.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9]+/g, " ").trim();
}
const vs = {
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
let Bt = null;
function Ss() {
  if (Bt)
    return Bt;
  const e = /* @__PURE__ */ new Map();
  tt.forEach((o, s) => {
    for (const i of [o.iso2, o.iso3, o.name]) {
      const n = oo(i);
      n && !e.has(n) && e.set(n, s);
    }
  });
  const t = new Map(tt.map((o, s) => [o.iso2, s]));
  for (const [o, s] of Object.entries(vs)) {
    const i = t.get(s);
    i !== void 0 && !e.has(o) && e.set(o, i);
  }
  return Bt = e, e;
}
function ws(e) {
  const t = Ss(), o = /* @__PURE__ */ new Set(), s = [], i = /* @__PURE__ */ new Set();
  for (const a of e) {
    const l = oo(String(a ?? ""));
    if (!l || i.has(l))
      continue;
    i.add(l);
    const h = t.get(l);
    h === void 0 ? s.push(String(a).trim()) : o.add(h);
  }
  const n = new Array(yt.length).fill(0);
  for (const a of o)
    n[tt[a].cont] += 1;
  const r = new Set([...o].map((a) => a + 1)), c = n.filter((a) => a > 0).length;
  return { cells: r, indices: o, perContinent: n, unknown: s, continentsTouched: c };
}
function Es(e) {
  if (Array.isArray(e))
    return e.map((s) => String(s));
  const t = String(e ?? "").trim();
  if (!t)
    return [];
  if (t.startsWith("["))
    try {
      const s = JSON.parse(t);
      if (Array.isArray(s))
        return s.map((i) => String(i));
    } catch {
    }
  const o = t.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  if (o.length === 1 && /\s/.test(o[0])) {
    const s = o[0].split(/\s+/);
    if (s.every((i) => i.length <= 3))
      return s;
  }
  return o;
}
var Cs = Object.defineProperty, xs = Object.getOwnPropertyDescriptor, vt = (e, t, o, s) => {
  for (var i = s > 1 ? void 0 : s ? xs(t, o) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (s ? r(t, o, i) : r(i)) || i);
  return s && i && Cs(t, o, i), i;
};
window.customCards ??= [];
window.customCards.push({
  type: se,
  name: Ye,
  description: "Dot-matrix world map — the countries you have visited, lit up by continent.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const Rs = {
  title: "WORLD MAP",
  countries: [],
  show_header: !0,
  show_meters: !0,
  show_overview: !0,
  show_stats: !0,
  caption: "",
  accent_color: ds,
  background_color: hs,
  land_color: us
};
let G = class extends N {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Us), document.createElement(
      "smaail-world-card-editor"
    );
  }
  static getStubConfig() {
    return {
      type: `custom:${se}`,
      countries: ["NL", "BE", "FR", "ES", "US", "MA", "JP", "AU", "BR", "ZA"]
    };
  }
  setConfig(e) {
    if (!e)
      throw new Error("Invalid configuration");
    if (e.countries !== void 0 && !Array.isArray(e.countries))
      throw new Error("`countries` must be a list");
    this._config = {
      ...Rs,
      ...e,
      countries: (e.countries ?? []).map((t) => String(t))
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
    return this._config ? eo(this._config).height : 700;
  }
  shouldUpdate(e) {
    if (!this._config)
      return !1;
    if (e.has("_config") || e.has("_headerShift"))
      return !0;
    const t = e.get("hass");
    if (!t || !this._config.countries_entity)
      return !t;
    const o = this._config.countries_entity;
    return t.states[o] !== this.hass?.states[o];
  }
  /** Merge the configured country list with any entity-provided list. */
  _visitedInputs() {
    const e = this._config;
    if (!e)
      return [];
    const t = [...e.countries];
    if (e.countries_entity && this.hass) {
      const o = this.hass.states[e.countries_entity];
      if (o) {
        const s = e.countries_attribute ? o.attributes[e.countries_attribute] : o.state;
        t.push(...Es(s));
      }
    }
    return t;
  }
  render() {
    if (!this._config)
      return m;
    const e = ws(this._visitedInputs());
    return w`
      <ha-card>
        ${ys(this._config, e, e.indices.size, {
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
    const e = this._config;
    if (!e?.show_header || this._measuredTitle === e.title)
      return;
    const t = this.renderRoot?.querySelector("#swc-header");
    if (!t)
      return;
    let o;
    try {
      o = t.getBBox();
    } catch {
      return;
    }
    if (!o.width)
      return;
    this._measuredTitle = e.title;
    const s = Math.round((M / 2 - (o.x + o.width / 2)) * 100) / 100;
    s !== this._headerShift && (this._headerShift = s);
  }
};
G.styles = $t`
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
vt([
  ot({ attribute: !1 })
], G.prototype, "hass", 2);
vt([
  W()
], G.prototype, "_config", 2);
vt([
  W()
], G.prototype, "_headerShift", 2);
G = vt([
  bt(se)
], G);
console.info(
  `%c ${Ye.toUpperCase()} %c ${Fe} `,
  "color: #0C0C0C; background: #F2DD00; font-weight: 700;",
  "color: #F2DD00; background: #0C0C0C; font-weight: 700;"
);
var Os = Object.defineProperty, Ms = Object.getOwnPropertyDescriptor, St = (e, t, o, s) => {
  for (var i = s > 1 ? void 0 : s ? Ms(t, o) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (s ? r(t, o, i) : r(i)) || i);
  return s && i && Os(t, o, i), i;
};
console.info(
  `%c ${ze.toUpperCase()} %c ${Fe} `,
  "color: #0C0C0C; background: #F2DD00; font-weight: 700;",
  "color: #F2DD00; background: #0C0C0C; font-weight: 700;"
);
window.customCards ??= [];
window.customCards.push({
  type: oe,
  name: ze,
  description: "Dot-matrix departures board — a travel poster of the places you have been.",
  preview: !0,
  documentationURL: "https://github.com/timoverwoest/smaailcard"
});
const Ut = {
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
  accent_color: ee,
  background_color: Fo,
  unlit_color: zo
};
let H = class extends N {
  constructor() {
    super(...arguments), this._headerShift = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => zs), document.createElement("smaail-card-editor");
  }
  static getStubConfig() {
    return {
      type: `custom:${oe}`,
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
      (s) => typeof s == "string" ? Ts(s) : s
    ), o = Ns(
      e.row_count ?? Math.max(Ut.row_count, t.length),
      1,
      40
    );
    this._config = {
      ...Ut,
      ...e,
      rows: t,
      row_count: o,
      pin: e.pin === void 0 ? Ut.pin : e.pin
    }, this._measuredTitle = void 0;
  }
  getCardSize() {
    return Math.max(3, Math.round(this._height() / Nt * 14));
  }
  /** Sensible default footprint in a Sections dashboard. */
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(4, Math.round(this._height() / Nt * 16))
    };
  }
  _height() {
    return this._config ? We(this._config).height : Nt;
  }
  shouldUpdate(e) {
    if (!this._config)
      return !1;
    if (e.has("_config") || e.has("_headerShift"))
      return !0;
    const t = e.get("hass");
    return t ? this._entities().some(
      (o) => t.states[o] !== this.hass?.states[o]
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
      return m;
    const e = cs(this._config, this.hass?.states ?? {});
    return w`
      <ha-card>
        ${ls(this._config, e, { headerShift: this._headerShift })}
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
    let o;
    try {
      o = t.getBBox();
    } catch {
      return;
    }
    if (!o.width)
      return;
    this._measuredTitle = e.title;
    const s = Math.round((Ht / 2 - (o.x + o.width / 2)) * 100) / 100;
    s !== this._headerShift && (this._headerShift = s);
  }
};
H.styles = $t`
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
St([
  ot({ attribute: !1 })
], H.prototype, "hass", 2);
St([
  W()
], H.prototype, "_config", 2);
St([
  W()
], H.prototype, "_headerShift", 2);
H = St([
  bt(oe)
], H);
function Ns(e, t, o) {
  return Math.min(o, Math.max(t, e));
}
function Ts(e) {
  const t = e.indexOf("|");
  return t === -1 ? { dest: e } : { dest: e.slice(0, t), year: e.slice(t + 1) };
}
var Oe, Me;
(function(e) {
  e.language = "language", e.system = "system", e.comma_decimal = "comma_decimal", e.decimal_comma = "decimal_comma", e.space_comma = "space_comma", e.none = "none";
})(Oe || (Oe = {})), function(e) {
  e.language = "language", e.system = "system", e.am_pm = "12", e.twenty_four = "24";
}(Me || (Me = {}));
var so = function(e, t, o, s) {
  s = s || {}, o = o ?? {};
  var i = new Event(t, { bubbles: s.bubbles === void 0 || s.bubbles, cancelable: !!s.cancelable, composed: s.composed === void 0 || s.composed });
  return i.detail = o, e.dispatchEvent(i), i;
}, Ls = Object.defineProperty, Ps = Object.getOwnPropertyDescriptor, ie = (e, t, o, s) => {
  for (var i = s > 1 ? void 0 : s ? Ps(t, o) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (s ? r(t, o, i) : r(i)) || i);
  return s && i && Ls(t, o, i), i;
};
const Ds = [
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
], Is = {
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
};
let k = class extends N {
  constructor() {
    super(...arguments), this._computeLabel = (e) => Is[e.name] ?? e.name;
  }
  setConfig(e) {
    this._config = e;
  }
  get _countries() {
    return this._config?.countries ?? [];
  }
  render() {
    return !this.hass || !this._config ? m : w`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Ds}
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

        ${this._countries.map((e, t) => this._renderCountry(e, t))}

        <div class="add">
          <button @click=${this._addCountry}>+ Land toevoegen</button>
        </div>
      </div>

      <datalist id="swc-countries">
        ${tt.map(
      (e) => w`<option value=${e.iso2}>${e.name}</option>`
    )}
      </datalist>
    `;
  }
  _renderCountry(e, t) {
    return w`
      <div class="row">
        <input
          type="text"
          list="swc-countries"
          .value=${e}
          @change=${(o) => this._setCountry(t, Bs(o))}
        />
        <button
          class="icon"
          title="Verwijderen"
          @click=${() => this._removeCountry(t)}
        >
          ✕
        </button>
      </div>
    `;
  }
  _formChanged(e) {
    e.stopPropagation(), this._emit({ ...this._config, ...e.detail.value });
  }
  _emit(e) {
    this._config = e, so(this, "config-changed", { config: e });
  }
  _updateCountries(e) {
    this._emit({ ...this._config, countries: e });
  }
  _setCountry(e, t) {
    const o = this._countries.map((s, i) => i === e ? t : s);
    this._updateCountries(o);
  }
  _addCountry() {
    this._updateCountries([...this._countries, ""]);
  }
  _removeCountry(e) {
    this._updateCountries(this._countries.filter((t, o) => o !== e));
  }
};
k.styles = $t`
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
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    input[type="text"] {
      font: inherit;
      font-size: 0.95rem;
      color: var(--primary-text-color, #212121);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.3));
      border-radius: 4px;
      padding: 7px 8px;
      flex: 1;
      box-sizing: border-box;
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
ie([
  ot({ attribute: !1 })
], k.prototype, "hass", 2);
ie([
  W()
], k.prototype, "_config", 2);
k = ie([
  bt("smaail-world-card-editor")
], k);
function Bs(e) {
  return e.target.value.trim();
}
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get SmaailWorldCardEditor() {
    return k;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Gs = Object.defineProperty, Hs = Object.getOwnPropertyDescriptor, ne = (e, t, o, s) => {
  for (var i = s > 1 ? void 0 : s ? Hs(t, o) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (s ? r(t, o, i) : r(i)) || i);
  return s && i && Gs(t, o, i), i;
};
const ks = [
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
], Ks = {
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
}, Ws = [
  { value: "", label: "Afwisselend (standaard)" },
  { value: "yellow", label: "Geel" },
  { value: "white", label: "Wit" },
  { value: "grey", label: "Grijs" }
];
let K = class extends N {
  constructor() {
    super(...arguments), this._computeLabel = (e) => Ks[e.name] ?? e.name;
  }
  setConfig(e) {
    this._config = e;
  }
  get _rows() {
    return this._config?.rows ?? [];
  }
  render() {
    return !this.hass || !this._config ? m : w`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ks}
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
        ${this._config.pin !== null ? w`<div class="grid2">
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
            </div>` : m}
      </div>

      <datalist id="sc-entities">
        ${Object.keys(this.hass.states).map(
      (e) => w`<option value=${e}></option>`
    )}
      </datalist>
    `;
  }
  _renderRow(e, t) {
    const o = e.year === "";
    return w`
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
              @change=${(s) => this._setRow(t, "dest", lt(s))}
            />
          </label>
          <label
            >Jaar
            <input
              type="text"
              .value=${o ? "" : e.year ?? ""}
              ?disabled=${o || !!e.year_entity}
              @change=${(s) => this._setYear(t, lt(s))}
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
              @change=${(s) => this._setRow(t, "entity", lt(s) || void 0)}
            />
          </label>
          <label
            >Kleur
            <select
              .value=${e.color ?? ""}
              @change=${(s) => this._setRow(t, "color", lt(s) || void 0)}
            >
              ${Ws.map(
      (s) => w`<option
                    value=${s.value}
                    ?selected=${(e.color ?? "") === s.value}
                  >
                    ${s.label}
                  </option>`
    )}
            </select>
          </label>
        </div>

        <label class="check">
          <input
            type="checkbox"
            .checked=${o}
            @change=${(s) => this._setFullWidth(t, Fs(s))}
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
    this._config = e, so(this, "config-changed", { config: e });
  }
  _updateRows(e) {
    this._emit({ ...this._config, rows: e });
  }
  _setRow(e, t, o) {
    const s = this._rows.map(
      (i, n) => n === e ? { ...i, [t]: o } : i
    );
    (o === void 0 || o === "") && delete s[e][t], this._updateRows(s);
  }
  _setYear(e, t) {
    const o = this._rows.map((s) => ({ ...s }));
    t === "" ? delete o[e].year : o[e].year = t, this._updateRows(o);
  }
  _setFullWidth(e, t) {
    const o = this._rows.map((s) => ({ ...s }));
    t ? o[e].year = "" : delete o[e].year, this._updateRows(o);
  }
  _addRow() {
    this._updateRows([...this._rows, { dest: "" }]);
  }
  _removeRow(e) {
    this._updateRows(this._rows.filter((t, o) => o !== e));
  }
  _togglePin(e) {
    const t = e.target.checked;
    this._emit({
      ...this._config,
      pin: t ? [5.12, 52.09] : null
    });
  }
  _setPin(e, t) {
    const o = [
      this._config?.pin?.[0] ?? 5.12,
      this._config?.pin?.[1] ?? 52.09
    ];
    o[e] = Number(t.target.value), this._emit({ ...this._config, pin: o });
  }
};
K.styles = $t`
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
ne([
  ot({ attribute: !1 })
], K.prototype, "hass", 2);
ne([
  W()
], K.prototype, "_config", 2);
K = ne([
  bt("smaail-card-editor")
], K);
function lt(e) {
  return e.target.value.trim();
}
function Fs(e) {
  return e.target.checked;
}
const zs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get SmaailcardEditor() {
    return K;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  H as Smaailcard
};
