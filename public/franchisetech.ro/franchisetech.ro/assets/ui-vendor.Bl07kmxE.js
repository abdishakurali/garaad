import {
    r as a,
    R as oe,
    a as Zt,
    b as dr,
    c as mr
} from "./react-vendor.CoFnG1Cb.js";
var Qt = {
        exports: {}
    },
    We = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pr = a,
    hr = Symbol.for("react.element"),
    vr = Symbol.for("react.fragment"),
    gr = Object.prototype.hasOwnProperty,
    yr = pr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    wr = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };

function Jt(e, t, n) {
    var r, o = {},
        i = null,
        s = null;
    n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (s = t.ref);
    for (r in t) gr.call(t, r) && !wr.hasOwnProperty(r) && (o[r] = t[r]);
    if (e && e.defaultProps)
        for (r in t = e.defaultProps, t) o[r] === void 0 && (o[r] = t[r]);
    return {
        $$typeof: hr,
        type: e,
        key: i,
        ref: s,
        props: o,
        _owner: yr.current
    }
}
We.Fragment = vr;
We.jsx = Jt;
We.jsxs = Jt;
Qt.exports = We;
var C = Qt.exports;

function W(e, t, {
    checkForDefaultPrevented: n = !0
} = {}) {
    return function(o) {
        if (e == null || e(o), n === !1 || !o.defaultPrevented) return t == null ? void 0 : t(o)
    }
}

function Tt(e, t) {
    if (typeof e == "function") return e(t);
    e != null && (e.current = t)
}

function en(...e) {
    return t => {
        let n = !1;
        const r = e.map(o => {
            const i = Tt(o, t);
            return !n && typeof i == "function" && (n = !0), i
        });
        if (n) return () => {
            for (let o = 0; o < r.length; o++) {
                const i = r[o];
                typeof i == "function" ? i() : Tt(e[o], null)
            }
        }
    }
}

function H(...e) {
    return a.useCallback(en(...e), e)
}

function xr(e, t) {
    const n = a.createContext(t),
        r = i => {
            const {
                children: s,
                ...c
            } = i, u = a.useMemo(() => c, Object.values(c));
            return C.jsx(n.Provider, {
                value: u,
                children: s
            })
        };
    r.displayName = e + "Provider";

    function o(i) {
        const s = a.useContext(n);
        if (s) return s;
        if (t !== void 0) return t;
        throw new Error(`\`${i}\` must be used within \`${e}\``)
    }
    return [r, o]
}

function je(e, t = []) {
    let n = [];

    function r(i, s) {
        const c = a.createContext(s),
            u = n.length;
        n = [...n, s];
        const l = m => {
            var g;
            const {
                scope: h,
                children: p,
                ...v
            } = m, f = ((g = h == null ? void 0 : h[e]) == null ? void 0 : g[u]) || c, y = a.useMemo(() => v, Object.values(v));
            return C.jsx(f.Provider, {
                value: y,
                children: p
            })
        };
        l.displayName = i + "Provider";

        function d(m, h) {
            var f;
            const p = ((f = h == null ? void 0 : h[e]) == null ? void 0 : f[u]) || c,
                v = a.useContext(p);
            if (v) return v;
            if (s !== void 0) return s;
            throw new Error(`\`${m}\` must be used within \`${i}\``)
        }
        return [l, d]
    }
    const o = () => {
        const i = n.map(s => a.createContext(s));
        return function(c) {
            const u = (c == null ? void 0 : c[e]) || i;
            return a.useMemo(() => ({
                [`__scope${e}`]: { ...c,
                    [e]: u
                }
            }), [c, u])
        }
    };
    return o.scopeName = e, [r, br(o, ...t)]
}

function br(...e) {
    const t = e[0];
    if (e.length === 1) return t;
    const n = () => {
        const r = e.map(o => ({
            useScope: o(),
            scopeName: o.scopeName
        }));
        return function(i) {
            const s = r.reduce((c, {
                useScope: u,
                scopeName: l
            }) => {
                const m = u(i)[`__scope${l}`];
                return { ...c,
                    ...m
                }
            }, {});
            return a.useMemo(() => ({
                [`__scope${t.scopeName}`]: s
            }), [s])
        }
    };
    return n.scopeName = t.scopeName, n
}
var ge = a.forwardRef((e, t) => {
    const {
        children: n,
        ...r
    } = e, o = a.Children.toArray(n), i = o.find(Cr);
    if (i) {
        const s = i.props.children,
            c = o.map(u => u === i ? a.Children.count(s) > 1 ? a.Children.only(null) : a.isValidElement(s) ? s.props.children : null : u);
        return C.jsx(nt, { ...r,
            ref: t,
            children: a.isValidElement(s) ? a.cloneElement(s, void 0, c) : null
        })
    }
    return C.jsx(nt, { ...r,
        ref: t,
        children: n
    })
});
ge.displayName = "Slot";
var nt = a.forwardRef((e, t) => {
    const {
        children: n,
        ...r
    } = e;
    if (a.isValidElement(n)) {
        const o = Sr(n);
        return a.cloneElement(n, { ...Rr(r, n.props),
            ref: t ? en(t, o) : o
        })
    }
    return a.Children.count(n) > 1 ? a.Children.only(null) : null
});
nt.displayName = "SlotClone";
var Er = ({
    children: e
}) => C.jsx(C.Fragment, {
    children: e
});

function Cr(e) {
    return a.isValidElement(e) && e.type === Er
}

function Rr(e, t) {
    const n = { ...t
    };
    for (const r in t) {
        const o = e[r],
            i = t[r];
        /^on[A-Z]/.test(r) ? o && i ? n[r] = (...c) => {
            i(...c), o(...c)
        } : o && (n[r] = o) : r === "style" ? n[r] = { ...o,
            ...i
        } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "))
    }
    return { ...e,
        ...n
    }
}

function Sr(e) {
    var r, o;
    let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get,
        n = t && "isReactWarning" in t && t.isReactWarning;
    return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref)
}

function Ar(e) {
    const t = e + "CollectionProvider",
        [n, r] = je(t),
        [o, i] = n(t, {
            collectionRef: {
                current: null
            },
            itemMap: new Map
        }),
        s = p => {
            const {
                scope: v,
                children: f
            } = p, y = oe.useRef(null), g = oe.useRef(new Map).current;
            return C.jsx(o, {
                scope: v,
                itemMap: g,
                collectionRef: y,
                children: f
            })
        };
    s.displayName = t;
    const c = e + "CollectionSlot",
        u = oe.forwardRef((p, v) => {
            const {
                scope: f,
                children: y
            } = p, g = i(c, f), w = H(v, g.collectionRef);
            return C.jsx(ge, {
                ref: w,
                children: y
            })
        });
    u.displayName = c;
    const l = e + "CollectionItemSlot",
        d = "data-radix-collection-item",
        m = oe.forwardRef((p, v) => {
            const {
                scope: f,
                children: y,
                ...g
            } = p, w = oe.useRef(null), b = H(v, w), x = i(l, f);
            return oe.useEffect(() => (x.itemMap.set(w, {
                ref: w,
                ...g
            }), () => void x.itemMap.delete(w))), C.jsx(ge, {
                [d]: "",
                ref: b,
                children: y
            })
        });
    m.displayName = l;

    function h(p) {
        const v = i(e + "CollectionConsumer", p);
        return oe.useCallback(() => {
            const y = v.collectionRef.current;
            if (!y) return [];
            const g = Array.from(y.querySelectorAll(`[${d}]`));
            return Array.from(v.itemMap.values()).sort((x, E) => g.indexOf(x.ref.current) - g.indexOf(E.ref.current))
        }, [v.collectionRef, v.itemMap])
    }
    return [{
        Provider: s,
        Slot: u,
        ItemSlot: m
    }, h, r]
}
var Pr = ["a", "button", "div", "form", "h2", "h3", "img", "input", "label", "li", "nav", "ol", "p", "span", "svg", "ul"],
    j = Pr.reduce((e, t) => {
        const n = a.forwardRef((r, o) => {
            const {
                asChild: i,
                ...s
            } = r, c = i ? ge : t;
            return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), C.jsx(c, { ...s,
                ref: o
            })
        });
        return n.displayName = `Primitive.${t}`, { ...e,
            [t]: n
        }
    }, {});

function Or(e, t) {
    e && Zt.flushSync(() => e.dispatchEvent(t))
}

function Z(e) {
    const t = a.useRef(e);
    return a.useEffect(() => {
        t.current = e
    }), a.useMemo(() => (...n) => {
        var r;
        return (r = t.current) == null ? void 0 : r.call(t, ...n)
    }, [])
}

function Dr(e, t = globalThis == null ? void 0 : globalThis.document) {
    const n = Z(e);
    a.useEffect(() => {
        const r = o => {
            o.key === "Escape" && n(o)
        };
        return t.addEventListener("keydown", r, {
            capture: !0
        }), () => t.removeEventListener("keydown", r, {
            capture: !0
        })
    }, [n, t])
}
var Tr = "DismissableLayer",
    rt = "dismissableLayer.update",
    Nr = "dismissableLayer.pointerDownOutside",
    Mr = "dismissableLayer.focusOutside",
    Nt, tn = a.createContext({
        layers: new Set,
        layersWithOutsidePointerEventsDisabled: new Set,
        branches: new Set
    }),
    lt = a.forwardRef((e, t) => {
        const {
            disableOutsidePointerEvents: n = !1,
            onEscapeKeyDown: r,
            onPointerDownOutside: o,
            onFocusOutside: i,
            onInteractOutside: s,
            onDismiss: c,
            ...u
        } = e, l = a.useContext(tn), [d, m] = a.useState(null), h = (d == null ? void 0 : d.ownerDocument) ? ? (globalThis == null ? void 0 : globalThis.document), [, p] = a.useState({}), v = H(t, R => m(R)), f = Array.from(l.layers), [y] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1), g = f.indexOf(y), w = d ? f.indexOf(d) : -1, b = l.layersWithOutsidePointerEventsDisabled.size > 0, x = w >= g, E = _r(R => {
            const A = R.target,
                T = [...l.branches].some(D => D.contains(A));
            !x || T || (o == null || o(R), s == null || s(R), R.defaultPrevented || c == null || c())
        }, h), S = Fr(R => {
            const A = R.target;
            [...l.branches].some(D => D.contains(A)) || (i == null || i(R), s == null || s(R), R.defaultPrevented || c == null || c())
        }, h);
        return Dr(R => {
            w === l.layers.size - 1 && (r == null || r(R), !R.defaultPrevented && c && (R.preventDefault(), c()))
        }, h), a.useEffect(() => {
            if (d) return n && (l.layersWithOutsidePointerEventsDisabled.size === 0 && (Nt = h.body.style.pointerEvents, h.body.style.pointerEvents = "none"), l.layersWithOutsidePointerEventsDisabled.add(d)), l.layers.add(d), Mt(), () => {
                n && l.layersWithOutsidePointerEventsDisabled.size === 1 && (h.body.style.pointerEvents = Nt)
            }
        }, [d, h, n, l]), a.useEffect(() => () => {
            d && (l.layers.delete(d), l.layersWithOutsidePointerEventsDisabled.delete(d), Mt())
        }, [d, l]), a.useEffect(() => {
            const R = () => p({});
            return document.addEventListener(rt, R), () => document.removeEventListener(rt, R)
        }, []), C.jsx(j.div, { ...u,
            ref: v,
            style: {
                pointerEvents: b ? x ? "auto" : "none" : void 0,
                ...e.style
            },
            onFocusCapture: W(e.onFocusCapture, S.onFocusCapture),
            onBlurCapture: W(e.onBlurCapture, S.onBlurCapture),
            onPointerDownCapture: W(e.onPointerDownCapture, E.onPointerDownCapture)
        })
    });
lt.displayName = Tr;
var Ir = "DismissableLayerBranch",
    nn = a.forwardRef((e, t) => {
        const n = a.useContext(tn),
            r = a.useRef(null),
            o = H(t, r);
        return a.useEffect(() => {
            const i = r.current;
            if (i) return n.branches.add(i), () => {
                n.branches.delete(i)
            }
        }, [n.branches]), C.jsx(j.div, { ...e,
            ref: o
        })
    });
nn.displayName = Ir;

function _r(e, t = globalThis == null ? void 0 : globalThis.document) {
    const n = Z(e),
        r = a.useRef(!1),
        o = a.useRef(() => {});
    return a.useEffect(() => {
        const i = c => {
                if (c.target && !r.current) {
                    let u = function() {
                        rn(Nr, n, l, {
                            discrete: !0
                        })
                    };
                    const l = {
                        originalEvent: c
                    };
                    c.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = u, t.addEventListener("click", o.current, {
                        once: !0
                    })) : u()
                } else t.removeEventListener("click", o.current);
                r.current = !1
            },
            s = window.setTimeout(() => {
                t.addEventListener("pointerdown", i)
            }, 0);
        return () => {
            window.clearTimeout(s), t.removeEventListener("pointerdown", i), t.removeEventListener("click", o.current)
        }
    }, [t, n]), {
        onPointerDownCapture: () => r.current = !0
    }
}

