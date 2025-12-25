import {
    R as I
} from "./react-vendor.CoFnG1Cb.js";
var ct = r => r.type === "checkbox",
    Ee = r => r instanceof Date,
    J = r => r == null;
const yr = r => typeof r == "object";
var D = r => !J(r) && !Array.isArray(r) && yr(r) && !Ee(r),
    vr = r => D(r) && r.target ? ct(r.target) ? r.target.checked : r.target.value : r,
    Jr = r => r.substring(0, r.search(/\.\d+(\.|$)/)) || r,
    _r = (r, e) => r.has(Jr(e)),
    Yr = r => {
        const e = r.constructor && r.constructor.prototype;
        return D(e) && e.hasOwnProperty("isPrototypeOf")
    },
    $t = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";

function X(r) {
    let e;
    const t = Array.isArray(r),
        s = typeof FileList < "u" ? r instanceof FileList : !1;
    if (r instanceof Date) e = new Date(r);
    else if (r instanceof Set) e = new Set(r);
    else if (!($t && (r instanceof Blob || s)) && (t || D(r)))
        if (e = t ? [] : {}, !t && !Yr(r)) e = r;
        else
            for (const n in r) r.hasOwnProperty(n) && (e[n] = X(r[n]));
    else return r;
    return e
}
var St = r => Array.isArray(r) ? r.filter(Boolean) : [],
    Z = r => r === void 0,
    p = (r, e, t) => {
        if (!e || !D(r)) return t;
        const s = St(e.split(/[,[\].]+?/)).reduce((n, a) => J(n) ? n : n[a], r);
        return Z(s) || s === r ? Z(r[e]) ? t : r[e] : s
    },
    se = r => typeof r == "boolean",
    Ut = r => /^\w*$/.test(r),
    gr = r => St(r.replace(/["|']|\]/g, "").split(/\.|\[/)),
    F = (r, e, t) => {
        let s = -1;
        const n = Ut(e) ? [e] : gr(e),
            a = n.length,
            i = a - 1;
        for (; ++s < a;) {
            const u = n[s];
            let l = t;
            if (s !== i) {
                const h = r[u];
                l = D(h) || Array.isArray(h) ? h : isNaN(+n[s + 1]) ? {} : []
            }
            if (u === "__proto__" || u === "constructor" || u === "prototype") return;
            r[u] = l, r = r[u]
        }
        return r
    };
const pt = {
        BLUR: "blur",
        FOCUS_OUT: "focusout",
        CHANGE: "change"
    },
    ae = {
        onBlur: "onBlur",
        onChange: "onChange",
        onSubmit: "onSubmit",
        onTouched: "onTouched",
        all: "all"
    },
    ye = {
        max: "max",
        min: "min",
        maxLength: "maxLength",
        minLength: "minLength",
        pattern: "pattern",
        required: "required",
        validate: "validate"
    },
    xr = I.createContext(null),
    zt = () => I.useContext(xr),
    Sn = r => {
        const {
            children: e,
            ...t
        } = r;
        return I.createElement(xr.Provider, {
            value: t
        }, e)
    };
var br = (r, e, t, s = !0) => {
        const n = {
            defaultValues: e._defaultValues
        };
        for (const a in r) Object.defineProperty(n, a, {
            get: () => {
                const i = a;
                return e._proxyFormState[i] !== ae.all && (e._proxyFormState[i] = !s || ae.all), t && (t[i] = !0), r[i]
            }
        });
        return n
    },
    K = r => D(r) && !Object.keys(r).length,
    kr = (r, e, t, s) => {
        t(r);
        const {
            name: n,
            ...a
        } = r;
        return K(a) || Object.keys(a).length >= Object.keys(e).length || Object.keys(a).find(i => e[i] === (!s || ae.all))
    },
    Ye = r => Array.isArray(r) ? r : [r],
    wr = (r, e, t) => !r || !e || r === e || Ye(r).some(s => s && (t ? s === e : s.startsWith(e) || e.startsWith(s)));

function Bt(r) {
    const e = I.useRef(r);
    e.current = r, I.useEffect(() => {
        const t = !r.disabled && e.current.subject && e.current.subject.subscribe({
            next: e.current.next
        });
        return () => {
            t && t.unsubscribe()
        }
    }, [r.disabled])
}

function Gr(r) {
    const e = zt(),
        {
            control: t = e.control,
            disabled: s,
            name: n,
            exact: a
        } = r || {},
        [i, u] = I.useState(t._formState),
        l = I.useRef(!0),
        h = I.useRef({
            isDirty: !1,
            isLoading: !1,
            dirtyFields: !1,
            touchedFields: !1,
            validatingFields: !1,
            isValidating: !1,
            isValid: !1,
            errors: !1
        }),
        y = I.useRef(n);
    return y.current = n, Bt({
        disabled: s,
        next: k => l.current && wr(y.current, k.name, a) && kr(k, h.current, t._updateFormState) && u({ ...t._formState,
            ...k
        }),
        subject: t._subjects.state
    }), I.useEffect(() => (l.current = !0, h.current.isValid && t._updateValid(!0), () => {
        l.current = !1
    }), [t]), I.useMemo(() => br(i, t, h.current, !1), [i, t])
}
var ce = r => typeof r == "string",
    Tr = (r, e, t, s, n) => ce(r) ? (s && e.watch.add(r), p(t, r, n)) : Array.isArray(r) ? r.map(a => (s && e.watch.add(a), p(t, a))) : (s && (e.watchAll = !0), t);

function Xr(r) {
    const e = zt(),
        {
            control: t = e.control,
            name: s,
            defaultValue: n,
            disabled: a,
            exact: i
        } = r || {},
        u = I.useRef(s);
    u.current = s, Bt({
        disabled: a,
        subject: t._subjects.values,
        next: y => {
            wr(u.current, y.name, i) && h(X(Tr(u.current, t._names, y.values || t._formValues, !1, n)))
        }
    });
    const [l, h] = I.useState(t._getWatch(s, n));
    return I.useEffect(() => t._removeUnmounted()), l
}

function Kr(r) {
    const e = zt(),
        {
            name: t,
            disabled: s,
            control: n = e.control,
            shouldUnregister: a
        } = r,
        i = _r(n._names.array, t),
        u = Xr({
            control: n,
            name: t,
            defaultValue: p(n._formValues, t, p(n._defaultValues, t, r.defaultValue)),
            exact: !0
        }),
        l = Gr({
            control: n,
            name: t,
            exact: !0
        }),
        h = I.useRef(n.register(t, { ...r.rules,
            value: u,
            ...se(r.disabled) ? {
                disabled: r.disabled
            } : {}
        })),
        y = I.useMemo(() => Object.defineProperties({}, {
            invalid: {
                enumerable: !0,
                get: () => !!p(l.errors, t)
            },
            isDirty: {
                enumerable: !0,
                get: () => !!p(l.dirtyFields, t)
            },
            isTouched: {
                enumerable: !0,
                get: () => !!p(l.touchedFields, t)
            },
            isValidating: {
                enumerable: !0,
                get: () => !!p(l.validatingFields, t)
            },
            error: {
                enumerable: !0,
                get: () => p(l.errors, t)
            }
        }), [l, t]),
        k = I.useMemo(() => ({
            name: t,
            value: u,
            ...se(s) || l.disabled ? {
                disabled: l.disabled || s
            } : {},
            onChange: M => h.current.onChange({
                target: {
                    value: vr(M),
                    name: t
                },
                type: pt.CHANGE
            }),
            onBlur: () => h.current.onBlur({
                target: {
                    value: p(n._formValues, t),
                    name: t
                },
                type: pt.BLUR
            }),
            ref: M => {
                const G = p(n._fields, t);
                G && M && (G._f.ref = {
                    focus: () => M.focus(),
                    select: () => M.select(),
                    setCustomValidity: B => M.setCustomValidity(B),
                    reportValidity: () => M.reportValidity()
                })
            }
        }), [t, n._formValues, s, l.disabled, u, n._fields]);
    return I.useEffect(() => {
        const M = n._options.shouldUnregister || a,
            G = (B, H) => {
                const Q = p(n._fields, B);
                Q && Q._f && (Q._f.mount = H)
            };
        if (G(t, !0), M) {
            const B = X(p(n._options.defaultValues, t));
            F(n._defaultValues, t, B), Z(p(n._formValues, t)) && F(n._formValues, t, B)
        }
        return !i && n.register(t), () => {
            (i ? M && !n._state.action : M) ? n.unregister(t): G(t, !1)
        }
    }, [t, n, i, a]), I.useEffect(() => {
        n._updateDisabledField({
            disabled: s,
            fields: n._fields,
            name: t
        })
    }, [s, t, n]), I.useMemo(() => ({
        field: k,
        formState: l,
        fieldState: y
    }), [k, l, y])
}
const Cn = r => r.render(Kr(r));
var Qr = (r, e, t, s, n) => e ? { ...t[r],
        types: { ...t[r] && t[r].types ? t[r].types : {},
            [s]: n || !0
        }
    } : {},
    nr = r => ({
        isOnSubmit: !r || r === ae.onSubmit,
        isOnBlur: r === ae.onBlur,
        isOnChange: r === ae.onChange,
        isOnAll: r === ae.all,
        isOnTouch: r === ae.onTouched
    }),
    ar = (r, e, t) => !t && (e.watchAll || e.watch.has(r) || [...e.watch].some(s => r.startsWith(s) && /^\.\w+/.test(r.slice(s.length))));
const Ge = (r, e, t, s) => {
    for (const n of t || Object.keys(r)) {
        const a = p(r, n);
        if (a) {
            const {
                _f: i,
                ...u
            } = a;
            if (i) {
                if (i.refs && i.refs[0] && e(i.refs[0], n) && !s) return !0;
                if (i.ref && e(i.ref, i.name) && !s) return !0;
                if (Ge(u, e)) break
            } else if (D(u) && Ge(u, e)) break
        }
    }
};
var es = (r, e, t) => {
        const s = Ye(p(r, t));
        return F(s, "root", e[t]), F(r, t, s), r
    },
    Wt = r => r.type === "file",
    de = r => typeof r == "function",
    yt = r => {
        if (!$t) return !1;
        const e = r ? r.ownerDocument : 0;
        return r instanceof(e && e.defaultView ? e.defaultView.HTMLElement : HTMLElement)
    },
    mt = r => ce(r),
    qt = r => r.type === "radio",
    vt = r => r instanceof RegExp;
const ir = {
        value: !1,
        isValid: !1
    },
    or = {
        value: !0,
        isValid: !0
    };
var Ar = r => {
    if (Array.isArray(r)) {
        if (r.length > 1) {
            const e = r.filter(t => t && t.checked && !t.disabled).map(t => t.value);
            return {
                value: e,
                isValid: !!e.length
            }
        }
        return r[0].checked && !r[0].disabled ? r[0].attributes && !Z(r[0].attributes.value) ? Z(r[0].value) || r[0].value === "" ? or : {
            value: r[0].value,
            isValid: !0
        } : or : ir
    }
    return ir
};
const ur = {
    isValid: !1,
    value: null
};
var Sr = r => Array.isArray(r) ? r.reduce((e, t) => t && t.checked && !t.disabled ? {
    isValid: !0,
    value: t.value
} : e, ur) : ur;

function dr(r, e, t = "validate") {
    if (mt(r) || Array.isArray(r) && r.every(mt) || se(r) && !r) return {
        type: t,
        message: mt(r) ? r : "",
        ref: e
    }
}
var je = r => D(r) && !vt(r) ? r : {
        value: r,
        message: ""
    },
    cr = async (r, e, t, s, n, a) => {
        const {
            ref: i,
            refs: u,
            required: l,
            maxLength: h,
            minLength: y,
            min: k,
            max: M,
            pattern: G,
            validate: B,
            name: H,
            valueAsNumber: Q,
            mount: xe
        } = r._f, R = p(t, H);
        if (!xe || e.has(H)) return {};
        const me = u ? u[0] : i,
            pe = V => {
                n && me.reportValidity && (me.setCustomValidity(se(V) ? "" : V || ""), me.reportValidity())
            },
            L = {},
            Fe = qt(i),
            ft = ct(i),
            Ce = Fe || ft,
            Ie = (Q || Wt(i)) && Z(i.value) && Z(R) || yt(i) && i.value === "" || R === "" || Array.isArray(R) && !R.length,
            te = Qr.bind(null, H, s, L),
            ht = (V, N, P, W = ye.maxLength, ne = ye.minLength) => {
                const re = V ? N : P;
                L[H] = {
                    type: V ? W : ne,
                    message: re,
                    ref: i,
                    ...te(V ? W : ne, re)
                }
            };
        if (a ? !Array.isArray(R) || !R.length : l && (!Ce && (Ie || J(R)) || se(R) && !R || ft && !Ar(u).isValid || Fe && !Sr(u).isValid)) {
            const {
                value: V,
                message: N
            } = mt(l) ? {
                value: !!l,
                message: l
            } : je(l);
            if (V && (L[H] = {
                    type: ye.required,
                    message: N,
                    ref: me,
                    ...te(ye.required, N)
                }, !s)) return pe(N), L
        }
        if (!Ie && (!J(k) || !J(M))) {
            let V, N;
            const P = je(M),
                W = je(k);
            if (!J(R) && !isNaN(R)) {
                const ne = i.valueAsNumber || R && +R;
                J(P.value) || (V = ne > P.value), J(W.value) || (N = ne < W.value)
            } else {
                const ne = i.valueAsDate || new Date(R),
                    re = Be => new Date(new Date().toDateString() + " " + Be),
                    Ue = i.type == "time",
                    ze = i.type == "week";
                ce(P.value) && R && (V = Ue ? re(R) > re(P.value) : ze ? R > P.value : ne > new Date(P.value)), ce(W.value) && R && (N = Ue ? re(R) < re(W.value) : ze ? R < W.value : ne < new Date(W.value))
            }
            if ((V || N) && (ht(!!V, P.message, W.message, ye.max, ye.min), !s)) return pe(L[H].message), L
        }
        if ((h || y) && !Ie && (ce(R) || a && Array.isArray(R))) {
            const V = je(h),
                N = je(y),
                P = !J(V.value) && R.length > +V.value,
                W = !J(N.value) && R.length < +N.value;
            if ((P || W) && (ht(P, V.message, N.message), !s)) return pe(L[H].message), L
        }
        if (G && !Ie && ce(R)) {
            const {
                value: V,
                message: N
            } = je(G);
            if (vt(V) && !R.match(V) && (L[H] = {
                    type: ye.pattern,
                    message: N,
                    ref: i,
                    ...te(ye.pattern, N)
                }, !s)) return pe(N), L
        }
        if (B) {
            if (de(B)) {
                const V = await B(R, t),
                    N = dr(V, me);
                if (N && (L[H] = { ...N,
                        ...te(ye.validate, N.message)
                    }, !s)) return pe(N.message), L
            } else if (D(B)) {
                let V = {};
                for (const N in B) {
                    if (!K(V) && !s) break;
                    const P = dr(await B[N](R, t), me, N);
                    P && (V = { ...P,
                        ...te(N, P.message)
                    }, pe(P.message), s && (L[H] = V))
                }
                if (!K(V) && (L[H] = {
                        ref: me,
                        ...V
                    }, !s)) return L
            }
        }
        return pe(!0), L
    };

function ts(r, e) {
    const t = e.slice(0, -1).length;
    let s = 0;
    for (; s < t;) r = Z(r) ? s++ : r[e[s++]];
    return r
}

function rs(r) {
    for (const e in r)
        if (r.hasOwnProperty(e) && !Z(r[e])) return !1;
    return !0
}

function $(r, e) {
    const t = Array.isArray(e) ? e : Ut(e) ? [e] : gr(e),
        s = t.length === 1 ? r : ts(r, t),
        n = t.length - 1,
        a = t[n];
    return s && delete s[a], n !== 0 && (D(s) && K(s) || Array.isArray(s) && rs(s)) && $(r, t.slice(0, -1)), r
}
var Nt = () => {
        let r = [];
        return {
            get observers() {
                return r
            },
            next: n => {
                for (const a of r) a.next && a.next(n)
            },
            subscribe: n => (r.push(n), {
                unsubscribe: () => {
                    r = r.filter(a => a !== n)
                }
            }),
            unsubscribe: () => {
                r = []
            }
        }
    },
    Zt = r => J(r) || !yr(r);

function ke(r, e) {
    if (Zt(r) || Zt(e)) return r === e;
    if (Ee(r) && Ee(e)) return r.getTime() === e.getTime();
    const t = Object.keys(r),
        s = Object.keys(e);
    if (t.length !== s.length) return !1;
    for (const n of t) {
        const a = r[n];
        if (!s.includes(n)) return !1;
        if (n !== "ref") {
            const i = e[n];
            if (Ee(a) && Ee(i) || D(a) && D(i) || Array.isArray(a) && Array.isArray(i) ? !ke(a, i) : a !== i) return !1
        }
    }
    return !0
}
var Cr = r => r.type === "select-multiple",
    ss = r => qt(r) || ct(r),
    Ft = r => yt(r) && r.isConnected,
    Er = r => {
        for (const e in r)
            if (de(r[e])) return !0;
        return !1
    };

function _t(r, e = {}) {
    const t = Array.isArray(r);
    if (D(r) || t)
        for (const s in r) Array.isArray(r[s]) || D(r[s]) && !Er(r[s]) ? (e[s] = Array.isArray(r[s]) ? [] : {}, _t(r[s], e[s])) : J(r[s]) || (e[s] = !0);
    return e
}

function Vr(r, e, t) {
    const s = Array.isArray(r);
    if (D(r) || s)
        for (const n in r) Array.isArray(r[n]) || D(r[n]) && !Er(r[n]) ? Z(e) || Zt(t[n]) ? t[n] = Array.isArray(r[n]) ? _t(r[n], []) : { ..._t(r[n])
        } : Vr(r[n], J(e) ? {} : e[n], t[n]) : t[n] = !ke(r[n], e[n]);
    return t
}
var We = (r, e) => Vr(r, e, _t(e)),
    Or = (r, {
        valueAsNumber: e,
        valueAsDate: t,
        setValueAs: s
    }) => Z(r) ? r : e ? r === "" ? NaN : r && +r : t && ce(r) ? new Date(r) : s ? s(r) : r;

function It(r) {
    const e = r.ref;
    return Wt(e) ? e.files : qt(e) ? Sr(r.refs).value : Cr(e) ? [...e.selectedOptions].map(({
        value: t
    }) => t) : ct(e) ? Ar(r.refs).value : Or(Z(e.value) ? r.ref.value : e.value, r)
}
var ns = (r, e, t, s) => {
        const n = {};
        for (const a of r) {
            const i = p(e, a);
            i && F(n, a, i._f)
        }
        return {
            criteriaMode: t,
            names: [...r],
            fields: n,
            shouldUseNativeValidation: s
        }
    },
    qe = r => Z(r) ? r : vt(r) ? r.source : D(r) ? vt(r.value) ? r.value.source : r.value : r;
const lr = "AsyncFunction";
var as = r => !!r && !!r.validate && !!(de(r.validate) && r.validate.constructor.name === lr || D(r.validate) && Object.values(r.validate).find(e => e.constructor.name === lr)),
    is = r => r.mount && (r.required || r.min || r.max || r.maxLength || r.minLength || r.pattern || r.validate);

function fr(r, e, t) {
    const s = p(r, t);
    if (s || Ut(t)) return {
        error: s,
        name: t
    };
    const n = t.split(".");
    for (; n.length;) {
        const a = n.join("."),
            i = p(e, a),
            u = p(r, a);
        if (i && !Array.isArray(i) && t !== a) return {
            name: t
        };
        if (u && u.type) return {
            name: a,
            error: u
        };
        n.pop()
    }
    return {
        name: t
    }
}
var os = (r, e, t, s, n) => n.isOnAll ? !1 : !t && n.isOnTouch ? !(e || r) : (t ? s.isOnBlur : n.isOnBlur) ? !r : (t ? s.isOnChange : n.isOnChange) ? r : !0,
    us = (r, e) => !St(p(r, e)).length && $(r, e);
const ds = {
    mode: ae.onSubmit,
    reValidateMode: ae.onChange,
    shouldFocusError: !0
};

function cs(r = {}) {
    let e = { ...ds,
            ...r
        },
        t = {
            submitCount: 0,
            isDirty: !1,
            isLoading: de(e.defaultValues),
            isValidating: !1,
            isSubmitted: !1,
            isSubmitting: !1,
            isSubmitSuccessful: !1,
            isValid: !1,
            touchedFields: {},
            dirtyFields: {},
            validatingFields: {},
            errors: e.errors || {},
            disabled: e.disabled || !1
        },
        s = {},
        n = D(e.defaultValues) || D(e.values) ? X(e.defaultValues || e.values) || {} : {},
        a = e.shouldUnregister ? {} : X(n),
        i = {
            action: !1,
            mount: !1,
            watch: !1
        },
        u = {
            mount: new Set,
            disabled: new Set,
            unMount: new Set,
            array: new Set,
            watch: new Set
        },
        l, h = 0;
    const y = {
            isDirty: !1,
            dirtyFields: !1,
            validatingFields: !1,
            touchedFields: !1,
            isValidating: !1,
            isValid: !1,
            errors: !1
        },
        k = {
            values: Nt(),
            array: Nt(),
            state: Nt()
        },
        M = nr(e.mode),
        G = nr(e.reValidateMode),
        B = e.criteriaMode === ae.all,
        H = o => d => {
            clearTimeout(h), h = setTimeout(o, d)
        },
        Q = async o => {
            if (!e.disabled && (y.isValid || o)) {
                const d = e.resolver ? K((await Ce()).errors) : await te(s, !0);
                d !== t.isValid && k.state.next({
                    isValid: d
                })
            }
        },
        xe = (o, d) => {
            !e.disabled && (y.isValidating || y.validatingFields) && ((o || Array.from(u.mount)).forEach(c => {
                c && (d ? F(t.validatingFields, c, d) : $(t.validatingFields, c))
            }), k.state.next({
                validatingFields: t.validatingFields,
                isValidating: !K(t.validatingFields)
            }))
        },
        R = (o, d = [], c, g, v = !0, m = !0) => {
            if (g && c && !e.disabled) {
                if (i.action = !0, m && Array.isArray(p(s, o))) {
                    const w = c(p(s, o), g.argA, g.argB);
                    v && F(s, o, w)
                }
                if (m && Array.isArray(p(t.errors, o))) {
                    const w = c(p(t.errors, o), g.argA, g.argB);
                    v && F(t.errors, o, w), us(t.errors, o)
                }
                if (y.touchedFields && m && Array.isArray(p(t.touchedFields, o))) {
                    const w = c(p(t.touchedFields, o), g.argA, g.argB);
                    v && F(t.touchedFields, o, w)
                }
                y.dirtyFields && (t.dirtyFields = We(n, a)), k.state.next({
                    name: o,
                    isDirty: V(o, d),
                    dirtyFields: t.dirtyFields,
                    errors: t.errors,
                    isValid: t.isValid
                })
            } else F(a, o, d)
        },
        me = (o, d) => {
            F(t.errors, o, d), k.state.next({
                errors: t.errors
            })
        },
        pe = o => {
            t.errors = o, k.state.next({
                errors: t.errors,
                isValid: !1
            })
        },
        L = (o, d, c, g) => {
            const v = p(s, o);
            if (v) {
                const m = p(a, o, Z(c) ? p(n, o) : c);
                Z(m) || g && g.defaultChecked || d ? F(a, o, d ? m : It(v._f)) : W(o, m), i.mount && Q()
            }
        },
        Fe = (o, d, c, g, v) => {
            let m = !1,
                w = !1;
            const E = {
                name: o
            };
            if (!e.disabled) {
                const U = !!(p(s, o) && p(s, o)._f && p(s, o)._f.disabled);
                if (!c || g) {
                    y.isDirty && (w = t.isDirty, t.isDirty = E.isDirty = V(), m = w !== E.isDirty);
                    const z = U || ke(p(n, o), d);
                    w = !!(!U && p(t.dirtyFields, o)), z || U ? $(t.dirtyFields, o) : F(t.dirtyFields, o, !0), E.dirtyFields = t.dirtyFields, m = m || y.dirtyFields && w !== !z
                }
                if (c) {
                    const z = p(t.touchedFields, o);
                    z || (F(t.touchedFields, o, c), E.touchedFields = t.touchedFields, m = m || y.touchedFields && z !== c)
                }
                m && v && k.state.next(E)
            }
            return m ? E : {}
        },
        ft = (o, d, c, g) => {
            const v = p(t.errors, o),
                m = y.isValid && se(d) && t.isValid !== d;
            if (e.delayError && c ? (l = H(() => me(o, c)), l(e.delayError)) : (clearTimeout(h), l = null, c ? F(t.errors, o, c) : $(t.errors, o)), (c ? !ke(v, c) : v) || !K(g) || m) {
                const w = { ...g,
                    ...m && se(d) ? {
                        isValid: d
                    } : {},
                    errors: t.errors,
                    name: o
                };
                t = { ...t,
                    ...w
                }, k.state.next(w)
            }
        },
        Ce = async o => {
            xe(o, !0);
            const d = await e.resolver(a, e.context, ns(o || u.mount, s, e.criteriaMode, e.shouldUseNativeValidation));
            return xe(o), d
        },
        Ie = async o => {
            const {
                errors: d
            } = await Ce(o);
            if (o)
                for (const c of o) {
                    const g = p(d, c);
                    g ? F(t.errors, c, g) : $(t.errors, c)
                } else t.errors = d;
            return d
        },
        te = async (o, d, c = {
            valid: !0
        }) => {
            for (const g in o) {
                const v = o[g];
                if (v) {
                    const {
                        _f: m,
                        ...w
                    } = v;
                    if (m) {
                        const E = u.array.has(m.name),
                            U = v._f && as(v._f);
                        U && y.validatingFields && xe([g], !0);
                        const z = await cr(v, u.disabled, a, B, e.shouldUseNativeValidation && !d, E);
                        if (U && y.validatingFields && xe([g]), z[m.name] && (c.valid = !1, d)) break;
                        !d && (p(z, m.name) ? E ? es(t.errors, z, m.name) : F(t.errors, m.name, z[m.name]) : $(t.errors, m.name))
                    }!K(w) && await te(w, d, c)
                }
            }
            return c.valid
        },
        ht = () => {
            for (const o of u.unMount) {
                const d = p(s, o);
                d && (d._f.refs ? d._f.refs.every(c => !Ft(c)) : !Ft(d._f.ref)) && Et(o)
            }
            u.unMount = new Set
        },
        V = (o, d) => !e.disabled && (o && d && F(a, o, d), !ke(Jt(), n)),
        N = (o, d, c) => Tr(o, u, { ...i.mount ? a : Z(d) ? n : ce(o) ? {
                [o]: d
            } : d
        }, c, d),
        P = o => St(p(i.mount ? a : n, o, e.shouldUnregister ? p(n, o, []) : [])),
        W = (o, d, c = {}) => {
            const g = p(s, o);
            let v = d;
            if (g) {
                const m = g._f;
                m && (!m.disabled && F(a, o, Or(d, m)), v = yt(m.ref) && J(d) ? "" : d, Cr(m.ref) ? [...m.ref.options].forEach(w => w.selected = v.includes(w.value)) : m.refs ? ct(m.ref) ? m.refs.length > 1 ? m.refs.forEach(w => (!w.defaultChecked || !w.disabled) && (w.checked = Array.isArray(v) ? !!v.find(E => E === w.value) : v === w.value)) : m.refs[0] && (m.refs[0].checked = !!v) : m.refs.forEach(w => w.checked = w.value === v) : Wt(m.ref) ? m.ref.value = "" : (m.ref.value = v, m.ref.type || k.values.next({
                    name: o,
                    values: { ...a
                    }
                })))
            }(c.shouldDirty || c.shouldTouch) && Fe(o, v, c.shouldTouch, c.shouldDirty, !0), c.shouldValidate && Be(o)
        },
        ne = (o, d, c) => {
            for (const g in d) {
                const v = d[g],
                    m = `${o}.${g}`,
                    w = p(s, m);
                (u.array.has(o) || D(v) || w && !w._f) && !Ee(v) ? ne(m, v, c) : W(m, v, c)
            }
        },
        re = (o, d, c = {}) => {
            const g = p(s, o),
                v = u.array.has(o),
                m = X(d);
            F(a, o, m), v ? (k.array.next({
                name: o,
                values: { ...a
                }
            }), (y.isDirty || y.dirtyFields) && c.shouldDirty && k.state.next({
                name: o,
                dirtyFields: We(n, a),
                isDirty: V(o, m)
            })) : g && !g._f && !J(m) ? ne(o, m, c) : W(o, m, c), ar(o, u) && k.state.next({ ...t
            }), k.values.next({
                name: i.mount ? o : void 0,
                values: { ...a
                }
            })
        },
        Ue = async o => {
            i.mount = !0;
            const d = o.target;
            let c = d.name,
                g = !0;
            const v = p(s, c),
                m = () => d.type ? It(v._f) : vr(o),
                w = E => {
                    g = Number.isNaN(E) || Ee(E) && isNaN(E.getTime()) || ke(E, p(a, c, E))
                };
            if (v) {
                let E, U;
                const z = m(),
                    be = o.type === pt.BLUR || o.type === pt.FOCUS_OUT,
                    Wr = !is(v._f) && !e.resolver && !p(t.errors, c) && !v._f.deps || os(be, p(t.touchedFields, c), t.isSubmitted, G, M),
                    Ot = ar(c, u, be);
                F(a, c, z), be ? (v._f.onBlur && v._f.onBlur(o), l && l(0)) : v._f.onChange && v._f.onChange(o);
                const Rt = Fe(c, z, be, !1),
                    qr = !K(Rt) || Ot;
                if (!be && k.values.next({
                        name: c,
                        type: o.type,
                        values: { ...a
                        }
                    }), Wr) return y.isValid && (e.mode === "onBlur" && be ? Q() : be || Q()), qr && k.state.next({
                    name: c,
                    ...Ot ? {} : Rt
                });
                if (!be && Ot && k.state.next({ ...t
                    }), e.resolver) {
                    const {
                        errors: rr
                    } = await Ce([c]);
                    if (w(z), g) {
                        const Hr = fr(t.errors, s, c),
                            sr = fr(rr, s, Hr.name || c);
                        E = sr.error, c = sr.name, U = K(rr)
                    }
                } else xe([c], !0), E = (await cr(v, u.disabled, a, B, e.shouldUseNativeValidation))[c], xe([c]), w(z), g && (E ? U = !1 : y.isValid && (U = await te(s, !0)));
                g && (v._f.deps && Be(v._f.deps), ft(c, U, E, Rt))
            }
        },
        ze = (o, d) => {
            if (p(t.errors, d) && o.focus) return o.focus(), 1
        },
        Be = async (o, d = {}) => {
            let c, g;
            const v = Ye(o);
            if (e.resolver) {
                const m = await Ie(Z(o) ? o : v);
                c = K(m), g = o ? !v.some(w => p(m, w)) : c
            } else o ? (g = (await Promise.all(v.map(async m => {
                const w = p(s, m);
                return await te(w && w._f ? {
                    [m]: w
                } : w)
            }))).every(Boolean), !(!g && !t.isValid) && Q()) : g = c = await te(s);
            return k.state.next({ ...!ce(o) || y.isValid && c !== t.isValid ? {} : {
                    name: o
                },
                ...e.resolver || !o ? {
                    isValid: c
                } : {},
                errors: t.errors
            }), d.shouldFocus && !g && Ge(s, ze, o ? v : u.mount), g
        },
        Jt = o => {
            const d = { ...i.mount ? a : n
            };
            return Z(o) ? d : ce(o) ? p(d, o) : o.map(c => p(d, c))
        },
        Yt = (o, d) => ({
            invalid: !!p((d || t).errors, o),
            isDirty: !!p((d || t).dirtyFields, o),
            error: p((d || t).errors, o),
            isValidating: !!p(t.validatingFields, o),
            isTouched: !!p((d || t).touchedFields, o)
        }),
        $r = o => {
            o && Ye(o).forEach(d => $(t.errors, d)), k.state.next({
                errors: o ? t.errors : {}
            })
        },
        Gt = (o, d, c) => {
            const g = (p(s, o, {
                    _f: {}
                })._f || {}).ref,
                v = p(t.errors, o) || {},
                {
                    ref: m,
                    message: w,
                    type: E,
                    ...U
                } = v;
            F(t.errors, o, { ...U,
                ...d,
                ref: g
            }), k.state.next({
                name: o,
                errors: t.errors,
                isValid: !1
            }), c && c.shouldFocus && g && g.focus && g.focus()
        },
        Ur = (o, d) => de(o) ? k.values.subscribe({
            next: c => o(N(void 0, d), c)
        }) : N(o, d, !0),
        Et = (o, d = {}) => {
            for (const c of o ? Ye(o) : u.mount) u.mount.delete(c), u.array.delete(c), d.keepValue || ($(s, c), $(a, c)), !d.keepError && $(t.errors, c), !d.keepDirty && $(t.dirtyFields, c), !d.keepTouched && $(t.touchedFields, c), !d.keepIsValidating && $(t.validatingFields, c), !e.shouldUnregister && !d.keepDefaultValue && $(n, c);
            k.values.next({
                values: { ...a
                }
            }), k.state.next({ ...t,
                ...d.keepDirty ? {
                    isDirty: V()
                } : {}
            }), !d.keepIsValid && Q()
        },
        Xt = ({
            disabled: o,
            name: d,
            field: c,
            fields: g
        }) => {
            (se(o) && i.mount || o || u.disabled.has(d)) && (o ? u.disabled.add(d) : u.disabled.delete(d), Fe(d, It(c ? c._f : p(g, d)._f), !1, !1, !0))
        },
        Vt = (o, d = {}) => {
            let c = p(s, o);
            const g = se(d.disabled) || se(e.disabled);
            return F(s, o, { ...c || {},
                _f: { ...c && c._f ? c._f : {
                        ref: {
                            name: o
                        }
                    },
                    name: o,
                    mount: !0,
                    ...d
                }
            }), u.mount.add(o), c ? Xt({
                field: c,
                disabled: se(d.disabled) ? d.disabled : e.disabled,
                name: o
            }) : L(o, !0, d.value), { ...g ? {
                    disabled: d.disabled || e.disabled
                } : {},
                ...e.progressive ? {
                    required: !!d.required,
                    min: qe(d.min),
                    max: qe(d.max),
                    minLength: qe(d.minLength),
                    maxLength: qe(d.maxLength),
                    pattern: qe(d.pattern)
                } : {},
                name: o,
                onChange: Ue,
                onBlur: Ue,
                ref: v => {
                    if (v) {
                        Vt(o, d), c = p(s, o);
                        const m = Z(v.value) && v.querySelectorAll && v.querySelectorAll("input,select,textarea")[0] || v,
                            w = ss(m),
                            E = c._f.refs || [];
                        if (w ? E.find(U => U === m) : m === c._f.ref) return;
                        F(s, o, {
                            _f: { ...c._f,
                                ...w ? {
                                    refs: [...E.filter(Ft), m, ...Array.isArray(p(n, o)) ? [{}] : []],
                                    ref: {
                                        type: m.type,
                                        name: o
                                    }
                                } : {
                                    ref: m
                                }
                            }
                        }), L(o, !1, void 0, m)
                    } else c = p(s, o, {}), c._f && (c._f.mount = !1), (e.shouldUnregister || d.shouldUnregister) && !(_r(u.array, o) && i.action) && u.unMount.add(o)
                }
            }
        },
        Kt = () => e.shouldFocusError && Ge(s, ze, u.mount),
        zr = o => {
            se(o) && (k.state.next({
                disabled: o
            }), Ge(s, (d, c) => {
                const g = p(s, c);
                g && (d.disabled = g._f.disabled || o, Array.isArray(g._f.refs) && g._f.refs.forEach(v => {
                    v.disabled = g._f.disabled || o
                }))
            }, 0, !1))
        },
        Qt = (o, d) => async c => {
            let g;
            c && (c.preventDefault && c.preventDefault(), c.persist && c.persist());
            let v = X(a);
            if (u.disabled.size)
                for (const m of u.disabled) F(v, m, void 0);
            if (k.state.next({
                    isSubmitting: !0
                }), e.resolver) {
                const {
                    errors: m,
                    values: w
                } = await Ce();
                t.errors = m, v = w
            } else await te(s);
            if ($(t.errors, "root"), K(t.errors)) {
                k.state.next({
                    errors: {}
                });
                try {
                    await o(v, c)
                } catch (m) {
                    g = m
                }
            } else d && await d({ ...t.errors
            }, c), Kt(), setTimeout(Kt);
            if (k.state.next({
                    isSubmitted: !0,
                    isSubmitting: !1,
                    isSubmitSuccessful: K(t.errors) && !g,
                    submitCount: t.submitCount + 1,
                    errors: t.errors
                }), g) throw g
        },
        Br = (o, d = {}) => {
            p(s, o) && (Z(d.defaultValue) ? re(o, X(p(n, o))) : (re(o, d.defaultValue), F(n, o, X(d.defaultValue))), d.keepTouched || $(t.touchedFields, o), d.keepDirty || ($(t.dirtyFields, o), t.isDirty = d.defaultValue ? V(o, X(p(n, o))) : V()), d.keepError || ($(t.errors, o), y.isValid && Q()), k.state.next({ ...t
            }))
        },
        er = (o, d = {}) => {
            const c = o ? X(o) : n,
                g = X(c),
                v = K(o),
                m = v ? n : g;
            if (d.keepDefaultValues || (n = c), !d.keepValues) {
                if (d.keepDirtyValues) {
                    const w = new Set([...u.mount, ...Object.keys(We(n, a))]);
                    for (const E of Array.from(w)) p(t.dirtyFields, E) ? F(m, E, p(a, E)) : re(E, p(m, E))
                } else {
                    if ($t && Z(o))
                        for (const w of u.mount) {
                            const E = p(s, w);
                            if (E && E._f) {
                                const U = Array.isArray(E._f.refs) ? E._f.refs[0] : E._f.ref;
                                if (yt(U)) {
                                    const z = U.closest("form");
                                    if (z) {
                                        z.reset();
                                        break
                                    }
                                }
                            }
                        }
                    s = {}
                }
                a = e.shouldUnregister ? d.keepDefaultValues ? X(n) : {} : X(m), k.array.next({
                    values: { ...m
                    }
                }), k.values.next({
                    values: { ...m
                    }
                })
            }
            u = {
                mount: d.keepDirtyValues ? u.mount : new Set,
                unMount: new Set,
                array: new Set,
                disabled: new Set,
                watch: new Set,
                watchAll: !1,
                focus: ""
            }, i.mount = !y.isValid || !!d.keepIsValid || !!d.keepDirtyValues, i.watch = !!e.shouldUnregister, k.state.next({
                submitCount: d.keepSubmitCount ? t.submitCount : 0,
                isDirty: v ? !1 : d.keepDirty ? t.isDirty : !!(d.keepDefaultValues && !ke(o, n)),
                isSubmitted: d.keepIsSubmitted ? t.isSubmitted : !1,
                dirtyFields: v ? {} : d.keepDirtyValues ? d.keepDefaultValues && a ? We(n, a) : t.dirtyFields : d.keepDefaultValues && o ? We(n, o) : d.keepDirty ? t.dirtyFields : {},
                touchedFields: d.keepTouched ? t.touchedFields : {},
                errors: d.keepErrors ? t.errors : {},
                isSubmitSuccessful: d.keepIsSubmitSuccessful ? t.isSubmitSuccessful : !1,
                isSubmitting: !1
            })
        },
        tr = (o, d) => er(de(o) ? o(a) : o, d);
    return {
        control: {
            register: Vt,
            unregister: Et,
            getFieldState: Yt,
            handleSubmit: Qt,
            setError: Gt,
            _executeSchema: Ce,
            _getWatch: N,
            _getDirty: V,
            _updateValid: Q,
            _removeUnmounted: ht,
            _updateFieldArray: R,
            _updateDisabledField: Xt,
            _getFieldArray: P,
            _reset: er,
            _resetDefaultValues: () => de(e.defaultValues) && e.defaultValues().then(o => {
                tr(o, e.resetOptions), k.state.next({
                    isLoading: !1
                })
            }),
            _updateFormState: o => {
                t = { ...t,
                    ...o
                }
            },
            _disableForm: zr,
            _subjects: k,
            _proxyFormState: y,
            _setErrors: pe,
            get _fields() {
                return s
            },
            get _formValues() {
                return a
            },
            get _state() {
                return i
            },
            set _state(o) {
                i = o
            },
            get _defaultValues() {
                return n
            },
            get _names() {
                return u
            },
            set _names(o) {
                u = o
            },
            get _formState() {
                return t
            },
            set _formState(o) {
                t = o
            },
            get _options() {
                return e
            },
            set _options(o) {
                e = { ...e,
                    ...o
                }
            }
        },
        trigger: Be,
        register: Vt,
        handleSubmit: Qt,
        watch: Ur,
        setValue: re,
        getValues: Jt,
        reset: tr,
        resetField: Br,
        clearErrors: $r,
        unregister: Et,
        setError: Gt,
        setFocus: (o, d = {}) => {
            const c = p(s, o),
                g = c && c._f;
            if (g) {
                const v = g.refs ? g.refs[0] : g.ref;
                v.focus && (v.focus(), d.shouldSelect && de(v.select) && v.select())
            }
        },
        getFieldState: Yt
    }
}

function En(r = {}) {
    const e = I.useRef(void 0),
        t = I.useRef(void 0),
        [s, n] = I.useState({
            isDirty: !1,
            isValidating: !1,
            isLoading: de(r.defaultValues),
            isSubmitted: !1,
            isSubmitting: !1,
            isSubmitSuccessful: !1,
            isValid: !1,
            submitCount: 0,
            dirtyFields: {},
            touchedFields: {},
            validatingFields: {},
            errors: r.errors || {},
            disabled: r.disabled || !1,
            defaultValues: de(r.defaultValues) ? void 0 : r.defaultValues
        });
    e.current || (e.current = { ...cs(r),
        formState: s
    });
    const a = e.current.control;
    return a._options = r, Bt({
        subject: a._subjects.state,
        next: i => {
            kr(i, a._proxyFormState, a._updateFormState, !0) && n({ ...a._formState
            })
        }
    }), I.useEffect(() => a._disableForm(r.disabled), [a, r.disabled]), I.useEffect(() => {
        if (a._proxyFormState.isDirty) {
            const i = a._getDirty();
            i !== s.isDirty && a._subjects.state.next({
                isDirty: i
            })
        }
    }, [a, s.isDirty]), I.useEffect(() => {
        r.values && !ke(r.values, t.current) ? (a._reset(r.values, a._options.resetOptions), t.current = r.values, n(i => ({ ...i
        }))) : a._resetDefaultValues()
    }, [r.values, a]), I.useEffect(() => {
        r.errors && a._setErrors(r.errors)
    }, [r.errors, a]), I.useEffect(() => {
        a._state.mount || (a._updateValid(), a._state.mount = !0), a._state.watch && (a._state.watch = !1, a._subjects.state.next({ ...a._formState
        })), a._removeUnmounted()
    }), I.useEffect(() => {
        r.shouldUnregister && a._subjects.values.next({
            values: a._getWatch()
        })
    }, [r.shouldUnregister, a]), e.current.formState = br(s, a), e.current
}
var O;
(function(r) {
    r.assertEqual = n => n;

    function e(n) {}
    r.assertIs = e;

    function t(n) {
        throw new Error
    }
    r.assertNever = t, r.arrayToEnum = n => {
        const a = {};
        for (const i of n) a[i] = i;
        return a
    }, r.getValidEnumValues = n => {
        const a = r.objectKeys(n).filter(u => typeof n[n[u]] != "number"),
            i = {};
        for (const u of a) i[u] = n[u];
        return r.objectValues(i)
    }, r.objectValues = n => r.objectKeys(n).map(function(a) {
        return n[a]
    }), r.objectKeys = typeof Object.keys == "function" ? n => Object.keys(n) : n => {
        const a = [];
        for (const i in n) Object.prototype.hasOwnProperty.call(n, i) && a.push(i);
        return a
    }, r.find = (n, a) => {
        for (const i of n)
            if (a(i)) return i
    }, r.isInteger = typeof Number.isInteger == "function" ? n => Number.isInteger(n) : n => typeof n == "number" && isFinite(n) && Math.floor(n) === n;

    function s(n, a = " | ") {
        return n.map(i => typeof i == "string" ? `'${i}'` : i).join(a)
    }
    r.joinValues = s, r.jsonStringifyReplacer = (n, a) => typeof a == "bigint" ? a.toString() : a
})(O || (O = {}));
var Dt;
(function(r) {
    r.mergeShapes = (e, t) => ({ ...e,
        ...t
    })
})(Dt || (Dt = {}));
const x = O.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]),
    _e = r => {
        switch (typeof r) {
            case "undefined":
                return x.undefined;
            case "string":
                return x.string;
            case "number":
                return isNaN(r) ? x.nan : x.number;
            case "boolean":
                return x.boolean;
            case "function":
                return x.function;
            case "bigint":
                return x.bigint;
            case "symbol":
                return x.symbol;
            case "object":
                return Array.isArray(r) ? x.array : r === null ? x.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? x.promise : typeof Map < "u" && r instanceof Map ? x.map : typeof Set < "u" && r instanceof Set ? x.set : typeof Date < "u" && r instanceof Date ? x.date : x.object;
            default:
                return x.unknown
        }
    },
    f = O.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]),
    ls = r => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class ee extends Error {
    get errors() {
        return this.issues
    }
    constructor(e) {
        super(), this.issues = [], this.addIssue = s => {
            this.issues = [...this.issues, s]
        }, this.addIssues = (s = []) => {
            this.issues = [...this.issues, ...s]
        };
        const t = new.target.prototype;
        Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e
    }
    format(e) {
        const t = e || function(a) {
                return a.message
            },
            s = {
                _errors: []
            },
            n = a => {
                for (const i of a.issues)
                    if (i.code === "invalid_union") i.unionErrors.map(n);
                    else if (i.code === "invalid_return_type") n(i.returnTypeError);
                else if (i.code === "invalid_arguments") n(i.argumentsError);
                else if (i.path.length === 0) s._errors.push(t(i));
                else {
                    let u = s,
                        l = 0;
                    for (; l < i.path.length;) {
                        const h = i.path[l];
                        l === i.path.length - 1 ? (u[h] = u[h] || {
                            _errors: []
                        }, u[h]._errors.push(t(i))) : u[h] = u[h] || {
                            _errors: []
                        }, u = u[h], l++
                    }
                }
            };
        return n(this), s
    }
    static assert(e) {
        if (!(e instanceof ee)) throw new Error(`Not a ZodError: ${e}`)
    }
    toString() {
        return this.message
    }
    get message() {
        return JSON.stringify(this.issues, O.jsonStringifyReplacer, 2)
    }
    get isEmpty() {
        return this.issues.length === 0
    }
    flatten(e = t => t.message) {
        const t = {},
            s = [];
        for (const n of this.issues) n.path.length > 0 ? (t[n.path[0]] = t[n.path[0]] || [], t[n.path[0]].push(e(n))) : s.push(e(n));
        return {
            formErrors: s,
            fieldErrors: t
        }
    }
    get formErrors() {
        return this.flatten()
    }
}
ee.create = r => new ee(r);
const Le = (r, e) => {
    let t;
    switch (r.code) {
        case f.invalid_type:
            r.received === x.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
            break;
        case f.invalid_literal:
            t = `Invalid literal value, expected ${JSON.stringify(r.expected,O.jsonStringifyReplacer)}`;
            break;
        case f.unrecognized_keys:
            t = `Unrecognized key(s) in object: ${O.joinValues(r.keys,", ")}`;
            break;
        case f.invalid_union:
            t = "Invalid input";
            break;
        case f.invalid_union_discriminator:
            t = `Invalid discriminator value. Expected ${O.joinValues(r.options)}`;
            break;
        case f.invalid_enum_value:
            t = `Invalid enum value. Expected ${O.joinValues(r.options)}, received '${r.received}'`;
            break;
        case f.invalid_arguments:
            t = "Invalid function arguments";
            break;
        case f.invalid_return_type:
            t = "Invalid function return type";
            break;
        case f.invalid_date:
            t = "Invalid date";
            break;
        case f.invalid_string:
            typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : O.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
            break;
        case f.too_small:
            r.type === "array" ? t = `Array must contain ${r.exact?"exactly":r.inclusive?"at least":"more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact?"exactly":r.inclusive?"at least":"over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact?"exactly equal to ":r.inclusive?"greater than or equal to ":"greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact?"exactly equal to ":r.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
            break;
        case f.too_big:
            r.type === "array" ? t = `Array must contain ${r.exact?"exactly":r.inclusive?"at most":"less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact?"exactly":r.inclusive?"at most":"under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact?"exactly":r.inclusive?"less than or equal to":"less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact?"exactly":r.inclusive?"less than or equal to":"less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact?"exactly":r.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
            break;
        case f.custom:
            t = "Invalid input";
            break;
        case f.invalid_intersection_types:
            t = "Intersection results could not be merged";
            break;
        case f.not_multiple_of:
            t = `Number must be a multiple of ${r.multipleOf}`;
            break;
        case f.not_finite:
            t = "Number must be finite";
            break;
        default:
            t = e.defaultError, O.assertNever(r)
    }
    return {
        message: t
    }
};
let Rr = Le;

function fs(r) {
    Rr = r
}

function gt() {
    return Rr
}
const xt = r => {
        const {
            data: e,
            path: t,
            errorMaps: s,
            issueData: n
        } = r, a = [...t, ...n.path || []], i = { ...n,
            path: a
        };
        if (n.message !== void 0) return { ...n,
            path: a,
            message: n.message
        };
        let u = "";
        const l = s.filter(h => !!h).slice().reverse();
        for (const h of l) u = h(i, {
            data: e,
            defaultError: u
        }).message;
        return { ...n,
            path: a,
            message: u
        }
    },
    hs = [];

function _(r, e) {
    const t = gt(),
        s = xt({
            issueData: e,
            data: r.data,
            path: r.path,
            errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, t, t === Le ? void 0 : Le].filter(n => !!n)
        });
    r.common.issues.push(s)
}
class q {
    constructor() {
        this.value = "valid"
    }
    dirty() {
        this.value === "valid" && (this.value = "dirty")
    }
    abort() {
        this.value !== "aborted" && (this.value = "aborted")
    }
    static mergeArray(e, t) {
        const s = [];
        for (const n of t) {
            if (n.status === "aborted") return A;
            n.status === "dirty" && e.dirty(), s.push(n.value)
        }
        return {
            status: e.value,
            value: s
        }
    }
    static async mergeObjectAsync(e, t) {
        const s = [];
        for (const n of t) {
            const a = await n.key,
                i = await n.value;
            s.push({
                key: a,
                value: i
            })
        }
        return q.mergeObjectSync(e, s)
    }
    static mergeObjectSync(e, t) {
        const s = {};
        for (const n of t) {
            const {
                key: a,
                value: i
            } = n;
            if (a.status === "aborted" || i.status === "aborted") return A;
            a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || n.alwaysSet) && (s[a.value] = i.value)
        }
        return {
            status: e.value,
            value: s
        }
    }
}
const A = Object.freeze({
        status: "aborted"
    }),
    De = r => ({
        status: "dirty",
        value: r
    }),
    Y = r => ({
        status: "valid",
        value: r
    }),
    Mt = r => r.status === "aborted",
    Lt = r => r.status === "dirty",
    Oe = r => r.status === "valid",
    Xe = r => typeof Promise < "u" && r instanceof Promise;

