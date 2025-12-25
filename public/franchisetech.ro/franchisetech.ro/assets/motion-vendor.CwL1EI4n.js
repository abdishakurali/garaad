import {
    j as G
} from "./ui-vendor.Bl07kmxE.js";
import {
    r as T
} from "./react-vendor.CoFnG1Cb.js";

function no(t) {
    if (typeof Proxy > "u") return t;
    const e = new Map,
        n = (...s) => t(...s);
    return new Proxy(n, {
        get: (s, i) => i === "create" ? t : (e.has(i) || e.set(i, t(i)), e.get(i))
    })
}

function Ht(t) {
    return t !== null && typeof t == "object" && typeof t.start == "function"
}
const pe = t => Array.isArray(t);

function Ms(t, e) {
    if (!Array.isArray(e)) return !1;
    const n = e.length;
    if (n !== t.length) return !1;
    for (let s = 0; s < n; s++)
        if (e[s] !== t[s]) return !1;
    return !0
}

function At(t) {
    return typeof t == "string" || Array.isArray(t)
}

function pn(t) {
    const e = [{}, {}];
    return t == null || t.values.forEach((n, s) => {
        e[0][s] = n.get(), e[1][s] = n.getVelocity()
    }), e
}

function Ee(t, e, n, s) {
    if (typeof e == "function") {
        const [i, r] = pn(s);
        e = e(n !== void 0 ? n : t.custom, i, r)
    }
    if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
        const [i, r] = pn(s);
        e = e(n !== void 0 ? n : t.custom, i, r)
    }
    return e
}

function Xt(t, e, n) {
    const s = t.getProps();
    return Ee(s, e, n !== void 0 ? n : s.custom, t)
}
const Le = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
    Fe = ["initial", ...Le],
    Dt = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
    it = new Set(Dt),
    z = t => t * 1e3,
    H = t => t / 1e3,
    so = {
        type: "spring",
        stiffness: 500,
        damping: 25,
        restSpeed: 10
    },
    io = t => ({
        type: "spring",
        stiffness: 550,
        damping: t === 0 ? 2 * Math.sqrt(550) : 30,
        restSpeed: 10
    }),
    oo = {
        type: "keyframes",
        duration: .8
    },
    ro = {
        type: "keyframes",
        ease: [.25, .1, .35, 1],
        duration: .3
    },
    ao = (t, {
        keyframes: e
    }) => e.length > 2 ? oo : it.has(t) ? t.startsWith("scale") ? io(e[1]) : so : ro;

function Be(t, e) {
    return t ? t[e] || t.default || t : void 0
}
const lo = {
        skipAnimations: !1,
        useManualTiming: !1
    },
    uo = t => t !== null;

function Yt(t, {
    repeat: e,
    repeatType: n = "loop"
}, s) {
    const i = t.filter(uo),
        r = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
    return !r || s === void 0 ? i[r] : s
}
const j = t => t;
let me = j;

function co(t) {
    let e = new Set,
        n = new Set,
        s = !1,
        i = !1;
    const r = new WeakSet;
    let o = {
        delta: 0,
        timestamp: 0,
        isProcessing: !1
    };

    function a(u) {
        r.has(u) && (l.schedule(u), t()), u(o)
    }
    const l = {
        schedule: (u, c = !1, h = !1) => {
            const d = h && s ? e : n;
            return c && r.add(u), d.has(u) || d.add(u), u
        },
        cancel: u => {
            n.delete(u), r.delete(u)
        },
        process: u => {
            if (o = u, s) {
                i = !0;
                return
            }
            s = !0, [e, n] = [n, e], e.forEach(a), e.clear(), s = !1, i && (i = !1, l.process(u))
        }
    };
    return l
}
const Ft = ["read", "resolveKeyframes", "update", "preRender", "render", "postRender"],
    ho = 40;

function Rs(t, e) {
    let n = !1,
        s = !0;
    const i = {
            delta: 0,
            timestamp: 0,
            isProcessing: !1
        },
        r = () => n = !0,
        o = Ft.reduce((m, y) => (m[y] = co(r), m), {}),
        {
            read: a,
            resolveKeyframes: l,
            update: u,
            preRender: c,
            render: h,
            postRender: f
        } = o,
        d = () => {
            const m = performance.now();
            n = !1, i.delta = s ? 1e3 / 60 : Math.max(Math.min(m - i.timestamp, ho), 1), i.timestamp = m, i.isProcessing = !0, a.process(i), l.process(i), u.process(i), c.process(i), h.process(i), f.process(i), i.isProcessing = !1, n && e && (s = !1, t(d))
        },
        p = () => {
            n = !0, s = !0, i.isProcessing || t(d)
        };
    return {
        schedule: Ft.reduce((m, y) => {
            const v = o[y];
            return m[y] = (b, S = !1, w = !1) => (n || p(), v.schedule(b, S, w)), m
        }, {}),
        cancel: m => {
            for (let y = 0; y < Ft.length; y++) o[Ft[y]].cancel(m)
        },
        state: i,
        steps: o
    }
}
const {
    schedule: V,
    cancel: q,
    state: E,
    steps: ee
} = Rs(typeof requestAnimationFrame < "u" ? requestAnimationFrame : j, !0), Es = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, fo = 1e-7, po = 12;

function mo(t, e, n, s, i) {
    let r, o, a = 0;
    do o = e + (n - e) / 2, r = Es(o, s, i) - t, r > 0 ? n = o : e = o; while (Math.abs(r) > fo && ++a < po);
    return o
}

function Mt(t, e, n, s) {
    if (t === e && n === s) return j;
    const i = r => mo(r, 0, 1, t, n);
    return r => r === 0 || r === 1 ? r : Es(i(r), e, s)
}
const Ls = t => e => e <= .5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2,
    Fs = t => e => 1 - t(1 - e),
    Bs = Mt(.33, 1.53, .69, .99),
    ke = Fs(Bs),
    ks = Ls(ke),
    js = t => (t *= 2) < 1 ? .5 * ke(t) : .5 * (2 - Math.pow(2, -10 * (t - 1))),
    je = t => 1 - Math.sin(Math.acos(t)),
    Is = Fs(je),
    Os = Ls(je),
    Ns = t => /^0[^.\s]+$/u.test(t);

function go(t) {
    return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || Ns(t) : !0
}
const Us = t => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),
    _s = t => e => typeof e == "string" && e.startsWith(t),
    Ks = _s("--"),
    yo = _s("var(--"),
    Ie = t => yo(t) ? vo.test(t.split("/*")[0].trim()) : !1,
    vo = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
    xo = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;

function To(t) {
    const e = xo.exec(t);
    if (!e) return [, ];
    const [, n, s, i] = e;
    return [`--${n??s}`, i]
}

function Ws(t, e, n = 1) {
    const [s, i] = To(t);
    if (!s) return;
    const r = window.getComputedStyle(e).getPropertyValue(s);
    if (r) {
        const o = r.trim();
        return Us(o) ? parseFloat(o) : o
    }
    return Ie(i) ? Ws(i, e, n + 1) : i
}
const X = (t, e, n) => n > e ? e : n < t ? t : n,
    pt = {
        test: t => typeof t == "number",
        parse: parseFloat,
        transform: t => t
    },
    bt = { ...pt,
        transform: t => X(0, 1, t)
    },
    Bt = { ...pt,
        default: 1
    },
    Rt = t => ({
        test: e => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
        parse: parseFloat,
        transform: e => `${e}${t}`
    }),
    Y = Rt("deg"),
    K = Rt("%"),
    P = Rt("px"),
    Po = Rt("vh"),
    So = Rt("vw"),
    mn = { ...K,
        parse: t => K.parse(t) / 100,
        transform: t => K.transform(t * 100)
    },
    Ao = new Set(["width", "height", "top", "left", "right", "bottom", "x", "y", "translateX", "translateY"]),
    gn = t => t === pt || t === P,
    yn = (t, e) => parseFloat(t.split(", ")[e]),
    vn = (t, e) => (n, {
        transform: s
    }) => {
        if (s === "none" || !s) return 0;
        const i = s.match(/^matrix3d\((.+)\)$/u);
        if (i) return yn(i[1], e); {
            const r = s.match(/^matrix\((.+)\)$/u);
            return r ? yn(r[1], t) : 0
        }
    },
    bo = new Set(["x", "y", "z"]),
    wo = Dt.filter(t => !bo.has(t));

function Vo(t) {
    const e = [];
    return wo.forEach(n => {
        const s = t.getValue(n);
        s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0))
    }), e
}
const ht = {
    width: ({
        x: t
    }, {
        paddingLeft: e = "0",
        paddingRight: n = "0"
    }) => t.max - t.min - parseFloat(e) - parseFloat(n),
    height: ({
        y: t
    }, {
        paddingTop: e = "0",
        paddingBottom: n = "0"
    }) => t.max - t.min - parseFloat(e) - parseFloat(n),
    top: (t, {
        top: e
    }) => parseFloat(e),
    left: (t, {
        left: e
    }) => parseFloat(e),
    bottom: ({
        y: t
    }, {
        top: e
    }) => parseFloat(e) + (t.max - t.min),
    right: ({
        x: t
    }, {
        left: e
    }) => parseFloat(e) + (t.max - t.min),
    x: vn(4, 13),
    y: vn(5, 14)
};
ht.translateX = ht.x;
ht.translateY = ht.y;
const $s = t => e => e.test(t),
    Co = {
        test: t => t === "auto",
        parse: t => t
    },
    Gs = [pt, P, K, Y, So, Po, Co],
    xn = t => Gs.find($s(t)),
    st = new Set;
let ge = !1,
    ye = !1;

function zs() {
    if (ye) {
        const t = Array.from(st).filter(s => s.needsMeasurement),
            e = new Set(t.map(s => s.element)),
            n = new Map;
        e.forEach(s => {
            const i = Vo(s);
            i.length && (n.set(s, i), s.render())
        }), t.forEach(s => s.measureInitialState()), e.forEach(s => {
            s.render();
            const i = n.get(s);
            i && i.forEach(([r, o]) => {
                var a;
                (a = s.getValue(r)) === null || a === void 0 || a.set(o)
            })
        }), t.forEach(s => s.measureEndState()), t.forEach(s => {
            s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY)
        })
    }
    ye = !1, ge = !1, st.forEach(t => t.complete()), st.clear()
}

function Hs() {
    st.forEach(t => {
        t.readKeyframes(), t.needsMeasurement && (ye = !0)
    })
}

function Do() {
    Hs(), zs()
}
class Oe {
    constructor(e, n, s, i, r, o = !1) {
        this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = r, this.isAsync = o
    }
    scheduleResolve() {
        this.isScheduled = !0, this.isAsync ? (st.add(this), ge || (ge = !0, V.read(Hs), V.resolveKeyframes(zs))) : (this.readKeyframes(), this.complete())
    }
    readKeyframes() {
        const {
            unresolvedKeyframes: e,
            name: n,
            element: s,
            motionValue: i
        } = this;
        for (let r = 0; r < e.length; r++)
            if (e[r] === null)
                if (r === 0) {
                    const o = i == null ? void 0 : i.get(),
                        a = e[e.length - 1];
                    if (o !== void 0) e[0] = o;
                    else if (s && n) {
                        const l = s.readValue(n, a);
                        l != null && (e[0] = l)
                    }
                    e[0] === void 0 && (e[0] = a), i && o === void 0 && i.set(e[0])
                } else e[r] = e[r - 1]
    }
    setFinalKeyframe() {}
    measureInitialState() {}
    renderEndStyles() {}
    measureEndState() {}
    complete() {
        this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), st.delete(this)
    }
    cancel() {
        this.isComplete || (this.isScheduled = !1, st.delete(this))
    }
    resume() {
        this.isComplete || this.scheduleResolve()
    }
}
const xt = t => Math.round(t * 1e5) / 1e5,
    Ne = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;

function Mo(t) {
    return t == null
}
const Ro = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
    Ue = (t, e) => n => !!(typeof n == "string" && Ro.test(n) && n.startsWith(t) || e && !Mo(n) && Object.prototype.hasOwnProperty.call(n, e)),
    Xs = (t, e, n) => s => {
        if (typeof s != "string") return s;
        const [i, r, o, a] = s.match(Ne);
        return {
            [t]: parseFloat(i),
            [e]: parseFloat(r),
            [n]: parseFloat(o),
            alpha: a !== void 0 ? parseFloat(a) : 1
        }
    },
    Eo = t => X(0, 255, t),
    ne = { ...pt,
        transform: t => Math.round(Eo(t))
    },
    nt = {
        test: Ue("rgb", "red"),
        parse: Xs("red", "green", "blue"),
        transform: ({
            red: t,
            green: e,
            blue: n,
            alpha: s = 1
        }) => "rgba(" + ne.transform(t) + ", " + ne.transform(e) + ", " + ne.transform(n) + ", " + xt(bt.transform(s)) + ")"
    };

function Lo(t) {
    let e = "",
        n = "",
        s = "",
        i = "";
    return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
        red: parseInt(e, 16),
        green: parseInt(n, 16),
        blue: parseInt(s, 16),
        alpha: i ? parseInt(i, 16) / 255 : 1
    }
}
const ve = {
        test: Ue("#"),
        parse: Lo,
        transform: nt.transform
    },
    rt = {
        test: Ue("hsl", "hue"),
        parse: Xs("hue", "saturation", "lightness"),
        transform: ({
            hue: t,
            saturation: e,
            lightness: n,
            alpha: s = 1
        }) => "hsla(" + Math.round(t) + ", " + K.transform(xt(e)) + ", " + K.transform(xt(n)) + ", " + xt(bt.transform(s)) + ")"
    },
    L = {
        test: t => nt.test(t) || ve.test(t) || rt.test(t),
        parse: t => nt.test(t) ? nt.parse(t) : rt.test(t) ? rt.parse(t) : ve.parse(t),
        transform: t => typeof t == "string" ? t : t.hasOwnProperty("red") ? nt.transform(t) : rt.transform(t)
    },
    Fo = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;

function Bo(t) {
    var e, n;
    return isNaN(t) && typeof t == "string" && (((e = t.match(Ne)) === null || e === void 0 ? void 0 : e.length) || 0) + (((n = t.match(Fo)) === null || n === void 0 ? void 0 : n.length) || 0) > 0
}
const Ys = "number",
    qs = "color",
    ko = "var",
    jo = "var(",
    Tn = "${}",
    Io = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;

function wt(t) {
    const e = t.toString(),
        n = [],
        s = {
            color: [],
            number: [],
            var: []
        },
        i = [];
    let r = 0;
    const a = e.replace(Io, l => (L.test(l) ? (s.color.push(r), i.push(qs), n.push(L.parse(l))) : l.startsWith(jo) ? (s.var.push(r), i.push(ko), n.push(l)) : (s.number.push(r), i.push(Ys), n.push(parseFloat(l))), ++r, Tn)).split(Tn);
    return {
        values: n,
        split: a,
        indexes: s,
        types: i
    }
}

function Zs(t) {
    return wt(t).values
}

function Js(t) {
    const {
        split: e,
        types: n
    } = wt(t), s = e.length;
    return i => {
        let r = "";
        for (let o = 0; o < s; o++)
            if (r += e[o], i[o] !== void 0) {
                const a = n[o];
                a === Ys ? r += xt(i[o]) : a === qs ? r += L.transform(i[o]) : r += i[o]
            }
        return r
    }
}
const Oo = t => typeof t == "number" ? 0 : t;

function No(t) {
    const e = Zs(t);
    return Js(t)(e.map(Oo))
}
const Z = {
        test: Bo,
        parse: Zs,
        createTransformer: Js,
        getAnimatableNone: No
    },
    Uo = new Set(["brightness", "contrast", "saturate", "opacity"]);

function _o(t) {
    const [e, n] = t.slice(0, -1).split("(");
    if (e === "drop-shadow") return t;
    const [s] = n.match(Ne) || [];
    if (!s) return t;
    const i = n.replace(s, "");
    let r = Uo.has(e) ? 1 : 0;
    return s !== n && (r *= 100), e + "(" + r + i + ")"
}
const Ko = /\b([a-z-]*)\(.*?\)/gu,
    xe = { ...Z,
        getAnimatableNone: t => {
            const e = t.match(Ko);
            return e ? e.map(_o).join(" ") : t
        }
    },
    Wo = {
        borderWidth: P,
        borderTopWidth: P,
        borderRightWidth: P,
        borderBottomWidth: P,
        borderLeftWidth: P,
        borderRadius: P,
        radius: P,
        borderTopLeftRadius: P,
        borderTopRightRadius: P,
        borderBottomRightRadius: P,
        borderBottomLeftRadius: P,
        width: P,
        maxWidth: P,
        height: P,
        maxHeight: P,
        top: P,
        right: P,
        bottom: P,
        left: P,
        padding: P,
        paddingTop: P,
        paddingRight: P,
        paddingBottom: P,
        paddingLeft: P,
        margin: P,
        marginTop: P,
        marginRight: P,
        marginBottom: P,
        marginLeft: P,
        backgroundPositionX: P,
        backgroundPositionY: P
    },
    $o = {
        rotate: Y,
        rotateX: Y,
        rotateY: Y,
        rotateZ: Y,
        scale: Bt,
        scaleX: Bt,
        scaleY: Bt,
        scaleZ: Bt,
        skew: Y,
        skewX: Y,
        skewY: Y,
        distance: P,
        translateX: P,
        translateY: P,
        translateZ: P,
        x: P,
        y: P,
        z: P,
        perspective: P,
        transformPerspective: P,
        opacity: bt,
        originX: mn,
        originY: mn,
        originZ: P
    },
    Pn = { ...pt,
        transform: Math.round
    },
    _e = { ...Wo,
        ...$o,
        zIndex: Pn,
        size: P,
        fillOpacity: bt,
        strokeOpacity: bt,
        numOctaves: Pn
    },
    Go = { ..._e,
        color: L,
        backgroundColor: L,
        outlineColor: L,
        fill: L,
        stroke: L,
        borderColor: L,
        borderTopColor: L,
        borderRightColor: L,
        borderBottomColor: L,
        borderLeftColor: L,
        filter: xe,
        WebkitFilter: xe
    },
    Ke = t => Go[t];

function Qs(t, e) {
    let n = Ke(t);
    return n !== xe && (n = Z), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0
}
const zo = new Set(["auto", "none", "0"]);