function Fr(e, t = globalThis == null ? void 0 : globalThis.document) {
    const n = Z(e),
        r = a.useRef(!1);
    return a.useEffect(() => {
        const o = i => {
            i.target && !r.current && rn(Mr, n, {
                originalEvent: i
            }, {
                discrete: !1
            })
        };
        return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o)
    }, [t, n]), {
        onFocusCapture: () => r.current = !0,
        onBlurCapture: () => r.current = !1
    }
}

function Mt() {
    const e = new CustomEvent(rt);
    document.dispatchEvent(e)
}

function rn(e, t, n, {
    discrete: r
}) {
    const o = n.originalEvent.target,
        i = new CustomEvent(e, {
            bubbles: !1,
            cancelable: !0,
            detail: n
        });
    t && o.addEventListener(e, t, {
        once: !0
    }), r ? Or(o, i) : o.dispatchEvent(i)
}
var ds = lt,
    ms = nn,
    ie = globalThis != null && globalThis.document ? a.useLayoutEffect : () => {},
    Lr = "Portal",
    on = a.forwardRef((e, t) => {
        var c;
        const {
            container: n,
            ...r
        } = e, [o, i] = a.useState(!1);
        ie(() => i(!0), []);
        const s = n || o && ((c = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : c.body);
        return s ? dr.createPortal(C.jsx(j.div, { ...r,
            ref: t
        }), s) : null
    });
on.displayName = Lr;

function kr(e, t) {
    return a.useReducer((n, r) => t[n][r] ? ? n, e)
}
var Be = e => {
    const {
        present: t,
        children: n
    } = e, r = Wr(t), o = typeof n == "function" ? n({
        present: r.isPresent
    }) : a.Children.only(n), i = H(r.ref, jr(o));
    return typeof n == "function" || r.isPresent ? a.cloneElement(o, {
        ref: i
    }) : null
};
Be.displayName = "Presence";

function Wr(e) {
    const [t, n] = a.useState(), r = a.useRef({}), o = a.useRef(e), i = a.useRef("none"), s = e ? "mounted" : "unmounted", [c, u] = kr(s, {
        mounted: {
            UNMOUNT: "unmounted",
            ANIMATION_OUT: "unmountSuspended"
        },
        unmountSuspended: {
            MOUNT: "mounted",
            ANIMATION_END: "unmounted"
        },
        unmounted: {
            MOUNT: "mounted"
        }
    });
    return a.useEffect(() => {
        const l = Ce(r.current);
        i.current = c === "mounted" ? l : "none"
    }, [c]), ie(() => {
        const l = r.current,
            d = o.current;
        if (d !== e) {
            const h = i.current,
                p = Ce(l);
            e ? u("MOUNT") : p === "none" || (l == null ? void 0 : l.display) === "none" ? u("UNMOUNT") : u(d && h !== p ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e
        }
    }, [e, u]), ie(() => {
        if (t) {
            let l;
            const d = t.ownerDocument.defaultView ? ? window,
                m = p => {
                    const f = Ce(r.current).includes(p.animationName);
                    if (p.target === t && f && (u("ANIMATION_END"), !o.current)) {
                        const y = t.style.animationFillMode;
                        t.style.animationFillMode = "forwards", l = d.setTimeout(() => {
                            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = y)
                        })
                    }
                },
                h = p => {
                    p.target === t && (i.current = Ce(r.current))
                };
            return t.addEventListener("animationstart", h), t.addEventListener("animationcancel", m), t.addEventListener("animationend", m), () => {
                d.clearTimeout(l), t.removeEventListener("animationstart", h), t.removeEventListener("animationcancel", m), t.removeEventListener("animationend", m)
            }
        } else u("ANIMATION_END")
    }, [t, u]), {
        isPresent: ["mounted", "unmountSuspended"].includes(c),
        ref: a.useCallback(l => {
            l && (r.current = getComputedStyle(l)), n(l)
        }, [])
    }
}

function Ce(e) {
    return (e == null ? void 0 : e.animationName) || "none"
}

function jr(e) {
    var r, o;
    let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get,
        n = t && "isReactWarning" in t && t.isReactWarning;
    return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref)
}

function sn({
    prop: e,
    defaultProp: t,
    onChange: n = () => {}
}) {
    const [r, o] = Br({
        defaultProp: t,
        onChange: n
    }), i = e !== void 0, s = i ? e : r, c = Z(n), u = a.useCallback(l => {
        if (i) {
            const m = typeof l == "function" ? l(e) : l;
            m !== e && c(m)
        } else o(l)
    }, [i, e, o, c]);
    return [s, u]
}

function Br({
    defaultProp: e,
    onChange: t
}) {
    const n = a.useState(e),
        [r] = n,
        o = a.useRef(r),
        i = Z(t);
    return a.useEffect(() => {
        o.current !== r && (i(r), o.current = r)
    }, [r, o, i]), n
}
var $r = a.createContext(void 0);

function Hr(e) {
    const t = a.useContext($r);
    return e || t || "ltr"
}
var Ur = mr.useId || (() => {}),
    Vr = 0;

function De(e) {
    const [t, n] = a.useState(Ur());
    return ie(() => {
        e || n(r => r ? ? String(Vr++))
    }, [e]), e || (t ? `radix-${t}` : "")
}
var Ye = "focusScope.autoFocusOnMount",
    Ge = "focusScope.autoFocusOnUnmount",
    It = {
        bubbles: !1,
        cancelable: !0
    },
    zr = "FocusScope",
    cn = a.forwardRef((e, t) => {
        const {
            loop: n = !1,
            trapped: r = !1,
            onMountAutoFocus: o,
            onUnmountAutoFocus: i,
            ...s
        } = e, [c, u] = a.useState(null), l = Z(o), d = Z(i), m = a.useRef(null), h = H(t, f => u(f)), p = a.useRef({
            paused: !1,
            pause() {
                this.paused = !0
            },
            resume() {
                this.paused = !1
            }
        }).current;
        a.useEffect(() => {
            if (r) {
                let f = function(b) {
                        if (p.paused || !c) return;
                        const x = b.target;
                        c.contains(x) ? m.current = x : ee(m.current, {
                            select: !0
                        })
                    },
                    y = function(b) {
                        if (p.paused || !c) return;
                        const x = b.relatedTarget;
                        x !== null && (c.contains(x) || ee(m.current, {
                            select: !0
                        }))
                    },
                    g = function(b) {
                        if (document.activeElement === document.body)
                            for (const E of b) E.removedNodes.length > 0 && ee(c)
                    };
                document.addEventListener("focusin", f), document.addEventListener("focusout", y);
                const w = new MutationObserver(g);
                return c && w.observe(c, {
                    childList: !0,
                    subtree: !0
                }), () => {
                    document.removeEventListener("focusin", f), document.removeEventListener("focusout", y), w.disconnect()
                }
            }
        }, [r, c, p.paused]), a.useEffect(() => {
            if (c) {
                Ft.add(p);
                const f = document.activeElement;
                if (!c.contains(f)) {
                    const g = new CustomEvent(Ye, It);
                    c.addEventListener(Ye, l), c.dispatchEvent(g), g.defaultPrevented || (Yr(Zr(an(c)), {
                        select: !0
                    }), document.activeElement === f && ee(c))
                }
                return () => {
                    c.removeEventListener(Ye, l), setTimeout(() => {
                        const g = new CustomEvent(Ge, It);
                        c.addEventListener(Ge, d), c.dispatchEvent(g), g.defaultPrevented || ee(f ? ? document.body, {
                            select: !0
                        }), c.removeEventListener(Ge, d), Ft.remove(p)
                    }, 0)
                }
            }
        }, [c, l, d, p]);
        const v = a.useCallback(f => {
            if (!n && !r || p.paused) return;
            const y = f.key === "Tab" && !f.altKey && !f.ctrlKey && !f.metaKey,
                g = document.activeElement;
            if (y && g) {
                const w = f.currentTarget,
                    [b, x] = Gr(w);
                b && x ? !f.shiftKey && g === x ? (f.preventDefault(), n && ee(b, {
                    select: !0
                })) : f.shiftKey && g === b && (f.preventDefault(), n && ee(x, {
                    select: !0
                })) : g === w && f.preventDefault()
            }
        }, [n, r, p.paused]);
        return C.jsx(j.div, {
            tabIndex: -1,
            ...s,
            ref: h,
            onKeyDown: v
        })
    });
cn.displayName = zr;

function Yr(e, {
    select: t = !1
} = {}) {
    const n = document.activeElement;
    for (const r of e)
        if (ee(r, {
                select: t
            }), document.activeElement !== n) return
}

function Gr(e) {
    const t = an(e),
        n = _t(t, e),
        r = _t(t.reverse(), e);
    return [n, r]
}

function an(e) {
    const t = [],
        n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
            acceptNode: r => {
                const o = r.tagName === "INPUT" && r.type === "hidden";
                return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            }
        });
    for (; n.nextNode();) t.push(n.currentNode);
    return t
}

function _t(e, t) {
    for (const n of e)
        if (!Kr(n, {
                upTo: t
            })) return n
}

function Kr(e, {
    upTo: t
}) {
    if (getComputedStyle(e).visibility === "hidden") return !0;
    for (; e;) {
        if (t !== void 0 && e === t) return !1;
        if (getComputedStyle(e).display === "none") return !0;
        e = e.parentElement
    }
    return !1
}

function Xr(e) {
    return e instanceof HTMLInputElement && "select" in e
}

function ee(e, {
    select: t = !1
} = {}) {
    if (e && e.focus) {
        const n = document.activeElement;
        e.focus({
            preventScroll: !0
        }), e !== n && Xr(e) && t && e.select()
    }
}
var Ft = qr();

function qr() {
    let e = [];
    return {
        add(t) {
            const n = e[0];
            t !== n && (n == null || n.pause()), e = Lt(e, t), e.unshift(t)
        },
        remove(t) {
            var n;
            e = Lt(e, t), (n = e[0]) == null || n.resume()
        }
    }
}

function Lt(e, t) {
    const n = [...e],
        r = n.indexOf(t);
    return r !== -1 && n.splice(r, 1), n
}

function Zr(e) {
    return e.filter(t => t.tagName !== "A")
}
var Ke = 0;

function Qr() {
    a.useEffect(() => {
        const e = document.querySelectorAll("[data-radix-focus-guard]");
        return document.body.insertAdjacentElement("afterbegin", e[0] ? ? kt()), document.body.insertAdjacentElement("beforeend", e[1] ? ? kt()), Ke++, () => {
            Ke === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach(t => t.remove()), Ke--
        }
    }, [])
}

function kt() {
    const e = document.createElement("span");
    return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e
}
var G = function() {
    return G = Object.assign || function(t) {
        for (var n, r = 1, o = arguments.length; r < o; r++) {
            n = arguments[r];
            for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i])
        }
        return t
    }, G.apply(this, arguments)
};

function ln(e, t) {
    var n = {};
    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
        for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++) t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
    return n
}