function bt(r, e, t, s) {
    if (typeof e == "function" ? r !== e || !s : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return e.get(r)
}

function Nr(r, e, t, s, n) {
    if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return e.set(r, t), t
}
var b;
(function(r) {
    r.errToObj = e => typeof e == "string" ? {
        message: e
    } : e || {}, r.toString = e => typeof e == "string" ? e : e == null ? void 0 : e.message
})(b || (b = {}));
var He, Je;
class fe {
    constructor(e, t, s, n) {
        this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n
    }
    get path() {
        return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath
    }
}
const hr = (r, e) => {
    if (Oe(e)) return {
        success: !0,
        data: e.value
    };
    if (!r.common.issues.length) throw new Error("Validation failed but no issues detected.");
    return {
        success: !1,
        get error() {
            if (this._error) return this._error;
            const t = new ee(r.common.issues);
            return this._error = t, this._error
        }
    }
};

function S(r) {
    if (!r) return {};
    const {
        errorMap: e,
        invalid_type_error: t,
        required_error: s,
        description: n
    } = r;
    if (e && (t || s)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    return e ? {
        errorMap: e,
        description: n
    } : {
        errorMap: (i, u) => {
            var l, h;
            const {
                message: y
            } = r;
            return i.code === "invalid_enum_value" ? {
                message: y ? ? u.defaultError
            } : typeof u.data > "u" ? {
                message: (l = y ? ? s) !== null && l !== void 0 ? l : u.defaultError
            } : i.code !== "invalid_type" ? {
                message: u.defaultError
            } : {
                message: (h = y ? ? t) !== null && h !== void 0 ? h : u.defaultError
            }
        },
        description: n
    }
}
class C {
    get description() {
        return this._def.description
    }
    _getType(e) {
        return _e(e.data)
    }
    _getOrReturnCtx(e, t) {
        return t || {
            common: e.parent.common,
            data: e.data,
            parsedType: _e(e.data),
            schemaErrorMap: this._def.errorMap,
            path: e.path,
            parent: e.parent
        }
    }
    _processInputParams(e) {
        return {
            status: new q,
            ctx: {
                common: e.parent.common,
                data: e.data,
                parsedType: _e(e.data),
                schemaErrorMap: this._def.errorMap,
                path: e.path,
                parent: e.parent
            }
        }
    }
    _parseSync(e) {
        const t = this._parse(e);
        if (Xe(t)) throw new Error("Synchronous parse encountered promise.");
        return t
    }
    _parseAsync(e) {
        const t = this._parse(e);
        return Promise.resolve(t)
    }
    parse(e, t) {
        const s = this.safeParse(e, t);
        if (s.success) return s.data;
        throw s.error
    }
    safeParse(e, t) {
        var s;
        const n = {
                common: {
                    issues: [],
                    async: (s = t == null ? void 0 : t.async) !== null && s !== void 0 ? s : !1,
                    contextualErrorMap: t == null ? void 0 : t.errorMap
                },
                path: (t == null ? void 0 : t.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: e,
                parsedType: _e(e)
            },
            a = this._parseSync({
                data: e,
                path: n.path,
                parent: n
            });
        return hr(n, a)
    }
    "~validate" (e) {
        var t, s;
        const n = {
            common: {
                issues: [],
                async: !!this["~standard"].async
            },
            path: [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: e,
            parsedType: _e(e)
        };
        if (!this["~standard"].async) try {
            const a = this._parseSync({
                data: e,
                path: [],
                parent: n
            });
            return Oe(a) ? {
                value: a.value
            } : {
                issues: n.common.issues
            }
        } catch (a) {
            !((s = (t = a == null ? void 0 : a.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || s === void 0) && s.includes("encountered") && (this["~standard"].async = !0), n.common = {
                issues: [],
                async: !0
            }
        }
        return this._parseAsync({
            data: e,
            path: [],
            parent: n
        }).then(a => Oe(a) ? {
            value: a.value
        } : {
            issues: n.common.issues
        })
    }
    async parseAsync(e, t) {
        const s = await this.safeParseAsync(e, t);
        if (s.success) return s.data;
        throw s.error
    }
    async safeParseAsync(e, t) {
        const s = {
                common: {
                    issues: [],
                    contextualErrorMap: t == null ? void 0 : t.errorMap,
                    async: !0
                },
                path: (t == null ? void 0 : t.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: e,
                parsedType: _e(e)
            },
            n = this._parse({
                data: e,
                path: s.path,
                parent: s
            }),
            a = await (Xe(n) ? n : Promise.resolve(n));
        return hr(s, a)
    }
    refine(e, t) {
        const s = n => typeof t == "string" || typeof t > "u" ? {
            message: t
        } : typeof t == "function" ? t(n) : t;
        return this._refinement((n, a) => {
            const i = e(n),
                u = () => a.addIssue({
                    code: f.custom,
                    ...s(n)
                });
            return typeof Promise < "u" && i instanceof Promise ? i.then(l => l ? !0 : (u(), !1)) : i ? !0 : (u(), !1)
        })
    }
    refinement(e, t) {
        return this._refinement((s, n) => e(s) ? !0 : (n.addIssue(typeof t == "function" ? t(s, n) : t), !1))
    }
    _refinement(e) {
        return new ue({
            schema: this,
            typeName: T.ZodEffects,
            effect: {
                type: "refinement",
                refinement: e
            }
        })
    }
    superRefine(e) {
        return this._refinement(e)
    }
    constructor(e) {
        this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: t => this["~validate"](t)
        }
    }
    optional() {
        return le.create(this, this._def)
    }
    nullable() {
        return Se.create(this, this._def)
    }
    nullish() {
        return this.nullable().optional()
    }
    array() {
        return oe.create(this)
    }
    promise() {
        return $e.create(this, this._def)
    }
    or(e) {
        return tt.create([this, e], this._def)
    }
    and(e) {
        return rt.create(this, e, this._def)
    }
    transform(e) {
        return new ue({ ...S(this._def),
            schema: this,
            typeName: T.ZodEffects,
            effect: {
                type: "transform",
                transform: e
            }
        })
    }
    default (e) {
        const t = typeof e == "function" ? e : () => e;
        return new ot({ ...S(this._def),
            innerType: this,
            defaultValue: t,
            typeName: T.ZodDefault
        })
    }
    brand() {
        return new Ht({
            typeName: T.ZodBranded,
            type: this,
            ...S(this._def)
        })
    } catch (e) {
        const t = typeof e == "function" ? e : () => e;
        return new ut({ ...S(this._def),
            innerType: this,
            catchValue: t,
            typeName: T.ZodCatch
        })
    }
    describe(e) {
        const t = this.constructor;
        return new t({ ...this._def,
            description: e
        })
    }
    pipe(e) {
        return lt.create(this, e)
    }
    readonly() {
        return dt.create(this)
    }
    isOptional() {
        return this.safeParse(void 0).success
    }
    isNullable() {
        return this.safeParse(null).success
    }
}
const ms = /^c[^\s-]{8,}$/i,
    ps = /^[0-9a-z]+$/,
    ys = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
    vs = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
    _s = /^[a-z0-9_-]{21}$/i,
    gs = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
    xs = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
    bs = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
    ks = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let jt;
const ws = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    Ts = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    As = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    Ss = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    Cs = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    Es = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    Fr = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",
    Vs = new RegExp(`^${Fr}$`);

function Ir(r) {
    let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
    return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e
}

function Os(r) {
    return new RegExp(`^${Ir(r)}$`)
}

function jr(r) {
    let e = `${Fr}T${Ir(r)}`;
    const t = [];
    return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`)
}

function Rs(r, e) {
    return !!((e === "v4" || !e) && ws.test(r) || (e === "v6" || !e) && As.test(r))
}

function Ns(r, e) {
    if (!gs.test(r)) return !1;
    try {
        const [t] = r.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(s));
        return !(typeof n != "object" || n === null || !n.typ || !n.alg || e && n.alg !== e)
    } catch {
        return !1
    }
}

function Fs(r, e) {
    return !!((e === "v4" || !e) && Ts.test(r) || (e === "v6" || !e) && Ss.test(r))
}
class ie extends C {
    _parse(e) {
        if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== x.string) {
            const a = this._getOrReturnCtx(e);
            return _(a, {
                code: f.invalid_type,
                expected: x.string,
                received: a.parsedType
            }), A
        }
        const s = new q;
        let n;
        for (const a of this._def.checks)
            if (a.kind === "min") e.data.length < a.value && (n = this._getOrReturnCtx(e, n), _(n, {
                code: f.too_small,
                minimum: a.value,
                type: "string",
                inclusive: !0,
                exact: !1,
                message: a.message
            }), s.dirty());
            else if (a.kind === "max") e.data.length > a.value && (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.too_big,
            maximum: a.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: a.message
        }), s.dirty());
        else if (a.kind === "length") {
            const i = e.data.length > a.value,
                u = e.data.length < a.value;
            (i || u) && (n = this._getOrReturnCtx(e, n), i ? _(n, {
                code: f.too_big,
                maximum: a.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: a.message
            }) : u && _(n, {
                code: f.too_small,
                minimum: a.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: a.message
            }), s.dirty())
        } else if (a.kind === "email") bs.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "email",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "emoji") jt || (jt = new RegExp(ks, "u")), jt.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "emoji",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "uuid") vs.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "uuid",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "nanoid") _s.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "nanoid",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "cuid") ms.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "cuid",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "cuid2") ps.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "cuid2",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "ulid") ys.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "ulid",
            code: f.invalid_string,
            message: a.message
        }), s.dirty());
        else if (a.kind === "url") try {
            new URL(e.data)
        } catch {
            n = this._getOrReturnCtx(e, n), _(n, {
                validation: "url",
                code: f.invalid_string,
                message: a.message
            }), s.dirty()
        } else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "regex",
            code: f.invalid_string,
            message: a.message
        }), s.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.invalid_string,
            validation: {
                includes: a.value,
                position: a.position
            },
            message: a.message
        }), s.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.invalid_string,
            validation: {
                startsWith: a.value
            },
            message: a.message
        }), s.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.invalid_string,
            validation: {
                endsWith: a.value
            },
            message: a.message
        }), s.dirty()) : a.kind === "datetime" ? jr(a).test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.invalid_string,
            validation: "datetime",
            message: a.message
        }), s.dirty()) : a.kind === "date" ? Vs.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.invalid_string,
            validation: "date",
            message: a.message
        }), s.dirty()) : a.kind === "time" ? Os(a).test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.invalid_string,
            validation: "time",
            message: a.message
        }), s.dirty()) : a.kind === "duration" ? xs.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "duration",
            code: f.invalid_string,
            message: a.message
        }), s.dirty()) : a.kind === "ip" ? Rs(e.data, a.version) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "ip",
            code: f.invalid_string,
            message: a.message
        }), s.dirty()) : a.kind === "jwt" ? Ns(e.data, a.alg) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "jwt",
            code: f.invalid_string,
            message: a.message
        }), s.dirty()) : a.kind === "cidr" ? Fs(e.data, a.version) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "cidr",
            code: f.invalid_string,
            message: a.message
        }), s.dirty()) : a.kind === "base64" ? Cs.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "base64",
            code: f.invalid_string,
            message: a.message
        }), s.dirty()) : a.kind === "base64url" ? Es.test(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
            validation: "base64url",
            code: f.invalid_string,
            message: a.message
        }), s.dirty()) : O.assertNever(a);
        return {
            status: s.value,
            value: e.data
        }
    }
    _regex(e, t, s) {
        return this.refinement(n => e.test(n), {
            validation: t,
            code: f.invalid_string,
            ...b.errToObj(s)
        })
    }
    _addCheck(e) {
        return new ie({ ...this._def,
            checks: [...this._def.checks, e]
        })
    }
    email(e) {
        return this._addCheck({
            kind: "email",
            ...b.errToObj(e)
        })
    }
    url(e) {
        return this._addCheck({
            kind: "url",
            ...b.errToObj(e)
        })
    }
    emoji(e) {
        return this._addCheck({
            kind: "emoji",
            ...b.errToObj(e)
        })
    }
    uuid(e) {
        return this._addCheck({
            kind: "uuid",
            ...b.errToObj(e)
        })
    }
    nanoid(e) {
        return this._addCheck({
            kind: "nanoid",
            ...b.errToObj(e)
        })
    }
    cuid(e) {
        return this._addCheck({
            kind: "cuid",
            ...b.errToObj(e)
        })
    }
    cuid2(e) {
        return this._addCheck({
            kind: "cuid2",
            ...b.errToObj(e)
        })
    }
    ulid(e) {
        return this._addCheck({
            kind: "ulid",
            ...b.errToObj(e)
        })
    }
    base64(e) {
        return this._addCheck({
            kind: "base64",
            ...b.errToObj(e)
        })
    }
    base64url(e) {
        return this._addCheck({
            kind: "base64url",
            ...b.errToObj(e)
        })
    }
    jwt(e) {
        return this._addCheck({
            kind: "jwt",
            ...b.errToObj(e)
        })
    }
    ip(e) {
        return this._addCheck({
            kind: "ip",
            ...b.errToObj(e)
        })
    }
    cidr(e) {
        return this._addCheck({
            kind: "cidr",
            ...b.errToObj(e)
        })
    }
    datetime(e) {
        var t, s;
        return typeof e == "string" ? this._addCheck({
            kind: "datetime",
            precision: null,
            offset: !1,
            local: !1,
            message: e
        }) : this._addCheck({
            kind: "datetime",
            precision: typeof(e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
            offset: (t = e == null ? void 0 : e.offset) !== null && t !== void 0 ? t : !1,
            local: (s = e == null ? void 0 : e.local) !== null && s !== void 0 ? s : !1,
            ...b.errToObj(e == null ? void 0 : e.message)
        })
    }
    date(e) {
        return this._addCheck({
            kind: "date",
            message: e
        })
    }
    time(e) {
        return typeof e == "string" ? this._addCheck({
            kind: "time",
            precision: null,
            message: e
        }) : this._addCheck({
            kind: "time",
            precision: typeof(e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
            ...b.errToObj(e == null ? void 0 : e.message)
        })
    }
    duration(e) {
        return this._addCheck({
            kind: "duration",
            ...b.errToObj(e)
        })
    }
    regex(e, t) {
        return this._addCheck({
            kind: "regex",
            regex: e,
            ...b.errToObj(t)
        })
    }
    includes(e, t) {
        return this._addCheck({
            kind: "includes",
            value: e,
            position: t == null ? void 0 : t.position,
            ...b.errToObj(t == null ? void 0 : t.message)
        })
    }
    startsWith(e, t) {
        return this._addCheck({
            kind: "startsWith",
            value: e,
            ...b.errToObj(t)
        })
    }
    endsWith(e, t) {
        return this._addCheck({
            kind: "endsWith",
            value: e,
            ...b.errToObj(t)
        })
    }
    min(e, t) {
        return this._addCheck({
            kind: "min",
            value: e,
            ...b.errToObj(t)
        })
    }
    max(e, t) {
        return this._addCheck({
            kind: "max",
            value: e,
            ...b.errToObj(t)
        })
    }
    length(e, t) {
        return this._addCheck({
            kind: "length",
            value: e,
            ...b.errToObj(t)
        })
    }
    nonempty(e) {
        return this.min(1, b.errToObj(e))
    }
    trim() {
        return new ie({ ...this._def,
            checks: [...this._def.checks, {
                kind: "trim"
            }]
        })
    }
    toLowerCase() {
        return new ie({ ...this._def,
            checks: [...this._def.checks, {
                kind: "toLowerCase"
            }]
        })
    }
    toUpperCase() {
        return new ie({ ...this._def,
            checks: [...this._def.checks, {
                kind: "toUpperCase"
            }]
        })
    }
    get isDatetime() {
        return !!this._def.checks.find(e => e.kind === "datetime")
    }
    get isDate() {
        return !!this._def.checks.find(e => e.kind === "date")
    }
    get isTime() {
        return !!this._def.checks.find(e => e.kind === "time")
    }
    get isDuration() {
        return !!this._def.checks.find(e => e.kind === "duration")
    }
    get isEmail() {
        return !!this._def.checks.find(e => e.kind === "email")
    }
    get isURL() {
        return !!this._def.checks.find(e => e.kind === "url")
    }
    get isEmoji() {
        return !!this._def.checks.find(e => e.kind === "emoji")
    }
    get isUUID() {
        return !!this._def.checks.find(e => e.kind === "uuid")
    }
    get isNANOID() {
        return !!this._def.checks.find(e => e.kind === "nanoid")
    }
    get isCUID() {
        return !!this._def.checks.find(e => e.kind === "cuid")
    }
    get isCUID2() {
        return !!this._def.checks.find(e => e.kind === "cuid2")
    }
    get isULID() {
        return !!this._def.checks.find(e => e.kind === "ulid")
    }
    get isIP() {
        return !!this._def.checks.find(e => e.kind === "ip")
    }
    get isCIDR() {
        return !!this._def.checks.find(e => e.kind === "cidr")
    }
    get isBase64() {
        return !!this._def.checks.find(e => e.kind === "base64")
    }
    get isBase64url() {
        return !!this._def.checks.find(e => e.kind === "base64url")
    }
    get minLength() {
        let e = null;
        for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
        return e
    }
    get maxLength() {
        let e = null;
        for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
        return e
    }
}
ie.create = r => {
    var e;
    return new ie({
        checks: [],
        typeName: T.ZodString,
        coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
        ...S(r)
    })
};

function Is(r, e) {
    const t = (r.toString().split(".")[1] || "").length,
        s = (e.toString().split(".")[1] || "").length,
        n = t > s ? t : s,
        a = parseInt(r.toFixed(n).replace(".", "")),
        i = parseInt(e.toFixed(n).replace(".", ""));
    return a % i / Math.pow(10, n)
}
class we extends C {
    constructor() {
        super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf
    }
    _parse(e) {
        if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== x.number) {
            const a = this._getOrReturnCtx(e);
            return _(a, {
                code: f.invalid_type,
                expected: x.number,
                received: a.parsedType
            }), A
        }
        let s;
        const n = new q;
        for (const a of this._def.checks) a.kind === "int" ? O.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.invalid_type,
            expected: "integer",
            received: "float",
            message: a.message
        }), n.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.too_small,
            minimum: a.value,
            type: "number",
            inclusive: a.inclusive,
            exact: !1,
            message: a.message
        }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.too_big,
            maximum: a.value,
            type: "number",
            inclusive: a.inclusive,
            exact: !1,
            message: a.message
        }), n.dirty()) : a.kind === "multipleOf" ? Is(e.data, a.value) !== 0 && (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.not_multiple_of,
            multipleOf: a.value,
            message: a.message
        }), n.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.not_finite,
            message: a.message
        }), n.dirty()) : O.assertNever(a);
        return {
            status: n.value,
            value: e.data
        }
    }
    gte(e, t) {
        return this.setLimit("min", e, !0, b.toString(t))
    }
    gt(e, t) {
        return this.setLimit("min", e, !1, b.toString(t))
    }
    lte(e, t) {
        return this.setLimit("max", e, !0, b.toString(t))
    }
    lt(e, t) {
        return this.setLimit("max", e, !1, b.toString(t))
    }
    setLimit(e, t, s, n) {
        return new we({ ...this._def,
            checks: [...this._def.checks, {
                kind: e,
                value: t,
                inclusive: s,
                message: b.toString(n)
            }]
        })
    }
    _addCheck(e) {
        return new we({ ...this._def,
            checks: [...this._def.checks, e]
        })
    }
    int(e) {
        return this._addCheck({
            kind: "int",
            message: b.toString(e)
        })
    }
    positive(e) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: !1,
            message: b.toString(e)
        })
    }
    negative(e) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: !1,
            message: b.toString(e)
        })
    }
    nonpositive(e) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: !0,
            message: b.toString(e)
        })
    }
    nonnegative(e) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: !0,
            message: b.toString(e)
        })
    }
    multipleOf(e, t) {
        return this._addCheck({
            kind: "multipleOf",
            value: e,
            message: b.toString(t)
        })
    }
    finite(e) {
        return this._addCheck({
            kind: "finite",
            message: b.toString(e)
        })
    }
    safe(e) {
        return this._addCheck({
            kind: "min",
            inclusive: !0,
            value: Number.MIN_SAFE_INTEGER,
            message: b.toString(e)
        })._addCheck({
            kind: "max",
            inclusive: !0,
            value: Number.MAX_SAFE_INTEGER,
            message: b.toString(e)
        })
    }
    get minValue() {
        let e = null;
        for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
        return e
    }
    get maxValue() {
        let e = null;
        for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
        return e
    }
    get isInt() {
        return !!this._def.checks.find(e => e.kind === "int" || e.kind === "multipleOf" && O.isInteger(e.value))
    }
    get isFinite() {
        let e = null,
            t = null;
        for (const s of this._def.checks) {
            if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf") return !0;
            s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value)
        }
        return Number.isFinite(t) && Number.isFinite(e)
    }
}
we.create = r => new we({
    checks: [],
    typeName: T.ZodNumber,
    coerce: (r == null ? void 0 : r.coerce) || !1,
    ...S(r)
});
class Te extends C {
    constructor() {
        super(...arguments), this.min = this.gte, this.max = this.lte
    }
    _parse(e) {
        if (this._def.coerce) try {
            e.data = BigInt(e.data)
        } catch {
            return this._getInvalidInput(e)
        }
        if (this._getType(e) !== x.bigint) return this._getInvalidInput(e);
        let s;
        const n = new q;
        for (const a of this._def.checks) a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.too_small,
            type: "bigint",
            minimum: a.value,
            inclusive: a.inclusive,
            message: a.message
        }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.too_big,
            type: "bigint",
            maximum: a.value,
            inclusive: a.inclusive,
            message: a.message
        }), n.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), _(s, {
            code: f.not_multiple_of,
            multipleOf: a.value,
            message: a.message
        }), n.dirty()) : O.assertNever(a);
        return {
            status: n.value,
            value: e.data
        }
    }
    _getInvalidInput(e) {
        const t = this._getOrReturnCtx(e);
        return _(t, {
            code: f.invalid_type,
            expected: x.bigint,
            received: t.parsedType
        }), A
    }
    gte(e, t) {
        return this.setLimit("min", e, !0, b.toString(t))
    }
    gt(e, t) {
        return this.setLimit("min", e, !1, b.toString(t))
    }
    lte(e, t) {
        return this.setLimit("max", e, !0, b.toString(t))
    }
    lt(e, t) {
        return this.setLimit("max", e, !1, b.toString(t))
    }
    setLimit(e, t, s, n) {
        return new Te({ ...this._def,
            checks: [...this._def.checks, {
                kind: e,
                value: t,
                inclusive: s,
                message: b.toString(n)
            }]
        })
    }
    _addCheck(e) {
        return new Te({ ...this._def,
            checks: [...this._def.checks, e]
        })
    }
    positive(e) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: !1,
            message: b.toString(e)
        })
    }
    negative(e) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: !1,
            message: b.toString(e)
        })
    }
    nonpositive(e) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: !0,
            message: b.toString(e)
        })
    }
    nonnegative(e) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: !0,
            message: b.toString(e)
        })
    }
    multipleOf(e, t) {
        return this._addCheck({
            kind: "multipleOf",
            value: e,
            message: b.toString(t)
        })
    }
    get minValue() {
        let e = null;
        for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
        return e
    }
    get maxValue() {
        let e = null;
        for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
        return e
    }
}
Te.create = r => {
    var e;
    return new Te({
        checks: [],
        typeName: T.ZodBigInt,
        coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
        ...S(r)
    })
};
class Ke extends C {
    _parse(e) {
        if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== x.boolean) {
            const s = this._getOrReturnCtx(e);
            return _(s, {
                code: f.invalid_type,
                expected: x.boolean,
                received: s.parsedType
            }), A
        }
        return Y(e.data)
    }
}
Ke.create = r => new Ke({
    typeName: T.ZodBoolean,
    coerce: (r == null ? void 0 : r.coerce) || !1,
    ...S(r)
});
class Re extends C {
    _parse(e) {
        if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== x.date) {
            const a = this._getOrReturnCtx(e);
            return _(a, {
                code: f.invalid_type,
                expected: x.date,
                received: a.parsedType
            }), A
        }
        if (isNaN(e.data.getTime())) {
            const a = this._getOrReturnCtx(e);
            return _(a, {
                code: f.invalid_date
            }), A
        }
        const s = new q;
        let n;
        for (const a of this._def.checks) a.kind === "min" ? e.data.getTime() < a.value && (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.too_small,
            message: a.message,
            inclusive: !0,
            exact: !1,
            minimum: a.value,
            type: "date"
        }), s.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (n = this._getOrReturnCtx(e, n), _(n, {
            code: f.too_big,
            message: a.message,
            inclusive: !0,
            exact: !1,
            maximum: a.value,
            type: "date"
        }), s.dirty()) : O.assertNever(a);
        return {
            status: s.value,
            value: new Date(e.data.getTime())
        }
    }
    _addCheck(e) {
        return new Re({ ...this._def,
            checks: [...this._def.checks, e]
        })
    }
    min(e, t) {
        return this._addCheck({
            kind: "min",
            value: e.getTime(),
            message: b.toString(t)
        })
    }
    max(e, t) {
        return this._addCheck({
            kind: "max",
            value: e.getTime(),
            message: b.toString(t)
        })
    }
    get minDate() {
        let e = null;
        for (const t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
        return e != null ? new Date(e) : null
    }
    get maxDate() {
        let e = null;
        for (const t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
        return e != null ? new Date(e) : null
    }
}
Re.create = r => new Re({
    checks: [],
    coerce: (r == null ? void 0 : r.coerce) || !1,
    typeName: T.ZodDate,
    ...S(r)
});
class kt extends C {
    _parse(e) {
        if (this._getType(e) !== x.symbol) {
            const s = this._getOrReturnCtx(e);
            return _(s, {
                code: f.invalid_type,
                expected: x.symbol,
                received: s.parsedType
            }), A
        }
        return Y(e.data)
    }
}
kt.create = r => new kt({
    typeName: T.ZodSymbol,
    ...S(r)
});
class Qe extends C {
    _parse(e) {
        if (this._getType(e) !== x.undefined) {
            const s = this._getOrReturnCtx(e);
            return _(s, {
                code: f.invalid_type,
                expected: x.undefined,
                received: s.parsedType
            }), A
        }
        return Y(e.data)
    }
}
Qe.create = r => new Qe({
    typeName: T.ZodUndefined,
    ...S(r)
});
class et extends C {
    _parse(e) {
        if (this._getType(e) !== x.null) {
            const s = this._getOrReturnCtx(e);
            return _(s, {
                code: f.invalid_type,
                expected: x.null,
                received: s.parsedType
            }), A
        }
        return Y(e.data)
    }
}
et.create = r => new et({
    typeName: T.ZodNull,
    ...S(r)
});
class Pe extends C {
    constructor() {
        super(...arguments), this._any = !0
    }
    _parse(e) {
        return Y(e.data)
    }
}
Pe.create = r => new Pe({
    typeName: T.ZodAny,
    ...S(r)
});
class Ve extends C {
    constructor() {
        super(...arguments), this._unknown = !0
    }
    _parse(e) {
        return Y(e.data)
    }
}
Ve.create = r => new Ve({
    typeName: T.ZodUnknown,
    ...S(r)
});
class ge extends C {
    _parse(e) {
        const t = this._getOrReturnCtx(e);
        return _(t, {
            code: f.invalid_type,
            expected: x.never,
            received: t.parsedType
        }), A
    }
}
ge.create = r => new ge({
    typeName: T.ZodNever,
    ...S(r)
});
class wt extends C {
    _parse(e) {
        if (this._getType(e) !== x.undefined) {
            const s = this._getOrReturnCtx(e);
            return _(s, {
                code: f.invalid_type,
                expected: x.void,
                received: s.parsedType
            }), A
        }
        return Y(e.data)
    }
}
wt.create = r => new wt({
    typeName: T.ZodVoid,
    ...S(r)
});
class oe extends C {
    _parse(e) {
        const {
            ctx: t,
            status: s
        } = this._processInputParams(e), n = this._def;
        if (t.parsedType !== x.array) return _(t, {
            code: f.invalid_type,
            expected: x.array,
            received: t.parsedType
        }), A;
        if (n.exactLength !== null) {
            const i = t.data.length > n.exactLength.value,
                u = t.data.length < n.exactLength.value;
            (i || u) && (_(t, {
                code: i ? f.too_big : f.too_small,
                minimum: u ? n.exactLength.value : void 0,
                maximum: i ? n.exactLength.value : void 0,
                type: "array",
                inclusive: !0,
                exact: !0,
                message: n.exactLength.message
            }), s.dirty())
        }
        if (n.minLength !== null && t.data.length < n.minLength.value && (_(t, {
                code: f.too_small,
                minimum: n.minLength.value,
                type: "array",
                inclusive: !0,
                exact: !1,
                message: n.minLength.message
            }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (_(t, {
                code: f.too_big,
                maximum: n.maxLength.value,
                type: "array",
                inclusive: !0,
                exact: !1,
                message: n.maxLength.message
            }), s.dirty()), t.common.async) return Promise.all([...t.data].map((i, u) => n.type._parseAsync(new fe(t, i, t.path, u)))).then(i => q.mergeArray(s, i));
        const a = [...t.data].map((i, u) => n.type._parseSync(new fe(t, i, t.path, u)));
        return q.mergeArray(s, a)
    }
    get element() {
        return this._def.type
    }
    min(e, t) {
        return new oe({ ...this._def,
            minLength: {
                value: e,
                message: b.toString(t)
            }
        })
    }
    max(e, t) {
        return new oe({ ...this._def,
            maxLength: {
                value: e,
                message: b.toString(t)
            }
        })
    }
    length(e, t) {
        return new oe({ ...this._def,
            exactLength: {
                value: e,
                message: b.toString(t)
            }
        })
    }
    nonempty(e) {
        return this.min(1, e)
    }
}
oe.create = (r, e) => new oe({
    type: r,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: T.ZodArray,
    ...S(e)
});

function Ze(r) {
    if (r instanceof j) {
        const e = {};
        for (const t in r.shape) {
            const s = r.shape[t];
            e[t] = le.create(Ze(s))
        }
        return new j({ ...r._def,
            shape: () => e
        })
    } else return r instanceof oe ? new oe({ ...r._def,
        type: Ze(r.element)
    }) : r instanceof le ? le.create(Ze(r.unwrap())) : r instanceof Se ? Se.create(Ze(r.unwrap())) : r instanceof he ? he.create(r.items.map(e => Ze(e))) : r
}
class j extends C {
    constructor() {
        super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend
    }
    _getCached() {
        if (this._cached !== null) return this._cached;
        const e = this._def.shape(),
            t = O.objectKeys(e);
        return this._cached = {
            shape: e,
            keys: t
        }
    }
    _parse(e) {
        if (this._getType(e) !== x.object) {
            const h = this._getOrReturnCtx(e);
            return _(h, {
                code: f.invalid_type,
                expected: x.object,
                received: h.parsedType
            }), A
        }
        const {
            status: s,
            ctx: n
        } = this._processInputParams(e), {
            shape: a,
            keys: i
        } = this._getCached(), u = [];
        if (!(this._def.catchall instanceof ge && this._def.unknownKeys === "strip"))
            for (const h in n.data) i.includes(h) || u.push(h);
        const l = [];
        for (const h of i) {
            const y = a[h],
                k = n.data[h];
            l.push({
                key: {
                    status: "valid",
                    value: h
                },
                value: y._parse(new fe(n, k, n.path, h)),
                alwaysSet: h in n.data
            })
        }
        if (this._def.catchall instanceof ge) {
            const h = this._def.unknownKeys;
            if (h === "passthrough")
                for (const y of u) l.push({
                    key: {
                        status: "valid",
                        value: y
                    },
                    value: {
                        status: "valid",
                        value: n.data[y]
                    }
                });
            else if (h === "strict") u.length > 0 && (_(n, {
                code: f.unrecognized_keys,
                keys: u
            }), s.dirty());
            else if (h !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.")
        } else {
            const h = this._def.catchall;
            for (const y of u) {
                const k = n.data[y];
                l.push({
                    key: {
                        status: "valid",
                        value: y
                    },
                    value: h._parse(new fe(n, k, n.path, y)),
                    alwaysSet: y in n.data
                })
            }
        }
        return n.common.async ? Promise.resolve().then(async () => {
            const h = [];
            for (const y of l) {
                const k = await y.key,
                    M = await y.value;
                h.push({
                    key: k,
                    value: M,
                    alwaysSet: y.alwaysSet
                })
            }
            return h
        }).then(h => q.mergeObjectSync(s, h)) : q.mergeObjectSync(s, l)
    }
    get shape() {
        return this._def.shape()
    }
    strict(e) {
        return b.errToObj, new j({ ...this._def,
            unknownKeys: "strict",
            ...e !== void 0 ? {
                errorMap: (t, s) => {
                    var n, a, i, u;
                    const l = (i = (a = (n = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(n, t, s).message) !== null && i !== void 0 ? i : s.defaultError;
                    return t.code === "unrecognized_keys" ? {
                        message: (u = b.errToObj(e).message) !== null && u !== void 0 ? u : l
                    } : {
                        message: l
                    }
                }
            } : {}
        })
    }
    strip() {
        return new j({ ...this._def,
            unknownKeys: "strip"
        })
    }
    passthrough() {
        return new j({ ...this._def,
            unknownKeys: "passthrough"
        })
    }
    extend(e) {
        return new j({ ...this._def,
            shape: () => ({ ...this._def.shape(),
                ...e
            })
        })
    }
    merge(e) {
        return new j({
            unknownKeys: e._def.unknownKeys,
            catchall: e._def.catchall,
            shape: () => ({ ...this._def.shape(),
                ...e._def.shape()
            }),
            typeName: T.ZodObject
        })
    }
    setKey(e, t) {
        return this.augment({
            [e]: t
        })
    }
    catchall(e) {
        return new j({ ...this._def,
            catchall: e
        })
    }
    pick(e) {
        const t = {};
        return O.objectKeys(e).forEach(s => {
            e[s] && this.shape[s] && (t[s] = this.shape[s])
        }), new j({ ...this._def,
            shape: () => t
        })
    }
    omit(e) {
        const t = {};
        return O.objectKeys(this.shape).forEach(s => {
            e[s] || (t[s] = this.shape[s])
        }), new j({ ...this._def,
            shape: () => t
        })
    }
    deepPartial() {
        return Ze(this)
    }
    partial(e) {
        const t = {};
        return O.objectKeys(this.shape).forEach(s => {
            const n = this.shape[s];
            e && !e[s] ? t[s] = n : t[s] = n.optional()
        }), new j({ ...this._def,
            shape: () => t
        })
    }
    required(e) {
        const t = {};
        return O.objectKeys(this.shape).forEach(s => {
            if (e && !e[s]) t[s] = this.shape[s];
            else {
                let a = this.shape[s];
                for (; a instanceof le;) a = a._def.innerType;
                t[s] = a
            }
        }), new j({ ...this._def,
            shape: () => t
        })
    }
    keyof() {
        return Zr(O.objectKeys(this.shape))
    }
}
j.create = (r, e) => new j({
    shape: () => r,
    unknownKeys: "strip",
    catchall: ge.create(),
    typeName: T.ZodObject,
    ...S(e)
});
j.strictCreate = (r, e) => new j({
    shape: () => r,
    unknownKeys: "strict",
    catchall: ge.create(),
    typeName: T.ZodObject,
    ...S(e)
});
j.lazycreate = (r, e) => new j({
    shape: r,
    unknownKeys: "strip",
    catchall: ge.create(),
    typeName: T.ZodObject,
    ...S(e)
});
class tt extends C {
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e), s = this._def.options;

        function n(a) {
            for (const u of a)
                if (u.result.status === "valid") return u.result;
            for (const u of a)
                if (u.result.status === "dirty") return t.common.issues.push(...u.ctx.common.issues), u.result;
            const i = a.map(u => new ee(u.ctx.common.issues));
            return _(t, {
                code: f.invalid_union,
                unionErrors: i
            }), A
        }
        if (t.common.async) return Promise.all(s.map(async a => {
            const i = { ...t,
                common: { ...t.common,
                    issues: []
                },
                parent: null
            };
            return {
                result: await a._parseAsync({
                    data: t.data,
                    path: t.path,
                    parent: i
                }),
                ctx: i
            }
        })).then(n); {
            let a;
            const i = [];
            for (const l of s) {
                const h = { ...t,
                        common: { ...t.common,
                            issues: []
                        },
                        parent: null
                    },
                    y = l._parseSync({
                        data: t.data,
                        path: t.path,
                        parent: h
                    });
                if (y.status === "valid") return y;
                y.status === "dirty" && !a && (a = {
                    result: y,
                    ctx: h
                }), h.common.issues.length && i.push(h.common.issues)
            }
            if (a) return t.common.issues.push(...a.ctx.common.issues), a.result;
            const u = i.map(l => new ee(l));
            return _(t, {
                code: f.invalid_union,
                unionErrors: u
            }), A
        }
    }
    get options() {
        return this._def.options
    }
}
tt.create = (r, e) => new tt({
    options: r,
    typeName: T.ZodUnion,
    ...S(e)
});
const ve = r => r instanceof nt ? ve(r.schema) : r instanceof ue ? ve(r.innerType()) : r instanceof at ? [r.value] : r instanceof Ae ? r.options : r instanceof it ? O.objectValues(r.enum) : r instanceof ot ? ve(r._def.innerType) : r instanceof Qe ? [void 0] : r instanceof et ? [null] : r instanceof le ? [void 0, ...ve(r.unwrap())] : r instanceof Se ? [null, ...ve(r.unwrap())] : r instanceof Ht || r instanceof dt ? ve(r.unwrap()) : r instanceof ut ? ve(r._def.innerType) : [];
class Ct extends C {
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e);
        if (t.parsedType !== x.object) return _(t, {
            code: f.invalid_type,
            expected: x.object,
            received: t.parsedType
        }), A;
        const s = this.discriminator,
            n = t.data[s],
            a = this.optionsMap.get(n);
        return a ? t.common.async ? a._parseAsync({
            data: t.data,
            path: t.path,
            parent: t
        }) : a._parseSync({
            data: t.data,
            path: t.path,
            parent: t
        }) : (_(t, {
            code: f.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [s]
        }), A)
    }
    get discriminator() {
        return this._def.discriminator
    }
    get options() {
        return this._def.options
    }
    get optionsMap() {
        return this._def.optionsMap
    }
    static create(e, t, s) {
        const n = new Map;
        for (const a of t) {
            const i = ve(a.shape[e]);
            if (!i.length) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
            for (const u of i) {
                if (n.has(u)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(u)}`);
                n.set(u, a)
            }
        }
        return new Ct({
            typeName: T.ZodDiscriminatedUnion,
            discriminator: e,
            options: t,
            optionsMap: n,
            ...S(s)
        })
    }
}

function Pt(r, e) {
    const t = _e(r),
        s = _e(e);
    if (r === e) return {
        valid: !0,
        data: r
    };
    if (t === x.object && s === x.object) {
        const n = O.objectKeys(e),
            a = O.objectKeys(r).filter(u => n.indexOf(u) !== -1),
            i = { ...r,
                ...e
            };
        for (const u of a) {
            const l = Pt(r[u], e[u]);
            if (!l.valid) return {
                valid: !1
            };
            i[u] = l.data
        }
        return {
            valid: !0,
            data: i
        }
    } else if (t === x.array && s === x.array) {
        if (r.length !== e.length) return {
            valid: !1
        };
        const n = [];
        for (let a = 0; a < r.length; a++) {
            const i = r[a],
                u = e[a],
                l = Pt(i, u);
            if (!l.valid) return {
                valid: !1
            };
            n.push(l.data)
        }
        return {
            valid: !0,
            data: n
        }
    } else return t === x.date && s === x.date && +r == +e ? {
        valid: !0,
        data: r
    } : {
        valid: !1
    }
}
class rt extends C {
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e), n = (a, i) => {
            if (Mt(a) || Mt(i)) return A;
            const u = Pt(a.value, i.value);
            return u.valid ? ((Lt(a) || Lt(i)) && t.dirty(), {
                status: t.value,
                value: u.data
            }) : (_(s, {
                code: f.invalid_intersection_types
            }), A)
        };
        return s.common.async ? Promise.all([this._def.left._parseAsync({
            data: s.data,
            path: s.path,
            parent: s
        }), this._def.right._parseAsync({
            data: s.data,
            path: s.path,
            parent: s
        })]).then(([a, i]) => n(a, i)) : n(this._def.left._parseSync({
            data: s.data,
            path: s.path,
            parent: s
        }), this._def.right._parseSync({
            data: s.data,
            path: s.path,
            parent: s
        }))
    }
}
rt.create = (r, e, t) => new rt({
    left: r,
    right: e,
    typeName: T.ZodIntersection,
    ...S(t)
});
class he extends C {
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e);
        if (s.parsedType !== x.array) return _(s, {
            code: f.invalid_type,
            expected: x.array,
            received: s.parsedType
        }), A;
        if (s.data.length < this._def.items.length) return _(s, {
            code: f.too_small,
            minimum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: "array"
        }), A;
        !this._def.rest && s.data.length > this._def.items.length && (_(s, {
            code: f.too_big,
            maximum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: "array"
        }), t.dirty());
        const a = [...s.data].map((i, u) => {
            const l = this._def.items[u] || this._def.rest;
            return l ? l._parse(new fe(s, i, s.path, u)) : null
        }).filter(i => !!i);
        return s.common.async ? Promise.all(a).then(i => q.mergeArray(t, i)) : q.mergeArray(t, a)
    }
    get items() {
        return this._def.items
    }
    rest(e) {
        return new he({ ...this._def,
            rest: e
        })
    }
}
he.create = (r, e) => {
    if (!Array.isArray(r)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new he({
        items: r,
        typeName: T.ZodTuple,
        rest: null,
        ...S(e)
    })
};
class st extends C {
    get keySchema() {
        return this._def.keyType
    }
    get valueSchema() {
        return this._def.valueType
    }
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e);
        if (s.parsedType !== x.object) return _(s, {
            code: f.invalid_type,
            expected: x.object,
            received: s.parsedType
        }), A;
        const n = [],
            a = this._def.keyType,
            i = this._def.valueType;
        for (const u in s.data) n.push({
            key: a._parse(new fe(s, u, s.path, u)),
            value: i._parse(new fe(s, s.data[u], s.path, u)),
            alwaysSet: u in s.data
        });
        return s.common.async ? q.mergeObjectAsync(t, n) : q.mergeObjectSync(t, n)
    }
    get element() {
        return this._def.valueType
    }
    static create(e, t, s) {
        return t instanceof C ? new st({
            keyType: e,
            valueType: t,
            typeName: T.ZodRecord,
            ...S(s)
        }) : new st({
            keyType: ie.create(),
            valueType: e,
            typeName: T.ZodRecord,
            ...S(t)
        })
    }
}
class Tt extends C {
    get keySchema() {
        return this._def.keyType
    }
    get valueSchema() {
        return this._def.valueType
    }
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e);
        if (s.parsedType !== x.map) return _(s, {
            code: f.invalid_type,
            expected: x.map,
            received: s.parsedType
        }), A;
        const n = this._def.keyType,
            a = this._def.valueType,
            i = [...s.data.entries()].map(([u, l], h) => ({
                key: n._parse(new fe(s, u, s.path, [h, "key"])),
                value: a._parse(new fe(s, l, s.path, [h, "value"]))
            }));
        if (s.common.async) {
            const u = new Map;
            return Promise.resolve().then(async () => {
                for (const l of i) {
                    const h = await l.key,
                        y = await l.value;
                    if (h.status === "aborted" || y.status === "aborted") return A;
                    (h.status === "dirty" || y.status === "dirty") && t.dirty(), u.set(h.value, y.value)
                }
                return {
                    status: t.value,
                    value: u
                }
            })
        } else {
            const u = new Map;
            for (const l of i) {
                const h = l.key,
                    y = l.value;
                if (h.status === "aborted" || y.status === "aborted") return A;
                (h.status === "dirty" || y.status === "dirty") && t.dirty(), u.set(h.value, y.value)
            }
            return {
                status: t.value,
                value: u
            }
        }
    }
}
Tt.create = (r, e, t) => new Tt({
    valueType: e,
    keyType: r,
    typeName: T.ZodMap,
    ...S(t)
});
class Ne extends C {
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e);
        if (s.parsedType !== x.set) return _(s, {
            code: f.invalid_type,
            expected: x.set,
            received: s.parsedType
        }), A;
        const n = this._def;
        n.minSize !== null && s.data.size < n.minSize.value && (_(s, {
            code: f.too_small,
            minimum: n.minSize.value,
            type: "set",
            inclusive: !0,
            exact: !1,
            message: n.minSize.message
        }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (_(s, {
            code: f.too_big,
            maximum: n.maxSize.value,
            type: "set",
            inclusive: !0,
            exact: !1,
            message: n.maxSize.message
        }), t.dirty());
        const a = this._def.valueType;

        function i(l) {
            const h = new Set;
            for (const y of l) {
                if (y.status === "aborted") return A;
                y.status === "dirty" && t.dirty(), h.add(y.value)
            }
            return {
                status: t.value,
                value: h
            }
        }
        const u = [...s.data.values()].map((l, h) => a._parse(new fe(s, l, s.path, h)));
        return s.common.async ? Promise.all(u).then(l => i(l)) : i(u)
    }
    min(e, t) {
        return new Ne({ ...this._def,
            minSize: {
                value: e,
                message: b.toString(t)
            }
        })
    }
    max(e, t) {
        return new Ne({ ...this._def,
            maxSize: {
                value: e,
                message: b.toString(t)
            }
        })
    }
    size(e, t) {
        return this.min(e, t).max(e, t)
    }
    nonempty(e) {
        return this.min(1, e)
    }
}
Ne.create = (r, e) => new Ne({
    valueType: r,
    minSize: null,
    maxSize: null,
    typeName: T.ZodSet,
    ...S(e)
});
class Me extends C {
    constructor() {
        super(...arguments), this.validate = this.implement
    }
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e);
        if (t.parsedType !== x.function) return _(t, {
            code: f.invalid_type,
            expected: x.function,
            received: t.parsedType
        }), A;

        function s(u, l) {
            return xt({
                data: u,
                path: t.path,
                errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, gt(), Le].filter(h => !!h),
                issueData: {
                    code: f.invalid_arguments,
                    argumentsError: l
                }
            })
        }

        function n(u, l) {
            return xt({
                data: u,
                path: t.path,
                errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, gt(), Le].filter(h => !!h),
                issueData: {
                    code: f.invalid_return_type,
                    returnTypeError: l
                }
            })
        }
        const a = {
                errorMap: t.common.contextualErrorMap
            },
            i = t.data;
        if (this._def.returns instanceof $e) {
            const u = this;
            return Y(async function(...l) {
                const h = new ee([]),
                    y = await u._def.args.parseAsync(l, a).catch(G => {
                        throw h.addIssue(s(l, G)), h
                    }),
                    k = await Reflect.apply(i, this, y);
                return await u._def.returns._def.type.parseAsync(k, a).catch(G => {
                    throw h.addIssue(n(k, G)), h
                })
            })
        } else {
            const u = this;
            return Y(function(...l) {
                const h = u._def.args.safeParse(l, a);
                if (!h.success) throw new ee([s(l, h.error)]);
                const y = Reflect.apply(i, this, h.data),
                    k = u._def.returns.safeParse(y, a);
                if (!k.success) throw new ee([n(y, k.error)]);
                return k.data
            })
        }
    }
    parameters() {
        return this._def.args
    }
    returnType() {
        return this._def.returns
    }
    args(...e) {
        return new Me({ ...this._def,
            args: he.create(e).rest(Ve.create())
        })
    }
    returns(e) {
        return new Me({ ...this._def,
            returns: e
        })
    }
    implement(e) {
        return this.parse(e)
    }
    strictImplement(e) {
        return this.parse(e)
    }
    static create(e, t, s) {
        return new Me({
            args: e || he.create([]).rest(Ve.create()),
            returns: t || Ve.create(),
            typeName: T.ZodFunction,
            ...S(s)
        })
    }
}
class nt extends C {
    get schema() {
        return this._def.getter()
    }
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e);
        return this._def.getter()._parse({
            data: t.data,
            path: t.path,
            parent: t
        })
    }
}
nt.create = (r, e) => new nt({
    getter: r,
    typeName: T.ZodLazy,
    ...S(e)
});
class at extends C {
    _parse(e) {
        if (e.data !== this._def.value) {
            const t = this._getOrReturnCtx(e);
            return _(t, {
                received: t.data,
                code: f.invalid_literal,
                expected: this._def.value
            }), A
        }
        return {
            status: "valid",
            value: e.data
        }
    }
    get value() {
        return this._def.value
    }
}
at.create = (r, e) => new at({
    value: r,
    typeName: T.ZodLiteral,
    ...S(e)
});