function Ho(t, e, n) {
    let s = 0,
        i;
    for (; s < t.length && !i;) {
        const r = t[s];
        typeof r == "string" && !zo.has(r) && wt(r).values.length && (i = t[s]), s++
    }
    if (i && n)
        for (const r of e) t[r] = Qs(n, i)
}
class ti extends Oe {
    constructor(e, n, s, i, r) {
        super(e, n, s, i, r, !0)
    }
    readKeyframes() {
        const {
            unresolvedKeyframes: e,
            element: n,
            name: s
        } = this;
        if (!n || !n.current) return;
        super.readKeyframes();
        for (let l = 0; l < e.length; l++) {
            let u = e[l];
            if (typeof u == "string" && (u = u.trim(), Ie(u))) {
                const c = Ws(u, n.current);
                c !== void 0 && (e[l] = c), l === e.length - 1 && (this.finalKeyframe = u)
            }
        }
        if (this.resolveNoneKeyframes(), !Ao.has(s) || e.length !== 2) return;
        const [i, r] = e, o = xn(i), a = xn(r);
        if (o !== a)
            if (gn(o) && gn(a))
                for (let l = 0; l < e.length; l++) {
                    const u = e[l];
                    typeof u == "string" && (e[l] = parseFloat(u))
                } else this.needsMeasurement = !0
    }
    resolveNoneKeyframes() {
        const {
            unresolvedKeyframes: e,
            name: n
        } = this, s = [];
        for (let i = 0; i < e.length; i++) go(e[i]) && s.push(i);
        s.length && Ho(e, s, n)
    }
    measureInitialState() {
        const {
            element: e,
            unresolvedKeyframes: n,
            name: s
        } = this;
        if (!e || !e.current) return;
        s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = ht[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
        const i = n[n.length - 1];
        i !== void 0 && e.getValue(s, i).jump(i, !1)
    }
    measureEndState() {
        var e;
        const {
            element: n,
            name: s,
            unresolvedKeyframes: i
        } = this;
        if (!n || !n.current) return;
        const r = n.getValue(s);
        r && r.jump(this.measuredOrigin, !1);
        const o = i.length - 1,
            a = i[o];
        i[o] = ht[s](n.measureViewportBox(), window.getComputedStyle(n.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), !((e = this.removedTransforms) === null || e === void 0) && e.length && this.removedTransforms.forEach(([l, u]) => {
            n.getValue(l).set(u)
        }), this.resolveNoneKeyframes()
    }
}

function We(t) {
    return typeof t == "function"
}
let It;

function Xo() {
    It = void 0
}
const W = {
        now: () => (It === void 0 && W.set(E.isProcessing || lo.useManualTiming ? E.timestamp : performance.now()), It),
        set: t => {
            It = t, queueMicrotask(Xo)
        }
    },
    Sn = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && (Z.test(t) || t === "0") && !t.startsWith("url("));

function Yo(t) {
    const e = t[0];
    if (t.length === 1) return !0;
    for (let n = 0; n < t.length; n++)
        if (t[n] !== e) return !0
}

function qo(t, e, n, s) {
    const i = t[0];
    if (i === null) return !1;
    if (e === "display" || e === "visibility") return !0;
    const r = t[t.length - 1],
        o = Sn(i, e),
        a = Sn(r, e);
    return !o || !a ? !1 : Yo(t) || (n === "spring" || We(n)) && s
}
const Zo = 40;
class ei {
    constructor({
        autoplay: e = !0,
        delay: n = 0,
        type: s = "keyframes",
        repeat: i = 0,
        repeatDelay: r = 0,
        repeatType: o = "loop",
        ...a
    }) {
        this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = W.now(), this.options = {
            autoplay: e,
            delay: n,
            type: s,
            repeat: i,
            repeatDelay: r,
            repeatType: o,
            ...a
        }, this.updateFinishedPromise()
    }
    calcStartTime() {
        return this.resolvedAt ? this.resolvedAt - this.createdAt > Zo ? this.resolvedAt : this.createdAt : this.createdAt
    }
    get resolved() {
        return !this._resolved && !this.hasAttemptedResolve && Do(), this._resolved
    }
    onKeyframesResolved(e, n) {
        this.resolvedAt = W.now(), this.hasAttemptedResolve = !0;
        const {
            name: s,
            type: i,
            velocity: r,
            delay: o,
            onComplete: a,
            onUpdate: l,
            isGenerator: u
        } = this.options;
        if (!u && !qo(e, s, i, r))
            if (o) this.options.duration = 0;
            else {
                l == null || l(Yt(e, this.options, n)), a == null || a(), this.resolveFinishedPromise();
                return
            }
        const c = this.initPlayback(e, n);
        c !== !1 && (this._resolved = {
            keyframes: e,
            finalKeyframe: n,
            ...c
        }, this.onPostResolved())
    }
    onPostResolved() {}
    then(e, n) {
        return this.currentFinishedPromise.then(e, n)
    }
    flatten() {
        this.options.type = "keyframes", this.options.ease = "linear"
    }
    updateFinishedPromise() {
        this.currentFinishedPromise = new Promise(e => {
            this.resolveFinishedPromise = e
        })
    }
}
const ft = (t, e, n) => {
        const s = e - t;
        return s === 0 ? 1 : (n - t) / s
    },
    ni = (t, e, n = 10) => {
        let s = "";
        const i = Math.max(Math.round(e / n), 2);
        for (let r = 0; r < i; r++) s += t(ft(0, i - 1, r)) + ", ";
        return `linear(${s.substring(0,s.length-2)})`
    };

function si(t, e) {
    return e ? t * (1e3 / e) : 0
}
const Jo = 5;

function ii(t, e, n) {
    const s = Math.max(e - Jo, 0);
    return si(n - t(s), e - s)
}
const D = {
        stiffness: 100,
        damping: 10,
        mass: 1,
        velocity: 0,
        duration: 800,
        bounce: .3,
        visualDuration: .3,
        restSpeed: {
            granular: .01,
            default: 2
        },
        restDelta: {
            granular: .005,
            default: .5
        },
        minDuration: .01,
        maxDuration: 10,
        minDamping: .05,
        maxDamping: 1
    },
    se = .001;

function Qo({
    duration: t = D.duration,
    bounce: e = D.bounce,
    velocity: n = D.velocity,
    mass: s = D.mass
}) {
    let i, r, o = 1 - e;
    o = X(D.minDamping, D.maxDamping, o), t = X(D.minDuration, D.maxDuration, H(t)), o < 1 ? (i = u => {
        const c = u * o,
            h = c * t,
            f = c - n,
            d = Te(u, o),
            p = Math.exp(-h);
        return se - f / d * p
    }, r = u => {
        const h = u * o * t,
            f = h * n + n,
            d = Math.pow(o, 2) * Math.pow(u, 2) * t,
            p = Math.exp(-h),
            g = Te(Math.pow(u, 2), o);
        return (-i(u) + se > 0 ? -1 : 1) * ((f - d) * p) / g
    }) : (i = u => {
        const c = Math.exp(-u * t),
            h = (u - n) * t + 1;
        return -se + c * h
    }, r = u => {
        const c = Math.exp(-u * t),
            h = (n - u) * (t * t);
        return c * h
    });
    const a = 5 / t,
        l = er(i, r, a);
    if (t = z(t), isNaN(l)) return {
        stiffness: D.stiffness,
        damping: D.damping,
        duration: t
    }; {
        const u = Math.pow(l, 2) * s;
        return {
            stiffness: u,
            damping: o * 2 * Math.sqrt(s * u),
            duration: t
        }
    }
}
const tr = 12;

function er(t, e, n) {
    let s = n;
    for (let i = 1; i < tr; i++) s = s - t(s) / e(s);
    return s
}

function Te(t, e) {
    return t * Math.sqrt(1 - e * e)
}
const Pe = 2e4;

function oi(t) {
    let e = 0;
    const n = 50;
    let s = t.next(e);
    for (; !s.done && e < Pe;) e += n, s = t.next(e);
    return e >= Pe ? 1 / 0 : e
}
const nr = ["duration", "bounce"],
    sr = ["stiffness", "damping", "mass"];

function An(t, e) {
    return e.some(n => t[n] !== void 0)
}

function ir(t) {
    let e = {
        velocity: D.velocity,
        stiffness: D.stiffness,
        damping: D.damping,
        mass: D.mass,
        isResolvedFromDuration: !1,
        ...t
    };
    if (!An(t, sr) && An(t, nr))
        if (t.visualDuration) {
            const n = t.visualDuration,
                s = 2 * Math.PI / (n * 1.2),
                i = s * s,
                r = 2 * X(.05, 1, 1 - t.bounce) * Math.sqrt(i);
            e = { ...e,
                mass: D.mass,
                stiffness: i,
                damping: r
            }
        } else {
            const n = Qo(t);
            e = { ...e,
                ...n,
                mass: D.mass
            }, e.isResolvedFromDuration = !0
        }
    return e
}

function ri(t = D.visualDuration, e = D.bounce) {
    const n = typeof t != "object" ? {
        visualDuration: t,
        keyframes: [0, 1],
        bounce: e
    } : t;
    let {
        restSpeed: s,
        restDelta: i
    } = n;
    const r = n.keyframes[0],
        o = n.keyframes[n.keyframes.length - 1],
        a = {
            done: !1,
            value: r
        },
        {
            stiffness: l,
            damping: u,
            mass: c,
            duration: h,
            velocity: f,
            isResolvedFromDuration: d
        } = ir({ ...n,
            velocity: -H(n.velocity || 0)
        }),
        p = f || 0,
        g = u / (2 * Math.sqrt(l * c)),
        x = o - r,
        m = H(Math.sqrt(l / c)),
        y = Math.abs(x) < 5;
    s || (s = y ? D.restSpeed.granular : D.restSpeed.default), i || (i = y ? D.restDelta.granular : D.restDelta.default);
    let v;
    if (g < 1) {
        const S = Te(m, g);
        v = w => {
            const R = Math.exp(-g * m * w);
            return o - R * ((p + g * m * x) / S * Math.sin(S * w) + x * Math.cos(S * w))
        }
    } else if (g === 1) v = S => o - Math.exp(-m * S) * (x + (p + m * x) * S);
    else {
        const S = m * Math.sqrt(g * g - 1);
        v = w => {
            const R = Math.exp(-g * m * w),
                A = Math.min(S * w, 300);
            return o - R * ((p + g * m * x) * Math.sinh(A) + S * x * Math.cosh(A)) / S
        }
    }
    const b = {
        calculatedDuration: d && h || null,
        next: S => {
            const w = v(S);
            if (d) a.done = S >= h;
            else {
                let R = 0;
                g < 1 && (R = S === 0 ? z(p) : ii(v, S, w));
                const A = Math.abs(R) <= s,
                    k = Math.abs(o - w) <= i;
                a.done = A && k
            }
            return a.value = a.done ? o : w, a
        },
        toString: () => {
            const S = Math.min(oi(b), Pe),
                w = ni(R => b.next(S * R).value, S, 30);
            return S + "ms " + w
        }
    };
    return b
}

function bn({
    keyframes: t,
    velocity: e = 0,
    power: n = .8,
    timeConstant: s = 325,
    bounceDamping: i = 10,
    bounceStiffness: r = 500,
    modifyTarget: o,
    min: a,
    max: l,
    restDelta: u = .5,
    restSpeed: c
}) {
    const h = t[0],
        f = {
            done: !1,
            value: h
        },
        d = A => a !== void 0 && A < a || l !== void 0 && A > l,
        p = A => a === void 0 ? l : l === void 0 || Math.abs(a - A) < Math.abs(l - A) ? a : l;
    let g = n * e;
    const x = h + g,
        m = o === void 0 ? x : o(x);
    m !== x && (g = m - h);
    const y = A => -g * Math.exp(-A / s),
        v = A => m + y(A),
        b = A => {
            const k = y(A),
                O = v(A);
            f.done = Math.abs(k) <= u, f.value = f.done ? m : O
        };
    let S, w;
    const R = A => {
        d(f.value) && (S = A, w = ri({
            keyframes: [f.value, p(f.value)],
            velocity: ii(v, A, f.value),
            damping: i,
            stiffness: r,
            restDelta: u,
            restSpeed: c
        }))
    };
    return R(0), {
        calculatedDuration: null,
        next: A => {
            let k = !1;
            return !w && S === void 0 && (k = !0, b(A), R(A)), S !== void 0 && A >= S ? w.next(A - S) : (!k && b(A), f)
        }
    }
}
const or = Mt(.42, 0, 1, 1),
    rr = Mt(0, 0, .58, 1),
    ai = Mt(.42, 0, .58, 1),
    ar = t => Array.isArray(t) && typeof t[0] != "number",
    $e = t => Array.isArray(t) && typeof t[0] == "number",
    wn = {
        linear: j,
        easeIn: or,
        easeInOut: ai,
        easeOut: rr,
        circIn: je,
        circInOut: Os,
        circOut: Is,
        backIn: ke,
        backInOut: ks,
        backOut: Bs,
        anticipate: js
    },
    Vn = t => {
        if ($e(t)) {
            me(t.length === 4);
            const [e, n, s, i] = t;
            return Mt(e, n, s, i)
        } else if (typeof t == "string") return me(wn[t] !== void 0), wn[t];
        return t
    },
    lr = (t, e) => n => e(t(n)),
    Et = (...t) => t.reduce(lr),
    C = (t, e, n) => t + (e - t) * n;

function ie(t, e, n) {
    return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t
}

function ur({
    hue: t,
    saturation: e,
    lightness: n,
    alpha: s
}) {
    t /= 360, e /= 100, n /= 100;
    let i = 0,
        r = 0,
        o = 0;
    if (!e) i = r = o = n;
    else {
        const a = n < .5 ? n * (1 + e) : n + e - n * e,
            l = 2 * n - a;
        i = ie(l, a, t + 1 / 3), r = ie(l, a, t), o = ie(l, a, t - 1 / 3)
    }
    return {
        red: Math.round(i * 255),
        green: Math.round(r * 255),
        blue: Math.round(o * 255),
        alpha: s
    }
}

function Ut(t, e) {
    return n => n > 0 ? e : t
}
const oe = (t, e, n) => {
        const s = t * t,
            i = n * (e * e - s) + s;
        return i < 0 ? 0 : Math.sqrt(i)
    },
    cr = [ve, nt, rt],
    hr = t => cr.find(e => e.test(t));

function Cn(t) {
    const e = hr(t);
    if (!e) return !1;
    let n = e.parse(t);
    return e === rt && (n = ur(n)), n
}
const Dn = (t, e) => {
        const n = Cn(t),
            s = Cn(e);
        if (!n || !s) return Ut(t, e);
        const i = { ...n
        };
        return r => (i.red = oe(n.red, s.red, r), i.green = oe(n.green, s.green, r), i.blue = oe(n.blue, s.blue, r), i.alpha = C(n.alpha, s.alpha, r), nt.transform(i))
    },
    Se = new Set(["none", "hidden"]);

function fr(t, e) {
    return Se.has(t) ? n => n <= 0 ? t : e : n => n >= 1 ? e : t
}

function dr(t, e) {
    return n => C(t, e, n)
}

function Ge(t) {
    return typeof t == "number" ? dr : typeof t == "string" ? Ie(t) ? Ut : L.test(t) ? Dn : gr : Array.isArray(t) ? li : typeof t == "object" ? L.test(t) ? Dn : pr : Ut
}

function li(t, e) {
    const n = [...t],
        s = n.length,
        i = t.map((r, o) => Ge(r)(r, e[o]));
    return r => {
        for (let o = 0; o < s; o++) n[o] = i[o](r);
        return n
    }
}

function pr(t, e) {
    const n = { ...t,
            ...e
        },
        s = {};
    for (const i in n) t[i] !== void 0 && e[i] !== void 0 && (s[i] = Ge(t[i])(t[i], e[i]));
    return i => {
        for (const r in s) n[r] = s[r](i);
        return n
    }
}

function mr(t, e) {
    var n;
    const s = [],
        i = {
            color: 0,
            var: 0,
            number: 0
        };
    for (let r = 0; r < e.values.length; r++) {
        const o = e.types[r],
            a = t.indexes[o][i[o]],
            l = (n = t.values[a]) !== null && n !== void 0 ? n : 0;
        s[r] = l, i[o]++
    }
    return s
}
const gr = (t, e) => {
    const n = Z.createTransformer(e),
        s = wt(t),
        i = wt(e);
    return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Se.has(t) && !i.values.length || Se.has(e) && !s.values.length ? fr(t, e) : Et(li(mr(s, i), i.values), n) : Ut(t, e)
};

function ui(t, e, n) {
    return typeof t == "number" && typeof e == "number" && typeof n == "number" ? C(t, e, n) : Ge(t)(t, e)
}

function yr(t, e, n) {
    const s = [],
        i = n || ui,
        r = t.length - 1;
    for (let o = 0; o < r; o++) {
        let a = i(t[o], t[o + 1]);
        if (e) {
            const l = Array.isArray(e) ? e[o] || j : e;
            a = Et(l, a)
        }
        s.push(a)
    }
    return s
}

function vr(t, e, {
    clamp: n = !0,
    ease: s,
    mixer: i
} = {}) {
    const r = t.length;
    if (me(r === e.length), r === 1) return () => e[0];
    if (r === 2 && t[0] === t[1]) return () => e[1];
    t[0] > t[r - 1] && (t = [...t].reverse(), e = [...e].reverse());
    const o = yr(e, s, i),
        a = o.length,
        l = u => {
            let c = 0;
            if (a > 1)
                for (; c < t.length - 2 && !(u < t[c + 1]); c++);
            const h = ft(t[c], t[c + 1], u);
            return o[c](h)
        };
    return n ? u => l(X(t[0], t[r - 1], u)) : l
}

function xr(t, e) {
    const n = t[t.length - 1];
    for (let s = 1; s <= e; s++) {
        const i = ft(0, e, s);
        t.push(C(n, 1, i))
    }
}

function Tr(t) {
    const e = [0];
    return xr(e, t.length - 1), e
}

function Pr(t, e) {
    return t.map(n => n * e)
}

function Sr(t, e) {
    return t.map(() => e || ai).splice(0, t.length - 1)
}

function _t({
    duration: t = 300,
    keyframes: e,
    times: n,
    ease: s = "easeInOut"
}) {
    const i = ar(s) ? s.map(Vn) : Vn(s),
        r = {
            done: !1,
            value: e[0]
        },
        o = Pr(n && n.length === e.length ? n : Tr(e), t),
        a = vr(o, e, {
            ease: Array.isArray(i) ? i : Sr(e, i)
        });
    return {
        calculatedDuration: t,
        next: l => (r.value = a(l), r.done = l >= t, r)
    }
}
const Ar = t => {
        const e = ({
            timestamp: n
        }) => t(n);
        return {
            start: () => V.update(e, !0),
            stop: () => q(e),
            now: () => E.isProcessing ? E.timestamp : W.now()
        }
    },
    br = {
        decay: bn,
        inertia: bn,
        tween: _t,
        keyframes: _t,
        spring: ri
    },
    wr = t => t / 100;
class ze extends ei {
    constructor(e) {
        super(e), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
            if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle") return;
            this.teardown();
            const {
                onStop: l
            } = this.options;
            l && l()
        };
        const {
            name: n,
            motionValue: s,
            element: i,
            keyframes: r
        } = this.options, o = (i == null ? void 0 : i.KeyframeResolver) || Oe, a = (l, u) => this.onKeyframesResolved(l, u);
        this.resolver = new o(r, a, n, s, i), this.resolver.scheduleResolve()
    }
    flatten() {
        super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes))
    }
    initPlayback(e) {
        const {
            type: n = "keyframes",
            repeat: s = 0,
            repeatDelay: i = 0,
            repeatType: r,
            velocity: o = 0
        } = this.options, a = We(n) ? n : br[n] || _t;
        let l, u;
        a !== _t && typeof e[0] != "number" && (l = Et(wr, ui(e[0], e[1])), e = [0, 100]);
        const c = a({ ...this.options,
            keyframes: e
        });
        r === "mirror" && (u = a({ ...this.options,
            keyframes: [...e].reverse(),
            velocity: -o
        })), c.calculatedDuration === null && (c.calculatedDuration = oi(c));
        const {
            calculatedDuration: h
        } = c, f = h + i, d = f * (s + 1) - i;
        return {
            generator: c,
            mirroredGenerator: u,
            mapPercentToKeyframes: l,
            calculatedDuration: h,
            resolvedDuration: f,
            totalDuration: d
        }
    }
    onPostResolved() {
        const {
            autoplay: e = !0
        } = this.options;
        this.play(), this.pendingPlayState === "paused" || !e ? this.pause() : this.state = this.pendingPlayState
    }
    tick(e, n = !1) {
        const {
            resolved: s
        } = this;
        if (!s) {
            const {
                keyframes: A
            } = this.options;
            return {
                done: !0,
                value: A[A.length - 1]
            }
        }
        const {
            finalKeyframe: i,
            generator: r,
            mirroredGenerator: o,
            mapPercentToKeyframes: a,
            keyframes: l,
            calculatedDuration: u,
            totalDuration: c,
            resolvedDuration: h
        } = s;
        if (this.startTime === null) return r.next(0);
        const {
            delay: f,
            repeat: d,
            repeatType: p,
            repeatDelay: g,
            onUpdate: x
        } = this.options;
        this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - c / this.speed, this.startTime)), n ? this.currentTime = e : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(e - this.startTime) * this.speed;
        const m = this.currentTime - f * (this.speed >= 0 ? 1 : -1),
            y = this.speed >= 0 ? m < 0 : m > c;
        this.currentTime = Math.max(m, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
        let v = this.currentTime,
            b = r;
        if (d) {
            const A = Math.min(this.currentTime, c) / h;
            let k = Math.floor(A),
                O = A % 1;
            !O && A >= 1 && (O = 1), O === 1 && k--, k = Math.min(k, d + 1), !!(k % 2) && (p === "reverse" ? (O = 1 - O, g && (O -= g / h)) : p === "mirror" && (b = o)), v = X(0, 1, O) * h
        }
        const S = y ? {
            done: !1,
            value: l[0]
        } : b.next(v);
        a && (S.value = a(S.value));
        let {
            done: w
        } = S;
        !y && u !== null && (w = this.speed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
        const R = this.holdTime === null && (this.state === "finished" || this.state === "running" && w);
        return R && i !== void 0 && (S.value = Yt(l, this.options, i)), x && x(S.value), R && this.finish(), S
    }
    get duration() {
        const {
            resolved: e
        } = this;
        return e ? H(e.calculatedDuration) : 0
    }
    get time() {
        return H(this.currentTime)
    }
    set time(e) {
        e = z(e), this.currentTime = e, this.holdTime !== null || this.speed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.speed)
    }
    get speed() {
        return this.playbackSpeed
    }
    set speed(e) {
        const n = this.playbackSpeed !== e;
        this.playbackSpeed = e, n && (this.time = H(this.currentTime))
    }
    play() {
        if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
            this.pendingPlayState = "running";
            return
        }
        if (this.isStopped) return;
        const {
            driver: e = Ar,
            onPlay: n,
            startTime: s
        } = this.options;
        this.driver || (this.driver = e(r => this.tick(r))), n && n();
        const i = this.driver.now();
        this.holdTime !== null ? this.startTime = i - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = i) : this.startTime = s ? ? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start()
    }
    pause() {
        var e;
        if (!this._resolved) {
            this.pendingPlayState = "paused";
            return
        }
        this.state = "paused", this.holdTime = (e = this.currentTime) !== null && e !== void 0 ? e : 0
    }
    complete() {
        this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null
    }
    finish() {
        this.teardown(), this.state = "finished";
        const {
            onComplete: e
        } = this.options;
        e && e()
    }
    cancel() {
        this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise()
    }
    teardown() {
        this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel()
    }
    stopDriver() {
        this.driver && (this.driver.stop(), this.driver = void 0)
    }
    sample(e) {
        return this.startTime = 0, this.tick(e, !0)
    }
}
const Vr = new Set(["opacity", "clipPath", "filter", "transform"]);