function Jr(e, t, n) {
    if (n || arguments.length === 2)
        for (var r = 0, o = t.length, i; r < o; r++)(i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
    return e.concat(i || Array.prototype.slice.call(t))
}
var Te = "right-scroll-bar-position",
    Ne = "width-before-scroll-bar",
    eo = "with-scroll-bars-hidden",
    to = "--removed-body-scroll-bar-size";

function Xe(e, t) {
    return typeof e == "function" ? e(t) : e && (e.current = t), e
}

function no(e, t) {
    var n = a.useState(function() {
        return {
            value: e,
            callback: t,
            facade: {
                get current() {
                    return n.value
                },
                set current(r) {
                    var o = n.value;
                    o !== r && (n.value = r, n.callback(r, o))
                }
            }
        }
    })[0];
    return n.callback = t, n.facade
}
var ro = typeof window < "u" ? a.useLayoutEffect : a.useEffect,
    Wt = new WeakMap;

function oo(e, t) {
    var n = no(null, function(r) {
        return e.forEach(function(o) {
            return Xe(o, r)
        })
    });
    return ro(function() {
        var r = Wt.get(n);
        if (r) {
            var o = new Set(r),
                i = new Set(e),
                s = n.current;
            o.forEach(function(c) {
                i.has(c) || Xe(c, null)
            }), i.forEach(function(c) {
                o.has(c) || Xe(c, s)
            })
        }
        Wt.set(n, e)
    }, [e]), n
}

function io(e) {
    return e
}

function so(e, t) {
    t === void 0 && (t = io);
    var n = [],
        r = !1,
        o = {
            read: function() {
                if (r) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
                return n.length ? n[n.length - 1] : e
            },
            useMedium: function(i) {
                var s = t(i, r);
                return n.push(s),
                    function() {
                        n = n.filter(function(c) {
                            return c !== s
                        })
                    }
            },
            assignSyncMedium: function(i) {
                for (r = !0; n.length;) {
                    var s = n;
                    n = [], s.forEach(i)
                }
                n = {
                    push: function(c) {
                        return i(c)
                    },
                    filter: function() {
                        return n
                    }
                }
            },
            assignMedium: function(i) {
                r = !0;
                var s = [];
                if (n.length) {
                    var c = n;
                    n = [], c.forEach(i), s = n
                }
                var u = function() {
                        var d = s;
                        s = [], d.forEach(i)
                    },
                    l = function() {
                        return Promise.resolve().then(u)
                    };
                l(), n = {
                    push: function(d) {
                        s.push(d), l()
                    },
                    filter: function(d) {
                        return s = s.filter(d), n
                    }
                }
            }
        };
    return o
}

function co(e) {
    e === void 0 && (e = {});
    var t = so(null);
    return t.options = G({
        async: !0,
        ssr: !1
    }, e), t
}
var un = function(e) {
    var t = e.sideCar,
        n = ln(e, ["sideCar"]);
    if (!t) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var r = t.read();
    if (!r) throw new Error("Sidecar medium not found");
    return a.createElement(r, G({}, n))
};
un.isSideCarExport = !0;

function ao(e, t) {
    return e.useMedium(t), un
}
var fn = co(),
    qe = function() {},
    $e = a.forwardRef(function(e, t) {
        var n = a.useRef(null),
            r = a.useState({
                onScrollCapture: qe,
                onWheelCapture: qe,
                onTouchMoveCapture: qe
            }),
            o = r[0],
            i = r[1],
            s = e.forwardProps,
            c = e.children,
            u = e.className,
            l = e.removeScrollBar,
            d = e.enabled,
            m = e.shards,
            h = e.sideCar,
            p = e.noIsolation,
            v = e.inert,
            f = e.allowPinchZoom,
            y = e.as,
            g = y === void 0 ? "div" : y,
            w = e.gapMode,
            b = ln(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]),
            x = h,
            E = oo([n, t]),
            S = G(G({}, b), o);
        return a.createElement(a.Fragment, null, d && a.createElement(x, {
            sideCar: fn,
            removeScrollBar: l,
            shards: m,
            noIsolation: p,
            inert: v,
            setCallbacks: i,
            allowPinchZoom: !!f,
            lockRef: n,
            gapMode: w
        }), s ? a.cloneElement(a.Children.only(c), G(G({}, S), {
            ref: E
        })) : a.createElement(g, G({}, S, {
            className: u,
            ref: E
        }), c))
    });
$e.defaultProps = {
    enabled: !0,
    removeScrollBar: !0,
    inert: !1
};
$e.classNames = {
    fullWidth: Ne,
    zeroRight: Te
};
var lo = function() {
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__
};

function uo() {
    if (!document) return null;
    var e = document.createElement("style");
    e.type = "text/css";
    var t = lo();
    return t && e.setAttribute("nonce", t), e
}

function fo(e, t) {
    e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t))
}