function Zr(r, e) {
    return new Ae({
        values: r,
        typeName: T.ZodEnum,
        ...S(e)
    })
}
class Ae extends C {
    constructor() {
        super(...arguments), He.set(this, void 0)
    }
    _parse(e) {
        if (typeof e.data != "string") {
            const t = this._getOrReturnCtx(e),
                s = this._def.values;
            return _(t, {
                expected: O.joinValues(s),
                received: t.parsedType,
                code: f.invalid_type
            }), A
        }
        if (bt(this, He) || Nr(this, He, new Set(this._def.values)), !bt(this, He).has(e.data)) {
            const t = this._getOrReturnCtx(e),
                s = this._def.values;
            return _(t, {
                received: t.data,
                code: f.invalid_enum_value,
                options: s
            }), A
        }
        return Y(e.data)
    }
    get options() {
        return this._def.values
    }
    get enum() {
        const e = {};
        for (const t of this._def.values) e[t] = t;
        return e
    }
    get Values() {
        const e = {};
        for (const t of this._def.values) e[t] = t;
        return e
    }
    get Enum() {
        const e = {};
        for (const t of this._def.values) e[t] = t;
        return e
    }
    extract(e, t = this._def) {
        return Ae.create(e, { ...this._def,
            ...t
        })
    }
    exclude(e, t = this._def) {
        return Ae.create(this.options.filter(s => !e.includes(s)), { ...this._def,
            ...t
        })
    }
}
He = new WeakMap;
Ae.create = Zr;
class it extends C {
    constructor() {
        super(...arguments), Je.set(this, void 0)
    }
    _parse(e) {
        const t = O.getValidEnumValues(this._def.values),
            s = this._getOrReturnCtx(e);
        if (s.parsedType !== x.string && s.parsedType !== x.number) {
            const n = O.objectValues(t);
            return _(s, {
                expected: O.joinValues(n),
                received: s.parsedType,
                code: f.invalid_type
            }), A
        }
        if (bt(this, Je) || Nr(this, Je, new Set(O.getValidEnumValues(this._def.values))), !bt(this, Je).has(e.data)) {
            const n = O.objectValues(t);
            return _(s, {
                received: s.data,
                code: f.invalid_enum_value,
                options: n
            }), A
        }
        return Y(e.data)
    }
    get enum() {
        return this._def.values
    }
}
Je = new WeakMap;
it.create = (r, e) => new it({
    values: r,
    typeName: T.ZodNativeEnum,
    ...S(e)
});
class $e extends C {
    unwrap() {
        return this._def.type
    }
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e);
        if (t.parsedType !== x.promise && t.common.async === !1) return _(t, {
            code: f.invalid_type,
            expected: x.promise,
            received: t.parsedType
        }), A;
        const s = t.parsedType === x.promise ? t.data : Promise.resolve(t.data);
        return Y(s.then(n => this._def.type.parseAsync(n, {
            path: t.path,
            errorMap: t.common.contextualErrorMap
        })))
    }
}
$e.create = (r, e) => new $e({
    type: r,
    typeName: T.ZodPromise,
    ...S(e)
});
class ue extends C {
    innerType() {
        return this._def.schema
    }
    sourceType() {
        return this._def.schema._def.typeName === T.ZodEffects ? this._def.schema.sourceType() : this._def.schema
    }
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e), n = this._def.effect || null, a = {
            addIssue: i => {
                _(s, i), i.fatal ? t.abort() : t.dirty()
            },
            get path() {
                return s.path
            }
        };
        if (a.addIssue = a.addIssue.bind(a), n.type === "preprocess") {
            const i = n.transform(s.data, a);
            if (s.common.async) return Promise.resolve(i).then(async u => {
                if (t.value === "aborted") return A;
                const l = await this._def.schema._parseAsync({
                    data: u,
                    path: s.path,
                    parent: s
                });
                return l.status === "aborted" ? A : l.status === "dirty" || t.value === "dirty" ? De(l.value) : l
            }); {
                if (t.value === "aborted") return A;
                const u = this._def.schema._parseSync({
                    data: i,
                    path: s.path,
                    parent: s
                });
                return u.status === "aborted" ? A : u.status === "dirty" || t.value === "dirty" ? De(u.value) : u
            }
        }
        if (n.type === "refinement") {
            const i = u => {
                const l = n.refinement(u, a);
                if (s.common.async) return Promise.resolve(l);
                if (l instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                return u
            };
            if (s.common.async === !1) {
                const u = this._def.schema._parseSync({
                    data: s.data,
                    path: s.path,
                    parent: s
                });
                return u.status === "aborted" ? A : (u.status === "dirty" && t.dirty(), i(u.value), {
                    status: t.value,
                    value: u.value
                })
            } else return this._def.schema._parseAsync({
                data: s.data,
                path: s.path,
                parent: s
            }).then(u => u.status === "aborted" ? A : (u.status === "dirty" && t.dirty(), i(u.value).then(() => ({
                status: t.value,
                value: u.value
            }))))
        }
        if (n.type === "transform")
            if (s.common.async === !1) {
                const i = this._def.schema._parseSync({
                    data: s.data,
                    path: s.path,
                    parent: s
                });
                if (!Oe(i)) return i;
                const u = n.transform(i.value, a);
                if (u instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
                return {
                    status: t.value,
                    value: u
                }
            } else return this._def.schema._parseAsync({
                data: s.data,
                path: s.path,
                parent: s
            }).then(i => Oe(i) ? Promise.resolve(n.transform(i.value, a)).then(u => ({
                status: t.value,
                value: u
            })) : i);
        O.assertNever(n)
    }
}
ue.create = (r, e, t) => new ue({
    schema: r,
    typeName: T.ZodEffects,
    effect: e,
    ...S(t)
});
ue.createWithPreprocess = (r, e, t) => new ue({
    schema: e,
    effect: {
        type: "preprocess",
        transform: r
    },
    typeName: T.ZodEffects,
    ...S(t)
});
class le extends C {
    _parse(e) {
        return this._getType(e) === x.undefined ? Y(void 0) : this._def.innerType._parse(e)
    }
    unwrap() {
        return this._def.innerType
    }
}
le.create = (r, e) => new le({
    innerType: r,
    typeName: T.ZodOptional,
    ...S(e)
});
class Se extends C {
    _parse(e) {
        return this._getType(e) === x.null ? Y(null) : this._def.innerType._parse(e)
    }
    unwrap() {
        return this._def.innerType
    }
}
Se.create = (r, e) => new Se({
    innerType: r,
    typeName: T.ZodNullable,
    ...S(e)
});
class ot extends C {
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e);
        let s = t.data;
        return t.parsedType === x.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
            data: s,
            path: t.path,
            parent: t
        })
    }
    removeDefault() {
        return this._def.innerType
    }
}
ot.create = (r, e) => new ot({
    innerType: r,
    typeName: T.ZodDefault,
    defaultValue: typeof e.default == "function" ? e.default : () => e.default,
    ...S(e)
});
class ut extends C {
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e), s = { ...t,
            common: { ...t.common,
                issues: []
            }
        }, n = this._def.innerType._parse({
            data: s.data,
            path: s.path,
            parent: { ...s
            }
        });
        return Xe(n) ? n.then(a => ({
            status: "valid",
            value: a.status === "valid" ? a.value : this._def.catchValue({
                get error() {
                    return new ee(s.common.issues)
                },
                input: s.data
            })
        })) : {
            status: "valid",
            value: n.status === "valid" ? n.value : this._def.catchValue({
                get error() {
                    return new ee(s.common.issues)
                },
                input: s.data
            })
        }
    }
    removeCatch() {
        return this._def.innerType
    }
}
ut.create = (r, e) => new ut({
    innerType: r,
    typeName: T.ZodCatch,
    catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
    ...S(e)
});
class At extends C {
    _parse(e) {
        if (this._getType(e) !== x.nan) {
            const s = this._getOrReturnCtx(e);
            return _(s, {
                code: f.invalid_type,
                expected: x.nan,
                received: s.parsedType
            }), A
        }
        return {
            status: "valid",
            value: e.data
        }
    }
}
At.create = r => new At({
    typeName: T.ZodNaN,
    ...S(r)
});
const js = Symbol("zod_brand");
class Ht extends C {
    _parse(e) {
        const {
            ctx: t
        } = this._processInputParams(e), s = t.data;
        return this._def.type._parse({
            data: s,
            path: t.path,
            parent: t
        })
    }
    unwrap() {
        return this._def.type
    }
}
class lt extends C {
    _parse(e) {
        const {
            status: t,
            ctx: s
        } = this._processInputParams(e);
        if (s.common.async) return (async () => {
            const a = await this._def.in._parseAsync({
                data: s.data,
                path: s.path,
                parent: s
            });
            return a.status === "aborted" ? A : a.status === "dirty" ? (t.dirty(), De(a.value)) : this._def.out._parseAsync({
                data: a.value,
                path: s.path,
                parent: s
            })
        })(); {
            const n = this._def.in._parseSync({
                data: s.data,
                path: s.path,
                parent: s
            });
            return n.status === "aborted" ? A : n.status === "dirty" ? (t.dirty(), {
                status: "dirty",
                value: n.value
            }) : this._def.out._parseSync({
                data: n.value,
                path: s.path,
                parent: s
            })
        }
    }
    static create(e, t) {
        return new lt({ in: e,
            out: t,
            typeName: T.ZodPipeline
        })
    }
}
class dt extends C {
    _parse(e) {
        const t = this._def.innerType._parse(e),
            s = n => (Oe(n) && (n.value = Object.freeze(n.value)), n);
        return Xe(t) ? t.then(n => s(n)) : s(t)
    }
    unwrap() {
        return this._def.innerType
    }
}
dt.create = (r, e) => new dt({
    innerType: r,
    typeName: T.ZodReadonly,
    ...S(e)
});