function He(t) {
    let e;
    return () => (e === void 0 && (e = t()), e)
}
const Cr = {
    linearEasing: void 0
};

function Dr(t, e) {
    const n = He(t);
    return () => {
        var s;
        return (s = Cr[e]) !== null && s !== void 0 ? s : n()
    }
}
const Kt = Dr(() => {
    try {
        document.createElement("div").animate({
            opacity: 0
        }, {
            easing: "linear(0, 1)"
        })
    } catch {
        return !1
    }
    return !0
}, "linearEasing");

function ci(t) {
    return !!(typeof t == "function" && Kt() || !t || typeof t == "string" && (t in Ae || Kt()) || $e(t) || Array.isArray(t) && t.every(ci))
}
const gt = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`,
    Ae = {
        linear: "linear",
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
        circIn: gt([0, .65, .55, 1]),
        circOut: gt([.55, 0, 1, .45]),
        backIn: gt([.31, .01, .66, -.59]),
        backOut: gt([.33, 1.53, .69, .99])
    };

function hi(t, e) {
    if (t) return typeof t == "function" && Kt() ? ni(t, e) : $e(t) ? gt(t) : Array.isArray(t) ? t.map(n => hi(n, e) || Ae.easeOut) : Ae[t]
}

function Mr(t, e, n, {
    delay: s = 0,
    duration: i = 300,
    repeat: r = 0,
    repeatType: o = "loop",
    ease: a = "easeInOut",
    times: l
} = {}) {
    const u = {
        [e]: n
    };
    l && (u.offset = l);
    const c = hi(a, i);
    return Array.isArray(c) && (u.easing = c), t.animate(u, {
        delay: s,
        duration: i,
        easing: Array.isArray(c) ? "linear" : c,
        fill: "both",
        iterations: r + 1,
        direction: o === "reverse" ? "alternate" : "normal"
    })
}

function Mn(t, e) {
    t.timeline = e, t.onfinish = null
}
const Rr = He(() => Object.hasOwnProperty.call(Element.prototype, "animate")),
    Wt = 10,
    Er = 2e4;

function Lr(t) {
    return We(t.type) || t.type === "spring" || !ci(t.ease)
}

function Fr(t, e) {
    const n = new ze({ ...e,
        keyframes: t,
        repeat: 0,
        delay: 0,
        isGenerator: !0
    });
    let s = {
        done: !1,
        value: t[0]
    };
    const i = [];
    let r = 0;
    for (; !s.done && r < Er;) s = n.sample(r), i.push(s.value), r += Wt;
    return {
        times: void 0,
        keyframes: i,
        duration: r - Wt,
        ease: "linear"
    }
}
const fi = {
    anticipate: js,
    backInOut: ks,
    circInOut: Os
};

function Br(t) {
    return t in fi
}
class Rn extends ei {
    constructor(e) {
        super(e);
        const {
            name: n,
            motionValue: s,
            element: i,
            keyframes: r
        } = this.options;
        this.resolver = new ti(r, (o, a) => this.onKeyframesResolved(o, a), n, s, i), this.resolver.scheduleResolve()
    }
    initPlayback(e, n) {
        var s;
        let {
            duration: i = 300,
            times: r,
            ease: o,
            type: a,
            motionValue: l,
            name: u,
            startTime: c
        } = this.options;
        if (!(!((s = l.owner) === null || s === void 0) && s.current)) return !1;
        if (typeof o == "string" && Kt() && Br(o) && (o = fi[o]), Lr(this.options)) {
            const {
                onComplete: f,
                onUpdate: d,
                motionValue: p,
                element: g,
                ...x
            } = this.options, m = Fr(e, x);
            e = m.keyframes, e.length === 1 && (e[1] = e[0]), i = m.duration, r = m.times, o = m.ease, a = "keyframes"
        }
        const h = Mr(l.owner.current, u, e, { ...this.options,
            duration: i,
            times: r,
            ease: o
        });
        return h.startTime = c ? ? this.calcStartTime(), this.pendingTimeline ? (Mn(h, this.pendingTimeline), this.pendingTimeline = void 0) : h.onfinish = () => {
            const {
                onComplete: f
            } = this.options;
            l.set(Yt(e, this.options, n)), f && f(), this.cancel(), this.resolveFinishedPromise()
        }, {
            animation: h,
            duration: i,
            times: r,
            type: a,
            ease: o,
            keyframes: e
        }
    }
    get duration() {
        const {
            resolved: e
        } = this;
        if (!e) return 0;
        const {
            duration: n
        } = e;
        return H(n)
    }
    get time() {
        const {
            resolved: e
        } = this;
        if (!e) return 0;
        const {
            animation: n
        } = e;
        return H(n.currentTime || 0)
    }
    set time(e) {
        const {
            resolved: n
        } = this;
        if (!n) return;
        const {
            animation: s
        } = n;
        s.currentTime = z(e)
    }
    get speed() {
        const {
            resolved: e
        } = this;
        if (!e) return 1;
        const {
            animation: n
        } = e;
        return n.playbackRate
    }
    set speed(e) {
        const {
            resolved: n
        } = this;
        if (!n) return;
        const {
            animation: s
        } = n;
        s.playbackRate = e
    }
    get state() {
        const {
            resolved: e
        } = this;
        if (!e) return "idle";
        const {
            animation: n
        } = e;
        return n.playState
    }
    get startTime() {
        const {
            resolved: e
        } = this;
        if (!e) return null;
        const {
            animation: n
        } = e;
        return n.startTime
    }
    attachTimeline(e) {
        if (!this._resolved) this.pendingTimeline = e;
        else {
            const {
                resolved: n
            } = this;
            if (!n) return j;
            const {
                animation: s
            } = n;
            Mn(s, e)
        }
        return j
    }
    play() {
        if (this.isStopped) return;
        const {
            resolved: e
        } = this;
        if (!e) return;
        const {
            animation: n
        } = e;
        n.playState === "finished" && this.updateFinishedPromise(), n.play()
    }
    pause() {
        const {
            resolved: e
        } = this;
        if (!e) return;
        const {
            animation: n
        } = e;
        n.pause()
    }
    stop() {
        if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle") return;
        this.resolveFinishedPromise(), this.updateFinishedPromise();
        const {
            resolved: e
        } = this;
        if (!e) return;
        const {
            animation: n,
            keyframes: s,
            duration: i,
            type: r,
            ease: o,
            times: a
        } = e;
        if (n.playState === "idle" || n.playState === "finished") return;
        if (this.time) {
            const {
                motionValue: u,
                onUpdate: c,
                onComplete: h,
                element: f,
                ...d
            } = this.options, p = new ze({ ...d,
                keyframes: s,
                duration: i,
                type: r,
                ease: o,
                times: a,
                isGenerator: !0
            }), g = z(this.time);
            u.setWithVelocity(p.sample(g - Wt).value, p.sample(g).value, Wt)
        }
        const {
            onStop: l
        } = this.options;
        l && l(), this.cancel()
    }
    complete() {
        const {
            resolved: e
        } = this;
        e && e.animation.finish()
    }
    cancel() {
        const {
            resolved: e
        } = this;
        e && e.animation.cancel()
    }
    static supports(e) {
        const {
            motionValue: n,
            name: s,
            repeatDelay: i,
            repeatType: r,
            damping: o,
            type: a
        } = e;
        return Rr() && s && Vr.has(s) && n && n.owner && n.owner.current instanceof HTMLElement && !n.owner.getProps().onUpdate && !i && r !== "mirror" && o !== 0 && a !== "inertia"
    }
}
const kr = He(() => window.ScrollTimeline !== void 0);
class jr {
    constructor(e) {
        this.stop = () => this.runAll("stop"), this.animations = e.filter(Boolean)
    }
    then(e, n) {
        return Promise.all(this.animations).then(e).catch(n)
    }
    getAll(e) {
        return this.animations[0][e]
    }
    setAll(e, n) {
        for (let s = 0; s < this.animations.length; s++) this.animations[s][e] = n
    }
    attachTimeline(e, n) {
        const s = this.animations.map(i => kr() && i.attachTimeline ? i.attachTimeline(e) : n(i));
        return () => {
            s.forEach((i, r) => {
                i && i(), this.animations[r].stop()
            })
        }
    }
    get time() {
        return this.getAll("time")
    }
    set time(e) {
        this.setAll("time", e)
    }
    get speed() {
        return this.getAll("speed")
    }
    set speed(e) {
        this.setAll("speed", e)
    }
    get startTime() {
        return this.getAll("startTime")
    }
    get duration() {
        let e = 0;
        for (let n = 0; n < this.animations.length; n++) e = Math.max(e, this.animations[n].duration);
        return e
    }
    runAll(e) {
        this.animations.forEach(n => n[e]())
    }
    flatten() {
        this.runAll("flatten")
    }
    play() {
        this.runAll("play")
    }
    pause() {
        this.runAll("pause")
    }
    cancel() {
        this.runAll("cancel")
    }
    complete() {
        this.runAll("complete")
    }
}

function Ir({
    when: t,
    delay: e,
    delayChildren: n,
    staggerChildren: s,
    staggerDirection: i,
    repeat: r,
    repeatType: o,
    repeatDelay: a,
    from: l,
    elapsed: u,
    ...c
}) {
    return !!Object.keys(c).length
}
const Xe = (t, e, n, s = {}, i, r) => o => {
        const a = Be(s, t) || {},
            l = a.delay || s.delay || 0;
        let {
            elapsed: u = 0
        } = s;
        u = u - z(l);
        let c = {
            keyframes: Array.isArray(n) ? n : [null, n],
            ease: "easeOut",
            velocity: e.getVelocity(),
            ...a,
            delay: -u,
            onUpdate: f => {
                e.set(f), a.onUpdate && a.onUpdate(f)
            },
            onComplete: () => {
                o(), a.onComplete && a.onComplete()
            },
            name: t,
            motionValue: e,
            element: r ? void 0 : i
        };
        Ir(a) || (c = { ...c,
            ...ao(t, c)
        }), c.duration && (c.duration = z(c.duration)), c.repeatDelay && (c.repeatDelay = z(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
        let h = !1;
        if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (c.duration = 0, c.delay === 0 && (h = !0)), h && !r && e.get() !== void 0) {
            const f = Yt(c.keyframes, a);
            if (f !== void 0) return V.update(() => {
                c.onUpdate(f), c.onComplete()
            }), new jr([])
        }
        return !r && Rn.supports(c) ? new Rn(c) : new ze(c)
    },
    Or = t => !!(t && typeof t == "object" && t.mix && t.toValue),
    Nr = t => pe(t) ? t[t.length - 1] || 0 : t;

function Ye(t, e) {
    t.indexOf(e) === -1 && t.push(e)
}

function qe(t, e) {
    const n = t.indexOf(e);
    n > -1 && t.splice(n, 1)
}
class Ze {
    constructor() {
        this.subscriptions = []
    }
    add(e) {
        return Ye(this.subscriptions, e), () => qe(this.subscriptions, e)
    }
    notify(e, n, s) {
        const i = this.subscriptions.length;
        if (i)
            if (i === 1) this.subscriptions[0](e, n, s);
            else
                for (let r = 0; r < i; r++) {
                    const o = this.subscriptions[r];
                    o && o(e, n, s)
                }
    }
    getSize() {
        return this.subscriptions.length
    }
    clear() {
        this.subscriptions.length = 0
    }
}
const En = 30,
    Ur = t => !isNaN(parseFloat(t));
class _r {
    constructor(e, n = {}) {
        this.version = "11.15.0", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s, i = !0) => {
            const r = W.now();
            this.updatedAt !== r && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), i && this.events.renderRequest && this.events.renderRequest.notify(this.current)
        }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner
    }
    setCurrent(e) {
        this.current = e, this.updatedAt = W.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Ur(this.current))
    }
    setPrevFrameValue(e = this.current) {
        this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt
    }
    onChange(e) {
        return this.on("change", e)
    }
    on(e, n) {
        this.events[e] || (this.events[e] = new Ze);
        const s = this.events[e].add(n);
        return e === "change" ? () => {
            s(), V.read(() => {
                this.events.change.getSize() || this.stop()
            })
        } : s
    }
    clearListeners() {
        for (const e in this.events) this.events[e].clear()
    }
    attach(e, n) {
        this.passiveEffect = e, this.stopPassiveEffect = n
    }
    set(e, n = !0) {
        !n || !this.passiveEffect ? this.updateAndNotify(e, n) : this.passiveEffect(e, this.updateAndNotify)
    }
    setWithVelocity(e, n, s) {
        this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - s
    }
    jump(e, n = !0) {
        this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect()
    }
    get() {
        return this.current
    }
    getPrevious() {
        return this.prev
    }
    getVelocity() {
        const e = W.now();
        if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > En) return 0;
        const n = Math.min(this.updatedAt - this.prevUpdatedAt, En);
        return si(parseFloat(this.current) - parseFloat(this.prevFrameValue), n)
    }
    start(e) {
        return this.stop(), new Promise(n => {
            this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify()
        }).then(() => {
            this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation()
        })
    }
    stop() {
        this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation()
    }
    isAnimating() {
        return !!this.animation
    }
    clearAnimation() {
        delete this.animation
    }
    destroy() {
        this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect()
    }
}

function Vt(t, e) {
    return new _r(t, e)
}

function Kr(t, e, n) {
    t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, Vt(n))
}

function Wr(t, e) {
    const n = Xt(t, e);
    let {
        transitionEnd: s = {},
        transition: i = {},
        ...r
    } = n || {};
    r = { ...r,
        ...s
    };
    for (const o in r) {
        const a = Nr(r[o]);
        Kr(t, o, a)
    }
}
const Je = t => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(),
    $r = "framerAppearId",
    di = "data-" + Je($r);

function pi(t) {
    return t.props[di]
}
const F = t => !!(t && t.getVelocity);

function Gr(t) {
    return !!(F(t) && t.add)
}

function be(t, e) {
    const n = t.getValue("willChange");
    if (Gr(n)) return n.add(e)
}

function zr({
    protectedKeys: t,
    needsAnimating: e
}, n) {
    const s = t.hasOwnProperty(n) && e[n] !== !0;
    return e[n] = !1, s
}

function mi(t, e, {
    delay: n = 0,
    transitionOverride: s,
    type: i
} = {}) {
    var r;
    let {
        transition: o = t.getDefaultTransition(),
        transitionEnd: a,
        ...l
    } = e;
    s && (o = s);
    const u = [],
        c = i && t.animationState && t.animationState.getState()[i];
    for (const h in l) {
        const f = t.getValue(h, (r = t.latestValues[h]) !== null && r !== void 0 ? r : null),
            d = l[h];
        if (d === void 0 || c && zr(c, h)) continue;
        const p = {
            delay: n,
            ...Be(o || {}, h)
        };
        let g = !1;
        if (window.MotionHandoffAnimation) {
            const m = pi(t);
            if (m) {
                const y = window.MotionHandoffAnimation(m, h, V);
                y !== null && (p.startTime = y, g = !0)
            }
        }
        be(t, h), f.start(Xe(h, f, d, t.shouldReduceMotion && it.has(h) ? {
            type: !1
        } : p, t, g));
        const x = f.animation;
        x && u.push(x)
    }
    return a && Promise.all(u).then(() => {
        V.update(() => {
            a && Wr(t, a)
        })
    }), u
}

function we(t, e, n = {}) {
    var s;
    const i = Xt(t, e, n.type === "exit" ? (s = t.presenceContext) === null || s === void 0 ? void 0 : s.custom : void 0);
    let {
        transition: r = t.getDefaultTransition() || {}
    } = i || {};
    n.transitionOverride && (r = n.transitionOverride);
    const o = i ? () => Promise.all(mi(t, i, n)) : () => Promise.resolve(),
        a = t.variantChildren && t.variantChildren.size ? (u = 0) => {
            const {
                delayChildren: c = 0,
                staggerChildren: h,
                staggerDirection: f
            } = r;
            return Hr(t, e, c + u, h, f, n)
        } : () => Promise.resolve(),
        {
            when: l
        } = r;
    if (l) {
        const [u, c] = l === "beforeChildren" ? [o, a] : [a, o];
        return u().then(() => c())
    } else return Promise.all([o(), a(n.delay)])
}

function Hr(t, e, n = 0, s = 0, i = 1, r) {
    const o = [],
        a = (t.variantChildren.size - 1) * s,
        l = i === 1 ? (u = 0) => u * s : (u = 0) => a - u * s;
    return Array.from(t.variantChildren).sort(Xr).forEach((u, c) => {
        u.notify("AnimationStart", e), o.push(we(u, e, { ...r,
            delay: n + l(c)
        }).then(() => u.notify("AnimationComplete", e)))
    }), Promise.all(o)
}

function Xr(t, e) {
    return t.sortNodePosition(e)
}

function Yr(t, e, n = {}) {
    t.notify("AnimationStart", e);
    let s;
    if (Array.isArray(e)) {
        const i = e.map(r => we(t, r, n));
        s = Promise.all(i)
    } else if (typeof e == "string") s = we(t, e, n);
    else {
        const i = typeof e == "function" ? Xt(t, e, n.custom) : e;
        s = Promise.all(mi(t, i, n))
    }
    return s.then(() => {
        t.notify("AnimationComplete", e)
    })
}
const qr = Fe.length;

function gi(t) {
    if (!t) return;
    if (!t.isControllingVariants) {
        const n = t.parent ? gi(t.parent) || {} : {};
        return t.props.initial !== void 0 && (n.initial = t.props.initial), n
    }
    const e = {};
    for (let n = 0; n < qr; n++) {
        const s = Fe[n],
            i = t.props[s];
        (At(i) || i === !1) && (e[s] = i)
    }
    return e
}
const Zr = [...Le].reverse(),
    Jr = Le.length;

function Qr(t) {
    return e => Promise.all(e.map(({
        animation: n,
        options: s
    }) => Yr(t, n, s)))
}

function ta(t) {
    let e = Qr(t),
        n = Ln(),
        s = !0;
    const i = l => (u, c) => {
        var h;
        const f = Xt(t, c, l === "exit" ? (h = t.presenceContext) === null || h === void 0 ? void 0 : h.custom : void 0);
        if (f) {
            const {
                transition: d,
                transitionEnd: p,
                ...g
            } = f;
            u = { ...u,
                ...g,
                ...p
            }
        }
        return u
    };

    function r(l) {
        e = l(t)
    }

    function o(l) {
        const {
            props: u
        } = t, c = gi(t.parent) || {}, h = [], f = new Set;
        let d = {},
            p = 1 / 0;
        for (let x = 0; x < Jr; x++) {
            const m = Zr[x],
                y = n[m],
                v = u[m] !== void 0 ? u[m] : c[m],
                b = At(v),
                S = m === l ? y.isActive : null;
            S === !1 && (p = x);
            let w = v === c[m] && v !== u[m] && b;
            if (w && s && t.manuallyAnimateOnMount && (w = !1), y.protectedKeys = { ...d
                }, !y.isActive && S === null || !v && !y.prevProp || Ht(v) || typeof v == "boolean") continue;
            const R = ea(y.prevProp, v);
            let A = R || m === l && y.isActive && !w && b || x > p && b,
                k = !1;
            const O = Array.isArray(v) ? v : [v];
            let ot = O.reduce(i(m), {});
            S === !1 && (ot = {});
            const {
                prevResolvedValues: fn = {}
            } = y, eo = { ...fn,
                ...ot
            }, dn = B => {
                A = !0, f.has(B) && (k = !0, f.delete(B)), y.needsAnimating[B] = !0;
                const $ = t.getValue(B);
                $ && ($.liveStyle = !1)
            };
            for (const B in eo) {
                const $ = ot[B],
                    Qt = fn[B];
                if (d.hasOwnProperty(B)) continue;
                let te = !1;
                pe($) && pe(Qt) ? te = !Ms($, Qt) : te = $ !== Qt, te ? $ != null ? dn(B) : f.add(B) : $ !== void 0 && f.has(B) ? dn(B) : y.protectedKeys[B] = !0
            }
            y.prevProp = v, y.prevResolvedValues = ot, y.isActive && (d = { ...d,
                ...ot
            }), s && t.blockInitialAnimation && (A = !1), A && (!(w && R) || k) && h.push(...O.map(B => ({
                animation: B,
                options: {
                    type: m
                }
            })))
        }
        if (f.size) {
            const x = {};
            f.forEach(m => {
                const y = t.getBaseTarget(m),
                    v = t.getValue(m);
                v && (v.liveStyle = !0), x[m] = y ? ? null
            }), h.push({
                animation: x
            })
        }
        let g = !!h.length;
        return s && (u.initial === !1 || u.initial === u.animate) && !t.manuallyAnimateOnMount && (g = !1), s = !1, g ? e(h) : Promise.resolve()
    }

    function a(l, u) {
        var c;
        if (n[l].isActive === u) return Promise.resolve();
        (c = t.variantChildren) === null || c === void 0 || c.forEach(f => {
            var d;
            return (d = f.animationState) === null || d === void 0 ? void 0 : d.setActive(l, u)
        }), n[l].isActive = u;
        const h = o(l);
        for (const f in n) n[f].protectedKeys = {};
        return h
    }
    return {
        animateChanges: o,
        setActive: a,
        setAnimateFunction: r,
        getState: () => n,
        reset: () => {
            n = Ln(), s = !0
        }
    }
}

function ea(t, e) {
    return typeof e == "string" ? e !== t : Array.isArray(e) ? !Ms(e, t) : !1
}

function Q(t = !1) {
    return {
        isActive: t,
        protectedKeys: {},
        needsAnimating: {},
        prevResolvedValues: {}
    }
}

function Ln() {
    return {
        animate: Q(!0),
        whileInView: Q(),
        whileHover: Q(),
        whileTap: Q(),
        whileDrag: Q(),
        whileFocus: Q(),
        exit: Q()
    }
}
class J {
    constructor(e) {
        this.isMounted = !1, this.node = e
    }
    update() {}
}
class na extends J {
    constructor(e) {
        super(e), e.animationState || (e.animationState = ta(e))
    }
    updateAnimationControlsSubscription() {
        const {
            animate: e
        } = this.node.getProps();
        Ht(e) && (this.unmountControls = e.subscribe(this.node))
    }
    mount() {
        this.updateAnimationControlsSubscription()
    }
    update() {
        const {
            animate: e
        } = this.node.getProps(), {
            animate: n
        } = this.node.prevProps || {};
        e !== n && this.updateAnimationControlsSubscription()
    }
    unmount() {
        var e;
        this.node.animationState.reset(), (e = this.unmountControls) === null || e === void 0 || e.call(this)
    }
}
let sa = 0;
class ia extends J {
    constructor() {
        super(...arguments), this.id = sa++
    }
    update() {
        if (!this.node.presenceContext) return;
        const {
            isPresent: e,
            onExitComplete: n
        } = this.node.presenceContext, {
            isPresent: s
        } = this.node.prevPresenceContext || {};
        if (!this.node.animationState || e === s) return;
        const i = this.node.animationState.setActive("exit", !e);
        n && !e && i.then(() => n(this.id))
    }
    mount() {
        const {
            register: e
        } = this.node.presenceContext || {};
        e && (this.unmount = e(this.id))
    }
    unmount() {}
}
const oa = {
        animation: {
            Feature: na
        },
        exit: {
            Feature: ia
        }
    },
    _ = {
        x: !1,
        y: !1
    };

function yi() {
    return _.x || _.y
}

function ra(t, e, n) {
    var s;
    if (t instanceof Element) return [t];
    if (typeof t == "string") {
        let i = document;
        const r = (s = void 0) !== null && s !== void 0 ? s : i.querySelectorAll(t);
        return r ? Array.from(r) : []
    }
    return Array.from(t)
}

function vi(t, e) {
    const n = ra(t),
        s = new AbortController,
        i = {
            passive: !0,
            ...e,
            signal: s.signal
        };
    return [n, i, () => s.abort()]
}

function Fn(t) {
    return e => {
        e.pointerType === "touch" || yi() || t(e)
    }
}

function aa(t, e, n = {}) {
    const [s, i, r] = vi(t, n), o = Fn(a => {
        const {
            target: l
        } = a, u = e(a);
        if (!u || !l) return;
        const c = Fn(h => {
            u(h), l.removeEventListener("pointerleave", c)
        });
        l.addEventListener("pointerleave", c, i)
    });
    return s.forEach(a => {
        a.addEventListener("pointerenter", o, i)
    }), r
}
const Qe = t => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1,
    yt = new WeakSet;

function Bn(t) {
    return e => {
        e.key === "Enter" && t(e)
    }
}

function re(t, e) {
    t.dispatchEvent(new PointerEvent("pointer" + e, {
        isPrimary: !0,
        bubbles: !0
    }))
}
const la = (t, e) => {
        const n = t.currentTarget;
        if (!n) return;
        const s = Bn(() => {
            if (yt.has(n)) return;
            re(n, "down");
            const i = Bn(() => {
                    re(n, "up")
                }),
                r = () => re(n, "cancel");
            n.addEventListener("keyup", i, e), n.addEventListener("blur", r, e)
        });
        n.addEventListener("keydown", s, e), n.addEventListener("blur", () => n.removeEventListener("keydown", s), e)
    },
    ua = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);

function ca(t) {
    return ua.has(t.tagName) || t.tabIndex !== -1
}
const xi = (t, e) => e ? t === e ? !0 : xi(t, e.parentElement) : !1;

function kn(t) {
    return Qe(t) && !yi()
}

function ha(t, e, n = {}) {
    const [s, i, r] = vi(t, n), o = a => {
        const l = a.currentTarget;
        if (!kn(a) || yt.has(l)) return;
        yt.add(l);
        const u = e(a),
            c = (d, p) => {
                window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), !(!kn(d) || !yt.has(l)) && (yt.delete(l), u && u(d, {
                    success: p
                }))
            },
            h = d => {
                c(d, n.useGlobalTarget || xi(l, d.target))
            },
            f = d => {
                c(d, !1)
            };
        window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i)
    };
    return s.forEach(a => {
        ca(a) || (a.tabIndex = 0), (n.useGlobalTarget ? window : a).addEventListener("pointerdown", o, i), a.addEventListener("focus", u => la(u, i), i)
    }), r
}

function fa(t) {
    return t === "x" || t === "y" ? _[t] ? null : (_[t] = !0, () => {
        _[t] = !1
    }) : _.x || _.y ? null : (_.x = _.y = !0, () => {
        _.x = _.y = !1
    })
}

function Lt(t) {
    return {
        point: {
            x: t.pageX,
            y: t.pageY
        }
    }
}
const da = t => e => Qe(e) && t(e, Lt(e));

function Ct(t, e, n, s = {
    passive: !0
}) {
    return t.addEventListener(e, n, s), () => t.removeEventListener(e, n)
}

function Tt(t, e, n, s) {
    return Ct(t, e, da(n), s)
}
const jn = (t, e) => Math.abs(t - e);

function pa(t, e) {
    const n = jn(t.x, e.x),
        s = jn(t.y, e.y);
    return Math.sqrt(n ** 2 + s ** 2)
}
class Ti {
    constructor(e, n, {
        transformPagePoint: s,
        contextWindow: i,
        dragSnapToOrigin: r = !1
    } = {}) {
        if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
                if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
                const h = le(this.lastMoveEventInfo, this.history),
                    f = this.startEvent !== null,
                    d = pa(h.offset, {
                        x: 0,
                        y: 0
                    }) >= 3;
                if (!f && !d) return;
                const {
                    point: p
                } = h, {
                    timestamp: g
                } = E;
                this.history.push({ ...p,
                    timestamp: g
                });
                const {
                    onStart: x,
                    onMove: m
                } = this.handlers;
                f || (x && x(this.lastMoveEvent, h), this.startEvent = this.lastMoveEvent), m && m(this.lastMoveEvent, h)
            }, this.handlePointerMove = (h, f) => {
                this.lastMoveEvent = h, this.lastMoveEventInfo = ae(f, this.transformPagePoint), V.update(this.updatePoint, !0)
            }, this.handlePointerUp = (h, f) => {
                this.end();
                const {
                    onEnd: d,
                    onSessionEnd: p,
                    resumeAnimation: g
                } = this.handlers;
                if (this.dragSnapToOrigin && g && g(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
                const x = le(h.type === "pointercancel" ? this.lastMoveEventInfo : ae(f, this.transformPagePoint), this.history);
                this.startEvent && d && d(h, x), p && p(h, x)
            }, !Qe(e)) return;
        this.dragSnapToOrigin = r, this.handlers = n, this.transformPagePoint = s, this.contextWindow = i || window;
        const o = Lt(e),
            a = ae(o, this.transformPagePoint),
            {
                point: l
            } = a,
            {
                timestamp: u
            } = E;
        this.history = [{ ...l,
            timestamp: u
        }];
        const {
            onSessionStart: c
        } = n;
        c && c(e, le(a, this.history)), this.removeListeners = Et(Tt(this.contextWindow, "pointermove", this.handlePointerMove), Tt(this.contextWindow, "pointerup", this.handlePointerUp), Tt(this.contextWindow, "pointercancel", this.handlePointerUp))
    }
    updateHandlers(e) {
        this.handlers = e
    }
    end() {
        this.removeListeners && this.removeListeners(), q(this.updatePoint)
    }
}

function ae(t, e) {
    return e ? {
        point: e(t.point)
    } : t
}

function In(t, e) {
    return {
        x: t.x - e.x,
        y: t.y - e.y
    }
}

function le({
    point: t
}, e) {
    return {
        point: t,
        delta: In(t, Pi(e)),
        offset: In(t, ma(e)),
        velocity: ga(e, .1)
    }
}

function ma(t) {
    return t[0]
}

function Pi(t) {
    return t[t.length - 1]
}

function ga(t, e) {
    if (t.length < 2) return {
        x: 0,
        y: 0
    };
    let n = t.length - 1,
        s = null;
    const i = Pi(t);
    for (; n >= 0 && (s = t[n], !(i.timestamp - s.timestamp > z(e)));) n--;
    if (!s) return {
        x: 0,
        y: 0
    };
    const r = H(i.timestamp - s.timestamp);
    if (r === 0) return {
        x: 0,
        y: 0
    };
    const o = {
        x: (i.x - s.x) / r,
        y: (i.y - s.y) / r
    };
    return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o
}

function at(t) {
    return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current")
}
const Si = 1e-4,
    ya = 1 - Si,
    va = 1 + Si,
    Ai = .01,
    xa = 0 - Ai,
    Ta = 0 + Ai;

function I(t) {
    return t.max - t.min
}

function Pa(t, e, n) {
    return Math.abs(t - e) <= n
}

function On(t, e, n, s = .5) {
    t.origin = s, t.originPoint = C(e.min, e.max, t.origin), t.scale = I(n) / I(e), t.translate = C(n.min, n.max, t.origin) - t.originPoint, (t.scale >= ya && t.scale <= va || isNaN(t.scale)) && (t.scale = 1), (t.translate >= xa && t.translate <= Ta || isNaN(t.translate)) && (t.translate = 0)
}

function Pt(t, e, n, s) {
    On(t.x, e.x, n.x, s ? s.originX : void 0), On(t.y, e.y, n.y, s ? s.originY : void 0)
}

function Nn(t, e, n) {
    t.min = n.min + e.min, t.max = t.min + I(e)
}

function Sa(t, e, n) {
    Nn(t.x, e.x, n.x), Nn(t.y, e.y, n.y)
}

function Un(t, e, n) {
    t.min = e.min - n.min, t.max = t.min + I(e)
}

function St(t, e, n) {
    Un(t.x, e.x, n.x), Un(t.y, e.y, n.y)
}

function Aa(t, {
    min: e,
    max: n
}, s) {
    return e !== void 0 && t < e ? t = s ? C(e, t, s.min) : Math.max(t, e) : n !== void 0 && t > n && (t = s ? C(n, t, s.max) : Math.min(t, n)), t
}

function _n(t, e, n) {
    return {
        min: e !== void 0 ? t.min + e : void 0,
        max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
    }
}

function ba(t, {
    top: e,
    left: n,
    bottom: s,
    right: i
}) {
    return {
        x: _n(t.x, n, i),
        y: _n(t.y, e, s)
    }
}

function Kn(t, e) {
    let n = e.min - t.min,
        s = e.max - t.max;
    return e.max - e.min < t.max - t.min && ([n, s] = [s, n]), {
        min: n,
        max: s
    }
}

function wa(t, e) {
    return {
        x: Kn(t.x, e.x),
        y: Kn(t.y, e.y)
    }
}

function Va(t, e) {
    let n = .5;
    const s = I(t),
        i = I(e);
    return i > s ? n = ft(e.min, e.max - s, t.min) : s > i && (n = ft(t.min, t.max - i, e.min)), X(0, 1, n)
}

function Ca(t, e) {
    const n = {};
    return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n
}
const Ve = .35;

function Da(t = Ve) {
    return t === !1 ? t = 0 : t === !0 && (t = Ve), {
        x: Wn(t, "left", "right"),
        y: Wn(t, "top", "bottom")
    }
}

function Wn(t, e, n) {
    return {
        min: $n(t, e),
        max: $n(t, n)
    }
}

function $n(t, e) {
    return typeof t == "number" ? t : t[e] || 0
}
const Gn = () => ({
        translate: 0,
        scale: 1,
        origin: 0,
        originPoint: 0
    }),
    lt = () => ({
        x: Gn(),
        y: Gn()
    }),
    zn = () => ({
        min: 0,
        max: 0
    }),
    M = () => ({
        x: zn(),
        y: zn()
    });

function U(t) {
    return [t("x"), t("y")]
}

function bi({
    top: t,
    left: e,
    right: n,
    bottom: s
}) {
    return {
        x: {
            min: e,
            max: n
        },
        y: {
            min: t,
            max: s
        }
    }
}

function Ma({
    x: t,
    y: e
}) {
    return {
        top: e.min,
        right: t.max,
        bottom: e.max,
        left: t.min
    }
}

function Ra(t, e) {
    if (!e) return t;
    const n = e({
            x: t.left,
            y: t.top
        }),
        s = e({
            x: t.right,
            y: t.bottom
        });
    return {
        top: n.y,
        left: n.x,
        bottom: s.y,
        right: s.x
    }
}

function ue(t) {
    return t === void 0 || t === 1
}

function Ce({
    scale: t,
    scaleX: e,
    scaleY: n
}) {
    return !ue(t) || !ue(e) || !ue(n)
}

function tt(t) {
    return Ce(t) || wi(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY
}

function wi(t) {
    return Hn(t.x) || Hn(t.y)
}

function Hn(t) {
    return t && t !== "0%"
}

function $t(t, e, n) {
    const s = t - n,
        i = e * s;
    return n + i
}

function Xn(t, e, n, s, i) {
    return i !== void 0 && (t = $t(t, i, s)), $t(t, n, s) + e
}

function De(t, e = 0, n = 1, s, i) {
    t.min = Xn(t.min, e, n, s, i), t.max = Xn(t.max, e, n, s, i)
}

function Vi(t, {
    x: e,
    y: n
}) {
    De(t.x, e.translate, e.scale, e.originPoint), De(t.y, n.translate, n.scale, n.originPoint)
}
const Yn = .999999999999,
    qn = 1.0000000000001;

function Ea(t, e, n, s = !1) {
    const i = n.length;
    if (!i) return;
    e.x = e.y = 1;
    let r, o;
    for (let a = 0; a < i; a++) {
        r = n[a], o = r.projectionDelta;
        const {
            visualElement: l
        } = r.options;
        l && l.props.style && l.props.style.display === "contents" || (s && r.options.layoutScroll && r.scroll && r !== r.root && ct(t, {
            x: -r.scroll.offset.x,
            y: -r.scroll.offset.y
        }), o && (e.x *= o.x.scale, e.y *= o.y.scale, Vi(t, o)), s && tt(r.latestValues) && ct(t, r.latestValues))
    }
    e.x < qn && e.x > Yn && (e.x = 1), e.y < qn && e.y > Yn && (e.y = 1)
}

function ut(t, e) {
    t.min = t.min + e, t.max = t.max + e
}

function Zn(t, e, n, s, i = .5) {
    const r = C(t.min, t.max, i);
    De(t, e, n, r, s)
}

function ct(t, e) {
    Zn(t.x, e.x, e.scaleX, e.scale, e.originX), Zn(t.y, e.y, e.scaleY, e.scale, e.originY)
}

function Ci(t, e) {
    return bi(Ra(t.getBoundingClientRect(), e))
}

function La(t, e, n) {
    const s = Ci(t, n),
        {
            scroll: i
        } = e;
    return i && (ut(s.x, i.offset.x), ut(s.y, i.offset.y)), s
}
const Di = ({
        current: t
    }) => t ? t.ownerDocument.defaultView : null,
    Fa = new WeakMap;
class Ba {
    constructor(e) {
        this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
            x: 0,
            y: 0
        }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = M(), this.visualElement = e
    }
    start(e, {
        snapToCursor: n = !1
    } = {}) {
        const {
            presenceContext: s
        } = this.visualElement;
        if (s && s.isPresent === !1) return;
        const i = c => {
                const {
                    dragSnapToOrigin: h
                } = this.getProps();
                h ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Lt(c).point)
            },
            r = (c, h) => {
                const {
                    drag: f,
                    dragPropagation: d,
                    onDragStart: p
                } = this.getProps();
                if (f && !d && (this.openDragLock && this.openDragLock(), this.openDragLock = fa(f), !this.openDragLock)) return;
                this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), U(x => {
                    let m = this.getAxisMotionValue(x).get() || 0;
                    if (K.test(m)) {
                        const {
                            projection: y
                        } = this.visualElement;
                        if (y && y.layout) {
                            const v = y.layout.layoutBox[x];
                            v && (m = I(v) * (parseFloat(m) / 100))
                        }
                    }
                    this.originPoint[x] = m
                }), p && V.postRender(() => p(c, h)), be(this.visualElement, "transform");
                const {
                    animationState: g
                } = this.visualElement;
                g && g.setActive("whileDrag", !0)
            },
            o = (c, h) => {
                const {
                    dragPropagation: f,
                    dragDirectionLock: d,
                    onDirectionLock: p,
                    onDrag: g
                } = this.getProps();
                if (!f && !this.openDragLock) return;
                const {
                    offset: x
                } = h;
                if (d && this.currentDirection === null) {
                    this.currentDirection = ka(x), this.currentDirection !== null && p && p(this.currentDirection);
                    return
                }
                this.updateAxis("x", h.point, x), this.updateAxis("y", h.point, x), this.visualElement.render(), g && g(c, h)
            },
            a = (c, h) => this.stop(c, h),
            l = () => U(c => {
                var h;
                return this.getAnimationState(c) === "paused" && ((h = this.getAxisMotionValue(c).animation) === null || h === void 0 ? void 0 : h.play())
            }),
            {
                dragSnapToOrigin: u
            } = this.getProps();
        this.panSession = new Ti(e, {
            onSessionStart: i,
            onStart: r,
            onMove: o,
            onSessionEnd: a,
            resumeAnimation: l
        }, {
            transformPagePoint: this.visualElement.getTransformPagePoint(),
            dragSnapToOrigin: u,
            contextWindow: Di(this.visualElement)
        })
    }
    stop(e, n) {
        const s = this.isDragging;
        if (this.cancel(), !s) return;
        const {
            velocity: i
        } = n;
        this.startAnimation(i);
        const {
            onDragEnd: r
        } = this.getProps();
        r && V.postRender(() => r(e, n))
    }
    cancel() {
        this.isDragging = !1;
        const {
            projection: e,
            animationState: n
        } = this.visualElement;
        e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
        const {
            dragPropagation: s
        } = this.getProps();
        !s && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1)
    }
    updateAxis(e, n, s) {
        const {
            drag: i
        } = this.getProps();
        if (!s || !kt(e, i, this.currentDirection)) return;
        const r = this.getAxisMotionValue(e);
        let o = this.originPoint[e] + s[e];
        this.constraints && this.constraints[e] && (o = Aa(o, this.constraints[e], this.elastic[e])), r.set(o)
    }
    resolveConstraints() {
        var e;
        const {
            dragConstraints: n,
            dragElastic: s
        } = this.getProps(), i = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (e = this.visualElement.projection) === null || e === void 0 ? void 0 : e.layout, r = this.constraints;
        n && at(n) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : n && i ? this.constraints = ba(i.layoutBox, n) : this.constraints = !1, this.elastic = Da(s), r !== this.constraints && i && this.constraints && !this.hasMutatedConstraints && U(o => {
            this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = Ca(i.layoutBox[o], this.constraints[o]))
        })
    }
    resolveRefConstraints() {
        const {
            dragConstraints: e,
            onMeasureDragConstraints: n
        } = this.getProps();
        if (!e || !at(e)) return !1;
        const s = e.current,
            {
                projection: i
            } = this.visualElement;
        if (!i || !i.layout) return !1;
        const r = La(s, i.root, this.visualElement.getTransformPagePoint());
        let o = wa(i.layout.layoutBox, r);
        if (n) {
            const a = n(Ma(o));
            this.hasMutatedConstraints = !!a, a && (o = bi(a))
        }
        return o
    }
    startAnimation(e) {
        const {
            drag: n,
            dragMomentum: s,
            dragElastic: i,
            dragTransition: r,
            dragSnapToOrigin: o,
            onDragTransitionEnd: a
        } = this.getProps(), l = this.constraints || {}, u = U(c => {
            if (!kt(c, n, this.currentDirection)) return;
            let h = l && l[c] || {};
            o && (h = {
                min: 0,
                max: 0
            });
            const f = i ? 200 : 1e6,
                d = i ? 40 : 1e7,
                p = {
                    type: "inertia",
                    velocity: s ? e[c] : 0,
                    bounceStiffness: f,
                    bounceDamping: d,
                    timeConstant: 750,
                    restDelta: 1,
                    restSpeed: 10,
                    ...r,
                    ...h
                };
            return this.startAxisValueAnimation(c, p)
        });
        return Promise.all(u).then(a)
    }
    startAxisValueAnimation(e, n) {
        const s = this.getAxisMotionValue(e);
        return be(this.visualElement, e), s.start(Xe(e, s, 0, n, this.visualElement, !1))
    }
    stopAnimation() {
        U(e => this.getAxisMotionValue(e).stop())
    }
    pauseAnimation() {
        U(e => {
            var n;
            return (n = this.getAxisMotionValue(e).animation) === null || n === void 0 ? void 0 : n.pause()
        })
    }
    getAnimationState(e) {
        var n;
        return (n = this.getAxisMotionValue(e).animation) === null || n === void 0 ? void 0 : n.state
    }
    getAxisMotionValue(e) {
        const n = `_drag${e.toUpperCase()}`,
            s = this.visualElement.getProps(),
            i = s[n];
        return i || this.visualElement.getValue(e, (s.initial ? s.initial[e] : void 0) || 0)
    }
    snapToCursor(e) {
        U(n => {
            const {
                drag: s
            } = this.getProps();
            if (!kt(n, s, this.currentDirection)) return;
            const {
                projection: i
            } = this.visualElement, r = this.getAxisMotionValue(n);
            if (i && i.layout) {
                const {
                    min: o,
                    max: a
                } = i.layout.layoutBox[n];
                r.set(e[n] - C(o, a, .5))
            }
        })
    }
    scalePositionWithinConstraints() {
        if (!this.visualElement.current) return;
        const {
            drag: e,
            dragConstraints: n
        } = this.getProps(), {
            projection: s
        } = this.visualElement;
        if (!at(n) || !s || !this.constraints) return;
        this.stopAnimation();
        const i = {
            x: 0,
            y: 0
        };
        U(o => {
            const a = this.getAxisMotionValue(o);
            if (a && this.constraints !== !1) {
                const l = a.get();
                i[o] = Va({
                    min: l,
                    max: l
                }, this.constraints[o])
            }
        });
        const {
            transformTemplate: r
        } = this.visualElement.getProps();
        this.visualElement.current.style.transform = r ? r({}, "") : "none", s.root && s.root.updateScroll(), s.updateLayout(), this.resolveConstraints(), U(o => {
            if (!kt(o, e, null)) return;
            const a = this.getAxisMotionValue(o),
                {
                    min: l,
                    max: u
                } = this.constraints[o];
            a.set(C(l, u, i[o]))
        })
    }
    addListeners() {
        if (!this.visualElement.current) return;
        Fa.set(this.visualElement, this);
        const e = this.visualElement.current,
            n = Tt(e, "pointerdown", l => {
                const {
                    drag: u,
                    dragListener: c = !0
                } = this.getProps();
                u && c && this.start(l)
            }),
            s = () => {
                const {
                    dragConstraints: l
                } = this.getProps();
                at(l) && l.current && (this.constraints = this.resolveRefConstraints())
            },
            {
                projection: i
            } = this.visualElement,
            r = i.addEventListener("measure", s);
        i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), V.read(s);
        const o = Ct(window, "resize", () => this.scalePositionWithinConstraints()),
            a = i.addEventListener("didUpdate", ({
                delta: l,
                hasLayoutChanged: u
            }) => {
                this.isDragging && u && (U(c => {
                    const h = this.getAxisMotionValue(c);
                    h && (this.originPoint[c] += l[c].translate, h.set(h.get() + l[c].translate))
                }), this.visualElement.render())
            });
        return () => {
            o(), n(), r(), a && a()
        }
    }
    getProps() {
        const e = this.visualElement.getProps(),
            {
                drag: n = !1,
                dragDirectionLock: s = !1,
                dragPropagation: i = !1,
                dragConstraints: r = !1,
                dragElastic: o = Ve,
                dragMomentum: a = !0
            } = e;
        return { ...e,
            drag: n,
            dragDirectionLock: s,
            dragPropagation: i,
            dragConstraints: r,
            dragElastic: o,
            dragMomentum: a
        }
    }
}

function kt(t, e, n) {
    return (e === !0 || e === t) && (n === null || n === t)
}

function ka(t, e = 10) {
    let n = null;
    return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n
}
class ja extends J {
    constructor(e) {
        super(e), this.removeGroupControls = j, this.removeListeners = j, this.controls = new Ba(e)
    }
    mount() {
        const {
            dragControls: e
        } = this.node.getProps();
        e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || j
    }
    unmount() {
        this.removeGroupControls(), this.removeListeners()
    }
}
const Jn = t => (e, n) => {
    t && V.postRender(() => t(e, n))
};
class Ia extends J {
    constructor() {
        super(...arguments), this.removePointerDownListener = j
    }
    onPointerDown(e) {
        this.session = new Ti(e, this.createPanHandlers(), {
            transformPagePoint: this.node.getTransformPagePoint(),
            contextWindow: Di(this.node)
        })
    }
    createPanHandlers() {
        const {
            onPanSessionStart: e,
            onPanStart: n,
            onPan: s,
            onPanEnd: i
        } = this.node.getProps();
        return {
            onSessionStart: Jn(e),
            onStart: Jn(n),
            onMove: s,
            onEnd: (r, o) => {
                delete this.session, i && V.postRender(() => i(r, o))
            }
        }
    }
    mount() {
        this.removePointerDownListener = Tt(this.node.current, "pointerdown", e => this.onPointerDown(e))
    }
    update() {
        this.session && this.session.updateHandlers(this.createPanHandlers())
    }
    unmount() {
        this.removePointerDownListener(), this.session && this.session.end()
    }
}
const qt = T.createContext(null);

function Oa() {
    const t = T.useContext(qt);
    if (t === null) return [!0, null];
    const {
        isPresent: e,
        onExitComplete: n,
        register: s
    } = t, i = T.useId();
    T.useEffect(() => s(i), []);
    const r = T.useCallback(() => n && n(i), [i, n]);
    return !e && n ? [!1, r] : [!0]
}
const tn = T.createContext({}),
    Mi = T.createContext({}),
    Ot = {
        hasAnimatedSinceResize: !0,
        hasEverUpdated: !1
    };

function Qn(t, e) {
    return e.max === e.min ? 0 : t / (e.max - e.min) * 100
}
const mt = {
        correct: (t, e) => {
            if (!e.target) return t;
            if (typeof t == "string")
                if (P.test(t)) t = parseFloat(t);
                else return t;
            const n = Qn(t, e.target.x),
                s = Qn(t, e.target.y);
            return `${n}% ${s}%`
        }
    },
    Na = {
        correct: (t, {
            treeScale: e,
            projectionDelta: n
        }) => {
            const s = t,
                i = Z.parse(t);
            if (i.length > 5) return s;
            const r = Z.createTransformer(t),
                o = typeof i[0] != "number" ? 1 : 0,
                a = n.x.scale * e.x,
                l = n.y.scale * e.y;
            i[0 + o] /= a, i[1 + o] /= l;
            const u = C(a, l, .5);
            return typeof i[2 + o] == "number" && (i[2 + o] /= u), typeof i[3 + o] == "number" && (i[3 + o] /= u), r(i)
        }
    },
    Gt = {};

function Ua(t) {
    Object.assign(Gt, t)
}
const {
    schedule: en,
    cancel: Lu
} = Rs(queueMicrotask, !1);
class _a extends T.Component {
    componentDidMount() {
        const {
            visualElement: e,
            layoutGroup: n,
            switchLayoutGroup: s,
            layoutId: i
        } = this.props, {
            projection: r
        } = e;
        Ua(Ka), r && (n.group && n.group.add(r), s && s.register && i && s.register(r), r.root.didUpdate(), r.addEventListener("animationComplete", () => {
            this.safeToRemove()
        }), r.setOptions({ ...r.options,
            onExitComplete: () => this.safeToRemove()
        })), Ot.hasEverUpdated = !0
    }
    getSnapshotBeforeUpdate(e) {
        const {
            layoutDependency: n,
            visualElement: s,
            drag: i,
            isPresent: r
        } = this.props, o = s.projection;
        return o && (o.isPresent = r, i || e.layoutDependency !== n || n === void 0 ? o.willUpdate() : this.safeToRemove(), e.isPresent !== r && (r ? o.promote() : o.relegate() || V.postRender(() => {
            const a = o.getStack();
            (!a || !a.members.length) && this.safeToRemove()
        }))), null
    }
    componentDidUpdate() {
        const {
            projection: e
        } = this.props.visualElement;
        e && (e.root.didUpdate(), en.postRender(() => {
            !e.currentAnimation && e.isLead() && this.safeToRemove()
        }))
    }
    componentWillUnmount() {
        const {
            visualElement: e,
            layoutGroup: n,
            switchLayoutGroup: s
        } = this.props, {
            projection: i
        } = e;
        i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i))
    }
    safeToRemove() {
        const {
            safeToRemove: e
        } = this.props;
        e && e()
    }
    render() {
        return null
    }
}

function Ri(t) {
    const [e, n] = Oa(), s = T.useContext(tn);
    return G.jsx(_a, { ...t,
        layoutGroup: s,
        switchLayoutGroup: T.useContext(Mi),
        isPresent: e,
        safeToRemove: n
    })
}
const Ka = {
        borderRadius: { ...mt,
            applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
        },
        borderTopLeftRadius: mt,
        borderTopRightRadius: mt,
        borderBottomLeftRadius: mt,
        borderBottomRightRadius: mt,
        boxShadow: Na
    },
    Ei = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
    Wa = Ei.length,
    ts = t => typeof t == "string" ? parseFloat(t) : t,
    es = t => typeof t == "number" || P.test(t);

function $a(t, e, n, s, i, r) {
    i ? (t.opacity = C(0, n.opacity !== void 0 ? n.opacity : 1, Ga(s)), t.opacityExit = C(e.opacity !== void 0 ? e.opacity : 1, 0, za(s))) : r && (t.opacity = C(e.opacity !== void 0 ? e.opacity : 1, n.opacity !== void 0 ? n.opacity : 1, s));
    for (let o = 0; o < Wa; o++) {
        const a = `border${Ei[o]}Radius`;
        let l = ns(e, a),
            u = ns(n, a);
        if (l === void 0 && u === void 0) continue;
        l || (l = 0), u || (u = 0), l === 0 || u === 0 || es(l) === es(u) ? (t[a] = Math.max(C(ts(l), ts(u), s), 0), (K.test(u) || K.test(l)) && (t[a] += "%")) : t[a] = u
    }(e.rotate || n.rotate) && (t.rotate = C(e.rotate || 0, n.rotate || 0, s))
}

function ns(t, e) {
    return t[e] !== void 0 ? t[e] : t.borderRadius
}
const Ga = Li(0, .5, Is),
    za = Li(.5, .95, j);

function Li(t, e, n) {
    return s => s < t ? 0 : s > e ? 1 : n(ft(t, e, s))
}

function ss(t, e) {
    t.min = e.min, t.max = e.max
}

function N(t, e) {
    ss(t.x, e.x), ss(t.y, e.y)
}

function is(t, e) {
    t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin
}

function os(t, e, n, s, i) {
    return t -= e, t = $t(t, 1 / n, s), i !== void 0 && (t = $t(t, 1 / i, s)), t
}

function Ha(t, e = 0, n = 1, s = .5, i, r = t, o = t) {
    if (K.test(e) && (e = parseFloat(e), e = C(o.min, o.max, e / 100) - o.min), typeof e != "number") return;
    let a = C(r.min, r.max, s);
    t === r && (a -= e), t.min = os(t.min, e, n, a, i), t.max = os(t.max, e, n, a, i)
}

function rs(t, e, [n, s, i], r, o) {
    Ha(t, e[n], e[s], e[i], e.scale, r, o)
}
const Xa = ["x", "scaleX", "originX"],
    Ya = ["y", "scaleY", "originY"];

function as(t, e, n, s) {
    rs(t.x, e, Xa, n ? n.x : void 0, s ? s.x : void 0), rs(t.y, e, Ya, n ? n.y : void 0, s ? s.y : void 0)
}

function ls(t) {
    return t.translate === 0 && t.scale === 1
}

function Fi(t) {
    return ls(t.x) && ls(t.y)
}

function us(t, e) {
    return t.min === e.min && t.max === e.max
}

function qa(t, e) {
    return us(t.x, e.x) && us(t.y, e.y)
}

function cs(t, e) {
    return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max)
}

function Bi(t, e) {
    return cs(t.x, e.x) && cs(t.y, e.y)
}

function hs(t) {
    return I(t.x) / I(t.y)
}

function fs(t, e) {
    return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint
}
class Za {
    constructor() {
        this.members = []
    }
    add(e) {
        Ye(this.members, e), e.scheduleRender()
    }
    remove(e) {
        if (qe(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
            const n = this.members[this.members.length - 1];
            n && this.promote(n)
        }
    }
    relegate(e) {
        const n = this.members.findIndex(i => e === i);
        if (n === 0) return !1;
        let s;
        for (let i = n; i >= 0; i--) {
            const r = this.members[i];
            if (r.isPresent !== !1) {
                s = r;
                break
            }
        }
        return s ? (this.promote(s), !0) : !1
    }
    promote(e, n) {
        const s = this.lead;
        if (e !== s && (this.prevLead = s, this.lead = e, e.show(), s)) {
            s.instance && s.scheduleRender(), e.scheduleRender(), e.resumeFrom = s, n && (e.resumeFrom.preserveOpacity = !0), s.snapshot && (e.snapshot = s.snapshot, e.snapshot.latestValues = s.animationValues || s.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
            const {
                crossfade: i
            } = e.options;
            i === !1 && s.hide()
        }
    }
    exitAnimationComplete() {
        this.members.forEach(e => {
            const {
                options: n,
                resumingFrom: s
            } = e;
            n.onExitComplete && n.onExitComplete(), s && s.options.onExitComplete && s.options.onExitComplete()
        })
    }
    scheduleRender() {
        this.members.forEach(e => {
            e.instance && e.scheduleRender(!1)
        })
    }
    removeLeadSnapshot() {
        this.lead && this.lead.snapshot && (this.lead.snapshot = void 0)
    }
}

function Ja(t, e, n) {
    let s = "";
    const i = t.x.translate / e.x,
        r = t.y.translate / e.y,
        o = (n == null ? void 0 : n.z) || 0;
    if ((i || r || o) && (s = `translate3d(${i}px, ${r}px, ${o}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1/e.x}, ${1/e.y}) `), n) {
        const {
            transformPerspective: u,
            rotate: c,
            rotateX: h,
            rotateY: f,
            skewX: d,
            skewY: p
        } = n;
        u && (s = `perspective(${u}px) ${s}`), c && (s += `rotate(${c}deg) `), h && (s += `rotateX(${h}deg) `), f && (s += `rotateY(${f}deg) `), d && (s += `skewX(${d}deg) `), p && (s += `skewY(${p}deg) `)
    }
    const a = t.x.scale * e.x,
        l = t.y.scale * e.y;
    return (a !== 1 || l !== 1) && (s += `scale(${a}, ${l})`), s || "none"
}
const Qa = (t, e) => t.depth - e.depth;
class tl {
    constructor() {
        this.children = [], this.isDirty = !1
    }
    add(e) {
        Ye(this.children, e), this.isDirty = !0
    }
    remove(e) {
        qe(this.children, e), this.isDirty = !0
    }
    forEach(e) {
        this.isDirty && this.children.sort(Qa), this.isDirty = !1, this.children.forEach(e)
    }
}

function Nt(t) {
    const e = F(t) ? t.get() : t;
    return Or(e) ? e.toValue() : e
}

function el(t, e) {
    const n = W.now(),
        s = ({
            timestamp: i
        }) => {
            const r = i - n;
            r >= e && (q(s), t(r - e))
        };
    return V.read(s, !0), () => q(s)
}

function nl(t) {
    return t instanceof SVGElement && t.tagName !== "svg"
}

function sl(t, e, n) {
    const s = F(t) ? t : Vt(t);
    return s.start(Xe("", s, e, n)), s.animation
}
const et = {
        type: "projectionFrame",
        totalNodes: 0,
        resolvedTargetDeltas: 0,
        recalculatedProjection: 0
    },
    vt = typeof window < "u" && window.MotionDebug !== void 0,
    ce = ["", "X", "Y", "Z"],
    il = {
        visibility: "hidden"
    },
    ds = 1e3;
let ol = 0;

function he(t, e, n, s) {
    const {
        latestValues: i
    } = e;
    i[t] && (n[t] = i[t], e.setStaticValue(t, 0), s && (s[t] = 0))
}

function ki(t) {
    if (t.hasCheckedOptimisedAppear = !0, t.root === t) return;
    const {
        visualElement: e
    } = t.options;
    if (!e) return;
    const n = pi(e);
    if (window.MotionHasOptimisedAnimation(n, "transform")) {
        const {
            layout: i,
            layoutId: r
        } = t.options;
        window.MotionCancelOptimisedAnimation(n, "transform", V, !(i || r))
    }
    const {
        parent: s
    } = t;
    s && !s.hasCheckedOptimisedAppear && ki(s)
}

function ji({
    attachResizeListener: t,
    defaultParent: e,
    measureScroll: n,
    checkIsScrollRoot: s,
    resetTransform: i
}) {
    return class {
        constructor(o = {}, a = e == null ? void 0 : e()) {
            this.id = ol++, this.animationId = 0, this.children = new Set, this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
                x: 1,
                y: 1
            }, this.eventHandlers = new Map, this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
                this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots())
            }, this.updateProjection = () => {
                this.projectionUpdateScheduled = !1, vt && (et.totalNodes = et.resolvedTargetDeltas = et.recalculatedProjection = 0), this.nodes.forEach(ll), this.nodes.forEach(dl), this.nodes.forEach(pl), this.nodes.forEach(ul), vt && window.MotionDebug.record(et)
            }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = new Map, this.latestValues = o, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
            for (let l = 0; l < this.path.length; l++) this.path[l].shouldResetTransform = !0;
            this.root === this && (this.nodes = new tl)
        }
        addEventListener(o, a) {
            return this.eventHandlers.has(o) || this.eventHandlers.set(o, new Ze), this.eventHandlers.get(o).add(a)
        }
        notifyListeners(o, ...a) {
            const l = this.eventHandlers.get(o);
            l && l.notify(...a)
        }
        hasListeners(o) {
            return this.eventHandlers.has(o)
        }
        mount(o, a = this.root.hasTreeAnimated) {
            if (this.instance) return;
            this.isSVG = nl(o), this.instance = o;
            const {
                layoutId: l,
                layout: u,
                visualElement: c
            } = this.options;
            if (c && !c.current && c.mount(o), this.root.nodes.add(this), this.parent && this.parent.children.add(this), a && (u || l) && (this.isLayoutDirty = !0), t) {
                let h;
                const f = () => this.root.updateBlockedByResize = !1;
                t(o, () => {
                    this.root.updateBlockedByResize = !0, h && h(), h = el(f, 250), Ot.hasAnimatedSinceResize && (Ot.hasAnimatedSinceResize = !1, this.nodes.forEach(ms))
                })
            }
            l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && c && (l || u) && this.addEventListener("didUpdate", ({
                delta: h,
                hasLayoutChanged: f,
                hasRelativeTargetChanged: d,
                layout: p
            }) => {
                if (this.isTreeAnimationBlocked()) {
                    this.target = void 0, this.relativeTarget = void 0;
                    return
                }
                const g = this.options.transition || c.getDefaultTransition() || xl,
                    {
                        onLayoutAnimationStart: x,
                        onLayoutAnimationComplete: m
                    } = c.getProps(),
                    y = !this.targetLayout || !Bi(this.targetLayout, p) || d,
                    v = !f && d;
                if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || v || f && (y || !this.currentAnimation)) {
                    this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(h, v);
                    const b = { ...Be(g, "layout"),
                        onPlay: x,
                        onComplete: m
                    };
                    (c.shouldReduceMotion || this.options.layoutRoot) && (b.delay = 0, b.type = !1), this.startAnimation(b)
                } else f || ms(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
                this.targetLayout = p
            })
        }
        unmount() {
            this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
            const o = this.getStack();
            o && o.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, q(this.updateProjection)
        }
        blockUpdate() {
            this.updateManuallyBlocked = !0
        }
        unblockUpdate() {
            this.updateManuallyBlocked = !1
        }
        isUpdateBlocked() {
            return this.updateManuallyBlocked || this.updateBlockedByResize
        }
        isTreeAnimationBlocked() {
            return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1
        }
        startUpdate() {
            this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(ml), this.animationId++)
        }
        getTransformTemplate() {
            const {
                visualElement: o
            } = this.options;
            return o && o.getProps().transformTemplate
        }
        willUpdate(o = !0) {
            if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
                this.options.onExitComplete && this.options.onExitComplete();
                return
            }
            if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && ki(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
            this.isLayoutDirty = !0;
            for (let c = 0; c < this.path.length; c++) {
                const h = this.path[c];
                h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1)
            }
            const {
                layoutId: a,
                layout: l
            } = this.options;
            if (a === void 0 && !l) return;
            const u = this.getTransformTemplate();
            this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), o && this.notifyListeners("willUpdate")
        }
        update() {
            if (this.updateScheduled = !1, this.isUpdateBlocked()) {
                this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(ps);
                return
            }
            this.isUpdating || this.nodes.forEach(hl), this.isUpdating = !1, this.nodes.forEach(fl), this.nodes.forEach(rl), this.nodes.forEach(al), this.clearAllSnapshots();
            const a = W.now();
            E.delta = X(0, 1e3 / 60, a - E.timestamp), E.timestamp = a, E.isProcessing = !0, ee.update.process(E), ee.preRender.process(E), ee.render.process(E), E.isProcessing = !1
        }
        didUpdate() {
            this.updateScheduled || (this.updateScheduled = !0, en.read(this.scheduleUpdate))
        }
        clearAllSnapshots() {
            this.nodes.forEach(cl), this.sharedNodes.forEach(gl)
        }
        scheduleUpdateProjection() {
            this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, V.preRender(this.updateProjection, !1, !0))
        }
        scheduleCheckAfterUnmount() {
            V.postRender(() => {
                this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
            })
        }
        updateSnapshot() {
            this.snapshot || !this.instance || (this.snapshot = this.measure())
        }
        updateLayout() {
            if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
            if (this.resumeFrom && !this.resumeFrom.instance)
                for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
            const o = this.layout;
            this.layout = this.measure(!1), this.layoutCorrected = M(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
            const {
                visualElement: a
            } = this.options;
            a && a.notify("LayoutMeasure", this.layout.layoutBox, o ? o.layoutBox : void 0)
        }
        updateScroll(o = "measure") {
            let a = !!(this.options.layoutScroll && this.instance);
            if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === o && (a = !1), a) {
                const l = s(this.instance);
                this.scroll = {
                    animationId: this.root.animationId,
                    phase: o,
                    isRoot: l,
                    offset: n(this.instance),
                    wasRoot: this.scroll ? this.scroll.isRoot : l
                }
            }
        }
        resetTransform() {
            if (!i) return;
            const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
                a = this.projectionDelta && !Fi(this.projectionDelta),
                l = this.getTransformTemplate(),
                u = l ? l(this.latestValues, "") : void 0,
                c = u !== this.prevTransformTemplateValue;
            o && (a || tt(this.latestValues) || c) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender())
        }
        measure(o = !0) {
            const a = this.measurePageBox();
            let l = this.removeElementScroll(a);
            return o && (l = this.removeTransform(l)), Tl(l), {
                animationId: this.root.animationId,
                measuredBox: a,
                layoutBox: l,
                latestValues: {},
                source: this.id
            }
        }
        measurePageBox() {
            var o;
            const {
                visualElement: a
            } = this.options;
            if (!a) return M();
            const l = a.measureViewportBox();
            if (!(((o = this.scroll) === null || o === void 0 ? void 0 : o.wasRoot) || this.path.some(Pl))) {
                const {
                    scroll: c
                } = this.root;
                c && (ut(l.x, c.offset.x), ut(l.y, c.offset.y))
            }
            return l
        }
        removeElementScroll(o) {
            var a;
            const l = M();
            if (N(l, o), !((a = this.scroll) === null || a === void 0) && a.wasRoot) return l;
            for (let u = 0; u < this.path.length; u++) {
                const c = this.path[u],
                    {
                        scroll: h,
                        options: f
                    } = c;
                c !== this.root && h && f.layoutScroll && (h.wasRoot && N(l, o), ut(l.x, h.offset.x), ut(l.y, h.offset.y))
            }
            return l
        }
        applyTransform(o, a = !1) {
            const l = M();
            N(l, o);
            for (let u = 0; u < this.path.length; u++) {
                const c = this.path[u];
                !a && c.options.layoutScroll && c.scroll && c !== c.root && ct(l, {
                    x: -c.scroll.offset.x,
                    y: -c.scroll.offset.y
                }), tt(c.latestValues) && ct(l, c.latestValues)
            }
            return tt(this.latestValues) && ct(l, this.latestValues), l
        }
        removeTransform(o) {
            const a = M();
            N(a, o);
            for (let l = 0; l < this.path.length; l++) {
                const u = this.path[l];
                if (!u.instance || !tt(u.latestValues)) continue;
                Ce(u.latestValues) && u.updateSnapshot();
                const c = M(),
                    h = u.measurePageBox();
                N(c, h), as(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c)
            }
            return tt(this.latestValues) && as(a, this.latestValues), a
        }
        setTargetDelta(o) {
            this.targetDelta = o, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0
        }
        setOptions(o) {
            this.options = { ...this.options,
                ...o,
                crossfade: o.crossfade !== void 0 ? o.crossfade : !0
            }
        }
        clearMeasurements() {
            this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1
        }
        forceRelativeParentToResolveTarget() {
            this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== E.timestamp && this.relativeParent.resolveTargetDelta(!0)
        }
        resolveTargetDelta(o = !1) {
            var a;
            const l = this.getLead();
            this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
            const u = !!this.resumingFrom || this !== l;
            if (!(o || u && this.isSharedProjectionDirty || this.isProjectionDirty || !((a = this.parent) === null || a === void 0) && a.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
            const {
                layout: h,
                layoutId: f
            } = this.options;
            if (!(!this.layout || !(h || f))) {
                if (this.resolvedRelativeTargetAt = E.timestamp, !this.targetDelta && !this.relativeTarget) {
                    const d = this.getClosestProjectingParent();
                    d && d.layout && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = M(), this.relativeTargetOrigin = M(), St(this.relativeTargetOrigin, this.layout.layoutBox, d.layout.layoutBox), N(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                }
                if (!(!this.relativeTarget && !this.targetDelta)) {
                    if (this.target || (this.target = M(), this.targetWithTransforms = M()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Sa(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : N(this.target, this.layout.layoutBox), Vi(this.target, this.targetDelta)) : N(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget) {
                        this.attemptToResolveRelativeTarget = !1;
                        const d = this.getClosestProjectingParent();
                        d && !!d.resumingFrom == !!this.resumingFrom && !d.options.layoutScroll && d.target && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = M(), this.relativeTargetOrigin = M(), St(this.relativeTargetOrigin, this.target, d.target), N(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                    }
                    vt && et.resolvedTargetDeltas++
                }
            }
        }
        getClosestProjectingParent() {
            if (!(!this.parent || Ce(this.parent.latestValues) || wi(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent()
        }
        isProjecting() {
            return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
        }
        calcProjection() {
            var o;
            const a = this.getLead(),
                l = !!this.resumingFrom || this !== a;
            let u = !0;
            if ((this.isProjectionDirty || !((o = this.parent) === null || o === void 0) && o.isProjectionDirty) && (u = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (u = !1), this.resolvedRelativeTargetAt === E.timestamp && (u = !1), u) return;
            const {
                layout: c,
                layoutId: h
            } = this.options;
            if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(c || h)) return;
            N(this.layoutCorrected, this.layout.layoutBox);
            const f = this.treeScale.x,
                d = this.treeScale.y;
            Ea(this.layoutCorrected, this.treeScale, this.path, l), a.layout && !a.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (a.target = a.layout.layoutBox, a.targetWithTransforms = M());
            const {
                target: p
            } = a;
            if (!p) {
                this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
                return
            }!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (is(this.prevProjectionDelta.x, this.projectionDelta.x), is(this.prevProjectionDelta.y, this.projectionDelta.y)), Pt(this.projectionDelta, this.layoutCorrected, p, this.latestValues), (this.treeScale.x !== f || this.treeScale.y !== d || !fs(this.projectionDelta.x, this.prevProjectionDelta.x) || !fs(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", p)), vt && et.recalculatedProjection++
        }
        hide() {
            this.isVisible = !1
        }
        show() {
            this.isVisible = !0
        }
        scheduleRender(o = !0) {
            var a;
            if ((a = this.options.visualElement) === null || a === void 0 || a.scheduleRender(), o) {
                const l = this.getStack();
                l && l.scheduleRender()
            }
            this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
        }
        createProjectionDeltas() {
            this.prevProjectionDelta = lt(), this.projectionDelta = lt(), this.projectionDeltaWithTransform = lt()
        }
        setAnimationOrigin(o, a = !1) {
            const l = this.snapshot,
                u = l ? l.latestValues : {},
                c = { ...this.latestValues
                },
                h = lt();
            (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
            const f = M(),
                d = l ? l.source : void 0,
                p = this.layout ? this.layout.source : void 0,
                g = d !== p,
                x = this.getStack(),
                m = !x || x.members.length <= 1,
                y = !!(g && !m && this.options.crossfade === !0 && !this.path.some(vl));
            this.animationProgress = 0;
            let v;
            this.mixTargetDelta = b => {
                const S = b / 1e3;
                gs(h.x, o.x, S), gs(h.y, o.y, S), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (St(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), yl(this.relativeTarget, this.relativeTargetOrigin, f, S), v && qa(this.relativeTarget, v) && (this.isProjectionDirty = !1), v || (v = M()), N(v, this.relativeTarget)), g && (this.animationValues = c, $a(c, u, this.latestValues, S, y, m)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = S
            }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0)
        }
        startAnimation(o) {
            this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (q(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = V.update(() => {
                Ot.hasAnimatedSinceResize = !0, this.currentAnimation = sl(0, ds, { ...o,
                    onUpdate: a => {
                        this.mixTargetDelta(a), o.onUpdate && o.onUpdate(a)
                    },
                    onComplete: () => {
                        o.onComplete && o.onComplete(), this.completeAnimation()
                    }
                }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0
            })
        }
        completeAnimation() {
            this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
            const o = this.getStack();
            o && o.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete")
        }
        finishAnimation() {
            this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(ds), this.currentAnimation.stop()), this.completeAnimation()
        }
        applyTransformsToTarget() {
            const o = this.getLead();
            let {
                targetWithTransforms: a,
                target: l,
                layout: u,
                latestValues: c
            } = o;
            if (!(!a || !l || !u)) {
                if (this !== o && this.layout && u && Ii(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
                    l = this.target || M();
                    const h = I(this.layout.layoutBox.x);
                    l.x.min = o.target.x.min, l.x.max = l.x.min + h;
                    const f = I(this.layout.layoutBox.y);
                    l.y.min = o.target.y.min, l.y.max = l.y.min + f
                }
                N(a, l), ct(a, c), Pt(this.projectionDeltaWithTransform, this.layoutCorrected, a, c)
            }
        }
        registerSharedNode(o, a) {
            this.sharedNodes.has(o) || this.sharedNodes.set(o, new Za), this.sharedNodes.get(o).add(a);
            const u = a.options.initialPromotionConfig;
            a.promote({
                transition: u ? u.transition : void 0,
                preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(a) : void 0
            })
        }
        isLead() {
            const o = this.getStack();
            return o ? o.lead === this : !0
        }
        getLead() {
            var o;
            const {
                layoutId: a
            } = this.options;
            return a ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.lead) || this : this
        }
        getPrevLead() {
            var o;
            const {
                layoutId: a
            } = this.options;
            return a ? (o = this.getStack()) === null || o === void 0 ? void 0 : o.prevLead : void 0
        }
        getStack() {
            const {
                layoutId: o
            } = this.options;
            if (o) return this.root.sharedNodes.get(o)
        }
        promote({
            needsReset: o,
            transition: a,
            preserveFollowOpacity: l
        } = {}) {
            const u = this.getStack();
            u && u.promote(this, l), o && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({
                transition: a
            })
        }
        relegate() {
            const o = this.getStack();
            return o ? o.relegate(this) : !1
        }
        resetSkewAndRotation() {
            const {
                visualElement: o
            } = this.options;
            if (!o) return;
            let a = !1;
            const {
                latestValues: l
            } = o;
            if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0), !a) return;
            const u = {};
            l.z && he("z", o, u, this.animationValues);
            for (let c = 0; c < ce.length; c++) he(`rotate${ce[c]}`, o, u, this.animationValues), he(`skew${ce[c]}`, o, u, this.animationValues);
            o.render();
            for (const c in u) o.setStaticValue(c, u[c]), this.animationValues && (this.animationValues[c] = u[c]);
            o.scheduleRender()
        }
        getProjectionStyles(o) {
            var a, l;
            if (!this.instance || this.isSVG) return;
            if (!this.isVisible) return il;
            const u = {
                    visibility: ""
                },
                c = this.getTransformTemplate();
            if (this.needsReset) return this.needsReset = !1, u.opacity = "", u.pointerEvents = Nt(o == null ? void 0 : o.pointerEvents) || "", u.transform = c ? c(this.latestValues, "") : "none", u;
            const h = this.getLead();
            if (!this.projectionDelta || !this.layout || !h.target) {
                const g = {};
                return this.options.layoutId && (g.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, g.pointerEvents = Nt(o == null ? void 0 : o.pointerEvents) || ""), this.hasProjected && !tt(this.latestValues) && (g.transform = c ? c({}, "") : "none", this.hasProjected = !1), g
            }
            const f = h.animationValues || h.latestValues;
            this.applyTransformsToTarget(), u.transform = Ja(this.projectionDeltaWithTransform, this.treeScale, f), c && (u.transform = c(f, u.transform));
            const {
                x: d,
                y: p
            } = this.projectionDelta;
            u.transformOrigin = `${d.origin*100}% ${p.origin*100}% 0`, h.animationValues ? u.opacity = h === this ? (l = (a = f.opacity) !== null && a !== void 0 ? a : this.latestValues.opacity) !== null && l !== void 0 ? l : 1 : this.preserveOpacity ? this.latestValues.opacity : f.opacityExit : u.opacity = h === this ? f.opacity !== void 0 ? f.opacity : "" : f.opacityExit !== void 0 ? f.opacityExit : 0;
            for (const g in Gt) {
                if (f[g] === void 0) continue;
                const {
                    correct: x,
                    applyTo: m
                } = Gt[g], y = u.transform === "none" ? f[g] : x(f[g], h);
                if (m) {
                    const v = m.length;
                    for (let b = 0; b < v; b++) u[m[b]] = y
                } else u[g] = y
            }
            return this.options.layoutId && (u.pointerEvents = h === this ? Nt(o == null ? void 0 : o.pointerEvents) || "" : "none"), u
        }
        clearSnapshot() {
            this.resumeFrom = this.snapshot = void 0
        }
        resetTree() {
            this.root.nodes.forEach(o => {
                var a;
                return (a = o.currentAnimation) === null || a === void 0 ? void 0 : a.stop()
            }), this.root.nodes.forEach(ps), this.root.sharedNodes.clear()
        }
    }
}

function rl(t) {
    t.updateLayout()
}

function al(t) {
    var e;
    const n = ((e = t.resumeFrom) === null || e === void 0 ? void 0 : e.snapshot) || t.snapshot;
    if (t.isLead() && t.layout && n && t.hasListeners("didUpdate")) {
        const {
            layoutBox: s,
            measuredBox: i
        } = t.layout, {
            animationType: r
        } = t.options, o = n.source !== t.layout.source;
        r === "size" ? U(h => {
            const f = o ? n.measuredBox[h] : n.layoutBox[h],
                d = I(f);
            f.min = s[h].min, f.max = f.min + d
        }) : Ii(r, n.layoutBox, s) && U(h => {
            const f = o ? n.measuredBox[h] : n.layoutBox[h],
                d = I(s[h]);
            f.max = f.min + d, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[h].max = t.relativeTarget[h].min + d)
        });
        const a = lt();
        Pt(a, s, n.layoutBox);
        const l = lt();
        o ? Pt(l, t.applyTransform(i, !0), n.measuredBox) : Pt(l, s, n.layoutBox);
        const u = !Fi(a);
        let c = !1;
        if (!t.resumeFrom) {
            const h = t.getClosestProjectingParent();
            if (h && !h.resumeFrom) {
                const {
                    snapshot: f,
                    layout: d
                } = h;
                if (f && d) {
                    const p = M();
                    St(p, n.layoutBox, f.layoutBox);
                    const g = M();
                    St(g, s, d.layoutBox), Bi(p, g) || (c = !0), h.options.layoutRoot && (t.relativeTarget = g, t.relativeTargetOrigin = p, t.relativeParent = h)
                }
            }
        }
        t.notifyListeners("didUpdate", {
            layout: s,
            snapshot: n,
            delta: l,
            layoutDelta: a,
            hasLayoutChanged: u,
            hasRelativeTargetChanged: c
        })
    } else if (t.isLead()) {
        const {
            onExitComplete: s
        } = t.options;
        s && s()
    }
    t.options.transition = void 0
}

function ll(t) {
    vt && et.totalNodes++, t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty))
}

function ul(t) {
    t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1
}

function cl(t) {
    t.clearSnapshot()
}

function ps(t) {
    t.clearMeasurements()
}

function hl(t) {
    t.isLayoutDirty = !1
}

function fl(t) {
    const {
        visualElement: e
    } = t.options;
    e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform()
}

function ms(t) {
    t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0
}

function dl(t) {
    t.resolveTargetDelta()
}

function pl(t) {
    t.calcProjection()
}

function ml(t) {
    t.resetSkewAndRotation()
}

function gl(t) {
    t.removeLeadSnapshot()
}

function gs(t, e, n) {
    t.translate = C(e.translate, 0, n), t.scale = C(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint
}

function ys(t, e, n, s) {
    t.min = C(e.min, n.min, s), t.max = C(e.max, n.max, s)
}

function yl(t, e, n, s) {
    ys(t.x, e.x, n.x, s), ys(t.y, e.y, n.y, s)
}

function vl(t) {
    return t.animationValues && t.animationValues.opacityExit !== void 0
}
const xl = {
        duration: .45,
        ease: [.4, 0, .1, 1]
    },
    vs = t => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t),
    xs = vs("applewebkit/") && !vs("chrome/") ? Math.round : j;

function Ts(t) {
    t.min = xs(t.min), t.max = xs(t.max)
}

function Tl(t) {
    Ts(t.x), Ts(t.y)
}

function Ii(t, e, n) {
    return t === "position" || t === "preserve-aspect" && !Pa(hs(e), hs(n), .2)
}

function Pl(t) {
    var e;
    return t !== t.root && ((e = t.scroll) === null || e === void 0 ? void 0 : e.wasRoot)
}
const Sl = ji({
        attachResizeListener: (t, e) => Ct(t, "resize", e),
        measureScroll: () => ({
            x: document.documentElement.scrollLeft || document.body.scrollLeft,
            y: document.documentElement.scrollTop || document.body.scrollTop
        }),
        checkIsScrollRoot: () => !0
    }),
    fe = {
        current: void 0
    },
    Oi = ji({
        measureScroll: t => ({
            x: t.scrollLeft,
            y: t.scrollTop
        }),
        defaultParent: () => {
            if (!fe.current) {
                const t = new Sl({});
                t.mount(window), t.setOptions({
                    layoutScroll: !0
                }), fe.current = t
            }
            return fe.current
        },
        resetTransform: (t, e) => {
            t.style.transform = e !== void 0 ? e : "none"
        },
        checkIsScrollRoot: t => window.getComputedStyle(t).position === "fixed"
    }),
    Al = {
        pan: {
            Feature: Ia
        },
        drag: {
            Feature: ja,
            ProjectionNode: Oi,
            MeasureLayout: Ri
        }
    };

function Ps(t, e, n) {
    const {
        props: s
    } = t;
    t.animationState && s.whileHover && t.animationState.setActive("whileHover", n === "Start");
    const i = "onHover" + n,
        r = s[i];
    r && V.postRender(() => r(e, Lt(e)))
}
class bl extends J {
    mount() {
        const {
            current: e
        } = this.node;
        e && (this.unmount = aa(e, n => (Ps(this.node, n, "Start"), s => Ps(this.node, s, "End"))))
    }
    unmount() {}
}
class wl extends J {
    constructor() {
        super(...arguments), this.isActive = !1
    }
    onFocus() {
        let e = !1;
        try {
            e = this.node.current.matches(":focus-visible")
        } catch {
            e = !0
        }!e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0)
    }
    onBlur() {
        !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1)
    }
    mount() {
        this.unmount = Et(Ct(this.node.current, "focus", () => this.onFocus()), Ct(this.node.current, "blur", () => this.onBlur()))
    }
    unmount() {}
}

function Ss(t, e, n) {
    const {
        props: s
    } = t;
    t.animationState && s.whileTap && t.animationState.setActive("whileTap", n === "Start");
    const i = "onTap" + (n === "End" ? "" : n),
        r = s[i];
    r && V.postRender(() => r(e, Lt(e)))
}
class Vl extends J {
    mount() {
        const {
            current: e
        } = this.node;
        e && (this.unmount = ha(e, n => (Ss(this.node, n, "Start"), (s, {
            success: i
        }) => Ss(this.node, s, i ? "End" : "Cancel")), {
            useGlobalTarget: this.node.props.globalTapTarget
        }))
    }
    unmount() {}
}
const Me = new WeakMap,
    de = new WeakMap,
    Cl = t => {
        const e = Me.get(t.target);
        e && e(t)
    },
    Dl = t => {
        t.forEach(Cl)
    };

function Ml({
    root: t,
    ...e
}) {
    const n = t || document;
    de.has(n) || de.set(n, {});
    const s = de.get(n),
        i = JSON.stringify(e);
    return s[i] || (s[i] = new IntersectionObserver(Dl, {
        root: t,
        ...e
    })), s[i]
}

function Rl(t, e, n) {
    const s = Ml(e);
    return Me.set(t, n), s.observe(t), () => {
        Me.delete(t), s.unobserve(t)
    }
}
const El = {
    some: 0,
    all: 1
};
class Ll extends J {
    constructor() {
        super(...arguments), this.hasEnteredView = !1, this.isInView = !1
    }
    startObserver() {
        this.unmount();
        const {
            viewport: e = {}
        } = this.node.getProps(), {
            root: n,
            margin: s,
            amount: i = "some",
            once: r
        } = e, o = {
            root: n ? n.current : void 0,
            rootMargin: s,
            threshold: typeof i == "number" ? i : El[i]
        }, a = l => {
            const {
                isIntersecting: u
            } = l;
            if (this.isInView === u || (this.isInView = u, r && !u && this.hasEnteredView)) return;
            u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
            const {
                onViewportEnter: c,
                onViewportLeave: h
            } = this.node.getProps(), f = u ? c : h;
            f && f(l)
        };
        return Rl(this.node.current, o, a)
    }
    mount() {
        this.startObserver()
    }
    update() {
        if (typeof IntersectionObserver > "u") return;
        const {
            props: e,
            prevProps: n
        } = this.node;
        ["amount", "margin", "root"].some(Fl(e, n)) && this.startObserver()
    }
    unmount() {}
}

function Fl({
    viewport: t = {}
}, {
    viewport: e = {}
} = {}) {
    return n => t[n] !== e[n]
}
const Bl = {
        inView: {
            Feature: Ll
        },
        tap: {
            Feature: Vl
        },
        focus: {
            Feature: wl
        },
        hover: {
            Feature: bl
        }
    },
    kl = {
        layout: {
            ProjectionNode: Oi,
            MeasureLayout: Ri
        }
    },
    nn = T.createContext({
        transformPagePoint: t => t,
        isStatic: !1,
        reducedMotion: "never"
    }),
    Zt = T.createContext({}),
    sn = typeof window < "u",
    Ni = sn ? T.useLayoutEffect : T.useEffect,
    Ui = T.createContext({
        strict: !1
    });

function jl(t, e, n, s, i) {
    var r, o;
    const {
        visualElement: a
    } = T.useContext(Zt), l = T.useContext(Ui), u = T.useContext(qt), c = T.useContext(nn).reducedMotion, h = T.useRef(null);
    s = s || l.renderer, !h.current && s && (h.current = s(t, {
        visualState: e,
        parent: a,
        props: n,
        presenceContext: u,
        blockInitialAnimation: u ? u.initial === !1 : !1,
        reducedMotionConfig: c
    }));
    const f = h.current,
        d = T.useContext(Mi);
    f && !f.projection && i && (f.type === "html" || f.type === "svg") && Il(h.current, n, i, d);
    const p = T.useRef(!1);
    T.useInsertionEffect(() => {
        f && p.current && f.update(n, u)
    });
    const g = n[di],
        x = T.useRef(!!g && !(!((r = window.MotionHandoffIsComplete) === null || r === void 0) && r.call(window, g)) && ((o = window.MotionHasOptimisedAnimation) === null || o === void 0 ? void 0 : o.call(window, g)));
    return Ni(() => {
        f && (p.current = !0, window.MotionIsMounted = !0, f.updateFeatures(), en.render(f.render), x.current && f.animationState && f.animationState.animateChanges())
    }), T.useEffect(() => {
        f && (!x.current && f.animationState && f.animationState.animateChanges(), x.current && (queueMicrotask(() => {
            var m;
            (m = window.MotionHandoffMarkAsComplete) === null || m === void 0 || m.call(window, g)
        }), x.current = !1))
    }), f
}

function Il(t, e, n, s) {
    const {
        layoutId: i,
        layout: r,
        drag: o,
        dragConstraints: a,
        layoutScroll: l,
        layoutRoot: u
    } = e;
    t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : _i(t.parent)), t.projection.setOptions({
        layoutId: i,
        layout: r,
        alwaysMeasureLayout: !!o || a && at(a),
        visualElement: t,
        animationType: typeof r == "string" ? r : "both",
        initialPromotionConfig: s,
        layoutScroll: l,
        layoutRoot: u
    })
}

function _i(t) {
    if (t) return t.options.allowProjection !== !1 ? t.projection : _i(t.parent)
}

function Ol(t, e, n) {
    return T.useCallback(s => {
        s && t.mount && t.mount(s), e && (s ? e.mount(s) : e.unmount()), n && (typeof n == "function" ? n(s) : at(n) && (n.current = s))
    }, [e])
}

function Jt(t) {
    return Ht(t.animate) || Fe.some(e => At(t[e]))
}

function Ki(t) {
    return !!(Jt(t) || t.variants)
}

function Nl(t, e) {
    if (Jt(t)) {
        const {
            initial: n,
            animate: s
        } = t;
        return {
            initial: n === !1 || At(n) ? n : void 0,
            animate: At(s) ? s : void 0
        }
    }
    return t.inherit !== !1 ? e : {}
}

function Ul(t) {
    const {
        initial: e,
        animate: n
    } = Nl(t, T.useContext(Zt));
    return T.useMemo(() => ({
        initial: e,
        animate: n
    }), [As(e), As(n)])
}

function As(t) {
    return Array.isArray(t) ? t.join(" ") : t
}
const bs = {
        animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"],
        exit: ["exit"],
        drag: ["drag", "dragControls"],
        focus: ["whileFocus"],
        hover: ["whileHover", "onHoverStart", "onHoverEnd"],
        tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
        pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
        inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
        layout: ["layout", "layoutId"]
    },
    dt = {};
for (const t in bs) dt[t] = {
    isEnabled: e => bs[t].some(n => !!e[n])
};

function _l(t) {
    for (const e in t) dt[e] = { ...dt[e],
        ...t[e]
    }
}
const Kl = Symbol.for("motionComponentSymbol");

function Wl({
    preloadedFeatures: t,
    createVisualElement: e,
    useRender: n,
    useVisualState: s,
    Component: i
}) {
    t && _l(t);

    function r(a, l) {
        let u;
        const c = { ...T.useContext(nn),
                ...a,
                layoutId: $l(a)
            },
            {
                isStatic: h
            } = c,
            f = Ul(a),
            d = s(a, h);
        if (!h && sn) {
            Gl();
            const p = zl(c);
            u = p.MeasureLayout, f.visualElement = jl(i, d, c, e, p.ProjectionNode)
        }
        return G.jsxs(Zt.Provider, {
            value: f,
            children: [u && f.visualElement ? G.jsx(u, {
                visualElement: f.visualElement,
                ...c
            }) : null, n(i, a, Ol(d, f.visualElement, l), d, h, f.visualElement)]
        })
    }
    const o = T.forwardRef(r);
    return o[Kl] = i, o
}

function $l({
    layoutId: t
}) {
    const e = T.useContext(tn).id;
    return e && t !== void 0 ? e + "-" + t : t
}

function Gl(t, e) {
    T.useContext(Ui).strict
}

function zl(t) {
    const {
        drag: e,
        layout: n
    } = dt;
    if (!e && !n) return {};
    const s = { ...e,
        ...n
    };
    return {
        MeasureLayout: e != null && e.isEnabled(t) || n != null && n.isEnabled(t) ? s.MeasureLayout : void 0,
        ProjectionNode: s.ProjectionNode
    }
}
const Hl = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];

function on(t) {
    return typeof t != "string" || t.includes("-") ? !1 : !!(Hl.indexOf(t) > -1 || /[A-Z]/u.test(t))
}

function Wi(t, {
    style: e,
    vars: n
}, s, i) {
    Object.assign(t.style, e, i && i.getProjectionStyles(s));
    for (const r in n) t.style.setProperty(r, n[r])
}
const $i = new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]);

function Gi(t, e, n, s) {
    Wi(t, e, void 0, s);
    for (const i in e.attrs) t.setAttribute($i.has(i) ? i : Je(i), e.attrs[i])
}

function zi(t, {
    layout: e,
    layoutId: n
}) {
    return it.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Gt[t] || t === "opacity")
}

function rn(t, e, n) {
    var s;
    const {
        style: i
    } = t, r = {};
    for (const o in i)(F(i[o]) || e.style && F(e.style[o]) || zi(o, t) || ((s = n == null ? void 0 : n.getValue(o)) === null || s === void 0 ? void 0 : s.liveStyle) !== void 0) && (r[o] = i[o]);
    return r
}

function Hi(t, e, n) {
    const s = rn(t, e, n);
    for (const i in t)
        if (F(t[i]) || F(e[i])) {
            const r = Dt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
            s[r] = t[i]
        }
    return s
}

function an(t) {
    const e = T.useRef(null);
    return e.current === null && (e.current = t()), e.current
}

function Xl({
    scrapeMotionValuesFromProps: t,
    createRenderState: e,
    onMount: n
}, s, i, r) {
    const o = {
        latestValues: Yl(s, i, r, t),
        renderState: e()
    };
    return n && (o.mount = a => n(s, a, o)), o
}
const Xi = t => (e, n) => {
    const s = T.useContext(Zt),
        i = T.useContext(qt),
        r = () => Xl(t, e, s, i);
    return n ? r() : an(r)
};

function Yl(t, e, n, s) {
    const i = {},
        r = s(t, {});
    for (const f in r) i[f] = Nt(r[f]);
    let {
        initial: o,
        animate: a
    } = t;
    const l = Jt(t),
        u = Ki(t);
    e && u && !l && t.inherit !== !1 && (o === void 0 && (o = e.initial), a === void 0 && (a = e.animate));
    let c = n ? n.initial === !1 : !1;
    c = c || o === !1;
    const h = c ? a : o;
    if (h && typeof h != "boolean" && !Ht(h)) {
        const f = Array.isArray(h) ? h : [h];
        for (let d = 0; d < f.length; d++) {
            const p = Ee(t, f[d]);
            if (p) {
                const {
                    transitionEnd: g,
                    transition: x,
                    ...m
                } = p;
                for (const y in m) {
                    let v = m[y];
                    if (Array.isArray(v)) {
                        const b = c ? v.length - 1 : 0;
                        v = v[b]
                    }
                    v !== null && (i[y] = v)
                }
                for (const y in g) i[y] = g[y]
            }
        }
    }
    return i
}
const ln = () => ({
        style: {},
        transform: {},
        transformOrigin: {},
        vars: {}
    }),
    Yi = () => ({ ...ln(),
        attrs: {}
    }),
    qi = (t, e) => e && typeof t == "number" ? e.transform(t) : t,
    ql = {
        x: "translateX",
        y: "translateY",
        z: "translateZ",
        transformPerspective: "perspective"
    },
    Zl = Dt.length;

function Jl(t, e, n) {
    let s = "",
        i = !0;
    for (let r = 0; r < Zl; r++) {
        const o = Dt[r],
            a = t[o];
        if (a === void 0) continue;
        let l = !0;
        if (typeof a == "number" ? l = a === (o.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
            const u = qi(a, _e[o]);
            if (!l) {
                i = !1;
                const c = ql[o] || o;
                s += `${c}(${u}) `
            }
            n && (e[o] = u)
        }
    }
    return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s
}

function un(t, e, n) {
    const {
        style: s,
        vars: i,
        transformOrigin: r
    } = t;
    let o = !1,
        a = !1;
    for (const l in e) {
        const u = e[l];
        if (it.has(l)) {
            o = !0;
            continue
        } else if (Ks(l)) {
            i[l] = u;
            continue
        } else {
            const c = qi(u, _e[l]);
            l.startsWith("origin") ? (a = !0, r[l] = c) : s[l] = c
        }
    }
    if (e.transform || (o || n ? s.transform = Jl(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
        const {
            originX: l = "50%",
            originY: u = "50%",
            originZ: c = 0
        } = r;
        s.transformOrigin = `${l} ${u} ${c}`
    }
}

function ws(t, e, n) {
    return typeof t == "string" ? t : P.transform(e + n * t)
}

function Ql(t, e, n) {
    const s = ws(e, t.x, t.width),
        i = ws(n, t.y, t.height);
    return `${s} ${i}`
}
const tu = {
        offset: "stroke-dashoffset",
        array: "stroke-dasharray"
    },
    eu = {
        offset: "strokeDashoffset",
        array: "strokeDasharray"
    };

function nu(t, e, n = 1, s = 0, i = !0) {
    t.pathLength = 1;
    const r = i ? tu : eu;
    t[r.offset] = P.transform(-s);
    const o = P.transform(e),
        a = P.transform(n);
    t[r.array] = `${o} ${a}`
}

function cn(t, {
    attrX: e,
    attrY: n,
    attrScale: s,
    originX: i,
    originY: r,
    pathLength: o,
    pathSpacing: a = 1,
    pathOffset: l = 0,
    ...u
}, c, h) {
    if (un(t, u, h), c) {
        t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
        return
    }
    t.attrs = t.style, t.style = {};
    const {
        attrs: f,
        style: d,
        dimensions: p
    } = t;
    f.transform && (p && (d.transform = f.transform), delete f.transform), p && (i !== void 0 || r !== void 0 || d.transform) && (d.transformOrigin = Ql(p, i !== void 0 ? i : .5, r !== void 0 ? r : .5)), e !== void 0 && (f.x = e), n !== void 0 && (f.y = n), s !== void 0 && (f.scale = s), o !== void 0 && nu(f, o, a, l, !1)
}
const hn = t => typeof t == "string" && t.toLowerCase() === "svg",
    su = {
        useVisualState: Xi({
            scrapeMotionValuesFromProps: Hi,
            createRenderState: Yi,
            onMount: (t, e, {
                renderState: n,
                latestValues: s
            }) => {
                V.read(() => {
                    try {
                        n.dimensions = typeof e.getBBox == "function" ? e.getBBox() : e.getBoundingClientRect()
                    } catch {
                        n.dimensions = {
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        }
                    }
                }), V.render(() => {
                    cn(n, s, hn(e.tagName), t.transformTemplate), Gi(e, n)
                })
            }
        })
    },
    iu = {
        useVisualState: Xi({
            scrapeMotionValuesFromProps: rn,
            createRenderState: ln
        })
    };

function Zi(t, e, n) {
    for (const s in e) !F(e[s]) && !zi(s, n) && (t[s] = e[s])
}

function ou({
    transformTemplate: t
}, e) {
    return T.useMemo(() => {
        const n = ln();
        return un(n, e, t), Object.assign({}, n.vars, n.style)
    }, [e])
}

function ru(t, e) {
    const n = t.style || {},
        s = {};
    return Zi(s, n, t), Object.assign(s, ou(t, e)), s
}

function au(t, e) {
    const n = {},
        s = ru(t, e);
    return t.drag && t.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag==="x"?"y":"x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = s, n
}
const lu = new Set(["animate", "exit", "variants", "initial", "style", "values", "variants", "transition", "transformTemplate", "custom", "inherit", "onBeforeLayoutMeasure", "onAnimationStart", "onAnimationComplete", "onUpdate", "onDragStart", "onDrag", "onDragEnd", "onMeasureDragConstraints", "onDirectionLock", "onDragTransitionEnd", "_dragX", "_dragY", "onHoverStart", "onHoverEnd", "onViewportEnter", "onViewportLeave", "globalTapTarget", "ignoreStrict", "viewport"]);

function zt(t) {
    return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || lu.has(t)
}
let Ji = t => !zt(t);

function uu(t) {
    t && (Ji = e => e.startsWith("on") ? !zt(e) : t(e))
}
try {
    uu(require("@emotion/is-prop-valid").default)
} catch {}

function cu(t, e, n) {
    const s = {};
    for (const i in t) i === "values" && typeof t.values == "object" || (Ji(i) || n === !0 && zt(i) || !e && !zt(i) || t.draggable && i.startsWith("onDrag")) && (s[i] = t[i]);
    return s
}

function hu(t, e, n, s) {
    const i = T.useMemo(() => {
        const r = Yi();
        return cn(r, e, hn(s), t.transformTemplate), { ...r.attrs,
            style: { ...r.style
            }
        }
    }, [e]);
    if (t.style) {
        const r = {};
        Zi(r, t.style, t), i.style = { ...r,
            ...i.style
        }
    }
    return i
}

function fu(t = !1) {
    return (n, s, i, {
        latestValues: r
    }, o) => {
        const l = (on(n) ? hu : au)(s, r, o, n),
            u = cu(s, typeof n == "string", t),
            c = n !== T.Fragment ? { ...u,
                ...l,
                ref: i
            } : {},
            {
                children: h
            } = s,
            f = T.useMemo(() => F(h) ? h.get() : h, [h]);
        return T.createElement(n, { ...c,
            children: f
        })
    }
}

function du(t, e) {
    return function(s, {
        forwardMotionProps: i
    } = {
        forwardMotionProps: !1
    }) {
        const o = { ...on(s) ? su : iu,
            preloadedFeatures: t,
            useRender: fu(i),
            createVisualElement: e,
            Component: s
        };
        return Wl(o)
    }
}
const Re = {
        current: null
    },
    Qi = {
        current: !1
    };

function pu() {
    if (Qi.current = !0, !!sn)
        if (window.matchMedia) {
            const t = window.matchMedia("(prefers-reduced-motion)"),
                e = () => Re.current = t.matches;
            t.addListener(e), e()
        } else Re.current = !1
}

function mu(t, e, n) {
    for (const s in e) {
        const i = e[s],
            r = n[s];
        if (F(i)) t.addValue(s, i);
        else if (F(r)) t.addValue(s, Vt(i, {
            owner: t
        }));
        else if (r !== i)
            if (t.hasValue(s)) {
                const o = t.getValue(s);
                o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i)
            } else {
                const o = t.getStaticValue(s);
                t.addValue(s, Vt(o !== void 0 ? o : i, {
                    owner: t
                }))
            }
    }
    for (const s in n) e[s] === void 0 && t.removeValue(s);
    return e
}
const Vs = new WeakMap,
    gu = [...Gs, L, Z],
    yu = t => gu.find($s(t)),
    Cs = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
class vu {
    scrapeMotionValuesFromProps(e, n, s) {
        return {}
    }
    constructor({
        parent: e,
        props: n,
        presenceContext: s,
        reducedMotionConfig: i,
        blockInitialAnimation: r,
        visualState: o
    }, a = {}) {
        this.current = null, this.children = new Set, this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = new Map, this.KeyframeResolver = Oe, this.features = {}, this.valueSubscriptions = new Map, this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
            this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
        }, this.renderScheduledAt = 0, this.scheduleRender = () => {
            const f = W.now();
            this.renderScheduledAt < f && (this.renderScheduledAt = f, V.render(this.render, !1, !0))
        };
        const {
            latestValues: l,
            renderState: u
        } = o;
        this.latestValues = l, this.baseTarget = { ...l
        }, this.initialValues = n.initial ? { ...l
        } : {}, this.renderState = u, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!r, this.isControllingVariants = Jt(n), this.isVariantNode = Ki(n), this.isVariantNode && (this.variantChildren = new Set), this.manuallyAnimateOnMount = !!(e && e.current);
        const {
            willChange: c,
            ...h
        } = this.scrapeMotionValuesFromProps(n, {}, this);
        for (const f in h) {
            const d = h[f];
            l[f] !== void 0 && F(d) && d.set(l[f], !1)
        }
    }
    mount(e) {
        this.current = e, Vs.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), Qi.current || pu(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Re.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext)
    }
    unmount() {
        Vs.delete(this.current), this.projection && this.projection.unmount(), q(this.notifyUpdate), q(this.render), this.valueSubscriptions.forEach(e => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
        for (const e in this.events) this.events[e].clear();
        for (const e in this.features) {
            const n = this.features[e];
            n && (n.unmount(), n.isMounted = !1)
        }
        this.current = null
    }
    bindToMotionValue(e, n) {
        this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
        const s = it.has(e),
            i = n.on("change", a => {
                this.latestValues[e] = a, this.props.onUpdate && V.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0)
            }),
            r = n.on("renderRequest", this.scheduleRender);
        let o;
        window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
            i(), r(), o && o(), n.owner && n.stop()
        })
    }
    sortNodePosition(e) {
        return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current)
    }
    updateFeatures() {
        let e = "animation";
        for (e in dt) {
            const n = dt[e];
            if (!n) continue;
            const {
                isEnabled: s,
                Feature: i
            } = n;
            if (!this.features[e] && i && s(this.props) && (this.features[e] = new i(this)), this.features[e]) {
                const r = this.features[e];
                r.isMounted ? r.update() : (r.mount(), r.isMounted = !0)
            }
        }
    }
    triggerBuild() {
        this.build(this.renderState, this.latestValues, this.props)
    }
    measureViewportBox() {
        return this.current ? this.measureInstanceViewportBox(this.current, this.props) : M()
    }
    getStaticValue(e) {
        return this.latestValues[e]
    }
    setStaticValue(e, n) {
        this.latestValues[e] = n
    }
    update(e, n) {
        (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
        for (let s = 0; s < Cs.length; s++) {
            const i = Cs[s];
            this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
            const r = "on" + i,
                o = e[r];
            o && (this.propEventSubscriptions[i] = this.on(i, o))
        }
        this.prevMotionValues = mu(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue()
    }
    getProps() {
        return this.props
    }
    getVariant(e) {
        return this.props.variants ? this.props.variants[e] : void 0
    }
    getDefaultTransition() {
        return this.props.transition
    }
    getTransformPagePoint() {
        return this.props.transformPagePoint
    }
    getClosestVariantNode() {
        return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0
    }
    addVariantChild(e) {
        const n = this.getClosestVariantNode();
        if (n) return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e)
    }
    addValue(e, n) {
        const s = this.values.get(e);
        n !== s && (s && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get())
    }
    removeValue(e) {
        this.values.delete(e);
        const n = this.valueSubscriptions.get(e);
        n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState)
    }
    hasValue(e) {
        return this.values.has(e)
    }
    getValue(e, n) {
        if (this.props.values && this.props.values[e]) return this.props.values[e];
        let s = this.values.get(e);
        return s === void 0 && n !== void 0 && (s = Vt(n === null ? void 0 : n, {
            owner: this
        }), this.addValue(e, s)), s
    }
    readValue(e, n) {
        var s;
        let i = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : (s = this.getBaseTargetFromProps(this.props, e)) !== null && s !== void 0 ? s : this.readValueFromInstance(this.current, e, this.options);
        return i != null && (typeof i == "string" && (Us(i) || Ns(i)) ? i = parseFloat(i) : !yu(i) && Z.test(n) && (i = Qs(e, n)), this.setBaseTarget(e, F(i) ? i.get() : i)), F(i) ? i.get() : i
    }
    setBaseTarget(e, n) {
        this.baseTarget[e] = n
    }
    getBaseTarget(e) {
        var n;
        const {
            initial: s
        } = this.props;
        let i;
        if (typeof s == "string" || typeof s == "object") {
            const o = Ee(this.props, s, (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom);
            o && (i = o[e])
        }
        if (s && i !== void 0) return i;
        const r = this.getBaseTargetFromProps(this.props, e);
        return r !== void 0 && !F(r) ? r : this.initialValues[e] !== void 0 && i === void 0 ? void 0 : this.baseTarget[e]
    }
    on(e, n) {
        return this.events[e] || (this.events[e] = new Ze), this.events[e].add(n)
    }
    notify(e, ...n) {
        this.events[e] && this.events[e].notify(...n)
    }
}
class to extends vu {
    constructor() {
        super(...arguments), this.KeyframeResolver = ti
    }
    sortInstanceNodePosition(e, n) {
        return e.compareDocumentPosition(n) & 2 ? 1 : -1
    }
    getBaseTargetFromProps(e, n) {
        return e.style ? e.style[n] : void 0
    }
    removeValueFromRenderState(e, {
        vars: n,
        style: s
    }) {
        delete n[e], delete s[e]
    }
    handleChildMotionValue() {
        this.childSubscription && (this.childSubscription(), delete this.childSubscription);
        const {
            children: e
        } = this.props;
        F(e) && (this.childSubscription = e.on("change", n => {
            this.current && (this.current.textContent = `${n}`)
        }))
    }
}

function xu(t) {
    return window.getComputedStyle(t)
}
class Tu extends to {
    constructor() {
        super(...arguments), this.type = "html", this.renderInstance = Wi
    }
    readValueFromInstance(e, n) {
        if (it.has(n)) {
            const s = Ke(n);
            return s && s.default || 0
        } else {
            const s = xu(e),
                i = (Ks(n) ? s.getPropertyValue(n) : s[n]) || 0;
            return typeof i == "string" ? i.trim() : i
        }
    }
    measureInstanceViewportBox(e, {
        transformPagePoint: n
    }) {
        return Ci(e, n)
    }
    build(e, n, s) {
        un(e, n, s.transformTemplate)
    }
    scrapeMotionValuesFromProps(e, n, s) {
        return rn(e, n, s)
    }
}
class Pu extends to {
    constructor() {
        super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = M
    }
    getBaseTargetFromProps(e, n) {
        return e[n]
    }
    readValueFromInstance(e, n) {
        if (it.has(n)) {
            const s = Ke(n);
            return s && s.default || 0
        }
        return n = $i.has(n) ? n : Je(n), e.getAttribute(n)
    }
    scrapeMotionValuesFromProps(e, n, s) {
        return Hi(e, n, s)
    }
    build(e, n, s) {
        cn(e, n, this.isSVGTag, s.transformTemplate)
    }
    renderInstance(e, n, s, i) {
        Gi(e, n, s, i)
    }
    mount(e) {
        this.isSVGTag = hn(e.tagName), super.mount(e)
    }
}
const Su = (t, e) => on(t) ? new Pu(e) : new Tu(e, {
        allowProjection: t !== T.Fragment
    }),
    Au = du({ ...oa,
        ...Bl,
        ...Al,
        ...kl
    }, Su),
    Bu = no(Au);
class bu extends T.Component {
    getSnapshotBeforeUpdate(e) {
        const n = this.props.childRef.current;
        if (n && e.isPresent && !this.props.isPresent) {
            const s = this.props.sizeRef.current;
            s.height = n.offsetHeight || 0, s.width = n.offsetWidth || 0, s.top = n.offsetTop, s.left = n.offsetLeft
        }
        return null
    }
    componentDidUpdate() {}
    render() {
        return this.props.children
    }
}

function wu({
    children: t,
    isPresent: e
}) {
    const n = T.useId(),
        s = T.useRef(null),
        i = T.useRef({
            width: 0,
            height: 0,
            top: 0,
            left: 0
        }),
        {
            nonce: r
        } = T.useContext(nn);
    return T.useInsertionEffect(() => {
        const {
            width: o,
            height: a,
            top: l,
            left: u
        } = i.current;
        if (e || !s.current || !o || !a) return;
        s.current.dataset.motionPopId = n;
        const c = document.createElement("style");
        return r && (c.nonce = r), document.head.appendChild(c), c.sheet && c.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${u}px !important;
          }
        `), () => {
            document.head.removeChild(c)
        }
    }, [e]), G.jsx(bu, {
        isPresent: e,
        childRef: s,
        sizeRef: i,
        children: T.cloneElement(t, {
            ref: s
        })
    })
}
const Vu = ({
    children: t,
    initial: e,
    isPresent: n,
    onExitComplete: s,
    custom: i,
    presenceAffectsLayout: r,
    mode: o
}) => {
    const a = an(Cu),
        l = T.useId(),
        u = T.useCallback(h => {
            a.set(h, !0);
            for (const f of a.values())
                if (!f) return;
            s && s()
        }, [a, s]),
        c = T.useMemo(() => ({
            id: l,
            initial: e,
            isPresent: n,
            custom: i,
            onExitComplete: u,
            register: h => (a.set(h, !1), () => a.delete(h))
        }), r ? [Math.random(), u] : [n, u]);
    return T.useMemo(() => {
        a.forEach((h, f) => a.set(f, !1))
    }, [n]), T.useEffect(() => {
        !n && !a.size && s && s()
    }, [n]), o === "popLayout" && (t = G.jsx(wu, {
        isPresent: n,
        children: t
    })), G.jsx(qt.Provider, {
        value: c,
        children: t
    })
};