function mo(e) {
    var t = document.head || document.getElementsByTagName("head")[0];
    t.appendChild(e)
}
var po = function() {
        var e = 0,
            t = null;
        return {
            add: function(n) {
                e == 0 && (t = uo()) && (fo(t, n), mo(t)), e++
            },
            remove: function() {
                e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null)
            }
        }
    },
    ho = function() {
        var e = po();
        return function(t, n) {
            a.useEffect(function() {
                return e.add(t),
                    function() {
                        e.remove()
                    }
            }, [t && n])
        }
    },
    dn = function() {
        var e = ho(),
            t = function(n) {
                var r = n.styles,
                    o = n.dynamic;
                return e(r, o), null
            };
        return t
    },
    vo = {
        left: 0,
        top: 0,
        right: 0,
        gap: 0
    },
    Ze = function(e) {
        return parseInt(e || "", 10) || 0
    },
    go = function(e) {
        var t = window.getComputedStyle(document.body),
            n = t[e === "padding" ? "paddingLeft" : "marginLeft"],
            r = t[e === "padding" ? "paddingTop" : "marginTop"],
            o = t[e === "padding" ? "paddingRight" : "marginRight"];
        return [Ze(n), Ze(r), Ze(o)]
    },
    yo = function(e) {
        if (e === void 0 && (e = "margin"), typeof window > "u") return vo;
        var t = go(e),
            n = document.documentElement.clientWidth,
            r = window.innerWidth;
        return {
            left: t[0],
            top: t[1],
            right: t[2],
            gap: Math.max(0, r - n + t[2] - t[0])
        }
    },
    wo = dn(),
    fe = "data-scroll-locked",
    xo = function(e, t, n, r) {
        var o = e.left,
            i = e.top,
            s = e.right,
            c = e.gap;
        return n === void 0 && (n = "margin"), `
  .`.concat(eo, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(c, "px ").concat(r, `;
  }
  body[`).concat(fe, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([t && "position: relative ".concat(r, ";"), n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(i, `px;
    padding-right: `).concat(s, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(c, "px ").concat(r, `;
    `), n === "padding" && "padding-right: ".concat(c, "px ").concat(r, ";")].filter(Boolean).join(""), `
  }
  
  .`).concat(Te, ` {
    right: `).concat(c, "px ").concat(r, `;
  }
  
  .`).concat(Ne, ` {
    margin-right: `).concat(c, "px ").concat(r, `;
  }
  
  .`).concat(Te, " .").concat(Te, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(Ne, " .").concat(Ne, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(fe, `] {
    `).concat(to, ": ").concat(c, `px;
  }
`)
    },
    jt = function() {
        var e = parseInt(document.body.getAttribute(fe) || "0", 10);
        return isFinite(e) ? e : 0
    },
    bo = function() {
        a.useEffect(function() {
            return document.body.setAttribute(fe, (jt() + 1).toString()),
                function() {
                    var e = jt() - 1;
                    e <= 0 ? document.body.removeAttribute(fe) : document.body.setAttribute(fe, e.toString())
                }
        }, [])
    },
    Eo = function(e) {
        var t = e.noRelative,
            n = e.noImportant,
            r = e.gapMode,
            o = r === void 0 ? "margin" : r;
        bo();
        var i = a.useMemo(function() {
            return yo(o)
        }, [o]);
        return a.createElement(wo, {
            styles: xo(i, !t, o, n ? "" : "!important")
        })
    },
    ot = !1;
if (typeof window < "u") try {
    var Re = Object.defineProperty({}, "passive", {
        get: function() {
            return ot = !0, !0
        }
    });
    window.addEventListener("test", Re, Re), window.removeEventListener("test", Re, Re)
} catch {
    ot = !1
}
var ae = ot ? {
        passive: !1
    } : !1,
    Co = function(e) {
        return e.tagName === "TEXTAREA"
    },
    mn = function(e, t) {
        if (!(e instanceof Element)) return !1;
        var n = window.getComputedStyle(e);
        return n[t] !== "hidden" && !(n.overflowY === n.overflowX && !Co(e) && n[t] === "visible")
    },
    Ro = function(e) {
        return mn(e, "overflowY")
    },
    So = function(e) {
        return mn(e, "overflowX")
    },
    Bt = function(e, t) {
        var n = t.ownerDocument,
            r = t;
        do {
            typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
            var o = pn(e, r);
            if (o) {
                var i = hn(e, r),
                    s = i[1],
                    c = i[2];
                if (s > c) return !0
            }
            r = r.parentNode
        } while (r && r !== n.body);
        return !1
    },
    Ao = function(e) {
        var t = e.scrollTop,
            n = e.scrollHeight,
            r = e.clientHeight;
        return [t, n, r]
    },
    Po = function(e) {
        var t = e.scrollLeft,
            n = e.scrollWidth,
            r = e.clientWidth;
        return [t, n, r]
    },
    pn = function(e, t) {
        return e === "v" ? Ro(t) : So(t)
    },
    hn = function(e, t) {
        return e === "v" ? Ao(t) : Po(t)
    },
    Oo = function(e, t) {
        return e === "h" && t === "rtl" ? -1 : 1
    },
    Do = function(e, t, n, r, o) {
        var i = Oo(e, window.getComputedStyle(t).direction),
            s = i * r,
            c = n.target,
            u = t.contains(c),
            l = !1,
            d = s > 0,
            m = 0,
            h = 0;
        do {
            var p = hn(e, c),
                v = p[0],
                f = p[1],
                y = p[2],
                g = f - y - i * v;
            (v || g) && pn(e, c) && (m += g, h += v), c instanceof ShadowRoot ? c = c.host : c = c.parentNode
        } while (!u && c !== document.body || u && (t.contains(c) || t === c));
        return (d && (Math.abs(m) < 1 || !o) || !d && (Math.abs(h) < 1 || !o)) && (l = !0), l
    },
    Se = function(e) {
        return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0]
    },
    $t = function(e) {
        return [e.deltaX, e.deltaY]
    },
    Ht = function(e) {
        return e && "current" in e ? e.current : e
    },
    To = function(e, t) {
        return e[0] === t[0] && e[1] === t[1]
    },
    No = function(e) {
        return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`)
    },
    Mo = 0,
    le = [];

function Io(e) {
    var t = a.useRef([]),
        n = a.useRef([0, 0]),
        r = a.useRef(),
        o = a.useState(Mo++)[0],
        i = a.useState(dn)[0],
        s = a.useRef(e);
    a.useEffect(function() {
        s.current = e
    }, [e]), a.useEffect(function() {
        if (e.inert) {
            document.body.classList.add("block-interactivity-".concat(o));
            var f = Jr([e.lockRef.current], (e.shards || []).map(Ht), !0).filter(Boolean);
            return f.forEach(function(y) {
                    return y.classList.add("allow-interactivity-".concat(o))
                }),
                function() {
                    document.body.classList.remove("block-interactivity-".concat(o)), f.forEach(function(y) {
                        return y.classList.remove("allow-interactivity-".concat(o))
                    })
                }
        }
    }, [e.inert, e.lockRef.current, e.shards]);
    var c = a.useCallback(function(f, y) {
            if ("touches" in f && f.touches.length === 2 || f.type === "wheel" && f.ctrlKey) return !s.current.allowPinchZoom;
            var g = Se(f),
                w = n.current,
                b = "deltaX" in f ? f.deltaX : w[0] - g[0],
                x = "deltaY" in f ? f.deltaY : w[1] - g[1],
                E, S = f.target,
                R = Math.abs(b) > Math.abs(x) ? "h" : "v";
            if ("touches" in f && R === "h" && S.type === "range") return !1;
            var A = Bt(R, S);
            if (!A) return !0;
            if (A ? E = R : (E = R === "v" ? "h" : "v", A = Bt(R, S)), !A) return !1;
            if (!r.current && "changedTouches" in f && (b || x) && (r.current = E), !E) return !0;
            var T = r.current || E;
            return Do(T, y, f, T === "h" ? b : x, !0)
        }, []),
        u = a.useCallback(function(f) {
            var y = f;
            if (!(!le.length || le[le.length - 1] !== i)) {
                var g = "deltaY" in y ? $t(y) : Se(y),
                    w = t.current.filter(function(E) {
                        return E.name === y.type && (E.target === y.target || y.target === E.shadowParent) && To(E.delta, g)
                    })[0];
                if (w && w.should) {
                    y.cancelable && y.preventDefault();
                    return
                }
                if (!w) {
                    var b = (s.current.shards || []).map(Ht).filter(Boolean).filter(function(E) {
                            return E.contains(y.target)
                        }),
                        x = b.length > 0 ? c(y, b[0]) : !s.current.noIsolation;
                    x && y.cancelable && y.preventDefault()
                }
            }
        }, []),
        l = a.useCallback(function(f, y, g, w) {
            var b = {
                name: f,
                delta: y,
                target: g,
                should: w,
                shadowParent: _o(g)
            };
            t.current.push(b), setTimeout(function() {
                t.current = t.current.filter(function(x) {
                    return x !== b
                })
            }, 1)
        }, []),
        d = a.useCallback(function(f) {
            n.current = Se(f), r.current = void 0
        }, []),
        m = a.useCallback(function(f) {
            l(f.type, $t(f), f.target, c(f, e.lockRef.current))
        }, []),
        h = a.useCallback(function(f) {
            l(f.type, Se(f), f.target, c(f, e.lockRef.current))
        }, []);
    a.useEffect(function() {
        return le.push(i), e.setCallbacks({
                onScrollCapture: m,
                onWheelCapture: m,
                onTouchMoveCapture: h
            }), document.addEventListener("wheel", u, ae), document.addEventListener("touchmove", u, ae), document.addEventListener("touchstart", d, ae),
            function() {
                le = le.filter(function(f) {
                    return f !== i
                }), document.removeEventListener("wheel", u, ae), document.removeEventListener("touchmove", u, ae), document.removeEventListener("touchstart", d, ae)
            }
    }, []);
    var p = e.removeScrollBar,
        v = e.inert;
    return a.createElement(a.Fragment, null, v ? a.createElement(i, {
        styles: No(o)
    }) : null, p ? a.createElement(Eo, {
        gapMode: e.gapMode
    }) : null)
}

function _o(e) {
    for (var t = null; e !== null;) e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
    return t
}
const Fo = ao(fn, Io);
var vn = a.forwardRef(function(e, t) {
    return a.createElement($e, G({}, e, {
        ref: t,
        sideCar: Fo
    }))
});
vn.classNames = $e.classNames;
var Lo = function(e) {
        if (typeof document > "u") return null;
        var t = Array.isArray(e) ? e[0] : e;
        return t.ownerDocument.body
    },
    ue = new WeakMap,
    Ae = new WeakMap,
    Pe = {},
    Qe = 0,
    gn = function(e) {
        return e && (e.host || gn(e.parentNode))
    },
    ko = function(e, t) {
        return t.map(function(n) {
            if (e.contains(n)) return n;
            var r = gn(n);
            return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null)
        }).filter(function(n) {
            return !!n
        })
    },
    Wo = function(e, t, n, r) {
        var o = ko(t, Array.isArray(e) ? e : [e]);
        Pe[n] || (Pe[n] = new WeakMap);
        var i = Pe[n],
            s = [],
            c = new Set,
            u = new Set(o),
            l = function(m) {
                !m || c.has(m) || (c.add(m), l(m.parentNode))
            };
        o.forEach(l);
        var d = function(m) {
            !m || u.has(m) || Array.prototype.forEach.call(m.children, function(h) {
                if (c.has(h)) d(h);
                else try {
                    var p = h.getAttribute(r),
                        v = p !== null && p !== "false",
                        f = (ue.get(h) || 0) + 1,
                        y = (i.get(h) || 0) + 1;
                    ue.set(h, f), i.set(h, y), s.push(h), f === 1 && v && Ae.set(h, !0), y === 1 && h.setAttribute(n, "true"), v || h.setAttribute(r, "true")
                } catch (g) {
                    console.error("aria-hidden: cannot operate on ", h, g)
                }
            })
        };
        return d(t), c.clear(), Qe++,
            function() {
                s.forEach(function(m) {
                    var h = ue.get(m) - 1,
                        p = i.get(m) - 1;
                    ue.set(m, h), i.set(m, p), h || (Ae.has(m) || m.removeAttribute(r), Ae.delete(m)), p || m.removeAttribute(n)
                }), Qe--, Qe || (ue = new WeakMap, ue = new WeakMap, Ae = new WeakMap, Pe = {})
            }
    },
    jo = function(e, t, n) {
        n === void 0 && (n = "data-aria-hidden");
        var r = Array.from(Array.isArray(e) ? e : [e]),
            o = Lo(e);
        return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live]"))), Wo(r, o, n, "aria-hidden")) : function() {
            return null
        }
    },
    ut = "Dialog",
    [yn, ps] = je(ut),
    [Bo, z] = yn(ut),
    wn = e => {
        const {
            __scopeDialog: t,
            children: n,
            open: r,
            defaultOpen: o,
            onOpenChange: i,
            modal: s = !0
        } = e, c = a.useRef(null), u = a.useRef(null), [l = !1, d] = sn({
            prop: r,
            defaultProp: o,
            onChange: i
        });
        return C.jsx(Bo, {
            scope: t,
            triggerRef: c,
            contentRef: u,
            contentId: De(),
            titleId: De(),
            descriptionId: De(),
            open: l,
            onOpenChange: d,
            onOpenToggle: a.useCallback(() => d(m => !m), [d]),
            modal: s,
            children: n
        })
    };
wn.displayName = ut;
var xn = "DialogTrigger",
    $o = a.forwardRef((e, t) => {
        const {
            __scopeDialog: n,
            ...r
        } = e, o = z(xn, n), i = H(t, o.triggerRef);
        return C.jsx(j.button, {
            type: "button",
            "aria-haspopup": "dialog",
            "aria-expanded": o.open,
            "aria-controls": o.contentId,
            "data-state": mt(o.open),
            ...r,
            ref: i,
            onClick: W(e.onClick, o.onOpenToggle)
        })
    });
$o.displayName = xn;
var ft = "DialogPortal",
    [Ho, bn] = yn(ft, {
        forceMount: void 0
    }),
    En = e => {
        const {
            __scopeDialog: t,
            forceMount: n,
            children: r,
            container: o
        } = e, i = z(ft, t);
        return C.jsx(Ho, {
            scope: t,
            forceMount: n,
            children: a.Children.map(r, s => C.jsx(Be, {
                present: n || i.open,
                children: C.jsx(on, {
                    asChild: !0,
                    container: o,
                    children: s
                })
            }))
        })
    };
En.displayName = ft;
var Ie = "DialogOverlay",
    Cn = a.forwardRef((e, t) => {
        const n = bn(Ie, e.__scopeDialog),
            {
                forceMount: r = n.forceMount,
                ...o
            } = e,
            i = z(Ie, e.__scopeDialog);
        return i.modal ? C.jsx(Be, {
            present: r || i.open,
            children: C.jsx(Uo, { ...o,
                ref: t
            })
        }) : null
    });
Cn.displayName = Ie;
var Uo = a.forwardRef((e, t) => {
        const {
            __scopeDialog: n,
            ...r
        } = e, o = z(Ie, n);
        return C.jsx(vn, {
            as: ge,
            allowPinchZoom: !0,
            shards: [o.contentRef],
            children: C.jsx(j.div, {
                "data-state": mt(o.open),
                ...r,
                ref: t,
                style: {
                    pointerEvents: "auto",
                    ...r.style
                }
            })
        })
    }),
    se = "DialogContent",
    Rn = a.forwardRef((e, t) => {
        const n = bn(se, e.__scopeDialog),
            {
                forceMount: r = n.forceMount,
                ...o
            } = e,
            i = z(se, e.__scopeDialog);
        return C.jsx(Be, {
            present: r || i.open,
            children: i.modal ? C.jsx(Vo, { ...o,
                ref: t
            }) : C.jsx(zo, { ...o,
                ref: t
            })
        })
    });
Rn.displayName = se;
var Vo = a.forwardRef((e, t) => {
        const n = z(se, e.__scopeDialog),
            r = a.useRef(null),
            o = H(t, n.contentRef, r);
        return a.useEffect(() => {
            const i = r.current;
            if (i) return jo(i)
        }, []), C.jsx(Sn, { ...e,
            ref: o,
            trapFocus: n.open,
            disableOutsidePointerEvents: !0,
            onCloseAutoFocus: W(e.onCloseAutoFocus, i => {
                var s;
                i.preventDefault(), (s = n.triggerRef.current) == null || s.focus()
            }),
            onPointerDownOutside: W(e.onPointerDownOutside, i => {
                const s = i.detail.originalEvent,
                    c = s.button === 0 && s.ctrlKey === !0;
                (s.button === 2 || c) && i.preventDefault()
            }),
            onFocusOutside: W(e.onFocusOutside, i => i.preventDefault())
        })
    }),
    zo = a.forwardRef((e, t) => {
        const n = z(se, e.__scopeDialog),
            r = a.useRef(!1),
            o = a.useRef(!1);
        return C.jsx(Sn, { ...e,
            ref: t,
            trapFocus: !1,
            disableOutsidePointerEvents: !1,
            onCloseAutoFocus: i => {
                var s, c;
                (s = e.onCloseAutoFocus) == null || s.call(e, i), i.defaultPrevented || (r.current || (c = n.triggerRef.current) == null || c.focus(), i.preventDefault()), r.current = !1, o.current = !1
            },
            onInteractOutside: i => {
                var u, l;
                (u = e.onInteractOutside) == null || u.call(e, i), i.defaultPrevented || (r.current = !0, i.detail.originalEvent.type === "pointerdown" && (o.current = !0));
                const s = i.target;
                ((l = n.triggerRef.current) == null ? void 0 : l.contains(s)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault()
            }
        })
    }),
    Sn = a.forwardRef((e, t) => {
        const {
            __scopeDialog: n,
            trapFocus: r,
            onOpenAutoFocus: o,
            onCloseAutoFocus: i,
            ...s
        } = e, c = z(se, n), u = a.useRef(null), l = H(t, u);
        return Qr(), C.jsxs(C.Fragment, {
            children: [C.jsx(cn, {
                asChild: !0,
                loop: !0,
                trapped: r,
                onMountAutoFocus: o,
                onUnmountAutoFocus: i,
                children: C.jsx(lt, {
                    role: "dialog",
                    id: c.contentId,
                    "aria-describedby": c.descriptionId,
                    "aria-labelledby": c.titleId,
                    "data-state": mt(c.open),
                    ...s,
                    ref: l,
                    onDismiss: () => c.onOpenChange(!1)
                })
            }), C.jsxs(C.Fragment, {
                children: [C.jsx(Yo, {
                    titleId: c.titleId
                }), C.jsx(Ko, {
                    contentRef: u,
                    descriptionId: c.descriptionId
                })]
            })]
        })
    }),
    dt = "DialogTitle",
    An = a.forwardRef((e, t) => {
        const {
            __scopeDialog: n,
            ...r
        } = e, o = z(dt, n);
        return C.jsx(j.h2, {
            id: o.titleId,
            ...r,
            ref: t
        })
    });
An.displayName = dt;
var Pn = "DialogDescription",
    On = a.forwardRef((e, t) => {
        const {
            __scopeDialog: n,
            ...r
        } = e, o = z(Pn, n);
        return C.jsx(j.p, {
            id: o.descriptionId,
            ...r,
            ref: t
        })
    });
On.displayName = Pn;
var Dn = "DialogClose",
    Tn = a.forwardRef((e, t) => {
        const {
            __scopeDialog: n,
            ...r
        } = e, o = z(Dn, n);
        return C.jsx(j.button, {
            type: "button",
            ...r,
            ref: t,
            onClick: W(e.onClick, () => o.onOpenChange(!1))
        })
    });
Tn.displayName = Dn;

function mt(e) {
    return e ? "open" : "closed"
}
var Nn = "DialogTitleWarning",
    [hs, Mn] = xr(Nn, {
        contentName: se,
        titleName: dt,
        docsSlug: "dialog"
    }),
    Yo = ({
        titleId: e
    }) => {
        const t = Mn(Nn),
            n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
        return a.useEffect(() => {
            e && (document.getElementById(e) || console.error(n))
        }, [n, e]), null
    },
    Go = "DialogDescriptionWarning",
    Ko = ({
        contentRef: e,
        descriptionId: t
    }) => {
        const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Mn(Go).contentName}}.`;
        return a.useEffect(() => {
            var i;
            const o = (i = e.current) == null ? void 0 : i.getAttribute("aria-describedby");
            t && o && (document.getElementById(t) || console.warn(r))
        }, [r, e, t]), null
    },
    vs = wn,
    gs = En,
    ys = Cn,
    ws = Rn,
    xs = An,
    bs = On,
    Es = Tn;

function Xo(e) {
    const [t, n] = a.useState(void 0);
    return ie(() => {
        if (e) {
            n({
                width: e.offsetWidth,
                height: e.offsetHeight
            });
            const r = new ResizeObserver(o => {
                if (!Array.isArray(o) || !o.length) return;
                const i = o[0];
                let s, c;
                if ("borderBoxSize" in i) {
                    const u = i.borderBoxSize,
                        l = Array.isArray(u) ? u[0] : u;
                    s = l.inlineSize, c = l.blockSize
                } else s = e.offsetWidth, c = e.offsetHeight;
                n({
                    width: s,
                    height: c
                })
            });
            return r.observe(e, {
                box: "border-box"
            }), () => r.unobserve(e)
        } else n(void 0)
    }, [e]), t
}
const qo = ["top", "right", "bottom", "left"],
    te = Math.min,
    B = Math.max,
    _e = Math.round,
    Oe = Math.floor,
    K = e => ({
        x: e,
        y: e
    }),
    Zo = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    },
    Qo = {
        start: "end",
        end: "start"
    };

function it(e, t, n) {
    return B(e, te(t, n))
}

function Q(e, t) {
    return typeof e == "function" ? e(t) : e
}

function J(e) {
    return e.split("-")[0]
}

function pe(e) {
    return e.split("-")[1]
}

function pt(e) {
    return e === "x" ? "y" : "x"
}

function ht(e) {
    return e === "y" ? "height" : "width"
}

function ne(e) {
    return ["top", "bottom"].includes(J(e)) ? "y" : "x"
}

function vt(e) {
    return pt(ne(e))
}

function Jo(e, t, n) {
    n === void 0 && (n = !1);
    const r = pe(e),
        o = vt(e),
        i = ht(o);
    let s = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
    return t.reference[i] > t.floating[i] && (s = Fe(s)), [s, Fe(s)]
}

function ei(e) {
    const t = Fe(e);
    return [st(e), t, st(t)]
}

function st(e) {
    return e.replace(/start|end/g, t => Qo[t])
}

function ti(e, t, n) {
    const r = ["left", "right"],
        o = ["right", "left"],
        i = ["top", "bottom"],
        s = ["bottom", "top"];
    switch (e) {
        case "top":
        case "bottom":
            return n ? t ? o : r : t ? r : o;
        case "left":
        case "right":
            return t ? i : s;
        default:
            return []
    }
}

function ni(e, t, n, r) {
    const o = pe(e);
    let i = ti(J(e), n === "start", r);
    return o && (i = i.map(s => s + "-" + o), t && (i = i.concat(i.map(st)))), i
}

function Fe(e) {
    return e.replace(/left|right|bottom|top/g, t => Zo[t])
}

function ri(e) {
    return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...e
    }
}

function In(e) {
    return typeof e != "number" ? ri(e) : {
        top: e,
        right: e,
        bottom: e,
        left: e
    }
}

function Le(e) {
    const {
        x: t,
        y: n,
        width: r,
        height: o
    } = e;
    return {
        width: r,
        height: o,
        top: n,
        left: t,
        right: t + r,
        bottom: n + o,
        x: t,
        y: n
    }
}

function Ut(e, t, n) {
    let {
        reference: r,
        floating: o
    } = e;
    const i = ne(t),
        s = vt(t),
        c = ht(s),
        u = J(t),
        l = i === "y",
        d = r.x + r.width / 2 - o.width / 2,
        m = r.y + r.height / 2 - o.height / 2,
        h = r[c] / 2 - o[c] / 2;
    let p;
    switch (u) {
        case "top":
            p = {
                x: d,
                y: r.y - o.height
            };
            break;
        case "bottom":
            p = {
                x: d,
                y: r.y + r.height
            };
            break;
        case "right":
            p = {
                x: r.x + r.width,
                y: m
            };
            break;
        case "left":
            p = {
                x: r.x - o.width,
                y: m
            };
            break;
        default:
            p = {
                x: r.x,
                y: r.y
            }
    }
    switch (pe(t)) {
        case "start":
            p[s] -= h * (n && l ? -1 : 1);
            break;
        case "end":
            p[s] += h * (n && l ? -1 : 1);
            break
    }
    return p
}
const oi = async (e, t, n) => {
    const {
        placement: r = "bottom",
        strategy: o = "absolute",
        middleware: i = [],
        platform: s
    } = n, c = i.filter(Boolean), u = await (s.isRTL == null ? void 0 : s.isRTL(t));
    let l = await s.getElementRects({
            reference: e,
            floating: t,
            strategy: o
        }),
        {
            x: d,
            y: m
        } = Ut(l, r, u),
        h = r,
        p = {},
        v = 0;
    for (let f = 0; f < c.length; f++) {
        const {
            name: y,
            fn: g
        } = c[f], {
            x: w,
            y: b,
            data: x,
            reset: E
        } = await g({
            x: d,
            y: m,
            initialPlacement: r,
            placement: h,
            strategy: o,
            middlewareData: p,
            rects: l,
            platform: s,
            elements: {
                reference: e,
                floating: t
            }
        });
        d = w ? ? d, m = b ? ? m, p = { ...p,
            [y]: { ...p[y],
                ...x
            }
        }, E && v <= 50 && (v++, typeof E == "object" && (E.placement && (h = E.placement), E.rects && (l = E.rects === !0 ? await s.getElementRects({
            reference: e,
            floating: t,
            strategy: o
        }) : E.rects), {
            x: d,
            y: m
        } = Ut(l, h, u)), f = -1)
    }
    return {
        x: d,
        y: m,
        placement: h,
        strategy: o,
        middlewareData: p
    }
};
async function ye(e, t) {
    var n;
    t === void 0 && (t = {});
    const {
        x: r,
        y: o,
        platform: i,
        rects: s,
        elements: c,
        strategy: u
    } = e, {
        boundary: l = "clippingAncestors",
        rootBoundary: d = "viewport",
        elementContext: m = "floating",
        altBoundary: h = !1,
        padding: p = 0
    } = Q(t, e), v = In(p), y = c[h ? m === "floating" ? "reference" : "floating" : m], g = Le(await i.getClippingRect({
        element: (n = await (i.isElement == null ? void 0 : i.isElement(y))) == null || n ? y : y.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(c.floating)),
        boundary: l,
        rootBoundary: d,
        strategy: u
    })), w = m === "floating" ? {
        x: r,
        y: o,
        width: s.floating.width,
        height: s.floating.height
    } : s.reference, b = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(c.floating)), x = await (i.isElement == null ? void 0 : i.isElement(b)) ? await (i.getScale == null ? void 0 : i.getScale(b)) || {
        x: 1,
        y: 1
    } : {
        x: 1,
        y: 1
    }, E = Le(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
        elements: c,
        rect: w,
        offsetParent: b,
        strategy: u
    }) : w);
    return {
        top: (g.top - E.top + v.top) / x.y,
        bottom: (E.bottom - g.bottom + v.bottom) / x.y,
        left: (g.left - E.left + v.left) / x.x,
        right: (E.right - g.right + v.right) / x.x
    }
}
const ii = e => ({
        name: "arrow",
        options: e,
        async fn(t) {
            const {
                x: n,
                y: r,
                placement: o,
                rects: i,
                platform: s,
                elements: c,
                middlewareData: u
            } = t, {
                element: l,
                padding: d = 0
            } = Q(e, t) || {};
            if (l == null) return {};
            const m = In(d),
                h = {
                    x: n,
                    y: r
                },
                p = vt(o),
                v = ht(p),
                f = await s.getDimensions(l),
                y = p === "y",
                g = y ? "top" : "left",
                w = y ? "bottom" : "right",
                b = y ? "clientHeight" : "clientWidth",
                x = i.reference[v] + i.reference[p] - h[p] - i.floating[v],
                E = h[p] - i.reference[p],
                S = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(l));
            let R = S ? S[b] : 0;
            (!R || !await (s.isElement == null ? void 0 : s.isElement(S))) && (R = c.floating[b] || i.floating[v]);
            const A = x / 2 - E / 2,
                T = R / 2 - f[v] / 2 - 1,
                D = te(m[g], T),
                I = te(m[w], T),
                F = D,
                M = R - f[v] - I,
                N = R / 2 - f[v] / 2 + A,
                k = it(F, N, M),
                O = !u.arrow && pe(o) != null && N !== k && i.reference[v] / 2 - (N < F ? D : I) - f[v] / 2 < 0,
                _ = O ? N < F ? N - F : N - M : 0;
            return {
                [p]: h[p] + _,
                data: {
                    [p]: k,
                    centerOffset: N - k - _,
                    ...O && {
                        alignmentOffset: _
                    }
                },
                reset: O
            }
        }
    }),
    si = function(e) {
        return e === void 0 && (e = {}), {
            name: "flip",
            options: e,
            async fn(t) {
                var n, r;
                const {
                    placement: o,
                    middlewareData: i,
                    rects: s,
                    initialPlacement: c,
                    platform: u,
                    elements: l
                } = t, {
                    mainAxis: d = !0,
                    crossAxis: m = !0,
                    fallbackPlacements: h,
                    fallbackStrategy: p = "bestFit",
                    fallbackAxisSideDirection: v = "none",
                    flipAlignment: f = !0,
                    ...y
                } = Q(e, t);
                if ((n = i.arrow) != null && n.alignmentOffset) return {};
                const g = J(o),
                    w = ne(c),
                    b = J(c) === c,
                    x = await (u.isRTL == null ? void 0 : u.isRTL(l.floating)),
                    E = h || (b || !f ? [Fe(c)] : ei(c)),
                    S = v !== "none";
                !h && S && E.push(...ni(c, f, v, x));
                const R = [c, ...E],
                    A = await ye(t, y),
                    T = [];
                let D = ((r = i.flip) == null ? void 0 : r.overflows) || [];
                if (d && T.push(A[g]), m) {
                    const N = Jo(o, s, x);
                    T.push(A[N[0]], A[N[1]])
                }
                if (D = [...D, {
                        placement: o,
                        overflows: T
                    }], !T.every(N => N <= 0)) {
                    var I, F;
                    const N = (((I = i.flip) == null ? void 0 : I.index) || 0) + 1,
                        k = R[N];
                    if (k) return {
                        data: {
                            index: N,
                            overflows: D
                        },
                        reset: {
                            placement: k
                        }
                    };
                    let O = (F = D.filter(_ => _.overflows[0] <= 0).sort((_, P) => _.overflows[1] - P.overflows[1])[0]) == null ? void 0 : F.placement;
                    if (!O) switch (p) {
                        case "bestFit":
                            {
                                var M;
                                const _ = (M = D.filter(P => {
                                    if (S) {
                                        const L = ne(P.placement);
                                        return L === w || L === "y"
                                    }
                                    return !0
                                }).map(P => [P.placement, P.overflows.filter(L => L > 0).reduce((L, Y) => L + Y, 0)]).sort((P, L) => P[1] - L[1])[0]) == null ? void 0 : M[0];_ && (O = _);
                                break
                            }
                        case "initialPlacement":
                            O = c;
                            break
                    }
                    if (o !== O) return {
                        reset: {
                            placement: O
                        }
                    }
                }
                return {}
            }
        }
    };