function Dr(r, e = {}, t) {
    return r ? Pe.create().superRefine((s, n) => {
        var a, i;
        if (!r(s)) {
            const u = typeof e == "function" ? e(s) : typeof e == "string" ? {
                    message: e
                } : e,
                l = (i = (a = u.fatal) !== null && a !== void 0 ? a : t) !== null && i !== void 0 ? i : !0,
                h = typeof u == "string" ? {
                    message: u
                } : u;
            n.addIssue({
                code: "custom",
                ...h,
                fatal: l
            })
        }
    }) : Pe.create()
}
const Zs = {
    object: j.lazycreate
};
var T;
(function(r) {
    r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly"
})(T || (T = {}));
const Ds = (r, e = {
        message: `Input not instance of ${r.name}`
    }) => Dr(t => t instanceof r, e),
    Mr = ie.create,
    Lr = we.create,
    Ms = At.create,
    Ls = Te.create,
    Pr = Ke.create,
    Ps = Re.create,
    $s = kt.create,
    Us = Qe.create,
    zs = et.create,
    Bs = Pe.create,
    Ws = Ve.create,
    qs = ge.create,
    Hs = wt.create,
    Js = oe.create,
    Ys = j.create,
    Gs = j.strictCreate,
    Xs = tt.create,
    Ks = Ct.create,
    Qs = rt.create,
    en = he.create,
    tn = st.create,
    rn = Tt.create,
    sn = Ne.create,
    nn = Me.create,
    an = nt.create,
    on = at.create,
    un = Ae.create,
    dn = it.create,
    cn = $e.create,
    mr = ue.create,
    ln = le.create,
    fn = Se.create,
    hn = ue.createWithPreprocess,
    mn = lt.create,
    pn = () => Mr().optional(),
    yn = () => Lr().optional(),
    vn = () => Pr().optional(),
    _n = {
        string: r => ie.create({ ...r,
            coerce: !0
        }),
        number: r => we.create({ ...r,
            coerce: !0
        }),
        boolean: r => Ke.create({ ...r,
            coerce: !0
        }),
        bigint: r => Te.create({ ...r,
            coerce: !0
        }),
        date: r => Re.create({ ...r,
            coerce: !0
        })
    },
    gn = A;