function Cu() {
    return new Map
}
const jt = t => t.key || "";

function Ds(t) {
    const e = [];
    return T.Children.forEach(t, n => {
        T.isValidElement(n) && e.push(n)
    }), e
}
const ku = ({
    children: t,
    exitBeforeEnter: e,
    custom: n,
    initial: s = !0,
    onExitComplete: i,
    presenceAffectsLayout: r = !0,
    mode: o = "sync"
}) => {
    const a = T.useMemo(() => Ds(t), [t]),
        l = a.map(jt),
        u = T.useRef(!0),
        c = T.useRef(a),
        h = an(() => new Map),
        [f, d] = T.useState(a),
        [p, g] = T.useState(a);
    Ni(() => {
        u.current = !1, c.current = a;
        for (let y = 0; y < p.length; y++) {
            const v = jt(p[y]);
            l.includes(v) ? h.delete(v) : h.get(v) !== !0 && h.set(v, !1)
        }
    }, [p, l.length, l.join("-")]);
    const x = [];
    if (a !== f) {
        let y = [...a];
        for (let v = 0; v < p.length; v++) {
            const b = p[v],
                S = jt(b);
            l.includes(S) || (y.splice(v, 0, b), x.push(b))
        }
        o === "wait" && x.length && (y = x), g(Ds(y)), d(a);
        return
    }
    const {
        forceRender: m
    } = T.useContext(tn);
    return G.jsx(G.Fragment, {
        children: p.map(y => {
            const v = jt(y),
                b = a === p || l.includes(v),
                S = () => {
                    if (h.has(v)) h.set(v, !0);
                    else return;
                    let w = !0;
                    h.forEach(R => {
                        R || (w = !1)
                    }), w && (m == null || m(), g(c.current), i && i())
                };
            return G.jsx(Vu, {
                isPresent: b,
                initial: !u.current || s ? void 0 : !1,
                custom: b ? void 0 : n,
                presenceAffectsLayout: r,
                mode: o,
                onExitComplete: b ? void 0 : S,
                children: y
            }, v)
        })
    })
};
export {
    ku as A, Bu as m
};