function Vt(e, t) {
    return {
        top: e.top - t.height,
        right: e.right - t.width,
        bottom: e.bottom - t.height,
        left: e.left - t.width
    }
}

function zt(e) {
    return qo.some(t => e[t] >= 0)
}
const ci = function(e) {
    return e === void 0 && (e = {}), {
        name: "hide",
        options: e,
        async fn(t) {
            const {
                rects: n
            } = t, {
                strategy: r = "referenceHidden",
                ...o
            } = Q(e, t);
            switch (r) {
                case "referenceHidden":
                    {
                        const i = await ye(t, { ...o,
                                elementContext: "reference"
                            }),
                            s = Vt(i, n.reference);
                        return {
                            data: {
                                referenceHiddenOffsets: s,
                                referenceHidden: zt(s)
                            }
                        }
                    }
                case "escaped":
                    {
                        const i = await ye(t, { ...o,
                                altBoundary: !0
                            }),
                            s = Vt(i, n.floating);
                        return {
                            data: {
                                escapedOffsets: s,
                                escaped: zt(s)
                            }
                        }
                    }
                default:
                    return {}
            }
        }
    }
};
async function ai(e, t) {
    const {
        placement: n,
        platform: r,
        elements: o
    } = e, i = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), s = J(n), c = pe(n), u = ne(n) === "y", l = ["left", "top"].includes(s) ? -1 : 1, d = i && u ? -1 : 1, m = Q(t, e);
    let {
        mainAxis: h,
        crossAxis: p,
        alignmentAxis: v
    } = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0,
        alignmentAxis: null
    } : {
        mainAxis: m.mainAxis || 0,
        crossAxis: m.crossAxis || 0,
        alignmentAxis: m.alignmentAxis
    };
    return c && typeof v == "number" && (p = c === "end" ? v * -1 : v), u ? {
        x: p * d,
        y: h * l
    } : {
        x: h * l,
        y: p * d
    }
}
const li = function(e) {
        return e === void 0 && (e = 0), {
            name: "offset",
            options: e,
            async fn(t) {
                var n, r;
                const {
                    x: o,
                    y: i,
                    placement: s,
                    middlewareData: c
                } = t, u = await ai(t, e);
                return s === ((n = c.offset) == null ? void 0 : n.placement) && (r = c.arrow) != null && r.alignmentOffset ? {} : {
                    x: o + u.x,
                    y: i + u.y,
                    data: { ...u,
                        placement: s
                    }
                }
            }
        }
    },
    ui = function(e) {
        return e === void 0 && (e = {}), {
            name: "shift",
            options: e,
            async fn(t) {
                const {
                    x: n,
                    y: r,
                    placement: o
                } = t, {
                    mainAxis: i = !0,
                    crossAxis: s = !1,
                    limiter: c = {
                        fn: y => {
                            let {
                                x: g,
                                y: w
                            } = y;
                            return {
                                x: g,
                                y: w
                            }
                        }
                    },
                    ...u
                } = Q(e, t), l = {
                    x: n,
                    y: r
                }, d = await ye(t, u), m = ne(J(o)), h = pt(m);
                let p = l[h],
                    v = l[m];
                if (i) {
                    const y = h === "y" ? "top" : "left",
                        g = h === "y" ? "bottom" : "right",
                        w = p + d[y],
                        b = p - d[g];
                    p = it(w, p, b)
                }
                if (s) {
                    const y = m === "y" ? "top" : "left",
                        g = m === "y" ? "bottom" : "right",
                        w = v + d[y],
                        b = v - d[g];
                    v = it(w, v, b)
                }
                const f = c.fn({ ...t,
                    [h]: p,
                    [m]: v
                });
                return { ...f,
                    data: {
                        x: f.x - n,
                        y: f.y - r,
                        enabled: {
                            [h]: i,
                            [m]: s
                        }
                    }
                }
            }
        }
    },
    fi = function(e) {
        return e === void 0 && (e = {}), {
            options: e,
            fn(t) {
                const {
                    x: n,
                    y: r,
                    placement: o,
                    rects: i,
                    middlewareData: s
                } = t, {
                    offset: c = 0,
                    mainAxis: u = !0,
                    crossAxis: l = !0
                } = Q(e, t), d = {
                    x: n,
                    y: r
                }, m = ne(o), h = pt(m);
                let p = d[h],
                    v = d[m];
                const f = Q(c, t),
                    y = typeof f == "number" ? {
                        mainAxis: f,
                        crossAxis: 0
                    } : {
                        mainAxis: 0,
                        crossAxis: 0,
                        ...f
                    };
                if (u) {
                    const b = h === "y" ? "height" : "width",
                        x = i.reference[h] - i.floating[b] + y.mainAxis,
                        E = i.reference[h] + i.reference[b] - y.mainAxis;
                    p < x ? p = x : p > E && (p = E)
                }
                if (l) {
                    var g, w;
                    const b = h === "y" ? "width" : "height",
                        x = ["top", "left"].includes(J(o)),
                        E = i.reference[m] - i.floating[b] + (x && ((g = s.offset) == null ? void 0 : g[m]) || 0) + (x ? 0 : y.crossAxis),
                        S = i.reference[m] + i.reference[b] + (x ? 0 : ((w = s.offset) == null ? void 0 : w[m]) || 0) - (x ? y.crossAxis : 0);
                    v < E ? v = E : v > S && (v = S)
                }
                return {
                    [h]: p,
                    [m]: v
                }
            }
        }
    },
    di = function(e) {
        return e === void 0 && (e = {}), {
            name: "size",
            options: e,
            async fn(t) {
                var n, r;
                const {
                    placement: o,
                    rects: i,
                    platform: s,
                    elements: c
                } = t, {
                    apply: u = () => {},
                    ...l
                } = Q(e, t), d = await ye(t, l), m = J(o), h = pe(o), p = ne(o) === "y", {
                    width: v,
                    height: f
                } = i.floating;
                let y, g;
                m === "top" || m === "bottom" ? (y = m, g = h === (await (s.isRTL == null ? void 0 : s.isRTL(c.floating)) ? "start" : "end") ? "left" : "right") : (g = m, y = h === "end" ? "top" : "bottom");
                const w = f - d.top - d.bottom,
                    b = v - d.left - d.right,
                    x = te(f - d[y], w),
                    E = te(v - d[g], b),
                    S = !t.middlewareData.shift;
                let R = x,
                    A = E;
                if ((n = t.middlewareData.shift) != null && n.enabled.x && (A = b), (r = t.middlewareData.shift) != null && r.enabled.y && (R = w), S && !h) {
                    const D = B(d.left, 0),
                        I = B(d.right, 0),
                        F = B(d.top, 0),
                        M = B(d.bottom, 0);
                    p ? A = v - 2 * (D !== 0 || I !== 0 ? D + I : B(d.left, d.right)) : R = f - 2 * (F !== 0 || M !== 0 ? F + M : B(d.top, d.bottom))
                }
                await u({ ...t,
                    availableWidth: A,
                    availableHeight: R
                });
                const T = await s.getDimensions(c.floating);
                return v !== T.width || f !== T.height ? {
                    reset: {
                        rects: !0
                    }
                } : {}
            }
        }
    };