var Vn = Object.freeze({
    __proto__: null,
    defaultErrorMap: Le,
    setErrorMap: fs,
    getErrorMap: gt,
    makeIssue: xt,
    EMPTY_PATH: hs,
    addIssueToContext: _,
    ParseStatus: q,
    INVALID: A,
    DIRTY: De,
    OK: Y,
    isAborted: Mt,
    isDirty: Lt,
    isValid: Oe,
    isAsync: Xe,
    get util() {
        return O
    },
    get objectUtil() {
        return Dt
    },
    ZodParsedType: x,
    getParsedType: _e,
    ZodType: C,
    datetimeRegex: jr,
    ZodString: ie,
    ZodNumber: we,
    ZodBigInt: Te,
    ZodBoolean: Ke,
    ZodDate: Re,
    ZodSymbol: kt,
    ZodUndefined: Qe,
    ZodNull: et,
    ZodAny: Pe,
    ZodUnknown: Ve,
    ZodNever: ge,
    ZodVoid: wt,
    ZodArray: oe,
    ZodObject: j,
    ZodUnion: tt,
    ZodDiscriminatedUnion: Ct,
    ZodIntersection: rt,
    ZodTuple: he,
    ZodRecord: st,
    ZodMap: Tt,
    ZodSet: Ne,
    ZodFunction: Me,
    ZodLazy: nt,
    ZodLiteral: at,
    ZodEnum: Ae,
    ZodNativeEnum: it,
    ZodPromise: $e,
    ZodEffects: ue,
    ZodTransformer: ue,
    ZodOptional: le,
    ZodNullable: Se,
    ZodDefault: ot,
    ZodCatch: ut,
    ZodNaN: At,
    BRAND: js,
    ZodBranded: Ht,
    ZodPipeline: lt,
    ZodReadonly: dt,
    custom: Dr,
    Schema: C,
    ZodSchema: C,
    late: Zs,
    get ZodFirstPartyTypeKind() {
        return T
    },
    coerce: _n,
    any: Bs,
    array: Js,
    bigint: Ls,
    boolean: Pr,
    date: Ps,
    discriminatedUnion: Ks,
    effect: mr,
    enum: un,
    function: nn,
    instanceof: Ds,
    intersection: Qs,
    lazy: an,
    literal: on,
    map: rn,
    nan: Ms,
    nativeEnum: dn,
    never: qs,
    null: zs,
    nullable: fn,
    number: Lr,
    object: Ys,
    oboolean: vn,
    onumber: yn,
    optional: ln,
    ostring: pn,
    pipeline: mn,
    preprocess: hn,
    promise: cn,
    record: tn,
    set: sn,
    strictObject: Gs,
    string: Mr,
    symbol: $s,
    transformer: mr,
    tuple: en,
    undefined: Us,
    union: Xs,
    unknown: Ws,
    void: Hs,
    NEVER: gn,
    ZodIssueCode: f,
    quotelessJson: ls,
    ZodError: ee
});
const pr = (r, e, t) => {
        if (r && "reportValidity" in r) {
            const s = p(t, e);
            r.setCustomValidity(s && s.message || ""), r.reportValidity()
        }
    },
    xn = (r, e) => {
        for (const t in e.fields) {
            const s = e.fields[t];
            s && s.ref && "reportValidity" in s.ref ? pr(s.ref, t, r) : s.refs && s.refs.forEach(n => pr(n, t, r))
        }
    },
    On = (r, e) => {
        e.shouldUseNativeValidation && xn(r, e);
        const t = {};
        for (const s in r) {
            const n = p(e.fields, s),
                a = Object.assign(r[s] || {}, {
                    ref: n && n.ref
                });
            if (bn(e.names || Object.keys(r), s)) {
                const i = Object.assign({}, p(t, s));
                F(i, "root", a), F(t, s, i)
            } else F(t, s, a)
        }
        return t
    },
    bn = (r, e) => r.some(t => t.startsWith(e + "."));
export {
    Cn as C, Sn as F, Qr as a, En as b, xn as o, On as r, zt as u, Vn as z
};