function He() {
    return typeof window < "u"
}

function he(e) {
    return _n(e) ? (e.nodeName || "").toLowerCase() : "#document"
}

function $(e) {
    var t;
    return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window
}

function q(e) {
    var t;
    return (t = (_n(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement
}

function _n(e) {
    return He() ? e instanceof Node || e instanceof $(e).Node : !1
}

function U(e) {
    return He() ? e instanceof Element || e instanceof $(e).Element : !1
}

function X(e) {
    return He() ? e instanceof HTMLElement || e instanceof $(e).HTMLElement : !1
}

function Yt(e) {
    return !He() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof $(e).ShadowRoot
}

function xe(e) {
    const {
        overflow: t,
        overflowX: n,
        overflowY: r,
        display: o
    } = V(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !["inline", "contents"].includes(o)
}

function mi(e) {
    return ["table", "td", "th"].includes(he(e))
}

function Ue(e) {
    return [":popover-open", ":modal"].some(t => {
        try {
            return e.matches(t)
        } catch {
            return !1
        }
    })
}

function gt(e) {
    const t = yt(),
        n = U(e) ? V(e) : e;
    return n.transform !== "none" || n.perspective !== "none" || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "perspective", "filter"].some(r => (n.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some(r => (n.contain || "").includes(r))
}

function pi(e) {
    let t = re(e);
    for (; X(t) && !me(t);) {
        if (gt(t)) return t;
        if (Ue(t)) return null;
        t = re(t)
    }
    return null
}

function yt() {
    return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none")
}

function me(e) {
    return ["html", "body", "#document"].includes(he(e))
}

function V(e) {
    return $(e).getComputedStyle(e)
}

function Ve(e) {
    return U(e) ? {
        scrollLeft: e.scrollLeft,
        scrollTop: e.scrollTop
    } : {
        scrollLeft: e.scrollX,
        scrollTop: e.scrollY
    }
}

function re(e) {
    if (he(e) === "html") return e;
    const t = e.assignedSlot || e.parentNode || Yt(e) && e.host || q(e);
    return Yt(t) ? t.host : t
}

function Fn(e) {
    const t = re(e);
    return me(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : X(t) && xe(t) ? t : Fn(t)
}

function we(e, t, n) {
    var r;
    t === void 0 && (t = []), n === void 0 && (n = !0);
    const o = Fn(e),
        i = o === ((r = e.ownerDocument) == null ? void 0 : r.body),
        s = $(o);
    if (i) {
        const c = ct(s);
        return t.concat(s, s.visualViewport || [], xe(o) ? o : [], c && n ? we(c) : [])
    }
    return t.concat(o, we(o, [], n))
}

function ct(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null
}

function Ln(e) {
    const t = V(e);
    let n = parseFloat(t.width) || 0,
        r = parseFloat(t.height) || 0;
    const o = X(e),
        i = o ? e.offsetWidth : n,
        s = o ? e.offsetHeight : r,
        c = _e(n) !== i || _e(r) !== s;
    return c && (n = i, r = s), {
        width: n,
        height: r,
        $: c
    }
}

function wt(e) {
    return U(e) ? e : e.contextElement
}

function de(e) {
    const t = wt(e);
    if (!X(t)) return K(1);
    const n = t.getBoundingClientRect(),
        {
            width: r,
            height: o,
            $: i
        } = Ln(t);
    let s = (i ? _e(n.width) : n.width) / r,
        c = (i ? _e(n.height) : n.height) / o;
    return (!s || !Number.isFinite(s)) && (s = 1), (!c || !Number.isFinite(c)) && (c = 1), {
        x: s,
        y: c
    }
}
const hi = K(0);

function kn(e) {
    const t = $(e);
    return !yt() || !t.visualViewport ? hi : {
        x: t.visualViewport.offsetLeft,
        y: t.visualViewport.offsetTop
    }
}

function vi(e, t, n) {
    return t === void 0 && (t = !1), !n || t && n !== $(e) ? !1 : t
}

function ce(e, t, n, r) {
    t === void 0 && (t = !1), n === void 0 && (n = !1);
    const o = e.getBoundingClientRect(),
        i = wt(e);
    let s = K(1);
    t && (r ? U(r) && (s = de(r)) : s = de(e));
    const c = vi(i, n, r) ? kn(i) : K(0);
    let u = (o.left + c.x) / s.x,
        l = (o.top + c.y) / s.y,
        d = o.width / s.x,
        m = o.height / s.y;
    if (i) {
        const h = $(i),
            p = r && U(r) ? $(r) : r;
        let v = h,
            f = ct(v);
        for (; f && r && p !== v;) {
            const y = de(f),
                g = f.getBoundingClientRect(),
                w = V(f),
                b = g.left + (f.clientLeft + parseFloat(w.paddingLeft)) * y.x,
                x = g.top + (f.clientTop + parseFloat(w.paddingTop)) * y.y;
            u *= y.x, l *= y.y, d *= y.x, m *= y.y, u += b, l += x, v = $(f), f = ct(v)
        }
    }
    return Le({
        width: d,
        height: m,
        x: u,
        y: l
    })
}

function xt(e, t) {
    const n = Ve(e).scrollLeft;
    return t ? t.left + n : ce(q(e)).left + n
}

function Wn(e, t, n) {
    n === void 0 && (n = !1);
    const r = e.getBoundingClientRect(),
        o = r.left + t.scrollLeft - (n ? 0 : xt(e, r)),
        i = r.top + t.scrollTop;
    return {
        x: o,
        y: i
    }
}

function gi(e) {
    let {
        elements: t,
        rect: n,
        offsetParent: r,
        strategy: o
    } = e;
    const i = o === "fixed",
        s = q(r),
        c = t ? Ue(t.floating) : !1;
    if (r === s || c && i) return n;
    let u = {
            scrollLeft: 0,
            scrollTop: 0
        },
        l = K(1);
    const d = K(0),
        m = X(r);
    if ((m || !m && !i) && ((he(r) !== "body" || xe(s)) && (u = Ve(r)), X(r))) {
        const p = ce(r);
        l = de(r), d.x = p.x + r.clientLeft, d.y = p.y + r.clientTop
    }
    const h = s && !m && !i ? Wn(s, u, !0) : K(0);
    return {
        width: n.width * l.x,
        height: n.height * l.y,
        x: n.x * l.x - u.scrollLeft * l.x + d.x + h.x,
        y: n.y * l.y - u.scrollTop * l.y + d.y + h.y
    }
}

function yi(e) {
    return Array.from(e.getClientRects())
}

function wi(e) {
    const t = q(e),
        n = Ve(e),
        r = e.ownerDocument.body,
        o = B(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth),
        i = B(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
    let s = -n.scrollLeft + xt(e);
    const c = -n.scrollTop;
    return V(r).direction === "rtl" && (s += B(t.clientWidth, r.clientWidth) - o), {
        width: o,
        height: i,
        x: s,
        y: c
    }
}

function xi(e, t) {
    const n = $(e),
        r = q(e),
        o = n.visualViewport;
    let i = r.clientWidth,
        s = r.clientHeight,
        c = 0,
        u = 0;
    if (o) {
        i = o.width, s = o.height;
        const l = yt();
        (!l || l && t === "fixed") && (c = o.offsetLeft, u = o.offsetTop)
    }
    return {
        width: i,
        height: s,
        x: c,
        y: u
    }
}

function bi(e, t) {
    const n = ce(e, !0, t === "fixed"),
        r = n.top + e.clientTop,
        o = n.left + e.clientLeft,
        i = X(e) ? de(e) : K(1),
        s = e.clientWidth * i.x,
        c = e.clientHeight * i.y,
        u = o * i.x,
        l = r * i.y;
    return {
        width: s,
        height: c,
        x: u,
        y: l
    }
}

function Gt(e, t, n) {
    let r;
    if (t === "viewport") r = xi(e, n);
    else if (t === "document") r = wi(q(e));
    else if (U(t)) r = bi(t, n);
    else {
        const o = kn(e);
        r = {
            x: t.x - o.x,
            y: t.y - o.y,
            width: t.width,
            height: t.height
        }
    }
    return Le(r)
}

function jn(e, t) {
    const n = re(e);
    return n === t || !U(n) || me(n) ? !1 : V(n).position === "fixed" || jn(n, t)
}

function Ei(e, t) {
    const n = t.get(e);
    if (n) return n;
    let r = we(e, [], !1).filter(c => U(c) && he(c) !== "body"),
        o = null;
    const i = V(e).position === "fixed";
    let s = i ? re(e) : e;
    for (; U(s) && !me(s);) {
        const c = V(s),
            u = gt(s);
        !u && c.position === "fixed" && (o = null), (i ? !u && !o : !u && c.position === "static" && !!o && ["absolute", "fixed"].includes(o.position) || xe(s) && !u && jn(e, s)) ? r = r.filter(d => d !== s) : o = c, s = re(s)
    }
    return t.set(e, r), r
}

function Ci(e) {
    let {
        element: t,
        boundary: n,
        rootBoundary: r,
        strategy: o
    } = e;
    const s = [...n === "clippingAncestors" ? Ue(t) ? [] : Ei(t, this._c) : [].concat(n), r],
        c = s[0],
        u = s.reduce((l, d) => {
            const m = Gt(t, d, o);
            return l.top = B(m.top, l.top), l.right = te(m.right, l.right), l.bottom = te(m.bottom, l.bottom), l.left = B(m.left, l.left), l
        }, Gt(t, c, o));
    return {
        width: u.right - u.left,
        height: u.bottom - u.top,
        x: u.left,
        y: u.top
    }
}

function Ri(e) {
    const {
        width: t,
        height: n
    } = Ln(e);
    return {
        width: t,
        height: n
    }
}

function Si(e, t, n) {
    const r = X(t),
        o = q(t),
        i = n === "fixed",
        s = ce(e, !0, i, t);
    let c = {
        scrollLeft: 0,
        scrollTop: 0
    };
    const u = K(0);
    if (r || !r && !i)
        if ((he(t) !== "body" || xe(o)) && (c = Ve(t)), r) {
            const h = ce(t, !0, i, t);
            u.x = h.x + t.clientLeft, u.y = h.y + t.clientTop
        } else o && (u.x = xt(o));
    const l = o && !r && !i ? Wn(o, c) : K(0),
        d = s.left + c.scrollLeft - u.x - l.x,
        m = s.top + c.scrollTop - u.y - l.y;
    return {
        x: d,
        y: m,
        width: s.width,
        height: s.height
    }
}

function Je(e) {
    return V(e).position === "static"
}

function Kt(e, t) {
    if (!X(e) || V(e).position === "fixed") return null;
    if (t) return t(e);
    let n = e.offsetParent;
    return q(e) === n && (n = n.ownerDocument.body), n
}

function Bn(e, t) {
    const n = $(e);
    if (Ue(e)) return n;
    if (!X(e)) {
        let o = re(e);
        for (; o && !me(o);) {
            if (U(o) && !Je(o)) return o;
            o = re(o)
        }
        return n
    }
    let r = Kt(e, t);
    for (; r && mi(r) && Je(r);) r = Kt(r, t);
    return r && me(r) && Je(r) && !gt(r) ? n : r || pi(e) || n
}
const Ai = async function(e) {
    const t = this.getOffsetParent || Bn,
        n = this.getDimensions,
        r = await n(e.floating);
    return {
        reference: Si(e.reference, await t(e.floating), e.strategy),
        floating: {
            x: 0,
            y: 0,
            width: r.width,
            height: r.height
        }
    }
};

function Pi(e) {
    return V(e).direction === "rtl"
}
const Oi = {
    convertOffsetParentRelativeRectToViewportRelativeRect: gi,
    getDocumentElement: q,
    getClippingRect: Ci,
    getOffsetParent: Bn,
    getElementRects: Ai,
    getClientRects: yi,
    getDimensions: Ri,
    getScale: de,
    isElement: U,
    isRTL: Pi
};

function Di(e, t) {
    let n = null,
        r;
    const o = q(e);

    function i() {
        var c;
        clearTimeout(r), (c = n) == null || c.disconnect(), n = null
    }

    function s(c, u) {
        c === void 0 && (c = !1), u === void 0 && (u = 1), i();
        const {
            left: l,
            top: d,
            width: m,
            height: h
        } = e.getBoundingClientRect();
        if (c || t(), !m || !h) return;
        const p = Oe(d),
            v = Oe(o.clientWidth - (l + m)),
            f = Oe(o.clientHeight - (d + h)),
            y = Oe(l),
            w = {
                rootMargin: -p + "px " + -v + "px " + -f + "px " + -y + "px",
                threshold: B(0, te(1, u)) || 1
            };
        let b = !0;

        function x(E) {
            const S = E[0].intersectionRatio;
            if (S !== u) {
                if (!b) return s();
                S ? s(!1, S) : r = setTimeout(() => {
                    s(!1, 1e-7)
                }, 1e3)
            }
            b = !1
        }
        try {
            n = new IntersectionObserver(x, { ...w,
                root: o.ownerDocument
            })
        } catch {
            n = new IntersectionObserver(x, w)
        }
        n.observe(e)
    }
    return s(!0), i
}

function Ti(e, t, n, r) {
    r === void 0 && (r = {});
    const {
        ancestorScroll: o = !0,
        ancestorResize: i = !0,
        elementResize: s = typeof ResizeObserver == "function",
        layoutShift: c = typeof IntersectionObserver == "function",
        animationFrame: u = !1
    } = r, l = wt(e), d = o || i ? [...l ? we(l) : [], ...we(t)] : [];
    d.forEach(g => {
        o && g.addEventListener("scroll", n, {
            passive: !0
        }), i && g.addEventListener("resize", n)
    });
    const m = l && c ? Di(l, n) : null;
    let h = -1,
        p = null;
    s && (p = new ResizeObserver(g => {
        let [w] = g;
        w && w.target === l && p && (p.unobserve(t), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
            var b;
            (b = p) == null || b.observe(t)
        })), n()
    }), l && !u && p.observe(l), p.observe(t));
    let v, f = u ? ce(e) : null;
    u && y();

    function y() {
        const g = ce(e);
        f && (g.x !== f.x || g.y !== f.y || g.width !== f.width || g.height !== f.height) && n(), f = g, v = requestAnimationFrame(y)
    }
    return n(), () => {
        var g;
        d.forEach(w => {
            o && w.removeEventListener("scroll", n), i && w.removeEventListener("resize", n)
        }), m == null || m(), (g = p) == null || g.disconnect(), p = null, u && cancelAnimationFrame(v)
    }
}
const Ni = li,
    Mi = ui,
    Ii = si,
    _i = di,
    Fi = ci,
    Xt = ii,
    Li = fi,
    ki = (e, t, n) => {
        const r = new Map,
            o = {
                platform: Oi,
                ...n
            },
            i = { ...o.platform,
                _c: r
            };
        return oi(e, t, { ...o,
            platform: i
        })
    };
var Me = typeof document < "u" ? a.useLayoutEffect : a.useEffect;

function ke(e, t) {
    if (e === t) return !0;
    if (typeof e != typeof t) return !1;
    if (typeof e == "function" && e.toString() === t.toString()) return !0;
    let n, r, o;
    if (e && t && typeof e == "object") {
        if (Array.isArray(e)) {
            if (n = e.length, n !== t.length) return !1;
            for (r = n; r-- !== 0;)
                if (!ke(e[r], t[r])) return !1;
            return !0
        }
        if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length) return !1;
        for (r = n; r-- !== 0;)
            if (!{}.hasOwnProperty.call(t, o[r])) return !1;
        for (r = n; r-- !== 0;) {
            const i = o[r];
            if (!(i === "_owner" && e.$$typeof) && !ke(e[i], t[i])) return !1
        }
        return !0
    }
    return e !== e && t !== t
}

function $n(e) {
    return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1
}

function qt(e, t) {
    const n = $n(e);
    return Math.round(t * n) / n
}

function et(e) {
    const t = a.useRef(e);
    return Me(() => {
        t.current = e
    }), t
}

function Wi(e) {
    e === void 0 && (e = {});
    const {
        placement: t = "bottom",
        strategy: n = "absolute",
        middleware: r = [],
        platform: o,
        elements: {
            reference: i,
            floating: s
        } = {},
        transform: c = !0,
        whileElementsMounted: u,
        open: l
    } = e, [d, m] = a.useState({
        x: 0,
        y: 0,
        strategy: n,
        placement: t,
        middlewareData: {},
        isPositioned: !1
    }), [h, p] = a.useState(r);
    ke(h, r) || p(r);
    const [v, f] = a.useState(null), [y, g] = a.useState(null), w = a.useCallback(P => {
        P !== S.current && (S.current = P, f(P))
    }, []), b = a.useCallback(P => {
        P !== R.current && (R.current = P, g(P))
    }, []), x = i || v, E = s || y, S = a.useRef(null), R = a.useRef(null), A = a.useRef(d), T = u != null, D = et(u), I = et(o), F = et(l), M = a.useCallback(() => {
        if (!S.current || !R.current) return;
        const P = {
            placement: t,
            strategy: n,
            middleware: h
        };
        I.current && (P.platform = I.current), ki(S.current, R.current, P).then(L => {
            const Y = { ...L,
                isPositioned: F.current !== !1
            };
            N.current && !ke(A.current, Y) && (A.current = Y, Zt.flushSync(() => {
                m(Y)
            }))
        })
    }, [h, t, n, I, F]);
    Me(() => {
        l === !1 && A.current.isPositioned && (A.current.isPositioned = !1, m(P => ({ ...P,
            isPositioned: !1
        })))
    }, [l]);
    const N = a.useRef(!1);
    Me(() => (N.current = !0, () => {
        N.current = !1
    }), []), Me(() => {
        if (x && (S.current = x), E && (R.current = E), x && E) {
            if (D.current) return D.current(x, E, M);
            M()
        }
    }, [x, E, M, D, T]);
    const k = a.useMemo(() => ({
            reference: S,
            floating: R,
            setReference: w,
            setFloating: b
        }), [w, b]),
        O = a.useMemo(() => ({
            reference: x,
            floating: E
        }), [x, E]),
        _ = a.useMemo(() => {
            const P = {
                position: n,
                left: 0,
                top: 0
            };
            if (!O.floating) return P;
            const L = qt(O.floating, d.x),
                Y = qt(O.floating, d.y);
            return c ? { ...P,
                transform: "translate(" + L + "px, " + Y + "px)",
                ...$n(O.floating) >= 1.5 && {
                    willChange: "transform"
                }
            } : {
                position: n,
                left: L,
                top: Y
            }
        }, [n, c, O.floating, d.x, d.y]);
    return a.useMemo(() => ({ ...d,
        update: M,
        refs: k,
        elements: O,
        floatingStyles: _
    }), [d, M, k, O, _])
}
const ji = e => {
        function t(n) {
            return {}.hasOwnProperty.call(n, "current")
        }
        return {
            name: "arrow",
            options: e,
            fn(n) {
                const {
                    element: r,
                    padding: o
                } = typeof e == "function" ? e(n) : e;
                return r && t(r) ? r.current != null ? Xt({
                    element: r.current,
                    padding: o
                }).fn(n) : {} : r ? Xt({
                    element: r,
                    padding: o
                }).fn(n) : {}
            }
        }
    },
    Bi = (e, t) => ({ ...Ni(e),
        options: [e, t]
    }),
    $i = (e, t) => ({ ...Mi(e),
        options: [e, t]
    }),
    Hi = (e, t) => ({ ...Li(e),
        options: [e, t]
    }),
    Ui = (e, t) => ({ ...Ii(e),
        options: [e, t]
    }),
    Vi = (e, t) => ({ ..._i(e),
        options: [e, t]
    }),
    zi = (e, t) => ({ ...Fi(e),
        options: [e, t]
    }),
    Yi = (e, t) => ({ ...ji(e),
        options: [e, t]
    });
var Gi = "Arrow",
    Hn = a.forwardRef((e, t) => {
        const {
            children: n,
            width: r = 10,
            height: o = 5,
            ...i
        } = e;
        return C.jsx(j.svg, { ...i,
            ref: t,
            width: r,
            height: o,
            viewBox: "0 0 30 10",
            preserveAspectRatio: "none",
            children: e.asChild ? n : C.jsx("polygon", {
                points: "0,0 30,0 15,10"
            })
        })
    });
Hn.displayName = Gi;
var Ki = Hn,
    bt = "Popper",
    [Un, Cs] = je(bt),
    [Xi, Vn] = Un(bt),
    zn = e => {
        const {
            __scopePopper: t,
            children: n
        } = e, [r, o] = a.useState(null);
        return C.jsx(Xi, {
            scope: t,
            anchor: r,
            onAnchorChange: o,
            children: n
        })
    };
zn.displayName = bt;
var Yn = "PopperAnchor",
    Gn = a.forwardRef((e, t) => {
        const {
            __scopePopper: n,
            virtualRef: r,
            ...o
        } = e, i = Vn(Yn, n), s = a.useRef(null), c = H(t, s);
        return a.useEffect(() => {
            i.onAnchorChange((r == null ? void 0 : r.current) || s.current)
        }), r ? null : C.jsx(j.div, { ...o,
            ref: c
        })
    });
Gn.displayName = Yn;
var Et = "PopperContent",
    [qi, Zi] = Un(Et),
    Kn = a.forwardRef((e, t) => {
        var Ct, Rt, St, At, Pt, Ot;
        const {
            __scopePopper: n,
            side: r = "bottom",
            sideOffset: o = 0,
            align: i = "center",
            alignOffset: s = 0,
            arrowPadding: c = 0,
            avoidCollisions: u = !0,
            collisionBoundary: l = [],
            collisionPadding: d = 0,
            sticky: m = "partial",
            hideWhenDetached: h = !1,
            updatePositionStrategy: p = "optimized",
            onPlaced: v,
            ...f
        } = e, y = Vn(Et, n), [g, w] = a.useState(null), b = H(t, ve => w(ve)), [x, E] = a.useState(null), S = Xo(x), R = (S == null ? void 0 : S.width) ? ? 0, A = (S == null ? void 0 : S.height) ? ? 0, T = r + (i !== "center" ? "-" + i : ""), D = typeof d == "number" ? d : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...d
        }, I = Array.isArray(l) ? l : [l], F = I.length > 0, M = {
            padding: D,
            boundary: I.filter(Ji),
            altBoundary: F
        }, {
            refs: N,
            floatingStyles: k,
            placement: O,
            isPositioned: _,
            middlewareData: P
        } = Wi({
            strategy: "fixed",
            placement: T,
            whileElementsMounted: (...ve) => Ti(...ve, {
                animationFrame: p === "always"
            }),
            elements: {
                reference: y.anchor
            },
            middleware: [Bi({
                mainAxis: o + A,
                alignmentAxis: s
            }), u && $i({
                mainAxis: !0,
                crossAxis: !1,
                limiter: m === "partial" ? Hi() : void 0,
                ...M
            }), u && Ui({ ...M
            }), Vi({ ...M,
                apply: ({
                    elements: ve,
                    rects: Dt,
                    availableWidth: ar,
                    availableHeight: lr
                }) => {
                    const {
                        width: ur,
                        height: fr
                    } = Dt.reference, Ee = ve.floating.style;
                    Ee.setProperty("--radix-popper-available-width", `${ar}px`), Ee.setProperty("--radix-popper-available-height", `${lr}px`), Ee.setProperty("--radix-popper-anchor-width", `${ur}px`), Ee.setProperty("--radix-popper-anchor-height", `${fr}px`)
                }
            }), x && Yi({
                element: x,
                padding: c
            }), es({
                arrowWidth: R,
                arrowHeight: A
            }), h && zi({
                strategy: "referenceHidden",
                ...M
            })]
        }), [L, Y] = Zn(O), be = Z(v);
        ie(() => {
            _ && (be == null || be())
        }, [_, be]);
        const rr = (Ct = P.arrow) == null ? void 0 : Ct.x,
            or = (Rt = P.arrow) == null ? void 0 : Rt.y,
            ir = ((St = P.arrow) == null ? void 0 : St.centerOffset) !== 0,
            [sr, cr] = a.useState();
        return ie(() => {
            g && cr(window.getComputedStyle(g).zIndex)
        }, [g]), C.jsx("div", {
            ref: N.setFloating,
            "data-radix-popper-content-wrapper": "",
            style: { ...k,
                transform: _ ? k.transform : "translate(0, -200%)",
                minWidth: "max-content",
                zIndex: sr,
                "--radix-popper-transform-origin": [(At = P.transformOrigin) == null ? void 0 : At.x, (Pt = P.transformOrigin) == null ? void 0 : Pt.y].join(" "),
                ...((Ot = P.hide) == null ? void 0 : Ot.referenceHidden) && {
                    visibility: "hidden",
                    pointerEvents: "none"
                }
            },
            dir: e.dir,
            children: C.jsx(qi, {
                scope: n,
                placedSide: L,
                onArrowChange: E,
                arrowX: rr,
                arrowY: or,
                shouldHideArrow: ir,
                children: C.jsx(j.div, {
                    "data-side": L,
                    "data-align": Y,
                    ...f,
                    ref: b,
                    style: { ...f.style,
                        animation: _ ? void 0 : "none"
                    }
                })
            })
        })
    });
Kn.displayName = Et;
var Xn = "PopperArrow",
    Qi = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
    },
    qn = a.forwardRef(function(t, n) {
        const {
            __scopePopper: r,
            ...o
        } = t, i = Zi(Xn, r), s = Qi[i.placedSide];
        return C.jsx("span", {
            ref: i.onArrowChange,
            style: {
                position: "absolute",
                left: i.arrowX,
                top: i.arrowY,
                [s]: 0,
                transformOrigin: {
                    top: "",
                    right: "0 0",
                    bottom: "center 0",
                    left: "100% 0"
                }[i.placedSide],
                transform: {
                    top: "translateY(100%)",
                    right: "translateY(50%) rotate(90deg) translateX(-50%)",
                    bottom: "rotate(180deg)",
                    left: "translateY(50%) rotate(-90deg) translateX(50%)"
                }[i.placedSide],
                visibility: i.shouldHideArrow ? "hidden" : void 0
            },
            children: C.jsx(Ki, { ...o,
                ref: n,
                style: { ...o.style,
                    display: "block"
                }
            })
        })
    });
qn.displayName = Xn;

function Ji(e) {
    return e !== null
}
var es = e => ({
    name: "transformOrigin",
    options: e,
    fn(t) {
        var y, g, w;
        const {
            placement: n,
            rects: r,
            middlewareData: o
        } = t, s = ((y = o.arrow) == null ? void 0 : y.centerOffset) !== 0, c = s ? 0 : e.arrowWidth, u = s ? 0 : e.arrowHeight, [l, d] = Zn(n), m = {
            start: "0%",
            center: "50%",
            end: "100%"
        }[d], h = (((g = o.arrow) == null ? void 0 : g.x) ? ? 0) + c / 2, p = (((w = o.arrow) == null ? void 0 : w.y) ? ? 0) + u / 2;
        let v = "",
            f = "";
        return l === "bottom" ? (v = s ? m : `${h}px`, f = `${-u}px`) : l === "top" ? (v = s ? m : `${h}px`, f = `${r.floating.height+u}px`) : l === "right" ? (v = `${-u}px`, f = s ? m : `${p}px`) : l === "left" && (v = `${r.floating.width+u}px`, f = s ? m : `${p}px`), {
            data: {
                x: v,
                y: f
            }
        }
    }
});

function Zn(e) {
    const [t, n = "center"] = e.split("-");
    return [t, n]
}
var Rs = zn,
    Ss = Gn,
    As = Kn,
    Ps = qn,
    tt = "rovingFocusGroup.onEntryFocus",
    ts = {
        bubbles: !1,
        cancelable: !0
    },
    ze = "RovingFocusGroup",
    [at, Qn, ns] = Ar(ze),
    [rs, Os] = je(ze, [ns]),
    [os, is] = rs(ze),
    Jn = a.forwardRef((e, t) => C.jsx(at.Provider, {
        scope: e.__scopeRovingFocusGroup,
        children: C.jsx(at.Slot, {
            scope: e.__scopeRovingFocusGroup,
            children: C.jsx(ss, { ...e,
                ref: t
            })
        })
    }));
Jn.displayName = ze;
var ss = a.forwardRef((e, t) => {
        const {
            __scopeRovingFocusGroup: n,
            orientation: r,
            loop: o = !1,
            dir: i,
            currentTabStopId: s,
            defaultCurrentTabStopId: c,
            onCurrentTabStopIdChange: u,
            onEntryFocus: l,
            preventScrollOnEntryFocus: d = !1,
            ...m
        } = e, h = a.useRef(null), p = H(t, h), v = Hr(i), [f = null, y] = sn({
            prop: s,
            defaultProp: c,
            onChange: u
        }), [g, w] = a.useState(!1), b = Z(l), x = Qn(n), E = a.useRef(!1), [S, R] = a.useState(0);
        return a.useEffect(() => {
            const A = h.current;
            if (A) return A.addEventListener(tt, b), () => A.removeEventListener(tt, b)
        }, [b]), C.jsx(os, {
            scope: n,
            orientation: r,
            dir: v,
            loop: o,
            currentTabStopId: f,
            onItemFocus: a.useCallback(A => y(A), [y]),
            onItemShiftTab: a.useCallback(() => w(!0), []),
            onFocusableItemAdd: a.useCallback(() => R(A => A + 1), []),
            onFocusableItemRemove: a.useCallback(() => R(A => A - 1), []),
            children: C.jsx(j.div, {
                tabIndex: g || S === 0 ? -1 : 0,
                "data-orientation": r,
                ...m,
                ref: p,
                style: {
                    outline: "none",
                    ...e.style
                },
                onMouseDown: W(e.onMouseDown, () => {
                    E.current = !0
                }),
                onFocus: W(e.onFocus, A => {
                    const T = !E.current;
                    if (A.target === A.currentTarget && T && !g) {
                        const D = new CustomEvent(tt, ts);
                        if (A.currentTarget.dispatchEvent(D), !D.defaultPrevented) {
                            const I = x().filter(O => O.focusable),
                                F = I.find(O => O.active),
                                M = I.find(O => O.id === f),
                                k = [F, M, ...I].filter(Boolean).map(O => O.ref.current);
                            nr(k, d)
                        }
                    }
                    E.current = !1
                }),
                onBlur: W(e.onBlur, () => w(!1))
            })
        })
    }),
    er = "RovingFocusGroupItem",
    tr = a.forwardRef((e, t) => {
        const {
            __scopeRovingFocusGroup: n,
            focusable: r = !0,
            active: o = !1,
            tabStopId: i,
            ...s
        } = e, c = De(), u = i || c, l = is(er, n), d = l.currentTabStopId === u, m = Qn(n), {
            onFocusableItemAdd: h,
            onFocusableItemRemove: p
        } = l;
        return a.useEffect(() => {
            if (r) return h(), () => p()
        }, [r, h, p]), C.jsx(at.ItemSlot, {
            scope: n,
            id: u,
            focusable: r,
            active: o,
            children: C.jsx(j.span, {
                tabIndex: d ? 0 : -1,
                "data-orientation": l.orientation,
                ...s,
                ref: t,
                onMouseDown: W(e.onMouseDown, v => {
                    r ? l.onItemFocus(u) : v.preventDefault()
                }),
                onFocus: W(e.onFocus, () => l.onItemFocus(u)),
                onKeyDown: W(e.onKeyDown, v => {
                    if (v.key === "Tab" && v.shiftKey) {
                        l.onItemShiftTab();
                        return
                    }
                    if (v.target !== v.currentTarget) return;
                    const f = ls(v, l.orientation, l.dir);
                    if (f !== void 0) {
                        if (v.metaKey || v.ctrlKey || v.altKey || v.shiftKey) return;
                        v.preventDefault();
                        let g = m().filter(w => w.focusable).map(w => w.ref.current);
                        if (f === "last") g.reverse();
                        else if (f === "prev" || f === "next") {
                            f === "prev" && g.reverse();
                            const w = g.indexOf(v.currentTarget);
                            g = l.loop ? us(g, w + 1) : g.slice(w + 1)
                        }
                        setTimeout(() => nr(g))
                    }
                })
            })
        })
    });
tr.displayName = er;
var cs = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last"
};

function as(e, t) {
    return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e
}

function ls(e, t, n) {
    const r = as(e.key, n);
    if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))) return cs[r]
}

function nr(e, t = !1) {
    const n = document.activeElement;
    for (const r of e)
        if (r === n || (r.focus({
                preventScroll: t
            }), document.activeElement !== n)) return
}

function us(e, t) {
    return e.map((n, r) => e[(t + r) % e.length])
}
var Ds = Jn,
    Ts = tr;
export {
    Ss as A, ms as B, ws as C, lt as D, Xo as E, cn as F, Os as G, Ds as H, Ts as I, ys as O, j as P, ds as R, ge as S, xs as T, je as a, sn as b, Ar as c, Be as d, Z as e, W as f, on as g, ie as h, Or as i, C as j, Hr as k, De as l, en as m, Es as n, bs as o, vs as p, gs as q, Cs as r, As as s, Er as t, H as u, Ps as v, Rs as w, jo as x, Qr as y, vn as z
};