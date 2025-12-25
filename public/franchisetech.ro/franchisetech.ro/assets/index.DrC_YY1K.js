const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/OnboardingModal.Bf5Dzp1K.js", "assets/ui-vendor.Bl07kmxE.js", "assets/react-vendor.CoFnG1Cb.js", "assets/odooVATHelper.BJeXAh4R.js", "assets/checkbox.DrjMjESB.js", "assets/icons-vendor.BaRxkmJj.js", "assets/form-vendor.CYdr9quq.js", "assets/index.DfBlkqaH.js", "assets/query-vendor.Ckm1xsuj.js", "assets/utils-vendor.B2rm_Apj.js", "assets/i18n-vendor.CxbKsUuT.js", "assets/motion-vendor.CwL1EI4n.js", "assets/RegistrationModal.DMTcX9UO.js", "assets/Home.PIWbmZ7T.js", "assets/Helmet.B9sVbWhk.js", "assets/index.JulBJio6.js", "assets/structuredData.D5Vl_LyK.js", "assets/Services.D0Az0Ifa.js", "assets/Layout.DUkNegbY.js", "assets/card.D6MdgTl_.js", "assets/badge.DUAjxJ8Z.js", "assets/textarea.DC4Xp0Yi.js", "assets/axios.DeQKcNki.js", "assets/Products.BLO4A7eA.js", "assets/About.Cj6J2FQL.js", "assets/Contact.muXGP9_K.js", "assets/CaseStudies.DBbReiqf.js", "assets/POS.Ck5IEX-F.js", "assets/VideoModel.DcuMuUNj.js", "assets/Inventory.DSz2hkpU.js", "assets/CRM.2sgl7ZjX.js", "assets/CloudManagement.CNNR3c-P.js", "assets/generateCategoricalChart.DP6sKCY0.js", "assets/isPlainObject.CetwFt8Z.js", "assets/WebsiteBuilder.DJ9KkLDi.js", "assets/CoffeeShop.4Qy9fikc.js", "assets/Franchiza.C7M5rnbV.js", "assets/Glossary.CiGoW3OO.js", "assets/GradientCustomizer.D73vJfCP.js", "assets/PrivacyPolicy.B4aSkR6f.js", "assets/TermsAndConditions.D8avKlBd.js", "assets/Partnership.BGpkdVzh.js", "assets/Resources.CshW3Jlm.js", "assets/BlogList.D3aV3a3Q.js", "assets/slugUtils.BdJNSh-n.js", "assets/Blog_details.Dtwwugmn.js", "assets/ThankYou.DwQzWf0U.js", "assets/NotFound.DR51RrEt.js", "assets/cash-register.BWWN4lX-.js", "assets/tablet.X6v6lqiO.js", "assets/terminal.DBki-0kE.js", "assets/ChargeTracking.CRURB2U7.js", "assets/EFactura.DgXnRONL.js", "assets/Payment.Bln1KxSH.js", "assets/chunk-K6AXKMTT.CM-rszQI.js", "assets/PaymentResult.BMrlAx3y.js", "assets/OrderSummary.6OpUxMDB.js", "assets/Invitation.DRHN0drX.js", "assets/400.B1KYXuNF.css", "assets/500.CCGSBh5v.css", "assets/600.tM8HDwJA.css", "assets/700.DWvkSAE_.css", "assets/index.DUP5BPDA.js"]))) => i.map(i => d[i]);
var gn = Object.defineProperty;
var vn = (e, t, r) => t in e ? gn(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: r
}) : e[t] = r;
var X = (e, t, r) => vn(e, typeof t != "symbol" ? t + "" : t, r);
import {
    j as n,
    P as L,
    c as Et,
    a as Er,
    u as ne,
    B as yn,
    b as jt,
    d as Pe,
    e as K,
    f as z,
    R as xn,
    g as bn,
    h as De,
    i as st,
    k as wn,
    l as jr,
    D as Sn,
    m as Tn,
    S as Pr,
    O as Ar,
    C as _r,
    n as Cn,
    T as Rr,
    o as Nr,
    p as En,
    q as jn
} from "./ui-vendor.Bl07kmxE.js";
import {
    a as Ir,
    r as l,
    c as Pn,
    b as An,
    R as B,
    g as Be,
    d as _n
} from "./react-vendor.CoFnG1Cb.js";
import {
    Q as Rn,
    a as Nn
} from "./query-vendor.Ckm1xsuj.js";
import {
    t as In,
    c as On,
    a as Ae
} from "./utils-vendor.B2rm_Apj.js";
import {
    X as Pt,
    C as Mn,
    L as Le,
    M as Wt,
    A as zn,
    a as kn,
    E as ct,
    b as lt,
    c as Fn,
    d as Dn,
    U as Xt,
    e as Yt,
    S as Ln,
    f as Vn,
    g as Un,
    W as $n,
    G as Bn,
    B as qn,
    H as Hn,
    h as Gn,
    i as Kn,
    j as Wn
} from "./icons-vendor.BaRxkmJj.js";
import {
    F as Xn,
    C as Yn,
    u as Qn,
    o as Jn,
    r as Zn,
    a as ea,
    z as Y,
    b as At
} from "./form-vendor.CYdr9quq.js";
import {
    u as ta,
    i as ra,
    a as ia
} from "./i18n-vendor.CxbKsUuT.js";
import {
    m as na
} from "./motion-vendor.CwL1EI4n.js";

function aa(e, t) {
    for (var r = 0; r < t.length; r++) {
        const i = t[r];
        if (typeof i != "string" && !Array.isArray(i)) {
            for (const a in i)
                if (a !== "default" && !(a in e)) {
                    const o = Object.getOwnPropertyDescriptor(i, a);
                    o && Object.defineProperty(e, a, o.get ? o : {
                        enumerable: !0,
                        get: () => i[a]
                    })
                }
        }
    }
    return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
    }))
}(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) i(a);
    new MutationObserver(a => {
        for (const o of a)
            if (o.type === "childList")
                for (const s of o.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && i(s)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function r(a) {
        const o = {};
        return a.integrity && (o.integrity = a.integrity), a.referrerPolicy && (o.referrerPolicy = a.referrerPolicy), a.crossOrigin === "use-credentials" ? o.credentials = "include" : a.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o
    }

    function i(a) {
        if (a.ep) return;
        a.ep = !0;
        const o = r(a);
        fetch(a.href, o)
    }
})();
const oa = "modulepreload",
    sa = function(e) {
        return "/" + e
    },
    Qt = {},
    A = function(t, r, i) {
        let a = Promise.resolve();
        if (r && r.length > 0) {
            document.getElementsByTagName("link");
            const s = document.querySelector("meta[property=csp-nonce]"),
                c = (s == null ? void 0 : s.nonce) || (s == null ? void 0 : s.getAttribute("nonce"));
            a = Promise.allSettled(r.map(u => {
                if (u = sa(u), u in Qt) return;
                Qt[u] = !0;
                const d = u.endsWith(".css"),
                    p = d ? '[rel="stylesheet"]' : "";
                if (document.querySelector(`link[href="${u}"]${p}`)) return;
                const f = document.createElement("link");
                if (f.rel = d ? "stylesheet" : oa, d || (f.as = "script"), f.crossOrigin = "", f.href = u, c && f.setAttribute("nonce", c), document.head.appendChild(f), d) return new Promise((g, v) => {
                    f.addEventListener("load", g), f.addEventListener("error", () => v(new Error(`Unable to preload CSS for ${u}`)))
                })
            }))
        }

        function o(s) {
            const c = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (c.payload = s, window.dispatchEvent(c), !c.defaultPrevented) throw s
        }
        return a.then(s => {
            for (const c of s || []) c.status === "rejected" && o(c.reason);
            return t().catch(o)
        })
    };
var Or, Jt = Ir;
Or = Jt.createRoot, Jt.hydrateRoot;
const ca = new Rn({
        defaultOptions: {
            queries: {
                queryFn: async ({
                    queryKey: e
                }) => {
                    const t = await fetch(e[0], {
                        credentials: "include"
                    });
                    if (!t.ok) throw t.status >= 500 ? new Error(`${t.status}: ${t.statusText}`) : new Error(`${t.status}: ${await t.text()}`);
                    return t.json()
                },
                refetchInterval: !1,
                refetchOnWindowFocus: !1,
                staleTime: 1 / 0,
                retry: !1
            },
            mutations: {
                retry: !1
            }
        }
    }),
    la = 1,
    ua = 1e6;
let Je = 0;

function da() {
    return Je = (Je + 1) % Number.MAX_SAFE_INTEGER, Je.toString()
}
const Ze = new Map,
    Zt = e => {
        if (Ze.has(e)) return;
        const t = setTimeout(() => {
            Ze.delete(e), Te({
                type: "REMOVE_TOAST",
                toastId: e
            })
        }, ua);
        Ze.set(e, t)
    },
    ma = (e, t) => {
        switch (t.type) {
            case "ADD_TOAST":
                return { ...e,
                    toasts: [t.toast, ...e.toasts].slice(0, la)
                };
            case "UPDATE_TOAST":
                return { ...e,
                    toasts: e.toasts.map(r => r.id === t.toast.id ? { ...r,
                        ...t.toast
                    } : r)
                };
            case "DISMISS_TOAST":
                {
                    const {
                        toastId: r
                    } = t;
                    return r ? Zt(r) : e.toasts.forEach(i => {
                        Zt(i.id)
                    }),
                    { ...e,
                        toasts: e.toasts.map(i => i.id === r || r === void 0 ? { ...i,
                            open: !1
                        } : i)
                    }
                }
            case "REMOVE_TOAST":
                return t.toastId === void 0 ? { ...e,
                    toasts: []
                } : { ...e,
                    toasts: e.toasts.filter(r => r.id !== t.toastId)
                }
        }
    },
    Oe = [];
let Me = {
    toasts: []
};

function Te(e) {
    Me = ma(Me, e), Oe.forEach(t => {
        t(Me)
    })
}

function pa({ ...e
}) {
    const t = da(),
        r = a => Te({
            type: "UPDATE_TOAST",
            toast: { ...a,
                id: t
            }
        }),
        i = () => Te({
            type: "DISMISS_TOAST",
            toastId: t
        });
    return Te({
        type: "ADD_TOAST",
        toast: { ...e,
            id: t,
            open: !0,
            onOpenChange: a => {
                a || i()
            }
        }
    }), {
        id: t,
        dismiss: i,
        update: r
    }
}

function _t() {
    const [e, t] = l.useState(Me);
    return l.useEffect(() => (Oe.push(t), () => {
        const r = Oe.indexOf(t);
        r > -1 && Oe.splice(r, 1)
    }), [e]), { ...e,
        toast: pa,
        dismiss: r => Te({
            type: "DISMISS_TOAST",
            toastId: r
        })
    }
}
var fa = "VisuallyHidden",
    qe = l.forwardRef((e, t) => n.jsx(L.span, { ...e,
        ref: t,
        style: {
            position: "absolute",
            border: 0,
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            wordWrap: "normal",
            ...e.style
        }
    }));
qe.displayName = fa;
var ha = qe,
    Rt = "ToastProvider",
    [Nt, ga, va] = Et("Toast"),
    [Mr, ll] = Er("Toast", [va]),
    [ya, He] = Mr(Rt),
    zr = e => {
        const {
            __scopeToast: t,
            label: r = "Notification",
            duration: i = 5e3,
            swipeDirection: a = "right",
            swipeThreshold: o = 50,
            children: s
        } = e, [c, u] = l.useState(null), [d, p] = l.useState(0), f = l.useRef(!1), g = l.useRef(!1);
        return r.trim() || console.error(`Invalid prop \`label\` supplied to \`${Rt}\`. Expected non-empty \`string\`.`), n.jsx(Nt.Provider, {
            scope: t,
            children: n.jsx(ya, {
                scope: t,
                label: r,
                duration: i,
                swipeDirection: a,
                swipeThreshold: o,
                toastCount: d,
                viewport: c,
                onViewportChange: u,
                onToastAdd: l.useCallback(() => p(v => v + 1), []),
                onToastRemove: l.useCallback(() => p(v => v - 1), []),
                isFocusedToastEscapeKeyDownRef: f,
                isClosePausedRef: g,
                children: s
            })
        })
    };
zr.displayName = Rt;
var kr = "ToastViewport",
    xa = ["F8"],
    ut = "toast.viewportPause",
    dt = "toast.viewportResume",
    Fr = l.forwardRef((e, t) => {
        const {
            __scopeToast: r,
            hotkey: i = xa,
            label: a = "Notifications ({hotkey})",
            ...o
        } = e, s = He(kr, r), c = ga(r), u = l.useRef(null), d = l.useRef(null), p = l.useRef(null), f = l.useRef(null), g = ne(t, f, s.onViewportChange), v = i.join("+").replace(/Key/g, "").replace(/Digit/g, ""), x = s.toastCount > 0;
        l.useEffect(() => {
            const y = j => {
                var w;
                i.length !== 0 && i.every(T => j[T] || j.code === T) && ((w = f.current) == null || w.focus())
            };
            return document.addEventListener("keydown", y), () => document.removeEventListener("keydown", y)
        }, [i]), l.useEffect(() => {
            const y = u.current,
                j = f.current;
            if (x && y && j) {
                const C = () => {
                        if (!s.isClosePausedRef.current) {
                            const P = new CustomEvent(ut);
                            j.dispatchEvent(P), s.isClosePausedRef.current = !0
                        }
                    },
                    w = () => {
                        if (s.isClosePausedRef.current) {
                            const P = new CustomEvent(dt);
                            j.dispatchEvent(P), s.isClosePausedRef.current = !1
                        }
                    },
                    T = P => {
                        !y.contains(P.relatedTarget) && w()
                    },
                    S = () => {
                        y.contains(document.activeElement) || w()
                    };
                return y.addEventListener("focusin", C), y.addEventListener("focusout", T), y.addEventListener("pointermove", C), y.addEventListener("pointerleave", S), window.addEventListener("blur", C), window.addEventListener("focus", w), () => {
                    y.removeEventListener("focusin", C), y.removeEventListener("focusout", T), y.removeEventListener("pointermove", C), y.removeEventListener("pointerleave", S), window.removeEventListener("blur", C), window.removeEventListener("focus", w)
                }
            }
        }, [x, s.isClosePausedRef]);
        const b = l.useCallback(({
            tabbingDirection: y
        }) => {
            const C = c().map(w => {
                const T = w.ref.current,
                    S = [T, ...Ia(T)];
                return y === "forwards" ? S : S.reverse()
            });
            return (y === "forwards" ? C.reverse() : C).flat()
        }, [c]);
        return l.useEffect(() => {
            const y = f.current;
            if (y) {
                const j = C => {
                    var S, P, M;
                    const w = C.altKey || C.ctrlKey || C.metaKey;
                    if (C.key === "Tab" && !w) {
                        const O = document.activeElement,
                            _ = C.shiftKey;
                        if (C.target === y && _) {
                            (S = d.current) == null || S.focus();
                            return
                        }
                        const G = b({
                                tabbingDirection: _ ? "backwards" : "forwards"
                            }),
                            J = G.findIndex(m => m === O);
                        et(G.slice(J + 1)) ? C.preventDefault() : _ ? (P = d.current) == null || P.focus() : (M = p.current) == null || M.focus()
                    }
                };
                return y.addEventListener("keydown", j), () => y.removeEventListener("keydown", j)
            }
        }, [c, b]), n.jsxs(yn, {
            ref: u,
            role: "region",
            "aria-label": a.replace("{hotkey}", v),
            tabIndex: -1,
            style: {
                pointerEvents: x ? void 0 : "none"
            },
            children: [x && n.jsx(mt, {
                ref: d,
                onFocusFromOutsideViewport: () => {
                    const y = b({
                        tabbingDirection: "forwards"
                    });
                    et(y)
                }
            }), n.jsx(Nt.Slot, {
                scope: r,
                children: n.jsx(L.ol, {
                    tabIndex: -1,
                    ...o,
                    ref: g
                })
            }), x && n.jsx(mt, {
                ref: p,
                onFocusFromOutsideViewport: () => {
                    const y = b({
                        tabbingDirection: "backwards"
                    });
                    et(y)
                }
            })]
        })
    });
Fr.displayName = kr;
var Dr = "ToastFocusProxy",
    mt = l.forwardRef((e, t) => {
        const {
            __scopeToast: r,
            onFocusFromOutsideViewport: i,
            ...a
        } = e, o = He(Dr, r);
        return n.jsx(qe, {
            "aria-hidden": !0,
            tabIndex: 0,
            ...a,
            ref: t,
            style: {
                position: "fixed"
            },
            onFocus: s => {
                var d;
                const c = s.relatedTarget;
                !((d = o.viewport) != null && d.contains(c)) && i()
            }
        })
    });
mt.displayName = Dr;
var Ge = "Toast",
    ba = "toast.swipeStart",
    wa = "toast.swipeMove",
    Sa = "toast.swipeCancel",
    Ta = "toast.swipeEnd",
    Lr = l.forwardRef((e, t) => {
        const {
            forceMount: r,
            open: i,
            defaultOpen: a,
            onOpenChange: o,
            ...s
        } = e, [c = !0, u] = jt({
            prop: i,
            defaultProp: a,
            onChange: o
        });
        return n.jsx(Pe, {
            present: r || c,
            children: n.jsx(ja, {
                open: c,
                ...s,
                ref: t,
                onClose: () => u(!1),
                onPause: K(e.onPause),
                onResume: K(e.onResume),
                onSwipeStart: z(e.onSwipeStart, d => {
                    d.currentTarget.setAttribute("data-swipe", "start")
                }),
                onSwipeMove: z(e.onSwipeMove, d => {
                    const {
                        x: p,
                        y: f
                    } = d.detail.delta;
                    d.currentTarget.setAttribute("data-swipe", "move"), d.currentTarget.style.setProperty("--radix-toast-swipe-move-x", `${p}px`), d.currentTarget.style.setProperty("--radix-toast-swipe-move-y", `${f}px`)
                }),
                onSwipeCancel: z(e.onSwipeCancel, d => {
                    d.currentTarget.setAttribute("data-swipe", "cancel"), d.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"), d.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"), d.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"), d.currentTarget.style.removeProperty("--radix-toast-swipe-end-y")
                }),
                onSwipeEnd: z(e.onSwipeEnd, d => {
                    const {
                        x: p,
                        y: f
                    } = d.detail.delta;
                    d.currentTarget.setAttribute("data-swipe", "end"), d.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"), d.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"), d.currentTarget.style.setProperty("--radix-toast-swipe-end-x", `${p}px`), d.currentTarget.style.setProperty("--radix-toast-swipe-end-y", `${f}px`), u(!1)
                })
            })
        })
    });
Lr.displayName = Ge;
var [Ca, Ea] = Mr(Ge, {
    onClose() {}
}), ja = l.forwardRef((e, t) => {
    const {
        __scopeToast: r,
        type: i = "foreground",
        duration: a,
        open: o,
        onClose: s,
        onEscapeKeyDown: c,
        onPause: u,
        onResume: d,
        onSwipeStart: p,
        onSwipeMove: f,
        onSwipeCancel: g,
        onSwipeEnd: v,
        ...x
    } = e, b = He(Ge, r), [y, j] = l.useState(null), C = ne(t, m => j(m)), w = l.useRef(null), T = l.useRef(null), S = a || b.duration, P = l.useRef(0), M = l.useRef(S), O = l.useRef(0), {
        onToastAdd: _,
        onToastRemove: $
    } = b, D = K(() => {
        var h;
        (y == null ? void 0 : y.contains(document.activeElement)) && ((h = b.viewport) == null || h.focus()), s()
    }), G = l.useCallback(m => {
        !m || m === 1 / 0 || (window.clearTimeout(O.current), P.current = new Date().getTime(), O.current = window.setTimeout(D, m))
    }, [D]);
    l.useEffect(() => {
        const m = b.viewport;
        if (m) {
            const h = () => {
                    G(M.current), d == null || d()
                },
                E = () => {
                    const F = new Date().getTime() - P.current;
                    M.current = M.current - F, window.clearTimeout(O.current), u == null || u()
                };
            return m.addEventListener(ut, E), m.addEventListener(dt, h), () => {
                m.removeEventListener(ut, E), m.removeEventListener(dt, h)
            }
        }
    }, [b.viewport, S, u, d, G]), l.useEffect(() => {
        o && !b.isClosePausedRef.current && G(S)
    }, [o, S, b.isClosePausedRef, G]), l.useEffect(() => (_(), () => $()), [_, $]);
    const J = l.useMemo(() => y ? Gr(y) : null, [y]);
    return b.viewport ? n.jsxs(n.Fragment, {
        children: [J && n.jsx(Pa, {
            __scopeToast: r,
            role: "status",
            "aria-live": i === "foreground" ? "assertive" : "polite",
            "aria-atomic": !0,
            children: J
        }), n.jsx(Ca, {
            scope: r,
            onClose: D,
            children: Ir.createPortal(n.jsx(Nt.ItemSlot, {
                scope: r,
                children: n.jsx(xn, {
                    asChild: !0,
                    onEscapeKeyDown: z(c, () => {
                        b.isFocusedToastEscapeKeyDownRef.current || D(), b.isFocusedToastEscapeKeyDownRef.current = !1
                    }),
                    children: n.jsx(L.li, {
                        role: "status",
                        "aria-live": "off",
                        "aria-atomic": !0,
                        tabIndex: 0,
                        "data-state": o ? "open" : "closed",
                        "data-swipe-direction": b.swipeDirection,
                        ...x,
                        ref: C,
                        style: {
                            userSelect: "none",
                            touchAction: "none",
                            ...e.style
                        },
                        onKeyDown: z(e.onKeyDown, m => {
                            m.key === "Escape" && (c == null || c(m.nativeEvent), m.nativeEvent.defaultPrevented || (b.isFocusedToastEscapeKeyDownRef.current = !0, D()))
                        }),
                        onPointerDown: z(e.onPointerDown, m => {
                            m.button === 0 && (w.current = {
                                x: m.clientX,
                                y: m.clientY
                            })
                        }),
                        onPointerMove: z(e.onPointerMove, m => {
                            if (!w.current) return;
                            const h = m.clientX - w.current.x,
                                E = m.clientY - w.current.y,
                                F = !!T.current,
                                k = ["left", "right"].includes(b.swipeDirection),
                                N = ["left", "up"].includes(b.swipeDirection) ? Math.min : Math.max,
                                ae = k ? N(0, h) : 0,
                                ee = k ? 0 : N(0, E),
                                te = m.pointerType === "touch" ? 10 : 2,
                                _e = {
                                    x: ae,
                                    y: ee
                                },
                                Kt = {
                                    originalEvent: m,
                                    delta: _e
                                };
                            F ? (T.current = _e, Re(wa, f, Kt, {
                                discrete: !1
                            })) : er(_e, b.swipeDirection, te) ? (T.current = _e, Re(ba, p, Kt, {
                                discrete: !1
                            }), m.target.setPointerCapture(m.pointerId)) : (Math.abs(h) > te || Math.abs(E) > te) && (w.current = null)
                        }),
                        onPointerUp: z(e.onPointerUp, m => {
                            const h = T.current,
                                E = m.target;
                            if (E.hasPointerCapture(m.pointerId) && E.releasePointerCapture(m.pointerId), T.current = null, w.current = null, h) {
                                const F = m.currentTarget,
                                    k = {
                                        originalEvent: m,
                                        delta: h
                                    };
                                er(h, b.swipeDirection, b.swipeThreshold) ? Re(Ta, v, k, {
                                    discrete: !0
                                }) : Re(Sa, g, k, {
                                    discrete: !0
                                }), F.addEventListener("click", N => N.preventDefault(), {
                                    once: !0
                                })
                            }
                        })
                    })
                })
            }), b.viewport)
        })]
    }) : null
}), Pa = e => {
    const {
        __scopeToast: t,
        children: r,
        ...i
    } = e, a = He(Ge, t), [o, s] = l.useState(!1), [c, u] = l.useState(!1);
    return Ra(() => s(!0)), l.useEffect(() => {
        const d = window.setTimeout(() => u(!0), 1e3);
        return () => window.clearTimeout(d)
    }, []), c ? null : n.jsx(bn, {
        asChild: !0,
        children: n.jsx(qe, { ...i,
            children: o && n.jsxs(n.Fragment, {
                children: [a.label, " ", r]
            })
        })
    })
}, Aa = "ToastTitle", Vr = l.forwardRef((e, t) => {
    const {
        __scopeToast: r,
        ...i
    } = e;
    return n.jsx(L.div, { ...i,
        ref: t
    })
});
Vr.displayName = Aa;
var _a = "ToastDescription",
    Ur = l.forwardRef((e, t) => {
        const {
            __scopeToast: r,
            ...i
        } = e;
        return n.jsx(L.div, { ...i,
            ref: t
        })
    });
Ur.displayName = _a;
var $r = "ToastAction",
    Br = l.forwardRef((e, t) => {
        const {
            altText: r,
            ...i
        } = e;
        return r.trim() ? n.jsx(Hr, {
            altText: r,
            asChild: !0,
            children: n.jsx(It, { ...i,
                ref: t
            })
        }) : (console.error(`Invalid prop \`altText\` supplied to \`${$r}\`. Expected non-empty \`string\`.`), null)
    });
Br.displayName = $r;
var qr = "ToastClose",
    It = l.forwardRef((e, t) => {
        const {
            __scopeToast: r,
            ...i
        } = e, a = Ea(qr, r);
        return n.jsx(Hr, {
            asChild: !0,
            children: n.jsx(L.button, {
                type: "button",
                ...i,
                ref: t,
                onClick: z(e.onClick, a.onClose)
            })
        })
    });
It.displayName = qr;
var Hr = l.forwardRef((e, t) => {
    const {
        __scopeToast: r,
        altText: i,
        ...a
    } = e;
    return n.jsx(L.div, {
        "data-radix-toast-announce-exclude": "",
        "data-radix-toast-announce-alt": i || void 0,
        ...a,
        ref: t
    })
});

function Gr(e) {
    const t = [];
    return Array.from(e.childNodes).forEach(i => {
        if (i.nodeType === i.TEXT_NODE && i.textContent && t.push(i.textContent), Na(i)) {
            const a = i.ariaHidden || i.hidden || i.style.display === "none",
                o = i.dataset.radixToastAnnounceExclude === "";
            if (!a)
                if (o) {
                    const s = i.dataset.radixToastAnnounceAlt;
                    s && t.push(s)
                } else t.push(...Gr(i))
        }
    }), t
}

function Re(e, t, r, {
    discrete: i
}) {
    const a = r.originalEvent.currentTarget,
        o = new CustomEvent(e, {
            bubbles: !0,
            cancelable: !0,
            detail: r
        });
    t && a.addEventListener(e, t, {
        once: !0
    }), i ? st(a, o) : a.dispatchEvent(o)
}
var er = (e, t, r = 0) => {
    const i = Math.abs(e.x),
        a = Math.abs(e.y),
        o = i > a;
    return t === "left" || t === "right" ? o && i > r : !o && a > r
};

function Ra(e = () => {}) {
    const t = K(e);
    De(() => {
        let r = 0,
            i = 0;
        return r = window.requestAnimationFrame(() => i = window.requestAnimationFrame(t)), () => {
            window.cancelAnimationFrame(r), window.cancelAnimationFrame(i)
        }
    }, [t])
}

function Na(e) {
    return e.nodeType === e.ELEMENT_NODE
}

function Ia(e) {
    const t = [],
        r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
            acceptNode: i => {
                const a = i.tagName === "INPUT" && i.type === "hidden";
                return i.disabled || i.hidden || a ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            }
        });
    for (; r.nextNode();) t.push(r.currentNode);
    return t
}

function et(e) {
    const t = document.activeElement;
    return e.some(r => r === t ? !0 : (r.focus(), document.activeElement !== t))
}
var Oa = zr,
    Kr = Fr,
    Wr = Lr,
    Xr = Vr,
    Yr = Ur,
    Qr = Br,
    Jr = It;

function I(...e) {
    return In(On(e))
}
const Ma = Oa,
    Zr = l.forwardRef(({
        className: e,
        ...t
    }, r) => n.jsx(Kr, {
        ref: r,
        className: I("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", e),
        ...t
    }));
Zr.displayName = Kr.displayName;
const za = Ae("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
        variants: {
            variant: {
                default: "border bg-background text-foreground",
                destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }),
    ei = l.forwardRef(({
        className: e,
        variant: t,
        ...r
    }, i) => n.jsx(Wr, {
        ref: i,
        className: I(za({
            variant: t
        }), e),
        ...r
    }));
ei.displayName = Wr.displayName;
const ka = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Qr, {
    ref: r,
    className: I("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", e),
    ...t
}));
ka.displayName = Qr.displayName;
const ti = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Jr, {
    ref: r,
    className: I("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", e),
    "toast-close": "",
    ...t,
    children: n.jsx(Pt, {
        className: "h-4 w-4"
    })
}));
ti.displayName = Jr.displayName;
const ri = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Xr, {
    ref: r,
    className: I("text-sm font-semibold", e),
    ...t
}));
ri.displayName = Xr.displayName;
const ii = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Yr, {
    ref: r,
    className: I("text-sm opacity-90", e),
    ...t
}));
ii.displayName = Yr.displayName;

function Fa() {
    const {
        toasts: e
    } = _t();
    return n.jsxs(Ma, {
        children: [e.map(function({
            id: t,
            title: r,
            description: i,
            action: a,
            ...o
        }) {
            return n.jsxs(ei, { ...o,
                children: [n.jsxs("div", {
                    className: "grid gap-1",
                    children: [r && n.jsx(ri, {
                        children: r
                    }), i && n.jsx(ii, {
                        children: i
                    })]
                }), a, n.jsx(ti, {})]
            }, t)
        }), n.jsx(Zr, {})]
    })
}

function Da(e, t) {
    if (e instanceof RegExp) return {
        keys: !1,
        pattern: e
    };
    var r, i, a, o, s = [],
        c = "",
        u = e.split("/");
    for (u[0] || u.shift(); a = u.shift();) r = a[0], r === "*" ? (s.push(r), c += a[1] === "?" ? "(?:/(.*))?" : "/(.*)") : r === ":" ? (i = a.indexOf("?", 1), o = a.indexOf(".", 1), s.push(a.substring(1, ~i ? i : ~o ? o : a.length)), c += ~i && !~o ? "(?:/([^/]+?))?" : "/([^/]+?)", ~o && (c += (~i ? "?" : "") + "\\" + a.substring(o))) : c += "/" + a;
    return {
        keys: s,
        pattern: new RegExp("^" + c + (t ? "(?=$|/)" : "/?$"), "i")
    }
}
var ni = {
        exports: {}
    },
    ai = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ue = l;

function La(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
}
var Va = typeof Object.is == "function" ? Object.is : La,
    Ua = ue.useState,
    $a = ue.useEffect,
    Ba = ue.useLayoutEffect,
    qa = ue.useDebugValue;

function Ha(e, t) {
    var r = t(),
        i = Ua({
            inst: {
                value: r,
                getSnapshot: t
            }
        }),
        a = i[0].inst,
        o = i[1];
    return Ba(function() {
        a.value = r, a.getSnapshot = t, tt(a) && o({
            inst: a
        })
    }, [e, r, t]), $a(function() {
        return tt(a) && o({
            inst: a
        }), e(function() {
            tt(a) && o({
                inst: a
            })
        })
    }, [e]), qa(r), r
}

function tt(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
        var r = t();
        return !Va(e, r)
    } catch {
        return !0
    }
}

function Ga(e, t) {
    return t()
}
var Ka = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Ga : Ha;
ai.useSyncExternalStore = ue.useSyncExternalStore !== void 0 ? ue.useSyncExternalStore : Ka;
ni.exports = ai;
var Wa = ni.exports;
const Xa = Pn.useInsertionEffect,
    Ya = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u",
    Qa = Ya ? l.useLayoutEffect : l.useEffect,
    Ja = Xa || Qa,
    oi = e => {
        const t = l.useRef([e, (...r) => t[0](...r)]).current;
        return Ja(() => {
            t[0] = e
        }), t[1]
    },
    Za = "popstate",
    Ot = "pushState",
    Mt = "replaceState",
    eo = "hashchange",
    tr = [Za, Ot, Mt, eo],
    to = e => {
        for (const t of tr) addEventListener(t, e);
        return () => {
            for (const t of tr) removeEventListener(t, e)
        }
    },
    si = (e, t) => Wa.useSyncExternalStore(to, e, t),
    ro = () => location.search,
    io = ({
        ssrSearch: e = ""
    } = {}) => si(ro, () => e),
    rr = () => location.pathname,
    no = ({
        ssrPath: e
    } = {}) => si(rr, e ? () => e : rr),
    ao = (e, {
        replace: t = !1,
        state: r = null
    } = {}) => history[t ? Mt : Ot](r, "", e),
    oo = (e = {}) => [no(e), ao],
    ir = Symbol.for("wouter_v3");
if (typeof history < "u" && typeof window[ir] > "u") {
    for (const e of [Ot, Mt]) {
        const t = history[e];
        history[e] = function() {
            const r = t.apply(this, arguments),
                i = new Event(e);
            return i.arguments = arguments, dispatchEvent(i), r
        }
    }
    Object.defineProperty(window, ir, {
        value: !0
    })
}
const so = (e, t) => t.toLowerCase().indexOf(e.toLowerCase()) ? "~" + t : t.slice(e.length) || "/",
    ci = (e = "") => e === "/" ? "" : e,
    co = (e, t) => e[0] === "~" ? e.slice(1) : ci(t) + e,
    lo = (e = "", t) => so(nr(ci(e)), nr(t)),
    nr = e => {
        try {
            return decodeURI(e)
        } catch {
            return e
        }
    },
    li = {
        hook: oo,
        searchHook: io,
        parser: Da,
        base: "",
        ssrPath: void 0,
        ssrSearch: void 0,
        hrefs: e => e
    },
    ui = l.createContext(li),
    ve = () => l.useContext(ui),
    di = {},
    mi = l.createContext(di),
    uo = () => l.useContext(mi),
    Ke = e => {
        const [t, r] = e.hook(e);
        return [lo(e.base, t), oi((i, a) => r(co(i, e.base), a))]
    },
    zt = () => Ke(ve()),
    kt = (e, t, r, i) => {
        const {
            pattern: a,
            keys: o
        } = t instanceof RegExp ? {
            keys: !1,
            pattern: t
        } : e(t || "*", i), s = a.exec(r) || [], [c, ...u] = s;
        return c !== void 0 ? [!0, (() => {
            const d = o !== !1 ? Object.fromEntries(o.map((f, g) => [f, u[g]])) : s.groups;
            let p = { ...u
            };
            return d && Object.assign(p, d), p
        })(), ...i ? [c] : []] : [!1, null]
    },
    ul = e => kt(ve().parser, e, zt()[0]),
    pi = ({
        children: e,
        ...t
    }) => {
        var p, f;
        const r = ve(),
            i = t.hook ? li : r;
        let a = i;
        const [o, s] = ((p = t.ssrPath) == null ? void 0 : p.split("?")) ? ? [];
        s && (t.ssrSearch = s, t.ssrPath = o), t.hrefs = t.hrefs ? ? ((f = t.hook) == null ? void 0 : f.hrefs);
        let c = l.useRef({}),
            u = c.current,
            d = u;
        for (let g in i) {
            const v = g === "base" ? i[g] + (t[g] || "") : t[g] || i[g];
            u === d && v !== d[g] && (c.current = d = { ...d
            }), d[g] = v, v !== i[g] && (a = d)
        }
        return l.createElement(ui.Provider, {
            value: a,
            children: e
        })
    },
    ar = ({
        children: e,
        component: t
    }, r) => t ? l.createElement(t, {
        params: r
    }) : typeof e == "function" ? e(r) : e,
    mo = e => {
        let t = l.useRef(di),
            r = t.current;
        for (const i in e) e[i] !== r[i] && (r = e);
        return Object.keys(e).length === 0 && (r = e), t.current = r
    },
    R = ({
        path: e,
        nest: t,
        match: r,
        ...i
    }) => {
        const a = ve(),
            [o] = Ke(a),
            [s, c, u] = r ? ? kt(a.parser, e, o, t),
            d = mo({ ...uo(),
                ...c
            });
        if (!s) return null;
        const p = u ? l.createElement(pi, {
            base: u
        }, ar(i, d)) : ar(i, d);
        return l.createElement(mi.Provider, {
            value: d,
            children: p
        })
    },
    Z = l.forwardRef((e, t) => {
        const r = ve(),
            [i, a] = Ke(r),
            {
                to: o = "",
                href: s = o,
                onClick: c,
                asChild: u,
                children: d,
                className: p,
                replace: f,
                state: g,
                ...v
            } = e,
            x = oi(y => {
                y.ctrlKey || y.metaKey || y.altKey || y.shiftKey || y.button !== 0 || (c == null || c(y), y.defaultPrevented || (y.preventDefault(), a(s, e)))
            }),
            b = r.hrefs(s[0] === "~" ? s.slice(1) : r.base + s, r);
        return u && l.isValidElement(d) ? l.cloneElement(d, {
            onClick: x,
            href: b
        }) : l.createElement("a", { ...v,
            onClick: x,
            href: b,
            className: p != null && p.call ? p(i === s) : p,
            children: d,
            ref: t
        })
    }),
    fi = e => Array.isArray(e) ? e.flatMap(t => fi(t && t.type === l.Fragment ? t.props.children : t)) : [e],
    po = ({
        children: e,
        location: t
    }) => {
        const r = ve(),
            [i] = Ke(r);
        for (const a of fi(e)) {
            let o = 0;
            if (l.isValidElement(a) && (o = kt(r.parser, a.props.path, t || i, a.props.nest))[0]) return l.cloneElement(a, {
                match: o
            })
        }
        return null
    };

function fo(e) {
    const t = l.useRef({
        value: e,
        previous: e
    });
    return l.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e])
}
var ye = "NavigationMenu",
    [Ft, hi, ho] = Et(ye),
    [pt, go, vo] = Et(ye),
    [Dt, dl] = Er(ye, [ho, vo]),
    [yo, H] = Dt(ye),
    [xo, bo] = Dt(ye),
    gi = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            value: i,
            onValueChange: a,
            defaultValue: o,
            delayDuration: s = 200,
            skipDelayDuration: c = 300,
            orientation: u = "horizontal",
            dir: d,
            ...p
        } = e, [f, g] = l.useState(null), v = ne(t, _ => g(_)), x = wn(d), b = l.useRef(0), y = l.useRef(0), j = l.useRef(0), [C, w] = l.useState(!0), [T = "", S] = jt({
            prop: i,
            onChange: _ => {
                const $ = _ !== "",
                    D = c > 0;
                $ ? (window.clearTimeout(j.current), D && w(!1)) : (window.clearTimeout(j.current), j.current = window.setTimeout(() => w(!0), c)), a == null || a(_)
            },
            defaultProp: o
        }), P = l.useCallback(() => {
            window.clearTimeout(y.current), y.current = window.setTimeout(() => S(""), 150)
        }, [S]), M = l.useCallback(_ => {
            window.clearTimeout(y.current), S(_)
        }, [S]), O = l.useCallback(_ => {
            T === _ ? window.clearTimeout(y.current) : b.current = window.setTimeout(() => {
                window.clearTimeout(y.current), S(_)
            }, s)
        }, [T, S, s]);
        return l.useEffect(() => () => {
            window.clearTimeout(b.current), window.clearTimeout(y.current), window.clearTimeout(j.current)
        }, []), n.jsx(yi, {
            scope: r,
            isRootMenu: !0,
            value: T,
            dir: x,
            orientation: u,
            rootNavigationMenu: f,
            onTriggerEnter: _ => {
                window.clearTimeout(b.current), C ? O(_) : M(_)
            },
            onTriggerLeave: () => {
                window.clearTimeout(b.current), P()
            },
            onContentEnter: () => window.clearTimeout(y.current),
            onContentLeave: P,
            onItemSelect: _ => {
                S($ => $ === _ ? "" : _)
            },
            onItemDismiss: () => S(""),
            children: n.jsx(L.nav, {
                "aria-label": "Main",
                "data-orientation": u,
                dir: x,
                ...p,
                ref: v
            })
        })
    });
gi.displayName = ye;
var vi = "NavigationMenuSub",
    wo = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            value: i,
            onValueChange: a,
            defaultValue: o,
            orientation: s = "horizontal",
            ...c
        } = e, u = H(vi, r), [d = "", p] = jt({
            prop: i,
            onChange: a,
            defaultProp: o
        });
        return n.jsx(yi, {
            scope: r,
            isRootMenu: !1,
            value: d,
            dir: u.dir,
            orientation: s,
            rootNavigationMenu: u.rootNavigationMenu,
            onTriggerEnter: f => p(f),
            onItemSelect: f => p(f),
            onItemDismiss: () => p(""),
            children: n.jsx(L.div, {
                "data-orientation": s,
                ...c,
                ref: t
            })
        })
    });
wo.displayName = vi;
var yi = e => {
        const {
            scope: t,
            isRootMenu: r,
            rootNavigationMenu: i,
            dir: a,
            orientation: o,
            children: s,
            value: c,
            onItemSelect: u,
            onItemDismiss: d,
            onTriggerEnter: p,
            onTriggerLeave: f,
            onContentEnter: g,
            onContentLeave: v
        } = e, [x, b] = l.useState(null), [y, j] = l.useState(new Map), [C, w] = l.useState(null);
        return n.jsx(yo, {
            scope: t,
            isRootMenu: r,
            rootNavigationMenu: i,
            value: c,
            previousValue: fo(c),
            baseId: jr(),
            dir: a,
            orientation: o,
            viewport: x,
            onViewportChange: b,
            indicatorTrack: C,
            onIndicatorTrackChange: w,
            onTriggerEnter: K(p),
            onTriggerLeave: K(f),
            onContentEnter: K(g),
            onContentLeave: K(v),
            onItemSelect: K(u),
            onItemDismiss: K(d),
            onViewportContentChange: l.useCallback((T, S) => {
                j(P => (P.set(T, S), new Map(P)))
            }, []),
            onViewportContentRemove: l.useCallback(T => {
                j(S => S.has(T) ? (S.delete(T), new Map(S)) : S)
            }, []),
            children: n.jsx(Ft.Provider, {
                scope: t,
                children: n.jsx(xo, {
                    scope: t,
                    items: y,
                    children: s
                })
            })
        })
    },
    xi = "NavigationMenuList",
    bi = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            ...i
        } = e, a = H(xi, r), o = n.jsx(L.ul, {
            "data-orientation": a.orientation,
            ...i,
            ref: t
        });
        return n.jsx(L.div, {
            style: {
                position: "relative"
            },
            ref: a.onIndicatorTrackChange,
            children: n.jsx(Ft.Slot, {
                scope: r,
                children: a.isRootMenu ? n.jsx(Ri, {
                    asChild: !0,
                    children: o
                }) : o
            })
        })
    });
bi.displayName = xi;
var wi = "NavigationMenuItem",
    [So, Si] = Dt(wi),
    Ti = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            value: i,
            ...a
        } = e, o = jr(), s = i || o || "LEGACY_REACT_AUTO_VALUE", c = l.useRef(null), u = l.useRef(null), d = l.useRef(null), p = l.useRef(() => {}), f = l.useRef(!1), g = l.useCallback((x = "start") => {
            if (c.current) {
                p.current();
                const b = ht(c.current);
                b.length && Ut(x === "start" ? b : b.reverse())
            }
        }, []), v = l.useCallback(() => {
            if (c.current) {
                const x = ht(c.current);
                x.length && (p.current = _o(x))
            }
        }, []);
        return n.jsx(So, {
            scope: r,
            value: s,
            triggerRef: u,
            contentRef: c,
            focusProxyRef: d,
            wasEscapeCloseRef: f,
            onEntryKeyDown: g,
            onFocusProxyEnter: g,
            onRootContentClose: v,
            onContentFocusOutside: v,
            children: n.jsx(L.li, { ...a,
                ref: t
            })
        })
    });
Ti.displayName = wi;
var ft = "NavigationMenuTrigger",
    Ci = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            disabled: i,
            ...a
        } = e, o = H(ft, e.__scopeNavigationMenu), s = Si(ft, e.__scopeNavigationMenu), c = l.useRef(null), u = ne(c, s.triggerRef, t), d = Ii(o.baseId, s.value), p = Oi(o.baseId, s.value), f = l.useRef(!1), g = l.useRef(!1), v = s.value === o.value;
        return n.jsxs(n.Fragment, {
            children: [n.jsx(Ft.ItemSlot, {
                scope: r,
                value: s.value,
                children: n.jsx(Ni, {
                    asChild: !0,
                    children: n.jsx(L.button, {
                        id: d,
                        disabled: i,
                        "data-disabled": i ? "" : void 0,
                        "data-state": $t(v),
                        "aria-expanded": v,
                        "aria-controls": p,
                        ...a,
                        ref: u,
                        onPointerEnter: z(e.onPointerEnter, () => {
                            g.current = !1, s.wasEscapeCloseRef.current = !1
                        }),
                        onPointerMove: z(e.onPointerMove, Ve(() => {
                            i || g.current || s.wasEscapeCloseRef.current || f.current || (o.onTriggerEnter(s.value), f.current = !0)
                        })),
                        onPointerLeave: z(e.onPointerLeave, Ve(() => {
                            i || (o.onTriggerLeave(), f.current = !1)
                        })),
                        onClick: z(e.onClick, () => {
                            o.onItemSelect(s.value), g.current = v
                        }),
                        onKeyDown: z(e.onKeyDown, x => {
                            const y = {
                                horizontal: "ArrowDown",
                                vertical: o.dir === "rtl" ? "ArrowLeft" : "ArrowRight"
                            }[o.orientation];
                            v && x.key === y && (s.onEntryKeyDown(), x.preventDefault())
                        })
                    })
                })
            }), v && n.jsxs(n.Fragment, {
                children: [n.jsx(ha, {
                    "aria-hidden": !0,
                    tabIndex: 0,
                    ref: s.focusProxyRef,
                    onFocus: x => {
                        const b = s.contentRef.current,
                            y = x.relatedTarget,
                            j = y === c.current,
                            C = b == null ? void 0 : b.contains(y);
                        (j || !C) && s.onFocusProxyEnter(j ? "start" : "end")
                    }
                }), o.viewport && n.jsx("span", {
                    "aria-owns": p
                })]
            })]
        })
    });
Ci.displayName = ft;
var To = "NavigationMenuLink",
    or = "navigationMenu.linkSelect",
    Ei = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            active: i,
            onSelect: a,
            ...o
        } = e;
        return n.jsx(Ni, {
            asChild: !0,
            children: n.jsx(L.a, {
                "data-active": i ? "" : void 0,
                "aria-current": i ? "page" : void 0,
                ...o,
                ref: t,
                onClick: z(e.onClick, s => {
                    const c = s.target,
                        u = new CustomEvent(or, {
                            bubbles: !0,
                            cancelable: !0
                        });
                    if (c.addEventListener(or, d => a == null ? void 0 : a(d), {
                            once: !0
                        }), st(c, u), !u.defaultPrevented && !s.metaKey) {
                        const d = new CustomEvent(ze, {
                            bubbles: !0,
                            cancelable: !0
                        });
                        st(c, d)
                    }
                }, {
                    checkForDefaultPrevented: !1
                })
            })
        })
    });
Ei.displayName = To;
var Lt = "NavigationMenuIndicator",
    ji = l.forwardRef((e, t) => {
        const {
            forceMount: r,
            ...i
        } = e, a = H(Lt, e.__scopeNavigationMenu), o = !!a.value;
        return a.indicatorTrack ? An.createPortal(n.jsx(Pe, {
            present: r || o,
            children: n.jsx(Co, { ...i,
                ref: t
            })
        }), a.indicatorTrack) : null
    });
ji.displayName = Lt;
var Co = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            ...i
        } = e, a = H(Lt, r), o = hi(r), [s, c] = l.useState(null), [u, d] = l.useState(null), p = a.orientation === "horizontal", f = !!a.value;
        l.useEffect(() => {
            var b;
            const x = (b = o().find(y => y.value === a.value)) == null ? void 0 : b.ref.current;
            x && c(x)
        }, [o, a.value]);
        const g = () => {
            s && d({
                size: p ? s.offsetWidth : s.offsetHeight,
                offset: p ? s.offsetLeft : s.offsetTop
            })
        };
        return gt(s, g), gt(a.indicatorTrack, g), u ? n.jsx(L.div, {
            "aria-hidden": !0,
            "data-state": f ? "visible" : "hidden",
            "data-orientation": a.orientation,
            ...i,
            ref: t,
            style: {
                position: "absolute",
                ...p ? {
                    left: 0,
                    width: u.size + "px",
                    transform: `translateX(${u.offset}px)`
                } : {
                    top: 0,
                    height: u.size + "px",
                    transform: `translateY(${u.offset}px)`
                },
                ...i.style
            }
        }) : null
    }),
    de = "NavigationMenuContent",
    Pi = l.forwardRef((e, t) => {
        const {
            forceMount: r,
            ...i
        } = e, a = H(de, e.__scopeNavigationMenu), o = Si(de, e.__scopeNavigationMenu), s = ne(o.contentRef, t), c = o.value === a.value, u = {
            value: o.value,
            triggerRef: o.triggerRef,
            focusProxyRef: o.focusProxyRef,
            wasEscapeCloseRef: o.wasEscapeCloseRef,
            onContentFocusOutside: o.onContentFocusOutside,
            onRootContentClose: o.onRootContentClose,
            ...i
        };
        return a.viewport ? n.jsx(Eo, {
            forceMount: r,
            ...u,
            ref: s
        }) : n.jsx(Pe, {
            present: r || c,
            children: n.jsx(Ai, {
                "data-state": $t(c),
                ...u,
                ref: s,
                onPointerEnter: z(e.onPointerEnter, a.onContentEnter),
                onPointerLeave: z(e.onPointerLeave, Ve(a.onContentLeave)),
                style: {
                    pointerEvents: !c && a.isRootMenu ? "none" : void 0,
                    ...u.style
                }
            })
        })
    });
Pi.displayName = de;
var Eo = l.forwardRef((e, t) => {
        const r = H(de, e.__scopeNavigationMenu),
            {
                onViewportContentChange: i,
                onViewportContentRemove: a
            } = r;
        return De(() => {
            i(e.value, {
                ref: t,
                ...e
            })
        }, [e, t, i]), De(() => () => a(e.value), [e.value, a]), null
    }),
    ze = "navigationMenu.rootContentDismiss",
    Ai = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            value: i,
            triggerRef: a,
            focusProxyRef: o,
            wasEscapeCloseRef: s,
            onRootContentClose: c,
            onContentFocusOutside: u,
            ...d
        } = e, p = H(de, r), f = l.useRef(null), g = ne(f, t), v = Ii(p.baseId, i), x = Oi(p.baseId, i), b = hi(r), y = l.useRef(null), {
            onItemDismiss: j
        } = p;
        l.useEffect(() => {
            const w = f.current;
            if (p.isRootMenu && w) {
                const T = () => {
                    var S;
                    j(), c(), w.contains(document.activeElement) && ((S = a.current) == null || S.focus())
                };
                return w.addEventListener(ze, T), () => w.removeEventListener(ze, T)
            }
        }, [p.isRootMenu, e.value, a, j, c]);
        const C = l.useMemo(() => {
            const T = b().map($ => $.value);
            p.dir === "rtl" && T.reverse();
            const S = T.indexOf(p.value),
                P = T.indexOf(p.previousValue),
                M = i === p.value,
                O = P === T.indexOf(i);
            if (!M && !O) return y.current;
            const _ = (() => {
                if (S !== P) {
                    if (M && P !== -1) return S > P ? "from-end" : "from-start";
                    if (O && S !== -1) return S > P ? "to-start" : "to-end"
                }
                return null
            })();
            return y.current = _, _
        }, [p.previousValue, p.value, p.dir, b, i]);
        return n.jsx(Ri, {
            asChild: !0,
            children: n.jsx(Sn, {
                id: x,
                "aria-labelledby": v,
                "data-motion": C,
                "data-orientation": p.orientation,
                ...d,
                ref: g,
                disableOutsidePointerEvents: !1,
                onDismiss: () => {
                    var T;
                    const w = new Event(ze, {
                        bubbles: !0,
                        cancelable: !0
                    });
                    (T = f.current) == null || T.dispatchEvent(w)
                },
                onFocusOutside: z(e.onFocusOutside, w => {
                    var S;
                    u();
                    const T = w.target;
                    (S = p.rootNavigationMenu) != null && S.contains(T) && w.preventDefault()
                }),
                onPointerDownOutside: z(e.onPointerDownOutside, w => {
                    var M;
                    const T = w.target,
                        S = b().some(O => {
                            var _;
                            return (_ = O.ref.current) == null ? void 0 : _.contains(T)
                        }),
                        P = p.isRootMenu && ((M = p.viewport) == null ? void 0 : M.contains(T));
                    (S || P || !p.isRootMenu) && w.preventDefault()
                }),
                onKeyDown: z(e.onKeyDown, w => {
                    var P;
                    const T = w.altKey || w.ctrlKey || w.metaKey;
                    if (w.key === "Tab" && !T) {
                        const M = ht(w.currentTarget),
                            O = document.activeElement,
                            _ = M.findIndex(G => G === O),
                            D = w.shiftKey ? M.slice(0, _).reverse() : M.slice(_ + 1, M.length);
                        Ut(D) ? w.preventDefault() : (P = o.current) == null || P.focus()
                    }
                }),
                onEscapeKeyDown: z(e.onEscapeKeyDown, w => {
                    s.current = !0
                })
            })
        })
    }),
    Vt = "NavigationMenuViewport",
    _i = l.forwardRef((e, t) => {
        const {
            forceMount: r,
            ...i
        } = e, o = !!H(Vt, e.__scopeNavigationMenu).value;
        return n.jsx(Pe, {
            present: r || o,
            children: n.jsx(jo, { ...i,
                ref: t
            })
        })
    });
_i.displayName = Vt;
var jo = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            children: i,
            ...a
        } = e, o = H(Vt, r), s = ne(t, o.onViewportChange), c = bo(de, e.__scopeNavigationMenu), [u, d] = l.useState(null), [p, f] = l.useState(null), g = u ? (u == null ? void 0 : u.width) + "px" : void 0, v = u ? (u == null ? void 0 : u.height) + "px" : void 0, x = !!o.value, b = x ? o.value : o.previousValue;
        return gt(p, () => {
            p && d({
                width: p.offsetWidth,
                height: p.offsetHeight
            })
        }), n.jsx(L.div, {
            "data-state": $t(x),
            "data-orientation": o.orientation,
            ...a,
            ref: s,
            style: {
                pointerEvents: !x && o.isRootMenu ? "none" : void 0,
                "--radix-navigation-menu-viewport-width": g,
                "--radix-navigation-menu-viewport-height": v,
                ...a.style
            },
            onPointerEnter: z(e.onPointerEnter, o.onContentEnter),
            onPointerLeave: z(e.onPointerLeave, Ve(o.onContentLeave)),
            children: Array.from(c.items).map(([j, {
                ref: C,
                forceMount: w,
                ...T
            }]) => {
                const S = b === j;
                return n.jsx(Pe, {
                    present: w || S,
                    children: n.jsx(Ai, { ...T,
                        ref: Tn(C, P => {
                            S && P && f(P)
                        })
                    })
                }, j)
            })
        })
    }),
    Po = "FocusGroup",
    Ri = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            ...i
        } = e, a = H(Po, r);
        return n.jsx(pt.Provider, {
            scope: r,
            children: n.jsx(pt.Slot, {
                scope: r,
                children: n.jsx(L.div, {
                    dir: a.dir,
                    ...i,
                    ref: t
                })
            })
        })
    }),
    sr = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"],
    Ao = "FocusGroupItem",
    Ni = l.forwardRef((e, t) => {
        const {
            __scopeNavigationMenu: r,
            ...i
        } = e, a = go(r), o = H(Ao, r);
        return n.jsx(pt.ItemSlot, {
            scope: r,
            children: n.jsx(L.button, { ...i,
                ref: t,
                onKeyDown: z(e.onKeyDown, s => {
                    if (["Home", "End", ...sr].includes(s.key)) {
                        let u = a().map(f => f.ref.current);
                        if ([o.dir === "rtl" ? "ArrowRight" : "ArrowLeft", "ArrowUp", "End"].includes(s.key) && u.reverse(), sr.includes(s.key)) {
                            const f = u.indexOf(s.currentTarget);
                            u = u.slice(f + 1)
                        }
                        setTimeout(() => Ut(u)), s.preventDefault()
                    }
                })
            })
        })
    });

function ht(e) {
    const t = [],
        r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
            acceptNode: i => {
                const a = i.tagName === "INPUT" && i.type === "hidden";
                return i.disabled || i.hidden || a ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            }
        });
    for (; r.nextNode();) t.push(r.currentNode);
    return t
}

function Ut(e) {
    const t = document.activeElement;
    return e.some(r => r === t ? !0 : (r.focus(), document.activeElement !== t))
}

function _o(e) {
    return e.forEach(t => {
        t.dataset.tabindex = t.getAttribute("tabindex") || "", t.setAttribute("tabindex", "-1")
    }), () => {
        e.forEach(t => {
            const r = t.dataset.tabindex;
            t.setAttribute("tabindex", r)
        })
    }
}

function gt(e, t) {
    const r = K(t);
    De(() => {
        let i = 0;
        if (e) {
            const a = new ResizeObserver(() => {
                cancelAnimationFrame(i), i = window.requestAnimationFrame(r)
            });
            return a.observe(e), () => {
                window.cancelAnimationFrame(i), a.unobserve(e)
            }
        }
    }, [e, r])
}

function $t(e) {
    return e ? "open" : "closed"
}

function Ii(e, t) {
    return `${e}-trigger-${t}`
}

function Oi(e, t) {
    return `${e}-content-${t}`
}

function Ve(e) {
    return t => t.pointerType === "mouse" ? e(t) : void 0
}
var Mi = gi,
    zi = bi,
    Ro = Ti,
    ki = Ci,
    No = Ei,
    Fi = ji,
    Di = Pi,
    Li = _i;
const Vi = l.forwardRef(({
    className: e,
    children: t,
    ...r
}, i) => n.jsxs(Mi, {
    ref: i,
    className: I("relative z-10 flex max-w-max flex-1 items-center justify-center", e),
    ...r,
    children: [t, n.jsx(qi, {})]
}));
Vi.displayName = Mi.displayName;
const Ui = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(zi, {
    ref: r,
    className: I("group flex flex-1 list-none items-center justify-center space-x-1", e),
    ...t
}));
Ui.displayName = zi.displayName;
const Io = Ro,
    Oo = Ae("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"),
    $i = l.forwardRef(({
        className: e,
        children: t,
        ...r
    }, i) => n.jsxs(ki, {
        ref: i,
        className: I(Oo(), "group", e),
        ...r,
        children: [t, " ", n.jsx(Mn, {
            className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
            "aria-hidden": "true"
        })]
    }));
$i.displayName = ki.displayName;
const Bi = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Di, {
    ref: r,
    className: I("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ", e),
    ...t
}));
Bi.displayName = Di.displayName;
const Mo = No,
    qi = l.forwardRef(({
        className: e,
        ...t
    }, r) => n.jsx("div", {
        className: I("absolute left-0 top-full flex justify-center"),
        children: n.jsx(Li, {
            className: I("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]", e),
            ref: r,
            ...t
        })
    }));
qi.displayName = Li.displayName;
const zo = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Fi, {
    ref: r,
    className: I("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in", e),
    ...t,
    children: n.jsx("div", {
        className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"
    })
}));
zo.displayName = Fi.displayName;
const ko = Ae("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline"
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }),
    V = l.forwardRef(({
        className: e,
        variant: t,
        size: r,
        asChild: i = !1,
        ...a
    }, o) => {
        const s = i ? Pr : "button";
        return n.jsx(s, {
            className: I(ko({
                variant: t,
                size: r,
                className: e
            })),
            ref: o,
            ...a
        })
    });
V.displayName = "Button";
const se = En,
    Fo = jn,
    Hi = l.forwardRef(({
        className: e,
        ...t
    }, r) => n.jsx(Ar, {
        ref: r,
        className: I("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", e),
        ...t
    }));
Hi.displayName = Ar.displayName;
const re = l.forwardRef(({
    className: e,
    children: t,
    ...r
}, i) => n.jsxs(Fo, {
    children: [n.jsx(Hi, {}), n.jsxs(_r, {
        ref: i,
        className: I("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", e),
        ...r,
        children: [t, n.jsxs(Cn, {
            className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
            children: [n.jsx(Pt, {
                className: "h-4 w-4"
            }), n.jsx("span", {
                className: "sr-only",
                children: "Close"
            })]
        })]
    })]
}));
re.displayName = _r.displayName;
const We = ({
    className: e,
    ...t
}) => n.jsx("div", {
    className: I("flex flex-col space-y-1.5 text-center sm:text-left", e),
    ...t
});
We.displayName = "DialogHeader";
const Xe = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Rr, {
    ref: r,
    className: I("text-lg font-semibold leading-none tracking-tight", e),
    ...t
}));
Xe.displayName = Rr.displayName;
const Ye = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx(Nr, {
    ref: r,
    className: I("text-sm text-muted-foreground", e),
    ...t
}));
Ye.displayName = Nr.displayName;
var Do = "Label",
    Gi = l.forwardRef((e, t) => n.jsx(L.label, { ...e,
        ref: t,
        onMouseDown: r => {
            var a;
            r.target.closest("button, input, select, textarea") || ((a = e.onMouseDown) == null || a.call(e, r), !r.defaultPrevented && r.detail > 1 && r.preventDefault())
        }
    }));
Gi.displayName = Do;
var Ki = Gi;
const Lo = Ae("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),
    Wi = l.forwardRef(({
        className: e,
        ...t
    }, r) => n.jsx(Ki, {
        ref: r,
        className: I(Lo(), e),
        ...t
    }));
Wi.displayName = Ki.displayName;
const Bt = Xn,
    Xi = l.createContext({}),
    Ce = ({ ...e
    }) => n.jsx(Xi.Provider, {
        value: {
            name: e.name
        },
        children: n.jsx(Yn, { ...e
        })
    }),
    Qe = () => {
        const e = l.useContext(Xi),
            t = l.useContext(Yi),
            {
                getFieldState: r,
                formState: i
            } = Qn(),
            a = r(e.name, i);
        if (!e) throw new Error("useFormField should be used within <FormField>");
        const {
            id: o
        } = t;
        return {
            id: o,
            name: e.name,
            formItemId: `${o}-form-item`,
            formDescriptionId: `${o}-form-item-description`,
            formMessageId: `${o}-form-item-message`,
            ...a
        }
    },
    Yi = l.createContext({}),
    me = l.forwardRef(({
        className: e,
        ...t
    }, r) => {
        const i = l.useId();
        return n.jsx(Yi.Provider, {
            value: {
                id: i
            },
            children: n.jsx("div", {
                ref: r,
                className: I("space-y-2", e),
                ...t
            })
        })
    });
me.displayName = "FormItem";
const pe = l.forwardRef(({
    className: e,
    ...t
}, r) => {
    const {
        error: i,
        formItemId: a
    } = Qe();
    return n.jsx(Wi, {
        ref: r,
        className: I(i && "text-destructive", e),
        htmlFor: a,
        ...t
    })
});
pe.displayName = "FormLabel";
const fe = l.forwardRef(({ ...e
}, t) => {
    const {
        error: r,
        formItemId: i,
        formDescriptionId: a,
        formMessageId: o
    } = Qe();
    return n.jsx(Pr, {
        ref: t,
        id: i,
        "aria-describedby": r ? `${a} ${o}` : `${a}`,
        "aria-invalid": !!r,
        ...e
    })
});
fe.displayName = "FormControl";
const Vo = l.forwardRef(({
    className: e,
    ...t
}, r) => {
    const {
        formDescriptionId: i
    } = Qe();
    return n.jsx("p", {
        ref: r,
        id: i,
        className: I("text-sm text-muted-foreground", e),
        ...t
    })
});
Vo.displayName = "FormDescription";
const he = l.forwardRef(({
    className: e,
    children: t,
    ...r
}, i) => {
    const {
        error: a,
        formMessageId: o
    } = Qe(), s = a ? String(a == null ? void 0 : a.message) : t;
    return s ? n.jsx("p", {
        ref: i,
        id: o,
        className: I("text-sm font-medium text-destructive", e),
        ...r,
        children: s
    }) : null
});
he.displayName = "FormMessage";
const ge = l.forwardRef(({
    className: e,
    type: t,
    onKeyDown: r,
    ...i
}, a) => {
    const o = s => {
        if (s.key === "Enter") {
            const c = s.currentTarget.closest("form");
            if (c) {
                const u = c.querySelector('button[type="submit"]');
                u && !u.disabled && (s.preventDefault(), u.click())
            }
        }
        r && r(s)
    };
    return n.jsx("input", {
        type: t,
        className: I("flex h-10 w-full rounded-lg border-2 border-gray-200 bg-background px-3 py-2 text-sm transition-all duration-200 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-100", e),
        ref: a,
        onKeyDown: o,
        ...i
    })
});
ge.displayName = "Input";
const Uo = Ae("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }),
    Qi = l.forwardRef(({
        className: e,
        variant: t,
        ...r
    }, i) => n.jsx("div", {
        ref: i,
        role: "alert",
        className: I(Uo({
            variant: t
        }), e),
        ...r
    }));
Qi.displayName = "Alert";
const $o = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx("h5", {
    ref: r,
    className: I("mb-1 font-medium leading-none tracking-tight", e),
    ...t
}));
$o.displayName = "AlertTitle";
const Ji = l.forwardRef(({
    className: e,
    ...t
}, r) => n.jsx("div", {
    ref: r,
    className: I("text-sm [&_p]:leading-relaxed", e),
    ...t
}));
Ji.displayName = "AlertDescription";
var Bo = function(e, t) {
        for (var r = {}; e.length;) {
            var i = e[0],
                a = i.code,
                o = i.message,
                s = i.path.join(".");
            if (!r[s])
                if ("unionErrors" in i) {
                    var c = i.unionErrors[0].errors[0];
                    r[s] = {
                        message: c.message,
                        type: c.code
                    }
                } else r[s] = {
                    message: o,
                    type: a
                };
            if ("unionErrors" in i && i.unionErrors.forEach(function(p) {
                    return p.errors.forEach(function(f) {
                        return e.push(f)
                    })
                }), t) {
                var u = r[s].types,
                    d = u && u[i.code];
                r[s] = ea(s, t, r, a, d ? [].concat(d, i.message) : i.message)
            }
            e.shift()
        }
        return r
    },
    qt = function(e, t, r) {
        return r === void 0 && (r = {}),
            function(i, a, o) {
                try {
                    return Promise.resolve(function(s, c) {
                        try {
                            var u = Promise.resolve(e[r.mode === "sync" ? "parse" : "parseAsync"](i, t)).then(function(d) {
                                return o.shouldUseNativeValidation && Jn({}, o), {
                                    errors: {},
                                    values: r.raw ? i : d
                                }
                            })
                        } catch (d) {
                            return c(d)
                        }
                        return u && u.then ? u.then(void 0, c) : u
                    }(0, function(s) {
                        if (function(c) {
                                return Array.isArray(c == null ? void 0 : c.errors)
                            }(s)) return {
                            values: {},
                            errors: Zn(Bo(s.errors, !o.shouldUseNativeValidation && o.criteriaMode === "all"), o)
                        };
                        throw s
                    }))
                } catch (s) {
                    return Promise.reject(s)
                }
            }
    };
const qo = Y.object({
    email: Y.string().email("Adresa de email nu este validă")
});

function Ho({
    open: e,
    onOpenChange: t
}) {
    const [r, i] = l.useState(!1), [a, o] = l.useState(!1), {
        toast: s
    } = _t(), c = At({
        resolver: qt(qo),
        defaultValues: {
            email: ""
        }
    }), u = async p => {
        i(!0);
        try {
            const v = await (await fetch("https://api.franchisetech.ro/api/odoo/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: p.email
                })
            })).json();
            v.success ? (o(!0), s({
                title: "Email Trimis",
                description: v.message || "Email-ul de resetare a fost trimis cu succes.",
                duration: 5e3
            })) : s({
                title: "Eroare",
                description: v.message || "A apărut o eroare la trimiterea email-ului.",
                variant: "destructive",
                duration: 5e3
            })
        } catch (f) {
            console.error("Forgot password error:", f), s({
                title: "Eroare",
                description: "A apărut o eroare la trimiterea email-ului. Vă rugăm să încercați din nou.",
                variant: "destructive",
                duration: 5e3
            })
        } finally {
            i(!1)
        }
    }, d = () => {
        o(!1), c.reset(), t(!1)
    };
    return n.jsx(se, {
        open: e,
        onOpenChange: d,
        children: n.jsxs(re, {
            className: "sm:max-w-[425px]",
            children: [n.jsxs(We, {
                children: [n.jsx(Xe, {
                    className: "text-xl font-bold bg-gradient-to-r from-[#9747FF] via-[#8A43E6] to-[#6E35B9] bg-clip-text text-transparent",
                    children: "Resetare Parolă"
                }), n.jsx(Ye, {
                    children: a ? "Verificați email-ul pentru instrucțiuni de resetare" : "Introduceți adresa de email pentru a primi un link de resetare"
                })]
            }), a ? n.jsxs("div", {
                className: "space-y-4",
                children: [n.jsxs("div", {
                    className: "text-center py-4",
                    children: [n.jsx(Wt, {
                        className: "h-12 w-12 text-green-500 mx-auto mb-4"
                    }), n.jsx("p", {
                        className: "text-sm text-gray-600",
                        children: "Am trimis un email cu instrucțiuni de resetare a parolei la adresa:"
                    }), n.jsx("p", {
                        className: "font-medium text-gray-900 mt-2",
                        children: c.getValues("email")
                    })]
                }), n.jsxs("div", {
                    className: "text-sm text-gray-500 space-y-2",
                    children: [n.jsx("p", {
                        children: "• Verificați căsuța de email și folderul spam"
                    }), n.jsx("p", {
                        children: "• Link-ul de resetare expiră după o perioadă limitată"
                    }), n.jsx("p", {
                        children: "• Dacă nu primiți email-ul, verificați adresa și încercați din nou"
                    })]
                }), n.jsxs(V, {
                    variant: "outline",
                    className: "w-full",
                    onClick: d,
                    children: [n.jsx(zn, {
                        className: "mr-2 h-4 w-4"
                    }), "Înapoi la Autentificare"]
                })]
            }) : n.jsx(Bt, { ...c,
                children: n.jsxs("form", {
                    onSubmit: c.handleSubmit(u),
                    className: "space-y-4",
                    children: [n.jsx(Ce, {
                        control: c.control,
                        name: "email",
                        render: ({
                            field: p
                        }) => n.jsxs(me, {
                            children: [n.jsx(pe, {
                                children: "Adresa de Email"
                            }), n.jsx(fe, {
                                children: n.jsx(ge, {
                                    type: "email",
                                    placeholder: "Introduceți adresa de email",
                                    ...p
                                })
                            }), n.jsx(he, {})]
                        })
                    }), n.jsx(V, {
                        type: "submit",
                        className: "w-full",
                        disabled: !c.formState.isValid || r,
                        children: r ? n.jsxs(n.Fragment, {
                            children: [n.jsx(Le, {
                                className: "mr-2 h-4 w-4 animate-spin"
                            }), "Se trimite..."]
                        }) : n.jsxs(n.Fragment, {
                            children: [n.jsx(Wt, {
                                className: "mr-2 h-4 w-4"
                            }), "Trimite Email de Resetare"]
                        })
                    })]
                })
            })]
        })
    })
}
const Go = Y.object({
    login: Y.string().min(1, "Email/username este obligatoriu"),
    password: Y.string().min(1, "Parola este obligatorie"),
    companyName: Y.string().optional()
});

function Ko({
    open: e,
    onOpenChange: t
}) {
    const [r, i] = l.useState(!1), [a, o] = l.useState(!1), [s, c] = l.useState(!1), [u, d] = l.useState(""), p = At({
        resolver: qt(Go),
        defaultValues: {
            login: "",
            password: "",
            companyName: ""
        }
    });
    return n.jsxs(n.Fragment, {
        children: [n.jsx(se, {
            open: e,
            onOpenChange: t,
            children: n.jsxs(re, {
                className: "sm:max-w-[425px]",
                children: [n.jsxs(We, {
                    children: [n.jsx(Xe, {
                        className: "text-xl font-bold bg-gradient-to-r from-[#9747FF] via-[#8A43E6] to-[#6E35B9] bg-clip-text text-transparent",
                        children: "Autentificare FranchiseTech"
                    }), n.jsx(Ye, {
                        children: "Introduceți credențialele pentru a accesa dashboard-ul"
                    }), u && n.jsxs(Qi, {
                        variant: "destructive",
                        className: "mt-4",
                        children: [n.jsx(kn, {
                            className: "h-4 w-4"
                        }), n.jsx(Ji, {
                            children: u
                        })]
                    })]
                }), n.jsx(Bt, { ...p,
                    children: n.jsxs("form", {
                        onSubmit: p.handleSubmit(async f => {
                            var g;
                            o(!0), d("");
                            try {
                                if (!await p.trigger()) {
                                    o(!1);
                                    return
                                }
                                if (!f.login || !f.password) {
                                    d("Vă rugăm să introduceți email-ul și parola"), o(!1);
                                    return
                                }
                                const x = "https://api.franchisetech.ro",
                                    b = await fetch(`${x}/api/odoo/validate-credentials`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            login: f.login,
                                            password: f.password,
                                            companyName: f.companyName
                                        })
                                    });
                                if (!b.ok) {
                                    if (b.status === 404) throw new Error("Endpoint-ul de validare nu este disponibil. Vă rugăm să contactați suportul.");
                                    const w = await b.json();
                                    throw console.log("Backend error response:", w), new Error(w.message || `Eroare server: ${b.status}`)
                                }
                                const y = await b.json();
                                if (!y.success) throw new Error(y.message || "Autentificare eșuată");
                                const j = await fetch(`${x}/api/odoo/generate-login-url`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        user_id: ((g = y.data) == null ? void 0 : g.userId) || 1,
                                        odoo_username: f.login,
                                        odoo_password: f.password
                                    })
                                });
                                if (!j.ok) {
                                    if (j.status === 404) throw new Error("Endpoint-ul de auto-login nu este disponibil. Vă rugăm să contactați suportul.");
                                    const w = await j.json();
                                    throw new Error(w.message || `Eroare server auto-login: ${j.status}`)
                                }
                                const C = await j.json();
                                if (console.log("Auto-login response:", C), C.success && C.auto_login_url) d(""), window.location.href = C.auto_login_url;
                                else throw new Error(C.message || "Eroare la generarea URL-ului de auto-login")
                            } catch (v) {
                                console.error("Login error:", v), d(v.message || "A apărut o eroare la autentificare. Vă rugăm să încercați din nou.")
                            } finally {
                                o(!1)
                            }
                        }),
                        className: "space-y-4",
                        children: [n.jsx(Ce, {
                            control: p.control,
                            name: "login",
                            render: ({
                                field: f
                            }) => n.jsxs(me, {
                                children: [n.jsx(pe, {
                                    className: "text-sm font-medium text-gray-700",
                                    children: "Email / Nume utilizator"
                                }), n.jsx(fe, {
                                    children: n.jsx(ge, {
                                        placeholder: "Introduceți email-ul sau numele de utilizator",
                                        ...f,
                                        onChange: g => {
                                            f.onChange(g), d("")
                                        },
                                        autoComplete: "username"
                                    })
                                }), n.jsx(he, {})]
                            })
                        }), n.jsx(Ce, {
                            control: p.control,
                            name: "password",
                            render: ({
                                field: f
                            }) => n.jsxs(me, {
                                children: [n.jsx(pe, {
                                    className: "text-sm font-medium text-gray-700",
                                    children: "Parolă"
                                }), n.jsx(fe, {
                                    children: n.jsxs("div", {
                                        className: "relative",
                                        children: [n.jsx(ge, {
                                            type: r ? "text" : "password",
                                            placeholder: "Introduceți parola",
                                            ...f,
                                            className: "pr-10",
                                            onChange: g => {
                                                f.onChange(g), d("")
                                            },
                                            autoComplete: "current-password"
                                        }), n.jsx(V, {
                                            type: "button",
                                            variant: "ghost",
                                            size: "sm",
                                            className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                            onClick: () => i(!r),
                                            children: r ? n.jsx(ct, {
                                                className: "h-4 w-4"
                                            }) : n.jsx(lt, {
                                                className: "h-4 w-4"
                                            })
                                        })]
                                    })
                                }), n.jsx(he, {})]
                            })
                        }), n.jsx("div", {
                            className: "text-right",
                            children: n.jsx(V, {
                                type: "button",
                                variant: "link",
                                className: "text-sm text-gray-600 hover:text-[#9747FF] p-0 h-auto",
                                onClick: () => c(!0),
                                children: "Ați uitat parola?"
                            })
                        }), n.jsx(V, {
                            type: "submit",
                            className: "w-full bg-gradient-to-r from-[#9747FF] to-[#6E35B9] hover:from-[#8A43E6] hover:to-[#5A2A9A] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]",
                            disabled: a,
                            children: a ? n.jsxs(n.Fragment, {
                                children: [n.jsx(Le, {
                                    className: "mr-2 h-4 w-4 animate-spin"
                                }), "Se autentifică..."]
                            }) : n.jsxs(n.Fragment, {
                                children: [n.jsx(Fn, {
                                    className: "mr-2 h-4 w-4"
                                }), "Autentificare"]
                            })
                        })]
                    })
                })]
            })
        }), n.jsx(Ho, {
            open: s,
            onOpenChange: c
        })]
    })
}

function Wo() {
    const [e, t] = l.useState({
        authenticated: !1,
        user: null,
        dashboardUrl: null,
        loading: !1,
        error: null
    });
    return { ...e,
        login: async i => {
            try {
                t(c => ({ ...c,
                    loading: !0,
                    error: null
                }));
                const a = "https://api.franchisetech.ro";
                console.log("Attempting login with Odoo session system...");
                const s = await (await fetch(`${a}/api/odoo/odoo-session-auth`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(i)
                })).json();
                return console.log("Login response:", s), s.success && s.data ? (console.log("Login successful:", s.data), t({
                    authenticated: !0,
                    user: {
                        id: s.data.uid,
                        name: s.data.username,
                        login: s.data.username
                    },
                    dashboardUrl: s.data.dashboardUrl,
                    loading: !1,
                    error: null
                }), !0) : (console.log("Login failed:", s.message), t({
                    authenticated: !1,
                    user: null,
                    dashboardUrl: null,
                    loading: !1,
                    error: s.message || "Login failed"
                }), !1)
            } catch (a) {
                return console.error("Login error:", a), t({
                    authenticated: !1,
                    user: null,
                    dashboardUrl: null,
                    loading: !1,
                    error: a.message || "Login failed"
                }), !1
            }
        }
    }
}
const Zi = l.createContext(void 0);

function Xo({
    children: e
}) {
    const t = Wo(),
        r = () => {
            t.dashboardUrl && (console.log("Redirecting to Odoo dashboard:", t.dashboardUrl), window.location.href = t.dashboardUrl)
        },
        i = () => {
            window.location.reload()
        },
        a = async () => {
            try {
                await fetch("https://api.franchisetech.ro/api/odoo/logout", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }), localStorage.clear(), sessionStorage.clear(), window.location.reload()
            } catch (s) {
                console.error("Logout failed:", s), window.location.reload()
            }
        },
        o = {
            isAuthenticated: t.authenticated,
            user: t.user,
            dashboardUrl: t.dashboardUrl,
            loading: t.loading,
            error: t.error,
            redirectToDashboard: r,
            refreshAuth: i,
            logout: a,
            login: t.login
        };
    return n.jsx(Zi.Provider, {
        value: o,
        children: e
    })
}

function Ht() {
    const e = l.useContext(Zi);
    if (e === void 0) throw new Error("useAuth must be used within an AuthProvider");
    return e
}
const Yo = {
        Solutions: {
            "/solutions/pos": n.jsx(Ln, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            }),
            "/solutions/inventory": n.jsx(Vn, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            }),
            "/solutions/analytics": n.jsx(Un, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            }),
            "/solutions/franchise-management": n.jsx($n, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            }),
            "/solutions/equipment": n.jsx(Bn, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            })
        },
        Resources: {
            "/blog": n.jsx(qn, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            }),
            "/partnership": n.jsx(Hn, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            }),
            "/services": n.jsx(Gn, {
                className: "w-4 h-4",
                "aria-hidden": "true"
            })
        }
    },
    cr = (e, t) => {
        var r;
        return ((r = Yo[t]) == null ? void 0 : r[e]) || null
    },
    lr = ["Solutions", "Resources"];

function Qo() {
    const [e, t] = B.useState(!1), [r, i] = B.useState(!1), {
        t: a
    } = ta(), {
        isAuthenticated: o,
        user: s,
        redirectToDashboard: c,
        loading: u,
        logout: d
    } = Ht(), p = a("navigation.titles", {
        returnObjects: !0
    }), f = a("navigation.items", {
        returnObjects: !0
    });
    return n.jsxs("header", {
        className: "fixed top-0 w-full bg-white  backdrop-blur z-50 border-b",
        children: [n.jsx(Ko, {
            open: r,
            onOpenChange: i
        }), n.jsx("div", {
            className: "container mx-auto px-4 sm:px-6 lg:px-8",
            children: n.jsxs("div", {
                className: "flex h-16 items-center justify-between",
                children: [n.jsx(Z, {
                    href: "/",
                    children: n.jsx("img", {
                        src: "/logo.png",
                        alt: "FranchiseTech Logo",
                        className: "w-full max-w-[150px] h-auto"
                    })
                }), n.jsx("button", {
                    className: "lg:hidden p-2 text-gray-600 hover:text-primary",
                    onClick: () => t(!e),
                    "aria-label": "Toggle menu",
                    "aria-expanded": e,
                    children: e ? n.jsx(Pt, {
                        className: "h-6 w-6"
                    }) : n.jsx(Dn, {
                        className: "h-6 w-6"
                    })
                }), n.jsx("div", {
                    className: "hidden lg:block",
                    children: n.jsx(Vi, {
                        children: n.jsx(Ui, {
                            children: lr.map(g => n.jsxs(Io, {
                                children: [n.jsx($i, {
                                    children: p[g]
                                }), n.jsx(Bi, {
                                    children: n.jsx("ul", {
                                        className: "grid gap-3 p-6 w-[600px] grid-cols-2",
                                        children: f[g].map(v => n.jsx("li", {
                                            className: "row-span-3",
                                            children: n.jsx(Mo, {
                                                asChild: !0,
                                                children: n.jsx(Z, {
                                                    href: v.href,
                                                    children: n.jsxs("a", {
                                                        className: I("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200", "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5", "focus:bg-gradient-to-r focus:from-primary/20 focus:to-primary/10"),
                                                        children: [n.jsxs("div", {
                                                            className: "flex items-center gap-2 text-sm font-medium leading-none mb-2",
                                                            children: [cr(v.href, g), n.jsx("span", {
                                                                className: "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
                                                                children: v.title
                                                            })]
                                                        }), n.jsx("p", {
                                                            className: "line-clamp-2 text-sm leading-snug text-muted-foreground",
                                                            children: v.description
                                                        })]
                                                    })
                                                })
                                            })
                                        }, v.href))
                                    })
                                })]
                            }, g))
                        })
                    })
                }), n.jsx("div", {
                    className: "hidden lg:flex items-center gap-4",
                    children: u ? n.jsx("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                    }) : o ? n.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [n.jsxs("span", {
                            className: "text-sm text-gray-600",
                            children: ["Bună, ", (s == null ? void 0 : s.name) || (s == null ? void 0 : s.login)]
                        }), n.jsxs(V, {
                            variant: "outline",
                            onClick: c,
                            className: "flex items-center gap-2",
                            children: [n.jsx(Xt, {
                                className: "w-4 h-4"
                            }), "Profil"]
                        }), n.jsx(V, {
                            variant: "ghost",
                            size: "sm",
                            onClick: d,
                            className: "flex items-center gap-1 text-gray-500 hover:text-gray-700",
                            children: n.jsx(Yt, {
                                className: "w-4 h-4"
                            })
                        })]
                    }) : n.jsx(V, {
                        variant: "outline",
                        onClick: () => i(!0),
                        children: "Autentificare"
                    })
                })]
            })
        }), n.jsx("div", {
            className: I("lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out", e ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"),
            children: n.jsxs("div", {
                className: "container mx-auto h-[calc(100vh-4rem)] bg-background flex flex-col",
                children: [n.jsx("div", {
                    className: "flex-1 overflow-y-auto px-4 py-6 space-y-8 hide-scrollbar",
                    children: lr.map(g => n.jsxs("div", {
                        className: "pb-6 border-b last:border-b-0",
                        children: [n.jsx("h3", {
                            className: "text-sm font-semibold text-muted-foreground mb-4 sticky top-0 bg-white py-2",
                            children: p[g]
                        }), n.jsx("ul", {
                            className: "grid gap-3",
                            children: f[g].map(v => n.jsx(na.li, {
                                initial: {
                                    opacity: 0,
                                    y: 5
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: .2
                                },
                                children: n.jsx(Z, {
                                    href: v.href,
                                    children: n.jsxs("a", {
                                        className: "flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors",
                                        onClick: () => t(!1),
                                        children: [cr(v.href, g), n.jsxs("div", {
                                            children: [n.jsx("span", {
                                                className: "font-medium",
                                                children: v.title
                                            }), n.jsx("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: v.description
                                            })]
                                        })]
                                    })
                                })
                            }, v.href))
                        })]
                    }, g))
                }), n.jsx("div", {
                    className: "flex flex-col gap-4 justify-center pb-8 px-4",
                    children: u ? n.jsx("div", {
                        className: "flex justify-center",
                        children: n.jsx("div", {
                            className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                        })
                    }) : o ? n.jsxs("div", {
                        className: "flex flex-col gap-2",
                        children: [n.jsxs("div", {
                            className: "text-center text-sm text-gray-600",
                            children: ["Bună, ", (s == null ? void 0 : s.name) || (s == null ? void 0 : s.login)]
                        }), n.jsxs(V, {
                            variant: "outline",
                            className: "w-full flex items-center gap-2",
                            onClick: () => {
                                c(), t(!1)
                            },
                            children: [n.jsx(Xt, {
                                className: "w-4 h-4"
                            }), "Profil"]
                        }), n.jsxs(V, {
                            variant: "ghost",
                            className: "w-full flex items-center gap-2 text-gray-500 hover:text-gray-700",
                            onClick: () => {
                                d(), t(!1)
                            },
                            children: [n.jsx(Yt, {
                                className: "w-4 h-4"
                            }), "Deconectare"]
                        })]
                    }) : n.jsx(V, {
                        variant: "outline",
                        className: "w-full",
                        onClick: () => {
                            i(!0), t(!1)
                        },
                        children: "Autentificare"
                    })
                })]
            })
        })]
    })
}
const U = {
    name: "Salut Tech SRL",
    brandName: "FranchiseTech",
    cui: "49702253",
    registrationNumber: "J23/1669/2024",
    euid: "ROONRC.J23/1669/2024",
    foundedDate: "4 martie 2024",
    phone: "+40 729 917 823",
    email: {
        main: "info@franchisetech.ro",
        support: "support@franchisetech.ro",
        privacy: "privacy@franchisetech.ro",
        complaints: "reclamatii@franchisetech.ro",
        finance: "finance@franchisetech.ro"
    },
    address: {
        street: "Str. Orhideelor nr. 15, Ap. BIR. 6",
        city: "Sat Dobroești",
        county: "Comuna Dobroești",
        region: "Ilfov",
        postalCode: "077085",
        country: "România",
        full: "Str. Orhideelor nr. 15, Ap. BIR. 6, Sat Dobroești, Comuna Dobroești, Ilfov, 077085, România"
    },
    website: "https://franchisetech.ro",
    apiUrl: "https://api.franchisetech.ro",
    cloudUrl: "https://cloud.franchisetech.ro",
    socialMedia: {
        linkedin: "https://linkedin.com/company/franchisetech-romania",
        twitter: "https://twitter.com/FranchiseTechRO",
        facebook: "https://facebook.com/FranchiseTechRomania",
        instagram: "https://instagram.com/franchisetech_ro"
    },
    description: "Soluții de gestionare a francizelor pentru cafenele și restaurante din România",
    industry: "Software și servicii IT",
    caen: "5829 - Activități de editare a altor produse software",
    pricing: {
        pro: {
            price: 49,
            currency: "EUR",
            period: "lună",
            description: "Pachet Complet Cafenea"
        },
        premium: {
            price: 99,
            currency: "EUR",
            period: "lună",
            description: "Pentru controlul complet al costurilor"
        },
        titanium: {
            price: 179,
            currency: "EUR",
            period: "lună",
            description: "Pentru afaceri cu multiple locații"
        }
    },
    services: {
        setup: {
            price: 50,
            currency: "EUR",
            unit: "oră",
            description: "Servicii de implementare și configurare"
        },
        equipment: {
            tablet: {
                price: 500,
                currency: "EUR",
                description: "Pachet Tabletă POS profesională"
            },
            cashRegister: {
                price: 999,
                currency: "RON",
                description: "Casă de Marcat Fiscală"
            },
            terminal: {
                price: 800,
                currency: "RON",
                description: "Terminal de Plată"
            }
        }
    }
};

function Jo() {
    return n.jsx("footer", {
        className: "bg-gray-50 border-t",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-8",
                children: [n.jsxs("div", {
                    children: [n.jsx("h3", {
                        className: "font-bold text-xl mb-4",
                        children: U.brandName
                    }), n.jsx("p", {
                        className: "text-gray-600 text-sm",
                        children: U.description
                    }), n.jsxs("div", {
                        className: "mt-4 space-y-2",
                        children: [n.jsx("p", {
                            className: "text-sm text-gray-600",
                            children: n.jsx("a", {
                                href: `mailto:${U.email.main}`,
                                className: "hover:text-primary",
                                children: U.email.main
                            })
                        }), n.jsx("p", {
                            className: "text-sm text-gray-600",
                            children: n.jsx("a", {
                                href: `tel:${U.phone}`,
                                className: "hover:text-primary",
                                children: U.phone
                            })
                        })]
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4",
                        children: "Soluții"
                    }), n.jsx("ul", {
                        className: "space-y-2",
                        children: n.jsx("li", {
                            children: n.jsx(Z, {
                                href: "/products",
                                children: n.jsx("a", {
                                    className: "text-gray-600 hover:text-primary",
                                    children: "Produse și Echipamente"
                                })
                            })
                        })
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4",
                        children: "Resurse"
                    }), n.jsxs("ul", {
                        className: "space-y-2",
                        children: [n.jsx("li", {
                            children: n.jsx(Z, {
                                href: "/blog",
                                children: n.jsx("a", {
                                    className: "text-gray-600 hover:text-primary",
                                    children: "Blog"
                                })
                            })
                        }), n.jsx("li", {
                            children: n.jsx(Z, {
                                href: "/partnership",
                                children: n.jsx("a", {
                                    className: "text-gray-600 hover:text-primary",
                                    children: "Program de Parteneriat"
                                })
                            })
                        })]
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4",
                        children: "Social Media"
                    }), n.jsxs("ul", {
                        className: "space-y-2",
                        children: [n.jsx("li", {
                            children: n.jsx("a", {
                                href: U.socialMedia.facebook,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-gray-600 hover:text-primary",
                                children: "Facebook"
                            })
                        }), n.jsx("li", {
                            children: n.jsx("a", {
                                href: U.socialMedia.linkedin,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-gray-600 hover:text-primary",
                                children: "LinkedIn"
                            })
                        }), n.jsx("li", {
                            children: n.jsx("a", {
                                href: U.socialMedia.instagram,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-gray-600 hover:text-primary",
                                children: "Instagram"
                            })
                        })]
                    })]
                })]
            }), n.jsx("div", {
                className: "border-t mt-8 pt-8",
                children: n.jsxs("div", {
                    className: "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0",
                    children: [n.jsxs("div", {
                        className: "text-gray-600 text-sm",
                        children: [n.jsxs("div", {
                            children: ["© ", new Date().getFullYear(), " ", U.name, ". Toate drepturile rezervate."]
                        }), n.jsxs("div", {
                            className: "mt-1",
                            children: ["CUI: ", U.cui, " | ", U.registrationNumber, " | ", U.address.city, ", ", U.address.region, ", ", U.address.country]
                        })]
                    }), n.jsxs("div", {
                        className: "flex items-center space-x-6",
                        children: [n.jsx("div", {
                            className: "flex items-center space-x-2",
                            children: n.jsx("div", {
                                className: "ml-2",
                                children: n.jsx("div", {
                                    className: "text-xs text-gray-500",
                                    children: "Plăți securizate prin Netopia"
                                })
                            })
                        }), n.jsxs("div", {
                            className: "flex space-x-6 text-sm",
                            children: [n.jsx(Z, {
                                href: "/legal/privacy-policy",
                                children: n.jsx("a", {
                                    className: "text-gray-600 hover:text-primary",
                                    children: "Politica de Confidențialitate"
                                })
                            }), n.jsx(Z, {
                                href: "/legal/terms-and-conditions",
                                children: n.jsx("a", {
                                    className: "text-gray-600 hover:text-primary",
                                    children: "Termeni și Condiții"
                                })
                            })]
                        })]
                    })]
                })
            })]
        })
    })
}

function Zo() {
    const [e] = zt();
    return l.useEffect(() => {
        window.scrollTo(0, 0)
    }, [e]), null
}
const es = l.lazy(() => A(() =>
        import ("./OnboardingModal.Bf5Dzp1K.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).then(e => ({
        default: e.OnboardingModal
    }))),
    ts = l.lazy(() => A(() =>
        import ("./RegistrationModal.DMTcX9UO.js"), __vite__mapDeps([12, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11]))),
    ur = () => n.jsx("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        children: n.jsxs("div", {
            className: "bg-white rounded-lg p-6 flex items-center space-x-3",
            children: [n.jsx("div", {
                className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
            }), n.jsx("span", {
                className: "text-gray-600",
                children: "Se încarcă..."
            })]
        })
    });

function rs() {
    const [e] = zt(), [t, r] = l.useState(!1), [i, a] = l.useState(!1), [o, s] = l.useState(void 0);
    return l.useEffect(() => {
        const c = new URLSearchParams(window.location.search),
            u = c.get("modal"),
            d = c.get("show"),
            p = c.get("plan"),
            f = c.get("billingCycle");
        if (d === "true" || u === "onboarding" ? r(!0) : u === "registration" && a(!0), p) {
            const v = [{
                id: "starter",
                name: "STARTER",
                price: 49
            }, {
                id: "growth",
                name: "GROWTH",
                price: 99
            }, {
                id: "pro",
                name: "PRO",
                price: 149
            }].find(x => x.id === p);
            v && s({
                id: v.id,
                name: v.name,
                price: v.price,
                billingCycle: f || "monthly"
            })
        }
        if (u || d || p || f) {
            const g = new URL(window.location.href);
            g.searchParams.delete("modal"), g.searchParams.delete("show"), g.searchParams.delete("plan"), g.searchParams.delete("billingCycle"), window.history.replaceState({}, "", g.toString())
        }
    }, [e]), n.jsxs(n.Fragment, {
        children: [n.jsx(l.Suspense, {
            fallback: t ? n.jsx(ur, {}) : null,
            children: n.jsx(es, {
                open: t,
                onOpenChange: r
            })
        }), n.jsx(l.Suspense, {
            fallback: i ? n.jsx(ur, {}) : null,
            children: n.jsx(ts, {
                open: i,
                onOpenChange: a,
                selectedPlan: o
            })
        })]
    })
}
var is = typeof Element < "u",
    ns = typeof Map == "function",
    as = typeof Set == "function",
    os = typeof ArrayBuffer == "function" && !!ArrayBuffer.isView;

function ke(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
        if (e.constructor !== t.constructor) return !1;
        var r, i, a;
        if (Array.isArray(e)) {
            if (r = e.length, r != t.length) return !1;
            for (i = r; i-- !== 0;)
                if (!ke(e[i], t[i])) return !1;
            return !0
        }
        var o;
        if (ns && e instanceof Map && t instanceof Map) {
            if (e.size !== t.size) return !1;
            for (o = e.entries(); !(i = o.next()).done;)
                if (!t.has(i.value[0])) return !1;
            for (o = e.entries(); !(i = o.next()).done;)
                if (!ke(i.value[1], t.get(i.value[0]))) return !1;
            return !0
        }
        if (as && e instanceof Set && t instanceof Set) {
            if (e.size !== t.size) return !1;
            for (o = e.entries(); !(i = o.next()).done;)
                if (!t.has(i.value[0])) return !1;
            return !0
        }
        if (os && ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) {
            if (r = e.length, r != t.length) return !1;
            for (i = r; i-- !== 0;)
                if (e[i] !== t[i]) return !1;
            return !0
        }
        if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
        if (e.valueOf !== Object.prototype.valueOf && typeof e.valueOf == "function" && typeof t.valueOf == "function") return e.valueOf() === t.valueOf();
        if (e.toString !== Object.prototype.toString && typeof e.toString == "function" && typeof t.toString == "function") return e.toString() === t.toString();
        if (a = Object.keys(e), r = a.length, r !== Object.keys(t).length) return !1;
        for (i = r; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(t, a[i])) return !1;
        if (is && e instanceof Element) return !1;
        for (i = r; i-- !== 0;)
            if (!((a[i] === "_owner" || a[i] === "__v" || a[i] === "__o") && e.$$typeof) && !ke(e[a[i]], t[a[i]])) return !1;
        return !0
    }
    return e !== e && t !== t
}
var ss = function(t, r) {
    try {
        return ke(t, r)
    } catch (i) {
        if ((i.message || "").match(/stack|recursion/i)) return console.warn("react-fast-compare cannot handle circular refs"), !1;
        throw i
    }
};
const cs = Be(ss);
var ls = function(e, t, r, i, a, o, s, c) {
        if (!e) {
            var u;
            if (t === void 0) u = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
            else {
                var d = [r, i, a, o, s, c],
                    p = 0;
                u = new Error(t.replace(/%s/g, function() {
                    return d[p++]
                })), u.name = "Invariant Violation"
            }
            throw u.framesToPop = 1, u
        }
    },
    us = ls;
const dr = Be(us);
var ds = function(t, r, i, a) {
    var o = i ? i.call(a, t, r) : void 0;
    if (o !== void 0) return !!o;
    if (t === r) return !0;
    if (typeof t != "object" || !t || typeof r != "object" || !r) return !1;
    var s = Object.keys(t),
        c = Object.keys(r);
    if (s.length !== c.length) return !1;
    for (var u = Object.prototype.hasOwnProperty.bind(r), d = 0; d < s.length; d++) {
        var p = s[d];
        if (!u(p)) return !1;
        var f = t[p],
            g = r[p];
        if (o = i ? i.call(a, f, g, p) : void 0, o === !1 || o === void 0 && f !== g) return !1
    }
    return !0
};
const ms = Be(ds);
var en = (e => (e.BASE = "base", e.BODY = "body", e.HEAD = "head", e.HTML = "html", e.LINK = "link", e.META = "meta", e.NOSCRIPT = "noscript", e.SCRIPT = "script", e.STYLE = "style", e.TITLE = "title", e.FRAGMENT = "Symbol(react.fragment)", e))(en || {}),
    rt = {
        link: {
            rel: ["amphtml", "canonical", "alternate"]
        },
        script: {
            type: ["application/ld+json"]
        },
        meta: {
            charset: "",
            name: ["generator", "robots", "description"],
            property: ["og:type", "og:title", "og:url", "og:image", "og:image:alt", "og:description", "twitter:url", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt", "twitter:card", "twitter:site"]
        }
    },
    mr = Object.values(en),
    Gt = {
        accesskey: "accessKey",
        charset: "charSet",
        class: "className",
        contenteditable: "contentEditable",
        contextmenu: "contextMenu",
        "http-equiv": "httpEquiv",
        itemprop: "itemProp",
        tabindex: "tabIndex"
    },
    ps = Object.entries(Gt).reduce((e, [t, r]) => (e[r] = t, e), {}),
    W = "data-rh",
    ce = {
        DEFAULT_TITLE: "defaultTitle",
        DEFER: "defer",
        ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
        ON_CHANGE_CLIENT_STATE: "onChangeClientState",
        TITLE_TEMPLATE: "titleTemplate",
        PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
    },
    le = (e, t) => {
        for (let r = e.length - 1; r >= 0; r -= 1) {
            const i = e[r];
            if (Object.prototype.hasOwnProperty.call(i, t)) return i[t]
        }
        return null
    },
    fs = e => {
        let t = le(e, "title");
        const r = le(e, ce.TITLE_TEMPLATE);
        if (Array.isArray(t) && (t = t.join("")), r && t) return r.replace(/%s/g, () => t);
        const i = le(e, ce.DEFAULT_TITLE);
        return t || i || void 0
    },
    hs = e => le(e, ce.ON_CHANGE_CLIENT_STATE) || (() => {}),
    it = (e, t) => t.filter(r => typeof r[e] < "u").map(r => r[e]).reduce((r, i) => ({ ...r,
        ...i
    }), {}),
    gs = (e, t) => t.filter(r => typeof r.base < "u").map(r => r.base).reverse().reduce((r, i) => {
        if (!r.length) {
            const a = Object.keys(i);
            for (let o = 0; o < a.length; o += 1) {
                const c = a[o].toLowerCase();
                if (e.indexOf(c) !== -1 && i[c]) return r.concat(i)
            }
        }
        return r
    }, []),
    vs = e => console && typeof console.warn == "function" && console.warn(e),
    xe = (e, t, r) => {
        const i = {};
        return r.filter(a => Array.isArray(a[e]) ? !0 : (typeof a[e] < "u" && vs(`Helmet: ${e} should be of type "Array". Instead found type "${typeof a[e]}"`), !1)).map(a => a[e]).reverse().reduce((a, o) => {
            const s = {};
            o.filter(u => {
                let d;
                const p = Object.keys(u);
                for (let g = 0; g < p.length; g += 1) {
                    const v = p[g],
                        x = v.toLowerCase();
                    t.indexOf(x) !== -1 && !(d === "rel" && u[d].toLowerCase() === "canonical") && !(x === "rel" && u[x].toLowerCase() === "stylesheet") && (d = x), t.indexOf(v) !== -1 && (v === "innerHTML" || v === "cssText" || v === "itemprop") && (d = v)
                }
                if (!d || !u[d]) return !1;
                const f = u[d].toLowerCase();
                return i[d] || (i[d] = {}), s[d] || (s[d] = {}), i[d][f] ? !1 : (s[d][f] = !0, !0)
            }).reverse().forEach(u => a.push(u));
            const c = Object.keys(s);
            for (let u = 0; u < c.length; u += 1) {
                const d = c[u],
                    p = { ...i[d],
                        ...s[d]
                    };
                i[d] = p
            }
            return a
        }, []).reverse()
    },
    ys = (e, t) => {
        if (Array.isArray(e) && e.length) {
            for (let r = 0; r < e.length; r += 1)
                if (e[r][t]) return !0
        }
        return !1
    },
    xs = e => ({
        baseTag: gs(["href"], e),
        bodyAttributes: it("bodyAttributes", e),
        defer: le(e, ce.DEFER),
        encode: le(e, ce.ENCODE_SPECIAL_CHARACTERS),
        htmlAttributes: it("htmlAttributes", e),
        linkTags: xe("link", ["rel", "href"], e),
        metaTags: xe("meta", ["name", "charset", "http-equiv", "property", "itemprop"], e),
        noscriptTags: xe("noscript", ["innerHTML"], e),
        onChangeClientState: hs(e),
        scriptTags: xe("script", ["src", "innerHTML"], e),
        styleTags: xe("style", ["cssText"], e),
        title: fs(e),
        titleAttributes: it("titleAttributes", e),
        prioritizeSeoTags: ys(e, ce.PRIORITIZE_SEO_TAGS)
    }),
    tn = e => Array.isArray(e) ? e.join("") : e,
    bs = (e, t) => {
        const r = Object.keys(e);
        for (let i = 0; i < r.length; i += 1)
            if (t[r[i]] && t[r[i]].includes(e[r[i]])) return !0;
        return !1
    },
    nt = (e, t) => Array.isArray(e) ? e.reduce((r, i) => (bs(i, t) ? r.priority.push(i) : r.default.push(i), r), {
        priority: [],
        default: []
    }) : {
        default: e,
        priority: []
    },
    pr = (e, t) => ({ ...e,
        [t]: void 0
    }),
    ws = ["noscript", "script", "style"],
    vt = (e, t = !0) => t === !1 ? String(e) : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;"),
    rn = e => Object.keys(e).reduce((t, r) => {
        const i = typeof e[r] < "u" ? `${r}="${e[r]}"` : `${r}`;
        return t ? `${t} ${i}` : i
    }, ""),
    Ss = (e, t, r, i) => {
        const a = rn(r),
            o = tn(t);
        return a ? `<${e} ${W}="true" ${a}>${vt(o,i)}</${e}>` : `<${e} ${W}="true">${vt(o,i)}</${e}>`
    },
    Ts = (e, t, r = !0) => t.reduce((i, a) => {
        const o = a,
            s = Object.keys(o).filter(d => !(d === "innerHTML" || d === "cssText")).reduce((d, p) => {
                const f = typeof o[p] > "u" ? p : `${p}="${vt(o[p],r)}"`;
                return d ? `${d} ${f}` : f
            }, ""),
            c = o.innerHTML || o.cssText || "",
            u = ws.indexOf(e) === -1;
        return `${i}<${e} ${W}="true" ${s}${u?"/>":`>${c}</${e}>`}`
    }, ""),
    nn = (e, t = {}) => Object.keys(e).reduce((r, i) => {
        const a = Gt[i];
        return r[a || i] = e[i], r
    }, t),
    Cs = (e, t, r) => {
        const i = {
                key: t,
                [W]: !0
            },
            a = nn(r, i);
        return [B.createElement("title", a, t)]
    },
    Fe = (e, t) => t.map((r, i) => {
        const a = {
            key: i,
            [W]: !0
        };
        return Object.keys(r).forEach(o => {
            const c = Gt[o] || o;
            if (c === "innerHTML" || c === "cssText") {
                const u = r.innerHTML || r.cssText;
                a.dangerouslySetInnerHTML = {
                    __html: u
                }
            } else a[c] = r[o]
        }), B.createElement(e, a)
    }),
    q = (e, t, r = !0) => {
        switch (e) {
            case "title":
                return {
                    toComponent: () => Cs(e, t.title, t.titleAttributes),
                    toString: () => Ss(e, t.title, t.titleAttributes, r)
                };
            case "bodyAttributes":
            case "htmlAttributes":
                return {
                    toComponent: () => nn(t),
                    toString: () => rn(t)
                };
            default:
                return {
                    toComponent: () => Fe(e, t),
                    toString: () => Ts(e, t, r)
                }
        }
    },
    Es = ({
        metaTags: e,
        linkTags: t,
        scriptTags: r,
        encode: i
    }) => {
        const a = nt(e, rt.meta),
            o = nt(t, rt.link),
            s = nt(r, rt.script);
        return {
            priorityMethods: {
                toComponent: () => [...Fe("meta", a.priority), ...Fe("link", o.priority), ...Fe("script", s.priority)],
                toString: () => `${q("meta",a.priority,i)} ${q("link",o.priority,i)} ${q("script",s.priority,i)}`
            },
            metaTags: a.default,
            linkTags: o.default,
            scriptTags: s.default
        }
    },
    js = e => {
        const {
            baseTag: t,
            bodyAttributes: r,
            encode: i = !0,
            htmlAttributes: a,
            noscriptTags: o,
            styleTags: s,
            title: c = "",
            titleAttributes: u,
            prioritizeSeoTags: d
        } = e;
        let {
            linkTags: p,
            metaTags: f,
            scriptTags: g
        } = e, v = {
            toComponent: () => {},
            toString: () => ""
        };
        return d && ({
            priorityMethods: v,
            linkTags: p,
            metaTags: f,
            scriptTags: g
        } = Es(e)), {
            priority: v,
            base: q("base", t, i),
            bodyAttributes: q("bodyAttributes", r, i),
            htmlAttributes: q("htmlAttributes", a, i),
            link: q("link", p, i),
            meta: q("meta", f, i),
            noscript: q("noscript", o, i),
            script: q("script", g, i),
            style: q("style", s, i),
            title: q("title", {
                title: c,
                titleAttributes: u
            }, i)
        }
    },
    yt = js,
    Ne = [],
    an = !!(typeof window < "u" && window.document && window.document.createElement),
    xt = class {
        constructor(e, t) {
            X(this, "instances", []);
            X(this, "canUseDOM", an);
            X(this, "context");
            X(this, "value", {
                setHelmet: e => {
                    this.context.helmet = e
                },
                helmetInstances: {
                    get: () => this.canUseDOM ? Ne : this.instances,
                    add: e => {
                        (this.canUseDOM ? Ne : this.instances).push(e)
                    },
                    remove: e => {
                        const t = (this.canUseDOM ? Ne : this.instances).indexOf(e);
                        (this.canUseDOM ? Ne : this.instances).splice(t, 1)
                    }
                }
            });
            this.context = e, this.canUseDOM = t || !1, t || (e.helmet = yt({
                baseTag: [],
                bodyAttributes: {},
                encodeSpecialCharacters: !0,
                htmlAttributes: {},
                linkTags: [],
                metaTags: [],
                noscriptTags: [],
                scriptTags: [],
                styleTags: [],
                title: "",
                titleAttributes: {}
            }))
        }
    },
    Ps = {},
    on = B.createContext(Ps),
    ie, sn = (ie = class extends l.Component {
        constructor(r) {
            super(r);
            X(this, "helmetData");
            this.helmetData = new xt(this.props.context || {}, ie.canUseDOM)
        }
        render() {
            return B.createElement(on.Provider, {
                value: this.helmetData.value
            }, this.props.children)
        }
    }, X(ie, "canUseDOM", an), ie),
    oe = (e, t) => {
        const r = document.head || document.querySelector("head"),
            i = r.querySelectorAll(`${e}[${W}]`),
            a = [].slice.call(i),
            o = [];
        let s;
        return t && t.length && t.forEach(c => {
            const u = document.createElement(e);
            for (const d in c)
                if (Object.prototype.hasOwnProperty.call(c, d))
                    if (d === "innerHTML") u.innerHTML = c.innerHTML;
                    else if (d === "cssText") u.styleSheet ? u.styleSheet.cssText = c.cssText : u.appendChild(document.createTextNode(c.cssText));
            else {
                const p = d,
                    f = typeof c[p] > "u" ? "" : c[p];
                u.setAttribute(d, f)
            }
            u.setAttribute(W, "true"), a.some((d, p) => (s = p, u.isEqualNode(d))) ? a.splice(s, 1) : o.push(u)
        }), a.forEach(c => {
            var u;
            return (u = c.parentNode) == null ? void 0 : u.removeChild(c)
        }), o.forEach(c => r.appendChild(c)), {
            oldTags: a,
            newTags: o
        }
    },
    bt = (e, t) => {
        const r = document.getElementsByTagName(e)[0];
        if (!r) return;
        const i = r.getAttribute(W),
            a = i ? i.split(",") : [],
            o = [...a],
            s = Object.keys(t);
        for (const c of s) {
            const u = t[c] || "";
            r.getAttribute(c) !== u && r.setAttribute(c, u), a.indexOf(c) === -1 && a.push(c);
            const d = o.indexOf(c);
            d !== -1 && o.splice(d, 1)
        }
        for (let c = o.length - 1; c >= 0; c -= 1) r.removeAttribute(o[c]);
        a.length === o.length ? r.removeAttribute(W) : r.getAttribute(W) !== s.join(",") && r.setAttribute(W, s.join(","))
    },
    As = (e, t) => {
        typeof e < "u" && document.title !== e && (document.title = tn(e)), bt("title", t)
    },
    fr = (e, t) => {
        const {
            baseTag: r,
            bodyAttributes: i,
            htmlAttributes: a,
            linkTags: o,
            metaTags: s,
            noscriptTags: c,
            onChangeClientState: u,
            scriptTags: d,
            styleTags: p,
            title: f,
            titleAttributes: g
        } = e;
        bt("body", i), bt("html", a), As(f, g);
        const v = {
                baseTag: oe("base", r),
                linkTags: oe("link", o),
                metaTags: oe("meta", s),
                noscriptTags: oe("noscript", c),
                scriptTags: oe("script", d),
                styleTags: oe("style", p)
            },
            x = {},
            b = {};
        Object.keys(v).forEach(y => {
            const {
                newTags: j,
                oldTags: C
            } = v[y];
            j.length && (x[y] = j), C.length && (b[y] = v[y].oldTags)
        }), t && t(), u(e, x, b)
    },
    be = null,
    _s = e => {
        be && cancelAnimationFrame(be), e.defer ? be = requestAnimationFrame(() => {
            fr(e, () => {
                be = null
            })
        }) : (fr(e), be = null)
    },
    Rs = _s,
    hr = class extends l.Component {
        constructor() {
            super(...arguments);
            X(this, "rendered", !1)
        }
        shouldComponentUpdate(t) {
            return !ms(t, this.props)
        }
        componentDidUpdate() {
            this.emitChange()
        }
        componentWillUnmount() {
            const {
                helmetInstances: t
            } = this.props.context;
            t.remove(this), this.emitChange()
        }
        emitChange() {
            const {
                helmetInstances: t,
                setHelmet: r
            } = this.props.context;
            let i = null;
            const a = xs(t.get().map(o => {
                const s = { ...o.props
                };
                return delete s.context, s
            }));
            sn.canUseDOM ? Rs(a) : yt && (i = yt(a)), r(i)
        }
        init() {
            if (this.rendered) return;
            this.rendered = !0;
            const {
                helmetInstances: t
            } = this.props.context;
            t.add(this), this.emitChange()
        }
        render() {
            return this.init(), null
        }
    },
    ot, ml = (ot = class extends l.Component {
        shouldComponentUpdate(e) {
            return !cs(pr(this.props, "helmetData"), pr(e, "helmetData"))
        }
        mapNestedChildrenToProps(e, t) {
            if (!t) return null;
            switch (e.type) {
                case "script":
                case "noscript":
                    return {
                        innerHTML: t
                    };
                case "style":
                    return {
                        cssText: t
                    };
                default:
                    throw new Error(`<${e.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`)
            }
        }
        flattenArrayTypeChildren(e, t, r, i) {
            return { ...t,
                [e.type]: [...t[e.type] || [], { ...r,
                    ...this.mapNestedChildrenToProps(e, i)
                }]
            }
        }
        mapObjectTypeChildren(e, t, r, i) {
            switch (e.type) {
                case "title":
                    return { ...t,
                        [e.type]: i,
                        titleAttributes: { ...r
                        }
                    };
                case "body":
                    return { ...t,
                        bodyAttributes: { ...r
                        }
                    };
                case "html":
                    return { ...t,
                        htmlAttributes: { ...r
                        }
                    };
                default:
                    return { ...t,
                        [e.type]: { ...r
                        }
                    }
            }
        }
        mapArrayTypeChildrenToProps(e, t) {
            let r = { ...t
            };
            return Object.keys(e).forEach(i => {
                r = { ...r,
                    [i]: e[i]
                }
            }), r
        }
        warnOnInvalidChildren(e, t) {
            return dr(mr.some(r => e.type === r), typeof e.type == "function" ? "You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information." : `Only elements types ${mr.join(", ")} are allowed. Helmet does not support rendering <${e.type}> elements. Refer to our API for more information.`), dr(!t || typeof t == "string" || Array.isArray(t) && !t.some(r => typeof r != "string"), `Helmet expects a string as a child of <${e.type}>. Did you forget to wrap your children in braces? ( <${e.type}>{\`\`}</${e.type}> ) Refer to our API for more information.`), !0
        }
        mapChildrenToProps(e, t) {
            let r = {};
            return B.Children.forEach(e, i => {
                if (!i || !i.props) return;
                const {
                    children: a,
                    ...o
                } = i.props, s = Object.keys(o).reduce((u, d) => (u[ps[d] || d] = o[d], u), {});
                let {
                    type: c
                } = i;
                switch (typeof c == "symbol" ? c = c.toString() : this.warnOnInvalidChildren(i, a), c) {
                    case "Symbol(react.fragment)":
                        t = this.mapChildrenToProps(a, t);
                        break;
                    case "link":
                    case "meta":
                    case "noscript":
                    case "script":
                    case "style":
                        r = this.flattenArrayTypeChildren(i, r, s, a);
                        break;
                    default:
                        t = this.mapObjectTypeChildren(i, t, s, a);
                        break
                }
            }), this.mapArrayTypeChildrenToProps(r, t)
        }
        render() {
            const {
                children: e,
                ...t
            } = this.props;
            let r = { ...t
                },
                {
                    helmetData: i
                } = t;
            if (e && (r = this.mapChildrenToProps(e, r)), i && !(i instanceof xt)) {
                const a = i;
                i = new xt(a.context, !0), delete r.helmetData
            }
            return i ? B.createElement(hr, { ...r,
                context: i.value
            }) : B.createElement(on.Consumer, null, a => B.createElement(hr, { ...r,
                context: a
            }))
        }
    }, X(ot, "defaultProps", {
        defer: !0,
        encodeSpecialCharacters: !0,
        prioritizeSeoTags: !1
    }), ot);
const Ns = Y.object({
    newPassword: Y.string().min(8, "Parola trebuie să aibă cel puțin 8 caractere"),
    confirmPassword: Y.string().min(8, "Parola trebuie să aibă cel puțin 8 caractere")
}).refine(e => e.newPassword === e.confirmPassword, {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"]
});

function Is({
    open: e,
    onOpenChange: t,
    token: r
}) {
    const [i, a] = l.useState(!1), [o, s] = l.useState(!0), [c, u] = l.useState(!1), [d, p] = l.useState(!1), [f, g] = l.useState(!1), [v, x] = l.useState(!1), [b, y] = l.useState(""), {
        toast: j
    } = _t(), C = At({
        resolver: qt(Ns),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });
    l.useEffect(() => {
        e && r && w()
    }, [e, r]);
    const w = async () => {
            s(!0);
            try {
                const O = await (await fetch(`https://api.franchisetech.ro/api/odoo/validate-reset-token/${r}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })).json();
                O.success ? (u(!0), y(O.email || "")) : (u(!1), j({
                    title: "Token Invalid",
                    description: O.message || "Link-ul de resetare este invalid sau a expirat.",
                    variant: "destructive",
                    duration: 5e3
                }))
            } catch (P) {
                console.error("Token validation error:", P), u(!1), j({
                    title: "Eroare",
                    description: "A apărut o eroare la validarea link-ului de resetare.",
                    variant: "destructive",
                    duration: 5e3
                })
            } finally {
                s(!1)
            }
        },
        T = async P => {
            a(!0);
            try {
                const _ = await (await fetch("https://api.franchisetech.ro/api/odoo/reset-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: r,
                        newPassword: P.newPassword
                    })
                })).json();
                _.success ? (x(!0), j({
                    title: "Parolă Resetată",
                    description: _.message || "Parola a fost resetată cu succes.",
                    duration: 5e3
                })) : j({
                    title: "Eroare",
                    description: _.message || "A apărut o eroare la resetarea parolei.",
                    variant: "destructive",
                    duration: 5e3
                })
            } catch (M) {
                console.error("Password reset error:", M), j({
                    title: "Eroare",
                    description: "A apărut o eroare la resetarea parolei. Vă rugăm să încercați din nou.",
                    variant: "destructive",
                    duration: 5e3
                })
            } finally {
                a(!1)
            }
        },
        S = () => {
            x(!1), u(!1), C.reset(), t(!1)
        };
    return o ? n.jsx(se, {
        open: e,
        onOpenChange: S,
        children: n.jsx(re, {
            className: "sm:max-w-[425px]",
            children: n.jsxs("div", {
                className: "flex flex-col items-center justify-center py-8",
                children: [n.jsx(Le, {
                    className: "h-8 w-8 animate-spin text-[#9747FF] mb-4"
                }), n.jsx("p", {
                    className: "text-sm text-gray-600",
                    children: "Se validează link-ul de resetare..."
                })]
            })
        })
    }) : c ? v ? n.jsx(se, {
        open: e,
        onOpenChange: S,
        children: n.jsx(re, {
            className: "sm:max-w-[425px]",
            children: n.jsxs("div", {
                className: "flex flex-col items-center justify-center py-8",
                children: [n.jsx(Wn, {
                    className: "h-12 w-12 text-green-500 mb-4"
                }), n.jsx("h3", {
                    className: "text-lg font-semibold text-gray-900 mb-2",
                    children: "Parolă Resetată cu Succes"
                }), n.jsx("p", {
                    className: "text-sm text-gray-600 text-center mb-4",
                    children: "Parola dvs. a fost resetată cu succes. Puteți acum să vă autentificați cu noua parolă."
                }), n.jsx(V, {
                    onClick: S,
                    children: "Autentificare"
                })]
            })
        })
    }) : n.jsx(se, {
        open: e,
        onOpenChange: S,
        children: n.jsxs(re, {
            className: "sm:max-w-[425px]",
            children: [n.jsxs(We, {
                children: [n.jsx(Xe, {
                    className: "text-xl font-bold bg-gradient-to-r from-[#9747FF] via-[#8A43E6] to-[#6E35B9] bg-clip-text text-transparent",
                    children: "Resetare Parolă"
                }), n.jsxs(Ye, {
                    children: ["Introduceți noua parolă pentru contul asociat cu ", b]
                })]
            }), n.jsx(Bt, { ...C,
                children: n.jsxs("form", {
                    onSubmit: C.handleSubmit(T),
                    className: "space-y-4",
                    children: [n.jsx(Ce, {
                        control: C.control,
                        name: "newPassword",
                        render: ({
                            field: P
                        }) => n.jsxs(me, {
                            children: [n.jsx(pe, {
                                children: "Parolă Nouă"
                            }), n.jsx(fe, {
                                children: n.jsxs("div", {
                                    className: "relative",
                                    children: [n.jsx(ge, {
                                        type: d ? "text" : "password",
                                        placeholder: "Introduceți noua parolă",
                                        ...P,
                                        className: "pr-10"
                                    }), n.jsx(V, {
                                        type: "button",
                                        variant: "ghost",
                                        size: "sm",
                                        className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                        onClick: () => p(!d),
                                        children: d ? n.jsx(ct, {
                                            className: "h-4 w-4"
                                        }) : n.jsx(lt, {
                                            className: "h-4 w-4"
                                        })
                                    })]
                                })
                            }), n.jsx(he, {})]
                        })
                    }), n.jsx(Ce, {
                        control: C.control,
                        name: "confirmPassword",
                        render: ({
                            field: P
                        }) => n.jsxs(me, {
                            children: [n.jsx(pe, {
                                children: "Confirmă Parola"
                            }), n.jsx(fe, {
                                children: n.jsxs("div", {
                                    className: "relative",
                                    children: [n.jsx(ge, {
                                        type: f ? "text" : "password",
                                        placeholder: "Confirmați noua parolă",
                                        ...P,
                                        className: "pr-10"
                                    }), n.jsx(V, {
                                        type: "button",
                                        variant: "ghost",
                                        size: "sm",
                                        className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                        onClick: () => g(!f),
                                        children: f ? n.jsx(ct, {
                                            className: "h-4 w-4"
                                        }) : n.jsx(lt, {
                                            className: "h-4 w-4"
                                        })
                                    })]
                                })
                            }), n.jsx(he, {})]
                        })
                    }), n.jsxs("div", {
                        className: "text-sm text-gray-500 space-y-1",
                        children: [n.jsx("p", {
                            children: "• Parola trebuie să aibă cel puțin 8 caractere"
                        }), n.jsx("p", {
                            children: "• Pentru securitate, folosiți o combinație de litere, cifre și simboluri"
                        })]
                    }), n.jsx(V, {
                        type: "submit",
                        className: "w-full",
                        disabled: !C.formState.isValid || i,
                        children: i ? n.jsxs(n.Fragment, {
                            children: [n.jsx(Le, {
                                className: "mr-2 h-4 w-4 animate-spin"
                            }), "Se resetează parola..."]
                        }) : "Resetează Parola"
                    })]
                })
            })]
        })
    }) : n.jsx(se, {
        open: e,
        onOpenChange: S,
        children: n.jsx(re, {
            className: "sm:max-w-[425px]",
            children: n.jsxs("div", {
                className: "flex flex-col items-center justify-center py-8",
                children: [n.jsx(Kn, {
                    className: "h-12 w-12 text-red-500 mb-4"
                }), n.jsx("h3", {
                    className: "text-lg font-semibold text-gray-900 mb-2",
                    children: "Link Invalid"
                }), n.jsx("p", {
                    className: "text-sm text-gray-600 text-center mb-4",
                    children: "Link-ul de resetare este invalid sau a expirat. Vă rugăm să solicitați un nou link de resetare."
                }), n.jsx(V, {
                    onClick: S,
                    children: "Închide"
                })]
            })
        })
    })
}

function Os() {
    const e = new URLSearchParams(window.location.search);
    return e.get("token") || e.get("reset_token")
}

function Ms() {
    const e = window.location.hash;
    if (!e) return null;
    const t = new URLSearchParams(e.substring(1));
    return t.get("token") || t.get("reset_token")
}

function zs() {
    return Os() || Ms()
}

function ks() {
    const e = new URL(window.location.href);
    e.searchParams.delete("token"), e.searchParams.delete("reset_token");
    const t = e.hash;
    if (t) {
        const r = new URLSearchParams(t.substring(1));
        r.delete("token"), r.delete("reset_token");
        const i = r.toString() ? `#${r.toString()}` : "";
        e.hash = i
    }
    window.history.replaceState({}, "", e.toString())
}

function Fs({
    criticalImages: e = [],
    criticalFonts: t = [],
    criticalScripts: r = []
}) {
    return l.useEffect(() => {
        e.forEach(o => {
            const s = document.createElement("link");
            s.rel = "preload", s.as = "image", s.href = o, document.head.appendChild(s)
        }), t.forEach(o => {
            const s = document.createElement("link");
            s.rel = "preload", s.as = "font", s.type = "font/woff2", s.href = o, s.crossOrigin = "anonymous", document.head.appendChild(s)
        }), r.forEach(o => {
            const s = document.createElement("link");
            s.rel = "preload", s.as = "script", s.href = o, document.head.appendChild(s)
        }), ["https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://api.franchisetech.ro", "https://www.googletagmanager.com"].forEach(o => {
            const s = document.createElement("link");
            s.rel = "preconnect", s.href = o, document.head.appendChild(s)
        }), ["https://odoocdn.com", "https://vercel.com"].forEach(o => {
            const s = document.createElement("link");
            s.rel = "dns-prefetch", s.href = o, document.head.appendChild(s)
        })
    }, [e, t, r]), null
}

function Ds() {
    const {
        loading: e
    } = Ht();
    return e ? n.jsx("div", {
        className: "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {
                className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
            }), n.jsx("p", {
                className: "text-gray-600",
                children: "Se verifică autentificarea..."
            })]
        })
    }) : null
}

function Ls() {
    const {
        isAuthenticated: e,
        user: t,
        dashboardUrl: r
    } = Ht();
    return e ? n.jsx("div", {
        className: "fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center max-w-md mx-auto p-6",
            children: [n.jsx("div", {
                className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
            }), n.jsxs("h2", {
                className: "text-xl font-semibold text-gray-900 mb-2",
                children: ["Bună, ", (t == null ? void 0 : t.name) || (t == null ? void 0 : t.login), "!"]
            }), n.jsx("p", {
                className: "text-gray-600 mb-4",
                children: "Se redirecționează către panoul de control..."
            }), n.jsxs("div", {
                className: "text-sm text-gray-500",
                children: ["Dacă nu ești redirecționat automat,", n.jsx("a", {
                    href: r || "https://cloud.franchisetech.ro/web",
                    className: "text-primary hover:underline ml-1",
                    children: "click aici"
                })]
            })]
        })
    }) : null
}
const Vs = l.lazy(() => A(() =>
        import ("./Home.PIWbmZ7T.js"), __vite__mapDeps([13, 1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16])).then(e => ({
        default: e.Home
    }))),
    Us = l.lazy(() => A(() =>
        import ("./Services.D0Az0Ifa.js"), __vite__mapDeps([17, 1, 2, 18, 14, 15, 16, 10, 11, 19, 20, 9, 21, 4, 5, 22, 7, 8, 6])).then(e => ({
        default: e.Services
    }))),
    $s = l.lazy(() => A(() =>
        import ("./Products.BLO4A7eA.js"), __vite__mapDeps([23, 1, 2, 18, 14, 15, 16, 10, 11, 19, 20, 9, 5, 8, 6]))),
    Bs = l.lazy(() => A(() =>
        import ("./About.Cj6J2FQL.js"), __vite__mapDeps([24, 1, 2, 19, 20, 9, 11, 5, 14, 15, 10, 8, 6])).then(e => ({
        default: e.About
    }))),
    qs = l.lazy(() => A(() =>
        import ("./Contact.muXGP9_K.js"), __vite__mapDeps([25, 1, 2, 19, 21, 6, 7, 10, 5, 8, 9, 11])).then(e => ({
        default: e.Contact
    }))),
    Hs = l.lazy(() => A(() =>
        import ("./CaseStudies.DBbReiqf.js"), __vite__mapDeps([26, 1, 2, 14, 15, 10, 8, 9, 5, 6, 11])).then(e => ({
        default: e.CaseStudies
    }))),
    Gs = l.lazy(() => A(() =>
        import ("./POS.Ck5IEX-F.js"), __vite__mapDeps([27, 1, 2, 19, 20, 9, 14, 15, 28, 11, 5, 8, 6, 10])).then(e => ({
        default: e.POS
    }))),
    Ks = l.lazy(() => A(() =>
        import ("./Inventory.DSz2hkpU.js"), __vite__mapDeps([29, 1, 2, 20, 9, 19, 5, 8, 6, 10, 11])).then(e => ({
        default: e.Inventory
    }))),
    Ws = l.lazy(() => A(() =>
        import ("./CRM.2sgl7ZjX.js"), __vite__mapDeps([30, 1, 2, 19, 20, 9, 11, 5, 8, 6, 10])).then(e => ({
        default: e.CRM
    }))),
    Xs = l.lazy(() => A(() =>
        import ("./CloudManagement.CNNR3c-P.js"), __vite__mapDeps([31, 1, 2, 10, 11, 32, 9, 33, 15, 5]))),
    Ys = l.lazy(() => A(() =>
        import ("./WebsiteBuilder.DJ9KkLDi.js"), __vite__mapDeps([34, 1, 2, 14, 15, 10, 5, 8, 9, 6, 11]))),
    gr = l.lazy(() => A(() =>
        import ("./CoffeeShop.4Qy9fikc.js"), __vite__mapDeps([35, 1, 2, 19, 20, 9, 28, 11, 5, 8, 6, 10])).then(e => ({
        default: e.CoffeeShop
    }))),
    Qs = l.lazy(() => A(() =>
        import ("./Franchiza.C7M5rnbV.js"), __vite__mapDeps([36, 1, 2, 14, 15, 19, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11])).then(e => ({
        default: e.Franchiza
    }))),
    Js = l.lazy(() => A(() =>
        import ("./Glossary.CiGoW3OO.js"), __vite__mapDeps([37, 1, 2, 19, 20, 9, 10, 11, 5, 8, 6])).then(e => ({
        default: e.Glossary
    }))),
    Zs = l.lazy(() => A(() =>
        import ("./GradientCustomizer.D73vJfCP.js"), __vite__mapDeps([38, 1, 2, 19, 5, 10, 11, 8, 9, 6])).then(e => ({
        default: e.GradientCustomizerPage
    }))),
    ec = l.lazy(() => A(() =>
        import ("./PrivacyPolicy.B4aSkR6f.js"), __vite__mapDeps([39, 1, 2, 5, 8, 9, 6, 10, 11]))),
    tc = l.lazy(() => A(() =>
        import ("./TermsAndConditions.D8avKlBd.js"), __vite__mapDeps([40, 1, 2, 5, 8, 9, 6, 10, 11]))),
    rc = l.lazy(() => A(() =>
        import ("./Partnership.BGpkdVzh.js"), __vite__mapDeps([41, 1, 2, 19, 20, 9, 5, 11, 32, 33, 15, 8, 6, 10]))),
    ic = l.lazy(() => A(() =>
        import ("./Resources.CshW3Jlm.js"), __vite__mapDeps([42, 1, 2, 14, 15, 10, 8, 9, 5, 6, 11])).then(e => ({
        default: e.Resources
    }))),
    nc = l.lazy(() => A(() =>
        import ("./BlogList.D3aV3a3Q.js"), __vite__mapDeps([43, 1, 2, 44, 22, 33, 5, 8, 9, 6, 10, 11])).then(e => ({
        default: e.BlogList
    }))),
    ac = l.lazy(() => A(() =>
        import ("./Blog_details.Dtwwugmn.js"), __vite__mapDeps([45, 1, 2, 44, 22, 33, 14, 15, 5, 8, 9, 6, 10, 11])).then(e => ({
        default: e.BlogPost
    }))),
    oc = l.lazy(() => A(() =>
        import ("./ThankYou.DwQzWf0U.js"), __vite__mapDeps([46, 1, 2, 10, 11, 8, 9, 5, 6]))),
    sc = l.lazy(() => A(() =>
        import ("./NotFound.DR51RrEt.js"), __vite__mapDeps([47, 1, 2, 14, 15, 10, 8, 9, 5, 6, 11])).then(e => ({
        default: e.NotFound
    }))),
    cc = l.lazy(() => A(() =>
        import ("./cash-register.BWWN4lX-.js"), __vite__mapDeps([48, 1, 2, 14, 15, 10, 11, 5, 8, 9, 6]))),
    lc = l.lazy(() => A(() =>
        import ("./tablet.X6v6lqiO.js"), __vite__mapDeps([49, 1, 2, 10, 11, 5]))),
    uc = l.lazy(() => A(() =>
        import ("./terminal.DBki-0kE.js"), __vite__mapDeps([50, 1, 2, 10, 11, 5]))),
    dc = l.lazy(() => A(() =>
        import ("./ChargeTracking.CRURB2U7.js"), __vite__mapDeps([51, 1, 2])).then(e => ({
        default: e.ChargeTracking
    }))),
    mc = l.lazy(() => A(() =>
        import ("./EFactura.DgXnRONL.js"), __vite__mapDeps([52, 1, 2, 18, 14, 15, 16, 10, 11, 5, 8, 9, 6])).then(e => ({
        default: e.default
    }))),
    pc = l.lazy(() => A(() =>
        import ("./Payment.Bln1KxSH.js"), __vite__mapDeps([53, 1, 2, 8, 22, 19, 5, 54, 9, 6, 10, 11]))),
    at = l.lazy(() => A(() =>
        import ("./PaymentResult.BMrlAx3y.js"), __vite__mapDeps([55, 1, 2, 19, 5, 54, 8, 9, 6, 10, 11]))),
    fc = l.lazy(() => A(() =>
        import ("./OrderSummary.6OpUxMDB.js"), __vite__mapDeps([56, 1, 2, 19, 5, 54, 8, 9, 6, 10, 11])).then(e => ({
        default: e.default
    }))),
    hc = l.lazy(() => A(() =>
        import ("./Invitation.DRHN0drX.js"), __vite__mapDeps([57, 1, 2, 19, 20, 9, 0, 3, 4, 5, 6, 7, 8, 10, 11]))),
    gc = () => {
        const [e, t] = B.useState(!1);
        return B.useEffect(() => {
            const r = setTimeout(() => {
                t(!0)
            }, 1e4);
            return () => clearTimeout(r)
        }, []), e ? n.jsx("div", {
            className: "min-h-screen flex items-center justify-center",
            children: n.jsxs("div", {
                className: "text-center",
                children: [n.jsx("h2", {
                    className: "text-xl font-semibold text-gray-900 mb-4",
                    children: "Se încarcă prea mult"
                }), n.jsx("p", {
                    className: "text-gray-600 mb-4",
                    children: "Vă rugăm să reîmprospătați pagina."
                }), n.jsx("button", {
                    onClick: () => window.location.reload(),
                    className: "bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90",
                    children: "Reîmprospătează pagina"
                })]
            })
        }) : n.jsx("div", {
            className: "min-h-screen flex items-center justify-center",
            children: n.jsxs("div", {
                className: "flex flex-col items-center space-y-4",
                children: [n.jsx("div", {
                    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                }), n.jsx("p", {
                    className: "text-gray-600",
                    children: "Se încarcă..."
                })]
            })
        })
    };

function vc() {
    const [e, t] = l.useState(null), [r, i] = l.useState(!1), [a, o] = l.useState(!1);
    return l.useEffect(() => {
        const s = zs();
        s && (t(s), i(!0), ks());
        const c = setTimeout(() => {
            o(!0)
        }, 100);
        return () => clearTimeout(c)
    }, []), a ? n.jsx(sn, {
        children: n.jsx(Xo, {
            children: n.jsx(pi, {
                children: n.jsxs("div", {
                    className: "min-h-screen flex flex-col",
                    children: [n.jsx(Fs, {
                        criticalImages: ["/package.png", "/hero.png", "/logo.png", "/mobile-pos.jpg"],
                        criticalFonts: ["https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"]
                    }), n.jsx(Zo, {}), n.jsx(Qo, {}), n.jsx(Ds, {}), n.jsx(Ls, {}), n.jsx("main", {
                        className: "flex-1",
                        children: n.jsx(l.Suspense, {
                            fallback: n.jsx(gc, {}),
                            children: n.jsxs(po, {
                                children: [n.jsx(R, {
                                    path: "/",
                                    component: Vs
                                }), n.jsx(R, {
                                    path: "/services",
                                    component: Us
                                }), n.jsx(R, {
                                    path: "/products",
                                    component: $s
                                }), n.jsx(R, {
                                    path: "/case-studies",
                                    component: Hs
                                }), n.jsx(R, {
                                    path: "/about",
                                    component: Bs
                                }), n.jsx(R, {
                                    path: "/contact",
                                    component: qs
                                }), n.jsx(R, {
                                    path: "/solutions/pos",
                                    component: Gs
                                }), n.jsx(R, {
                                    path: "/solutions/inventory",
                                    component: Ks
                                }), n.jsx(R, {
                                    path: "/solutions/analytics",
                                    component: Ws
                                }), n.jsx(R, {
                                    path: "/solutions/franchise-management",
                                    component: Xs
                                }), n.jsx(R, {
                                    path: "/solutions/equipment",
                                    component: Ys
                                }), n.jsx(R, {
                                    path: "/solutions/equipment/cash-register",
                                    component: cc
                                }), n.jsx(R, {
                                    path: "/solutions/equipment/tablet",
                                    component: lc
                                }), n.jsx(R, {
                                    path: "/solutions/equipment/terminal",
                                    component: uc
                                }), n.jsx(R, {
                                    path: "/coffee-shops",
                                    component: gr
                                }), n.jsx(R, {
                                    path: "/erp-system/coffee-shops",
                                    component: gr
                                }), n.jsx(R, {
                                    path: "/solutions/franchiza",
                                    component: Qs
                                }), n.jsx(R, {
                                    path: "/blog",
                                    component: nc
                                }), n.jsx(R, {
                                    path: "/blog/:id",
                                    component: ac
                                }), n.jsx(R, {
                                    path: "/resources",
                                    component: ic
                                }), n.jsx(R, {
                                    path: "/legal/privacy-policy",
                                    component: ec
                                }), n.jsx(R, {
                                    path: "/legal/terms-and-conditions",
                                    component: tc
                                }), n.jsx(R, {
                                    path: "/glossary",
                                    component: Js
                                }), n.jsx(R, {
                                    path: "/gradients",
                                    component: Zs
                                }), n.jsx(R, {
                                    path: "/partnership",
                                    component: rc
                                }), n.jsx(R, {
                                    path: "/charge-tracking",
                                    component: dc
                                }), n.jsx(R, {
                                    path: "/e-factura",
                                    component: mc
                                }), n.jsx(R, {
                                    path: "/payment",
                                    component: pc
                                }), n.jsx(R, {
                                    path: "/payment-result",
                                    component: at
                                }), n.jsx(R, {
                                    path: "/payment-success",
                                    component: at
                                }), n.jsx(R, {
                                    path: "/payment-cancel",
                                    component: at
                                }), n.jsx(R, {
                                    path: "/order-summary",
                                    component: fc
                                }), n.jsx(R, {
                                    path: "/thank-you",
                                    component: oc
                                }), n.jsx(R, {
                                    path: "/n/:token",
                                    component: hc
                                }), n.jsx(R, {
                                    component: sc
                                })]
                            })
                        })
                    }), n.jsx(rs, {}), e && n.jsx(Is, {
                        open: r,
                        onOpenChange: i,
                        token: e
                    }), n.jsx(Jo, {}), !1]
                })
            })
        })
    }) : n.jsx("div", {
        className: "min-h-screen flex items-center justify-center",
        children: n.jsxs("div", {
            className: "flex flex-col items-center space-y-4",
            children: [n.jsx("div", {
                className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
            }), n.jsx("p", {
                className: "text-gray-600",
                children: "Se încarcă aplicația..."
            })]
        })
    })
}

function yc(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function Ee(e) {
    "@babel/helpers - typeof";
    return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
        return typeof t
    } : function(t) {
        return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }, Ee(e)
}

function xc(e, t) {
    if (Ee(e) != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var i = r.call(e, t);
        if (Ee(i) != "object") return i;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return String(e)
}

function bc(e) {
    var t = xc(e, "string");
    return Ee(t) == "symbol" ? t : t + ""
}

function wc(e, t) {
    for (var r = 0; r < t.length; r++) {
        var i = t[r];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, bc(i.key), i)
    }
}

function Sc(e, t, r) {
    return t && wc(e.prototype, t), Object.defineProperty(e, "prototype", {
        writable: !1
    }), e
}
var cn = [],
    Tc = cn.forEach,
    Cc = cn.slice;

function Ec(e) {
    return Tc.call(Cc.call(arguments, 1), function(t) {
        if (t)
            for (var r in t) e[r] === void 0 && (e[r] = t[r])
    }), e
}
var vr = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,
    jc = function(t, r, i) {
        var a = i || {};
        a.path = a.path || "/";
        var o = encodeURIComponent(r),
            s = "".concat(t, "=").concat(o);
        if (a.maxAge > 0) {
            var c = a.maxAge - 0;
            if (Number.isNaN(c)) throw new Error("maxAge should be a Number");
            s += "; Max-Age=".concat(Math.floor(c))
        }
        if (a.domain) {
            if (!vr.test(a.domain)) throw new TypeError("option domain is invalid");
            s += "; Domain=".concat(a.domain)
        }
        if (a.path) {
            if (!vr.test(a.path)) throw new TypeError("option path is invalid");
            s += "; Path=".concat(a.path)
        }
        if (a.expires) {
            if (typeof a.expires.toUTCString != "function") throw new TypeError("option expires is invalid");
            s += "; Expires=".concat(a.expires.toUTCString())
        }
        if (a.httpOnly && (s += "; HttpOnly"), a.secure && (s += "; Secure"), a.sameSite) {
            var u = typeof a.sameSite == "string" ? a.sameSite.toLowerCase() : a.sameSite;
            switch (u) {
                case !0:
                    s += "; SameSite=Strict";
                    break;
                case "lax":
                    s += "; SameSite=Lax";
                    break;
                case "strict":
                    s += "; SameSite=Strict";
                    break;
                case "none":
                    s += "; SameSite=None";
                    break;
                default:
                    throw new TypeError("option sameSite is invalid")
            }
        }
        return s
    },
    yr = {
        create: function(t, r, i, a) {
            var o = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
                path: "/",
                sameSite: "strict"
            };
            i && (o.expires = new Date, o.expires.setTime(o.expires.getTime() + i * 60 * 1e3)), a && (o.domain = a), document.cookie = jc(t, encodeURIComponent(r), o)
        },
        read: function(t) {
            for (var r = "".concat(t, "="), i = document.cookie.split(";"), a = 0; a < i.length; a++) {
                for (var o = i[a]; o.charAt(0) === " ";) o = o.substring(1, o.length);
                if (o.indexOf(r) === 0) return o.substring(r.length, o.length)
            }
            return null
        },
        remove: function(t) {
            this.create(t, "", -1)
        }
    },
    Pc = {
        name: "cookie",
        lookup: function(t) {
            var r;
            if (t.lookupCookie && typeof document < "u") {
                var i = yr.read(t.lookupCookie);
                i && (r = i)
            }
            return r
        },
        cacheUserLanguage: function(t, r) {
            r.lookupCookie && typeof document < "u" && yr.create(r.lookupCookie, t, r.cookieMinutes, r.cookieDomain, r.cookieOptions)
        }
    },
    Ac = {
        name: "querystring",
        lookup: function(t) {
            var r;
            if (typeof window < "u") {
                var i = window.location.search;
                !window.location.search && window.location.hash && window.location.hash.indexOf("?") > -1 && (i = window.location.hash.substring(window.location.hash.indexOf("?")));
                for (var a = i.substring(1), o = a.split("&"), s = 0; s < o.length; s++) {
                    var c = o[s].indexOf("=");
                    if (c > 0) {
                        var u = o[s].substring(0, c);
                        u === t.lookupQuerystring && (r = o[s].substring(c + 1))
                    }
                }
            }
            return r
        }
    },
    we = null,
    xr = function() {
        if (we !== null) return we;
        try {
            we = window !== "undefined" && window.localStorage !== null;
            var t = "i18next.translate.boo";
            window.localStorage.setItem(t, "foo"), window.localStorage.removeItem(t)
        } catch {
            we = !1
        }
        return we
    },
    _c = {
        name: "localStorage",
        lookup: function(t) {
            var r;
            if (t.lookupLocalStorage && xr()) {
                var i = window.localStorage.getItem(t.lookupLocalStorage);
                i && (r = i)
            }
            return r
        },
        cacheUserLanguage: function(t, r) {
            r.lookupLocalStorage && xr() && window.localStorage.setItem(r.lookupLocalStorage, t)
        }
    },
    Se = null,
    br = function() {
        if (Se !== null) return Se;
        try {
            Se = window !== "undefined" && window.sessionStorage !== null;
            var t = "i18next.translate.boo";
            window.sessionStorage.setItem(t, "foo"), window.sessionStorage.removeItem(t)
        } catch {
            Se = !1
        }
        return Se
    },
    Rc = {
        name: "sessionStorage",
        lookup: function(t) {
            var r;
            if (t.lookupSessionStorage && br()) {
                var i = window.sessionStorage.getItem(t.lookupSessionStorage);
                i && (r = i)
            }
            return r
        },
        cacheUserLanguage: function(t, r) {
            r.lookupSessionStorage && br() && window.sessionStorage.setItem(r.lookupSessionStorage, t)
        }
    },
    Nc = {
        name: "navigator",
        lookup: function(t) {
            var r = [];
            if (typeof navigator < "u") {
                if (navigator.languages)
                    for (var i = 0; i < navigator.languages.length; i++) r.push(navigator.languages[i]);
                navigator.userLanguage && r.push(navigator.userLanguage), navigator.language && r.push(navigator.language)
            }
            return r.length > 0 ? r : void 0
        }
    },
    Ic = {
        name: "htmlTag",
        lookup: function(t) {
            var r, i = t.htmlTag || (typeof document < "u" ? document.documentElement : null);
            return i && typeof i.getAttribute == "function" && (r = i.getAttribute("lang")), r
        }
    },
    Oc = {
        name: "path",
        lookup: function(t) {
            var r;
            if (typeof window < "u") {
                var i = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
                if (i instanceof Array)
                    if (typeof t.lookupFromPathIndex == "number") {
                        if (typeof i[t.lookupFromPathIndex] != "string") return;
                        r = i[t.lookupFromPathIndex].replace("/", "")
                    } else r = i[0].replace("/", "")
            }
            return r
        }
    },
    Mc = {
        name: "subdomain",
        lookup: function(t) {
            var r = typeof t.lookupFromSubdomainIndex == "number" ? t.lookupFromSubdomainIndex + 1 : 1,
                i = typeof window < "u" && window.location && window.location.hostname && window.location.hostname.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);
            if (i) return i[r]
        }
    };

function zc() {
    return {
        order: ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        lookupSessionStorage: "i18nextLng",
        caches: ["localStorage"],
        excludeCacheFor: ["cimode"]
    }
}
var ln = function() {
    function e(t) {
        var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        yc(this, e), this.type = "languageDetector", this.detectors = {}, this.init(t, r)
    }
    return Sc(e, [{
        key: "init",
        value: function(r) {
            var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            this.services = r, this.options = Ec(i, this.options || {}, zc()), this.options.lookupFromUrlIndex && (this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex), this.i18nOptions = a, this.addDetector(Pc), this.addDetector(Ac), this.addDetector(_c), this.addDetector(Rc), this.addDetector(Nc), this.addDetector(Ic), this.addDetector(Oc), this.addDetector(Mc)
        }
    }, {
        key: "addDetector",
        value: function(r) {
            this.detectors[r.name] = r
        }
    }, {
        key: "detect",
        value: function(r) {
            var i = this;
            r || (r = this.options.order);
            var a = [];
            return r.forEach(function(o) {
                if (i.detectors[o]) {
                    var s = i.detectors[o].lookup(i.options);
                    s && typeof s == "string" && (s = [s]), s && (a = a.concat(s))
                }
            }), this.services.languageUtils.getBestMatchFromCodes ? a : a.length > 0 ? a[0] : null
        }
    }, {
        key: "cacheUserLanguage",
        value: function(r, i) {
            var a = this;
            i || (i = this.options.caches), i && (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(r) > -1 || i.forEach(function(o) {
                a.detectors[o] && a.detectors[o].cacheUserLanguage(r, a.options)
            }))
        }
    }]), e
}();
ln.type = "languageDetector";

function wt(e) {
    "@babel/helpers - typeof";
    return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
        return typeof t
    } : function(t) {
        return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }, wt(e)
}
var un = [],
    kc = un.forEach,
    Fc = un.slice;

function St(e) {
    return kc.call(Fc.call(arguments, 1), function(t) {
        if (t)
            for (var r in t) e[r] === void 0 && (e[r] = t[r])
    }), e
}

function dn() {
    return typeof XMLHttpRequest == "function" || (typeof XMLHttpRequest > "u" ? "undefined" : wt(XMLHttpRequest)) === "object"
}

function Dc(e) {
    return !!e && typeof e.then == "function"
}

function Lc(e) {
    return Dc(e) ? e : Promise.resolve(e)
}

function Vc(e) {
    throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')
}
var Tt = {
        exports: {}
    },
    Ie = {
        exports: {}
    },
    wr;

function Uc() {
    return wr || (wr = 1, function(e, t) {
        var r = typeof self < "u" ? self : _n,
            i = function() {
                function o() {
                    this.fetch = !1, this.DOMException = r.DOMException
                }
                return o.prototype = r, new o
            }();
        (function(o) {
            (function(s) {
                var c = {
                    searchParams: "URLSearchParams" in o,
                    iterable: "Symbol" in o && "iterator" in Symbol,
                    blob: "FileReader" in o && "Blob" in o && function() {
                        try {
                            return new Blob, !0
                        } catch {
                            return !1
                        }
                    }(),
                    formData: "FormData" in o,
                    arrayBuffer: "ArrayBuffer" in o
                };

                function u(m) {
                    return m && DataView.prototype.isPrototypeOf(m)
                }
                if (c.arrayBuffer) var d = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
                    p = ArrayBuffer.isView || function(m) {
                        return m && d.indexOf(Object.prototype.toString.call(m)) > -1
                    };

                function f(m) {
                    if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(m)) throw new TypeError("Invalid character in header field name");
                    return m.toLowerCase()
                }

                function g(m) {
                    return typeof m != "string" && (m = String(m)), m
                }

                function v(m) {
                    var h = {
                        next: function() {
                            var E = m.shift();
                            return {
                                done: E === void 0,
                                value: E
                            }
                        }
                    };
                    return c.iterable && (h[Symbol.iterator] = function() {
                        return h
                    }), h
                }

                function x(m) {
                    this.map = {}, m instanceof x ? m.forEach(function(h, E) {
                        this.append(E, h)
                    }, this) : Array.isArray(m) ? m.forEach(function(h) {
                        this.append(h[0], h[1])
                    }, this) : m && Object.getOwnPropertyNames(m).forEach(function(h) {
                        this.append(h, m[h])
                    }, this)
                }
                x.prototype.append = function(m, h) {
                    m = f(m), h = g(h);
                    var E = this.map[m];
                    this.map[m] = E ? E + ", " + h : h
                }, x.prototype.delete = function(m) {
                    delete this.map[f(m)]
                }, x.prototype.get = function(m) {
                    return m = f(m), this.has(m) ? this.map[m] : null
                }, x.prototype.has = function(m) {
                    return this.map.hasOwnProperty(f(m))
                }, x.prototype.set = function(m, h) {
                    this.map[f(m)] = g(h)
                }, x.prototype.forEach = function(m, h) {
                    for (var E in this.map) this.map.hasOwnProperty(E) && m.call(h, this.map[E], E, this)
                }, x.prototype.keys = function() {
                    var m = [];
                    return this.forEach(function(h, E) {
                        m.push(E)
                    }), v(m)
                }, x.prototype.values = function() {
                    var m = [];
                    return this.forEach(function(h) {
                        m.push(h)
                    }), v(m)
                }, x.prototype.entries = function() {
                    var m = [];
                    return this.forEach(function(h, E) {
                        m.push([E, h])
                    }), v(m)
                }, c.iterable && (x.prototype[Symbol.iterator] = x.prototype.entries);

                function b(m) {
                    if (m.bodyUsed) return Promise.reject(new TypeError("Already read"));
                    m.bodyUsed = !0
                }

                function y(m) {
                    return new Promise(function(h, E) {
                        m.onload = function() {
                            h(m.result)
                        }, m.onerror = function() {
                            E(m.error)
                        }
                    })
                }

                function j(m) {
                    var h = new FileReader,
                        E = y(h);
                    return h.readAsArrayBuffer(m), E
                }

                function C(m) {
                    var h = new FileReader,
                        E = y(h);
                    return h.readAsText(m), E
                }

                function w(m) {
                    for (var h = new Uint8Array(m), E = new Array(h.length), F = 0; F < h.length; F++) E[F] = String.fromCharCode(h[F]);
                    return E.join("")
                }

                function T(m) {
                    if (m.slice) return m.slice(0);
                    var h = new Uint8Array(m.byteLength);
                    return h.set(new Uint8Array(m)), h.buffer
                }

                function S() {
                    return this.bodyUsed = !1, this._initBody = function(m) {
                        this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : c.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : c.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : c.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : c.arrayBuffer && c.blob && u(m) ? (this._bodyArrayBuffer = T(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : c.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || p(m)) ? this._bodyArrayBuffer = T(m) : this._bodyText = m = Object.prototype.toString.call(m) : this._bodyText = "", this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : c.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
                    }, c.blob && (this.blob = function() {
                        var m = b(this);
                        if (m) return m;
                        if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                        if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                        if (this._bodyFormData) throw new Error("could not read FormData body as blob");
                        return Promise.resolve(new Blob([this._bodyText]))
                    }, this.arrayBuffer = function() {
                        return this._bodyArrayBuffer ? b(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(j)
                    }), this.text = function() {
                        var m = b(this);
                        if (m) return m;
                        if (this._bodyBlob) return C(this._bodyBlob);
                        if (this._bodyArrayBuffer) return Promise.resolve(w(this._bodyArrayBuffer));
                        if (this._bodyFormData) throw new Error("could not read FormData body as text");
                        return Promise.resolve(this._bodyText)
                    }, c.formData && (this.formData = function() {
                        return this.text().then(_)
                    }), this.json = function() {
                        return this.text().then(JSON.parse)
                    }, this
                }
                var P = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];

                function M(m) {
                    var h = m.toUpperCase();
                    return P.indexOf(h) > -1 ? h : m
                }

                function O(m, h) {
                    h = h || {};
                    var E = h.body;
                    if (m instanceof O) {
                        if (m.bodyUsed) throw new TypeError("Already read");
                        this.url = m.url, this.credentials = m.credentials, h.headers || (this.headers = new x(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !E && m._bodyInit != null && (E = m._bodyInit, m.bodyUsed = !0)
                    } else this.url = String(m);
                    if (this.credentials = h.credentials || this.credentials || "same-origin", (h.headers || !this.headers) && (this.headers = new x(h.headers)), this.method = M(h.method || this.method || "GET"), this.mode = h.mode || this.mode || null, this.signal = h.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && E) throw new TypeError("Body not allowed for GET or HEAD requests");
                    this._initBody(E)
                }
                O.prototype.clone = function() {
                    return new O(this, {
                        body: this._bodyInit
                    })
                };

                function _(m) {
                    var h = new FormData;
                    return m.trim().split("&").forEach(function(E) {
                        if (E) {
                            var F = E.split("="),
                                k = F.shift().replace(/\+/g, " "),
                                N = F.join("=").replace(/\+/g, " ");
                            h.append(decodeURIComponent(k), decodeURIComponent(N))
                        }
                    }), h
                }

                function $(m) {
                    var h = new x,
                        E = m.replace(/\r?\n[\t ]+/g, " ");
                    return E.split(/\r?\n/).forEach(function(F) {
                        var k = F.split(":"),
                            N = k.shift().trim();
                        if (N) {
                            var ae = k.join(":").trim();
                            h.append(N, ae)
                        }
                    }), h
                }
                S.call(O.prototype);

                function D(m, h) {
                    h || (h = {}), this.type = "default", this.status = h.status === void 0 ? 200 : h.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in h ? h.statusText : "OK", this.headers = new x(h.headers), this.url = h.url || "", this._initBody(m)
                }
                S.call(D.prototype), D.prototype.clone = function() {
                    return new D(this._bodyInit, {
                        status: this.status,
                        statusText: this.statusText,
                        headers: new x(this.headers),
                        url: this.url
                    })
                }, D.error = function() {
                    var m = new D(null, {
                        status: 0,
                        statusText: ""
                    });
                    return m.type = "error", m
                };
                var G = [301, 302, 303, 307, 308];
                D.redirect = function(m, h) {
                    if (G.indexOf(h) === -1) throw new RangeError("Invalid status code");
                    return new D(null, {
                        status: h,
                        headers: {
                            location: m
                        }
                    })
                }, s.DOMException = o.DOMException;
                try {
                    new s.DOMException
                } catch {
                    s.DOMException = function(h, E) {
                        this.message = h, this.name = E;
                        var F = Error(h);
                        this.stack = F.stack
                    }, s.DOMException.prototype = Object.create(Error.prototype), s.DOMException.prototype.constructor = s.DOMException
                }

                function J(m, h) {
                    return new Promise(function(E, F) {
                        var k = new O(m, h);
                        if (k.signal && k.signal.aborted) return F(new s.DOMException("Aborted", "AbortError"));
                        var N = new XMLHttpRequest;

                        function ae() {
                            N.abort()
                        }
                        N.onload = function() {
                            var ee = {
                                status: N.status,
                                statusText: N.statusText,
                                headers: $(N.getAllResponseHeaders() || "")
                            };
                            ee.url = "responseURL" in N ? N.responseURL : ee.headers.get("X-Request-URL");
                            var te = "response" in N ? N.response : N.responseText;
                            E(new D(te, ee))
                        }, N.onerror = function() {
                            F(new TypeError("Network request failed"))
                        }, N.ontimeout = function() {
                            F(new TypeError("Network request failed"))
                        }, N.onabort = function() {
                            F(new s.DOMException("Aborted", "AbortError"))
                        }, N.open(k.method, k.url, !0), k.credentials === "include" ? N.withCredentials = !0 : k.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && c.blob && (N.responseType = "blob"), k.headers.forEach(function(ee, te) {
                            N.setRequestHeader(te, ee)
                        }), k.signal && (k.signal.addEventListener("abort", ae), N.onreadystatechange = function() {
                            N.readyState === 4 && k.signal.removeEventListener("abort", ae)
                        }), N.send(typeof k._bodyInit > "u" ? null : k._bodyInit)
                    })
                }
                return J.polyfill = !0, o.fetch || (o.fetch = J, o.Headers = x, o.Request = O, o.Response = D), s.Headers = x, s.Request = O, s.Response = D, s.fetch = J, Object.defineProperty(s, "__esModule", {
                    value: !0
                }), s
            })({})
        })(i), i.fetch.ponyfill = !0, delete i.fetch.polyfill;
        var a = i;
        t = a.fetch, t.default = a.fetch, t.fetch = a.fetch, t.Headers = a.Headers, t.Request = a.Request, t.Response = a.Response, e.exports = t
    }(Ie, Ie.exports)), Ie.exports
}(function(e, t) {
    var r;
    if (typeof fetch == "function" && (typeof globalThis < "u" && globalThis.fetch ? r = globalThis.fetch : typeof window < "u" && window.fetch ? r = window.fetch : r = fetch), typeof Vc < "u" && (typeof window > "u" || typeof window.document > "u")) {
        var i = r || Uc();
        i.default && (i = i.default), t.default = i, e.exports = t.default
    }
})(Tt, Tt.exports);
var mn = Tt.exports;
const pn = Be(mn),
    Sr = aa({
        __proto__: null,
        default: pn
    }, [mn]);

function Ue(e) {
    "@babel/helpers - typeof";
    return Ue = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
        return typeof t
    } : function(t) {
        return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }, Ue(e)
}
var Q;
typeof fetch == "function" && (typeof globalThis < "u" && globalThis.fetch ? Q = globalThis.fetch : typeof window < "u" && window.fetch ? Q = window.fetch : Q = fetch);
var je;
dn() && (typeof globalThis < "u" && globalThis.XMLHttpRequest ? je = globalThis.XMLHttpRequest : typeof window < "u" && window.XMLHttpRequest && (je = window.XMLHttpRequest));
var $e;
typeof ActiveXObject == "function" && (typeof globalThis < "u" && globalThis.ActiveXObject ? $e = globalThis.ActiveXObject : typeof window < "u" && window.ActiveXObject && ($e = window.ActiveXObject));
!Q && Sr && !je && !$e && (Q = pn || Sr);
typeof Q != "function" && (Q = void 0);
var Ct = function(t, r) {
        if (r && Ue(r) === "object") {
            var i = "";
            for (var a in r) i += "&" + encodeURIComponent(a) + "=" + encodeURIComponent(r[a]);
            if (!i) return t;
            t = t + (t.indexOf("?") !== -1 ? "&" : "?") + i.slice(1)
        }
        return t
    },
    Tr = function(t, r, i) {
        Q(t, r).then(function(a) {
            if (!a.ok) return i(a.statusText || "Error", {
                status: a.status
            });
            a.text().then(function(o) {
                i(null, {
                    status: a.status,
                    data: o
                })
            }).catch(i)
        }).catch(i)
    },
    Cr = !1,
    $c = function(t, r, i, a) {
        t.queryStringParams && (r = Ct(r, t.queryStringParams));
        var o = St({}, typeof t.customHeaders == "function" ? t.customHeaders() : t.customHeaders);
        i && (o["Content-Type"] = "application/json");
        var s = typeof t.requestOptions == "function" ? t.requestOptions(i) : t.requestOptions,
            c = St({
                method: i ? "POST" : "GET",
                body: i ? t.stringify(i) : void 0,
                headers: o
            }, Cr ? {} : s);
        try {
            Tr(r, c, a)
        } catch (u) {
            if (!s || Object.keys(s).length === 0 || !u.message || u.message.indexOf("not implemented") < 0) return a(u);
            try {
                Object.keys(s).forEach(function(d) {
                    delete c[d]
                }), Tr(r, c, a), Cr = !0
            } catch (d) {
                a(d)
            }
        }
    },
    Bc = function(t, r, i, a) {
        i && Ue(i) === "object" && (i = Ct("", i).slice(1)), t.queryStringParams && (r = Ct(r, t.queryStringParams));
        try {
            var o;
            je ? o = new je : o = new $e("MSXML2.XMLHTTP.3.0"), o.open(i ? "POST" : "GET", r, 1), t.crossDomain || o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.withCredentials = !!t.withCredentials, i && o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), o.overrideMimeType && o.overrideMimeType("application/json");
            var s = t.customHeaders;
            if (s = typeof s == "function" ? s() : s, s)
                for (var c in s) o.setRequestHeader(c, s[c]);
            o.onreadystatechange = function() {
                o.readyState > 3 && a(o.status >= 400 ? o.statusText : null, {
                    status: o.status,
                    data: o.responseText
                })
            }, o.send(i)
        } catch (u) {
            console && console.log(u)
        }
    },
    qc = function(t, r, i, a) {
        if (typeof i == "function" && (a = i, i = void 0), a = a || function() {}, Q) return $c(t, r, i, a);
        if (dn() || typeof ActiveXObject == "function") return Bc(t, r, i, a);
        a(new Error("No fetch and no xhr implementation found!"))
    };

function Hc(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function Gc(e, t) {
    for (var r = 0; r < t.length; r++) {
        var i = t[r];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
    }
}

function Kc(e, t, r) {
    return t && Gc(e.prototype, t), Object.defineProperty(e, "prototype", {
        writable: !1
    }), e
}

function Wc(e, t, r) {
    return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}
var Xc = function() {
        return {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
            addPath: "/locales/add/{{lng}}/{{ns}}",
            allowMultiLoading: !1,
            parse: function(r) {
                return JSON.parse(r)
            },
            stringify: JSON.stringify,
            parsePayload: function(r, i, a) {
                return Wc({}, i, a || "")
            },
            request: qc,
            reloadInterval: typeof window < "u" ? !1 : 60 * 60 * 1e3,
            customHeaders: {},
            queryStringParams: {},
            crossDomain: !1,
            withCredentials: !1,
            overrideMimeType: !1,
            requestOptions: {
                mode: "cors",
                credentials: "same-origin",
                cache: "default"
            }
        }
    },
    fn = function() {
        function e(t) {
            var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            Hc(this, e), this.services = t, this.options = r, this.allOptions = i, this.type = "backend", this.init(t, r, i)
        }
        return Kc(e, [{
            key: "init",
            value: function(r) {
                var i = this,
                    a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                    o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                this.services = r, this.options = St(a, this.options || {}, Xc()), this.allOptions = o, this.services && this.options.reloadInterval && setInterval(function() {
                    return i.reload()
                }, this.options.reloadInterval)
            }
        }, {
            key: "readMulti",
            value: function(r, i, a) {
                this._readAny(r, r, i, i, a)
            }
        }, {
            key: "read",
            value: function(r, i, a) {
                this._readAny([r], r, [i], i, a)
            }
        }, {
            key: "_readAny",
            value: function(r, i, a, o, s) {
                var c = this,
                    u = this.options.loadPath;
                typeof this.options.loadPath == "function" && (u = this.options.loadPath(r, a)), u = Lc(u), u.then(function(d) {
                    if (!d) return s(null, {});
                    var p = c.services.interpolator.interpolate(d, {
                        lng: r.join("+"),
                        ns: a.join("+")
                    });
                    c.loadUrl(p, s, i, o)
                })
            }
        }, {
            key: "loadUrl",
            value: function(r, i, a, o) {
                var s = this;
                this.options.request(this.options, r, void 0, function(c, u) {
                    if (u && (u.status >= 500 && u.status < 600 || !u.status)) return i("failed loading " + r + "; status code: " + u.status, !0);
                    if (u && u.status >= 400 && u.status < 500) return i("failed loading " + r + "; status code: " + u.status, !1);
                    if (!u && c && c.message && c.message.indexOf("Failed to fetch") > -1) return i("failed loading " + r + ": " + c.message, !0);
                    if (c) return i(c, !1);
                    var d, p;
                    try {
                        typeof u.data == "string" ? d = s.options.parse(u.data, a, o) : d = u.data
                    } catch {
                        p = "failed parsing " + r + " to json"
                    }
                    if (p) return i(p, !1);
                    i(null, d)
                })
            }
        }, {
            key: "create",
            value: function(r, i, a, o, s) {
                var c = this;
                if (this.options.addPath) {
                    typeof r == "string" && (r = [r]);
                    var u = this.options.parsePayload(i, a, o),
                        d = 0,
                        p = [],
                        f = [];
                    r.forEach(function(g) {
                        var v = c.options.addPath;
                        typeof c.options.addPath == "function" && (v = c.options.addPath(g, i));
                        var x = c.services.interpolator.interpolate(v, {
                            lng: g,
                            ns: i
                        });
                        c.options.request(c.options, x, u, function(b, y) {
                            d += 1, p.push(b), f.push(y), d === r.length && s && s(p, f)
                        })
                    })
                }
            }
        }, {
            key: "reload",
            value: function() {
                var r = this,
                    i = this.services,
                    a = i.backendConnector,
                    o = i.languageUtils,
                    s = i.logger,
                    c = a.language;
                if (!(c && c.toLowerCase() === "cimode")) {
                    var u = [],
                        d = function(f) {
                            var g = o.toResolveHierarchy(f);
                            g.forEach(function(v) {
                                u.indexOf(v) < 0 && u.push(v)
                            })
                        };
                    d(c), this.allOptions.preload && this.allOptions.preload.forEach(function(p) {
                        return d(p)
                    }), u.forEach(function(p) {
                        r.allOptions.ns.forEach(function(f) {
                            a.read(p, f, "read", null, null, function(g, v) {
                                g && s.warn("loading namespace ".concat(f, " for language ").concat(p, " failed"), g), !g && v && s.log("loaded namespace ".concat(f, " for language ").concat(p), v), a.loaded("".concat(p, "|").concat(f), g, v)
                            })
                        })
                    })
                }
            }
        }]), e
    }();
fn.type = "backend";
const Yc = {
    en: {
        translation: {
            services: {
                hero: {
                    title: "Transform Your Franchise with FranchiseTech",
                    subtitle: "At FranchiseTech, we understand that franchise owners are driven by the desire for efficiency, growth, and exceptional customer experiences.",
                    cta: "Start Your Journey",
                    contact: "Contact Sales"
                },
                implementationPricing: {
                    title: "Setup and Implementation Services",
                    subtitle: "Transparent pricing for our implementation services",
                    hourlyRate: "€50/hour",
                    description: "Our team of specialists helps you configure and implement FranchiseTech solutions for your business",
                    services: {
                        title: "What We Include in Our Services",
                        items: ["On-site inventory configuration", "Product setup in the system", "Customer data entry", "Staff training and onboarding", "Custom system configuration", "Technical support during implementation"]
                    },
                    cta: "Request Custom Quote",
                    contact: "Speak with a Specialist"
                },
                catalog: {
                    title: "Our Services",
                    subtitle: "Choose from our complete range of implementation and configuration services",
                    info: {
                        title: "Why choose our services?",
                        description: "All our services are offered at transparent prices with complete support and quality guarantee.",
                        transparent: "Transparent Pricing",
                        transparentDesc: "No hidden costs, just clear and fair prices.",
                        fast: "Fast Implementation",
                        fastDesc: "Most services are completed within 1-3 days.",
                        support: "Complete Support",
                        supportDesc: "Dedicated technical assistance during and after implementation."
                    }
                },
                coffee: {
                    title: "Coffee Shop Solutions",
                    description: "Complete management solutions for coffee shops and cafes with integrated modules for seamless operations",
                    features: ["Sistem Integrat de Vânzări", "Real-time Inventory Management", "Customer Loyalty Program", "Staff Scheduling & Management", "Customer Relationship Management", "Financial Analytics & Reporting"]
                },
                restaurant: {
                    title: "Restaurant Management",
                    description: "Comprehensive restaurant solution with table service, kitchen display, and advanced ordering capabilities",
                    features: ["Table Management System", "Kitchen Display System", "Order Tracking & Management", "Menu Management", "Customer Feedback System", "Multi-location Support"]
                },
                fastfood: {
                    title: "Fast Food Solutions",
                    description: "Quick service solutions for fast food restaurants and franchises with streamlined operations",
                    features: ["Quick Order Processing", "Drive-thru Management", "Multi-location Inventory", "Customer Analytics", "Mobile Ordering", "Delivery Integration"]
                },
                retail: {
                    title: "Food Retail Management",
                    description: "Complete solution for convenience stores and food retail businesses with integrated sales system and inventory",
                    features: ["Sistem Avansat de Vânzări", "Inventory Management", "Supplier Management", "Sales Analytics", "Customer Management", "Multi-store Operations"]
                }
            },
            common: {
                company_name: "FranchiseTech",
                learn_more: "Learn More",
                features: "Features",
                why_choose: "De ce să alegi",
                schedule_demo: "Schedule Demo",
                contact_sales: "Contact Sales",
                read_more: "Read More",
                get_started: "Get Started",
                contact_us: "Contact Us",
                our_features: "Our Features",
                benefits: "Benefits",
                testimonials: "Testimonials",
                case_studies: "Case Studies",
                about_us: "About Us",
                skip_to_main: "Skip to main content",
                footer: "Footer"
            },
            products: {
                title: "Products & Equipment",
                description: "High-quality equipment and software solutions for your business. All products come with warranty and professional support.",
                add_to_cart: "Add to Cart",
                buy_now: "Buy Now",
                cart: "Shopping Cart",
                total: "Total",
                checkout: "Checkout",
                order_confirmation: "Order Confirmation",
                email: "Email Address",
                email_placeholder: "your@email.com",
                phone: "Phone Number",
                phone_placeholder: "+40 123 456 789",
                address: "Delivery Address",
                address_placeholder: "Enter your full delivery address",
                cancel: "Cancel",
                confirm_order: "Confirm Order & Pay"
            }
        }
    },
    ro: {
        translation: {
            navigation: {
                dashboard: "Panou Control",
                compliance: "Conformitate",
                costs: "Gestionare Costuri",
                settings: "Setări",
                support: "Suport"
            },
            dashboard: {
                title: "Gestionare Cloud de Nivel Enterprise",
                subtitle: "Soluții Cloud Complet Gestionate cu Infrastructură Germană Conformă GDPR",
                metrics: {
                    uptime: "Timp Funcționare",
                    costs: "Costuri Lunare",
                    compliance: "Scor Conformitate",
                    tickets: "Tichete Deschise"
                },
                actions: {
                    startTrial: "Începe Probă Gratuită",
                    requestDemo: "Solicită Demo",
                    configure: "Configurează",
                    viewDetails: "Vezi Detalii",
                    export: "Exportă Raport"
                }
            },
            services: {
                hosting: {
                    title: "Găzduire",
                    features: ["Servere Dedicat", "Clustere Cloud", "Scalare Automată", "99.99% Timp Funcționare"]
                },
                domain: {
                    title: "Domeniu",
                    features: ["Înregistrare", "Gestionare DNS", "Certificate SSL", "Confidențialitate WHOIS"]
                },
                email: {
                    title: "Email",
                    features: ["Email Business", "Filtrare Spam", "IMAP/POP3", "Acces Webmail"]
                },
                backup: {
                    title: "Backup",
                    features: ["Snapshot-uri Zilnice", "Recuperare Dezastre", "Versionare", "Stocare Criptată"]
                },
                security: {
                    title: "Securitate",
                    features: ["Protecție DDoS", "Firewall-uri", "Monitorizare SIEM", "Testare Penetrație"]
                }
            },
            compliance: {
                title: "Panou Conformitate",
                heatmap: "Harta Conformitate",
                status: "Status",
                lastCheck: "Ultima Verificare",
                nextAudit: "Următorul Audit",
                certificates: {
                    gdpr: "Conform GDPR",
                    german: "Legea Germană de Date",
                    iso: "ISO 27001",
                    soc2: "SOC 2 Type II"
                }
            },
            costs: {
                title: "Gestionare Costuri",
                comparison: "Comparație Costuri",
                forecast: "Prognoză Costuri",
                optimization: "Sugestii Optimizare",
                breakdown: "Detalii Costuri"
            },
            onboarding: {
                process: "          Procesul Nostru de Integrare",
                title: "      Transformă-ți Franciza cu Soluții Complete de Management",
                desc: "                La FranchiseTech, înțelegem că proprietarii de francize sunt motivați de dorința de eficiență, creștere și experiențe excepționale pentru clienți. Soluții de franciză personalizate concepute pentru a îndeplini nevoile specifice ale afacerii tale în multiple industrii"
            },
            pageTitle: "Să Transformăm Împreună Franciza Ta",
            pageSubtitle: "Alătură-te sutelor de proprietari de francize care și-au actualizat deja soluțiile de management cu FranchiseTech",
            trustElements: {
                support: {
                    title: "Suport 24/7",
                    description: "Timp de răspuns rapid cu echipă dedicată de suport"
                },
                security: {
                    title: "Securitate Franciză",
                    description: "Certificat ISO 27001, soluții conforme GDPR"
                },
                clients: {
                    title: "4 Francize",
                    description: "De încredere pentru proprietarii de francize din întreaga lume"
                },
                expert: {
                    title: "Expert Franciză",
                    description: "Peste 2 ani de soluții pentru francize"
                }
            },
            contactInfo: {
                title: "Informații de Contact",
                email: {
                    label: "Email",
                    value: "info@franchisetech.ro"
                },
                phone: {
                    label: "Telefon",
                    value: "+40 729 917 823"
                },
                address: {
                    label: "Adresă",
                    value: `București
România`
                },
                response: {
                    title: "Garanția Răspunsului Rapid",
                    description: "Echipa noastră răspunde de obicei în termen de 24 de ore la toate solicitările"
                }
            },
            form: {
                title: "Trimite-ne un mesaj",
                name: {
                    label: "Nume",
                    placeholder: "Numele tău",
                    error: "Numele trebuie să aibă cel puțin 2 caractere"
                },
                email: {
                    label: "Email",
                    placeholder: "emailul@tău.com",
                    error: "Adresă de email invalidă"
                },
                company: {
                    label: "Companie",
                    placeholder: "Compania ta",
                    error: "Numele companiei trebuie să aibă cel puțin 2 caractere"
                },
                message: {
                    label: "Mesaj",
                    placeholder: "Cum te putem ajuta să-ți transformi afacerea?",
                    error: "Mesajul trebuie să aibă cel puțin 10 caractere"
                },
                submit: "Trimite Mesaj",
                sending: "Se trimite...",
                success: {
                    title: "Mesaj trimis cu succes",
                    description: "Vă vom răspunde în termen de 24 de ore."
                },
                error: {
                    title: "Eroare la trimiterea mesajului",
                    description: "Vă rugăm să încercați din nou sau să ne contactați direct."
                }
            },
            nav: {
                industries: "Industrii",
                modules: "Module",
                resources: "Resurse",
                solutions: "Soluțiile Noastre",
                about: "Despre Noi",
                manufacturing: {
                    title: "Cafenele",
                    description: "Gestionarea completă a cafenelelor cu sistem de vânzări, planificarea producției și controlul calității"
                },
                estate: {
                    title: "Restaurante",
                    description: "Soluție completă de gestionare a restaurantelor pentru serviciu la masă, întreținere și portaluri pentru clienți"
                },
                retail: {
                    title: "Fast Food",
                    description: "Soluții integrate de vânzări, inventar și e-commerce pentru fast food modern"
                },
                services: {
                    title: "Retail Alimentar",
                    description: "Gestionarea proiectelor și urmărirea serviciilor pentru magazinele alimentare"
                },
                construction: {
                    title: "Brutărie",
                    description: "Estimarea costurilor proiectelor, urmărirea materialelor și conformitatea cu reglementările"
                },
                healthcare: {
                    title: "Catering",
                    description: "Sisteme de gestionare a clienților și urmărirea inventarului pentru catering"
                },
                education: {
                    title: "Servicii",
                    description: "Informații despre clienți și gestionarea resurselor pentru servicii"
                }
            },
            menu: {
                crm: "CRM",
                sales: "Vânzări",
                inventory: "Inventar",
                manufacturing: "Producție",
                accounting: "Contabilitate",
                project_management: "Gestionarea Proiectelor",
                hr: "HR & Recrutare",
                ecommerce: "Website & E-commerce",
                pos: "Sistem de Vânzări",
                field_service: "Servicii Teren",
                marketing: "Automatizare Marketing"
            },
            common: {
                company_name: "FranchiseTech",
                learn_more: "Află Mai Multe",
                features: "Caracteristici",
                why_choose: "De Ce Să Ne Alegi",
                market_features: "Caracteristici de Piață",
                schedule_demo: "Programează Demo",
                contact_sales: "Contactează Vânzări",
                read_more: "Citește Mai Multe",
                get_started: "Începe Acum",
                contact_us: "Contactează-ne",
                our_features: "Caracteristicile Noastre",
                benefits: "Beneficii",
                testimonials: "Testimoniale",
                case_studies: "Studii de Caz",
                about_us: "Despre Noi"
            },
            products: {
                title: "Produse și Echipamente",
                description: "Echipamente de înaltă calitate și soluții software pentru afacerea ta. Toate produsele vin cu garanție și suport profesional.",
                add_to_cart: "Adaugă în Coș",
                buy_now: "Cumpără Acum",
                cart: "Coș de Cumpărături",
                total: "Total",
                checkout: "Finalizează Comanda",
                order_confirmation: "Confirmarea Comenzii",
                email: "Adresa de Email",
                email_placeholder: "emailul@tău.com",
                phone: "Numărul de Telefon",
                phone_placeholder: "+40 123 456 789",
                address: "Adresa de Livrare",
                address_placeholder: "Introdu adresa completă de livrare",
                cancel: "Anulează",
                confirm_order: "Confirmă Comanda și Plătește"
            },
            contact: {
                sales: "Contactează Vânzări",
                title: "Contactează-ne",
                subtitle: "Ia legătura cu echipa noastră",
                form: {
                    name: "Numele Tău",
                    email: "Adresa de Email",
                    message: "Mesaj",
                    submit: "Trimite Mesaj"
                }
            },
            industries: {
                manufacturing: {
                    title: "Enterprise Manufacturing Suite",
                    subtitle: "Advanced manufacturing solutions tailored for modern industries",
                    description: "Complete manufacturing management system with integrated MRP, real-time planning, and quality control",
                    badge: "Manufacturing Excellence",
                    features: {
                        title: "Key Features",
                        planning: {
                            title: "Production Planning",
                            description: "Advanced MRP system with real-time production scheduling"
                        },
                        quality: {
                            title: "Quality Control",
                            description: "Comprehensive quality management and testing protocols"
                        },
                        supply: {
                            title: "Supply Chain",
                            description: "End-to-end supply chain visibility and optimization"
                        },
                        cost: {
                            title: "Cost Management",
                            description: "Detailed cost tracking and financial analytics"
                        },
                        compliance: {
                            title: "Compliance",
                            description: "Automated compliance with industry standards"
                        },
                        documents: {
                            title: "E-Document Integration",
                            description: "Seamless integration with Romanian e-Factura system"
                        }
                    },
                    romania_specific: {
                        title: "Romanian Market Features",
                        features: {
                            efactura: "E-Factura Compliance and Integration",
                            fiscal: "Romanian Fiscal Code Management",
                            supply_chain: "Local Supply Chain Optimization",
                            eu_export: "EU Export Documentation",
                            labor: "Romanian Labor Law Compliance",
                            inventory: "Regional Inventory Management"
                        }
                    }
                },
                healthcare: {
                    badge: "Soluții pentru Sănătate",
                    title: "Soluții Complete pentru Sănătate",
                    subtitle: "Sisteme avansate de management pentru clinici, spitale și centre medicale din România",
                    features: {
                        patient: {
                            title: "Gestionarea Pacienților",
                            description: "Sistem complet de gestionare a dosarelor medicale și programărilor pacienților"
                        },
                        inventory: {
                            title: "Gestionarea Stocurilor Medicale",
                            description: "Controlul inventarului farmaceutic și al echipamentelor medicale"
                        },
                        billing: {
                            title: "Facturare Medicală",
                            description: "Sistem de facturare integrat cu CNAS și asigurări private"
                        },
                        telemedicine: {
                            title: "Telemedicină",
                            description: "Platformă pentru consultații online și monitorizare la distanță"
                        },
                        compliance: {
                            title: "Conformitate Medicală",
                            description: "Conformitate cu reglementările ANM și CNAS din România"
                        },
                        analytics: {
                            title: "Raportare și Analiză",
                            description: "Rapoarte detaliate pentru managementul clinic și analiza performanței"
                        }
                    },
                    romania_specific: {
                        title: "Caracteristici Specifice pentru România",
                        features: {
                            regulations: "Conformitate cu reglementările ANM (Agenția Națională a Medicamentului)",
                            cnas: "Integrare cu sistemul CNAS pentru facturare automată",
                            prescription: "Gestionarea rețetelor electronice conform legislației române",
                            documentation: "Documentație medicală conform standardelor românești",
                            network: "Integrare cu rețeaua națională de sănătate",
                            coding: "Codificare ICD-10 pentru diagnosticare și raportare"
                        }
                    }
                }
            },
            home: {
                hero: {
                    title: "Sistem Inovator de Gestiune pentru Cafenele în Cloud",
                    subtitle: "Soluții avansate dedicate cafenelelor și afacerilor de cafea. Platformă modernă pentru management complet.",
                    value_prop: "40% reducere costuri, 60% eficiență în 3 luni. 50€/lună .",
                    transform: "Transformă Cafeneaua Ta",
                    unlock_growth: "Dezblochează creșterea fără precedent cu suite-ul nostru de soluții avansate de gestionare a cafenelelor.",
                    why_choose: "De Ce Proprietarii de Cafenele de Top Aleg",
                    company_exp: "Experimentează fuziunea perfectă între fiabilitatea de nivel franciză și inovația modernă.",
                    platform_evolves: "Platforma noastră evoluează cu ambițiile tale, oferind fundația pentru creșterea sustenabilă a francizei și excelența digitală.",
                    cta: "Începe Gratuit Acum",
                    competitive_advantage: "De ce să alegi FranchiseTech în loc de soluțiile tradiționale?",
                    vs_competitors: {
                        title: "Comparație cu Competitorii",
                        subtitle: "De ce FranchiseTech este alegerea superioară pentru francizele tale",
                        advantages: {
                            all_in_one: {
                                title: "All-in-One vs 5 Aplicații Separate",
                                description: "Soluții separate pentru facturare + e-facturare + inventar + vânzări + analiză = 5 abonamente, 5 interfețe, 5 probleme"
                            },
                            cost_savings: {
                                title: "Economii de 40% vs Competitorii",
                                description: "În loc de 5 abonamente separate, un singur abonament care include totul. Economisește 2000-5000 RON/lună"
                            },
                            modern_ui: {
                                title: "Interfață Modernă vs Sisteme Învechite",
                                description: "UI/UX modern vs interfețele complicate și învechite ale soluțiilor tradiționale"
                            },
                            franchise_focused: {
                                title: "Specializat pentru Francize vs Soluții Generice",
                                description: "Construit specific pentru cafenele, restaurante și hospitality vs soluții generice care nu se adaptează"
                            },
                            cloud_native: {
                                title: "Cloud-Native vs Sisteme On-Premise",
                                description: "Acces din orice loc, actualizări automate vs instalări complicate și mentenanță costisitoare"
                            },
                            support: {
                                title: "Suport Dedicat vs Suport Generici",
                                description: "Echipă dedicată pentru francize vs suport generic pentru toate tipurile de afaceri"
                            }
                        }
                    }
                },
                features: {
                    why_choose: "De Ce Francizele Aleg FranchiseTech",
                    scalable: {
                        title: "All-in-One vs 5 Aplicații Separate",
                        description: "Înlocuiește 5 aplicații separate cu o singură platformă. 5 abonamente → 1 abonament."
                    },
                    integration: {
                        title: "Integrare Perfectă vs Sisteme Separate",
                        description: "Toate modulele se integrează perfect vs sincronizări complicate între sisteme separate."
                    },
                    support: {
                        title: "Suport Dedicat pentru Francize",
                        description: "Echipă specializată în francize vs suport generic pentru toate tipurile de afaceri."
                    }
                }
            },
            button: {
                demo: "Programează Demo",
                learn_more: "Află Mai Multe",
                contact_sales: "Contactează Vânzări",
                get_started: "Începe Acum",
                submit: "Trimite",
                send: "Trimite",
                view_more: "Vezi Mai Multe",
                try_now: "Încearcă Acum"
            },
            language: {
                select: "Select Language",
                english: "English",
                romanian: "Romanian"
            },
            gradients: {
                customizer: {
                    title: "Gradient Customizer",
                    page_title: "Gradient Customization Toolkit",
                    page_description: "Create beautiful, customized gradients for your enterprise application",
                    preset: "Preset",
                    select_preset: "Select a preset",
                    start_color: "Start Color",
                    end_color: "End Color",
                    direction: "Direction",
                    preview: "Gradient Preview",
                    copy_classes: "Copy Gradient Classes"
                },
                directions: {
                    right: "Right",
                    bottom_right: "Bottom Right",
                    top_right: "Top Right",
                    bottom: "Bottom"
                }
            },
            glossary: {
                title: "Industry Terminology Glossary",
                description: "Comprehensive guide to industry-specific terms and definitions",
                search_placeholder: "Search terms...",
                all_industries: "All Industries",
                example: "Example",
                no_results: "No terms found"
            },
            erp: {
                implementation_milestones: [{
                    id: "kick-off-meeting",
                    duration: "3-5 days",
                    title: "Kick-off Meeting",
                    description: "Initial strategic consultation to define project scope and objectives",
                    note: "Duration may vary based on project complexity",
                    category: "initial"
                }, {
                    id: "requirements-analysis",
                    duration: "5-7 days",
                    title: "Requirements Analysis",
                    description: "Comprehensive assessment of business needs and system landscape",
                    note: "Complexity of business processes impacts timeline",
                    category: "planning"
                }, {
                    id: "solution-design",
                    duration: "5-7 days",
                    title: "Solution Design",
                    description: "Architectural planning and initial ERP system configuration",
                    note: "Custom requirements may extend design phase",
                    category: "design"
                }, {
                    id: "implementation",
                    duration: "10-14 days",
                    title: "Implementation Phase",
                    description: "System configuration, data migration, and custom development",
                    note: "Varies significantly with system complexity and customization needs",
                    category: "development"
                }, {
                    id: "testing",
                    duration: "3-5 days",
                    title: "Comprehensive Testing",
                    description: "System validation across functional and performance dimensions",
                    note: "Depth of testing depends on system intricacy",
                    category: "validation"
                }, {
                    id: "training",
                    duration: "2-3 days",
                    title: "User Training",
                    description: "Comprehensive training program for end-users and administrators",
                    note: "Tailored to organizational size and system complexity",
                    category: "enablement"
                }, {
                    id: "go-live",
                    duration: "2-3 days",
                    title: "Go-Live and Transition",
                    description: "Managed system deployment and initial support period",
                    note: "Deployment complexity impacts timeline",
                    category: "deployment"
                }]
            },
            navigation: {
                titles: {
                    Solutions: "Soluții",
                    Resources: "Resurse"
                },
                items: {
                    Resources: [{
                        title: "Blog",
                        href: "/blog",
                        description: "Ghiduri, sfaturi și ultimele tendințe în managementul cafenelelor și restauranter"
                    }, {
                        title: "Parteneriat",
                        href: "/partnership",
                        description: "Devino partener FranchiseTech și construiește o afacere de succes în tehnologie"
                    }, {
                        title: "Servicii de Implementare",
                        href: "/services",
                        description: "Alege din gama noastră completă de servicii de implementare și configurare"
                    }],
                    Solutions: [{
                        title: "Sistem de Vânzări",
                        href: "/solutions/pos",
                        description: "Sistem rapid, intuitiv cu gestionarea meselor și facturi separate pentru francize"
                    }, {
                        title: "Gestionarea Stocurilor",
                        href: "/solutions/inventory",
                        description: "Urmărirea stocurilor în timp real și reordonare automată pentru operațiunile de franciză"
                    }, {
                        title: "Franciză & Rețele",
                        href: "/solutions/franchiza",
                        description: "Dashboard centralizat pentru managementul rețelelor de franciză cu utilizatori nelimitați"
                    }, {
                        title: "Echipamente și Tehnologie",
                        href: "/products",
                        description: "Soluții hardware integrate și suport tehnologic pentru francize"
                    }]
                }
            },
            home: {
                comparison: {
                    subtitle: "De ce FranchiseTech este alegerea superioară față de soluțiile tradiționale",
                    traditional: {
                        title: "Soluții Separate = 5 Probleme",
                        items: ["5 Abonamente Separate: facturare + e-facturare + inventar + vânzări + analiză.", "5 Interfețe Diferite: Fiecare sistem are propria interfață, necesitând training pentru fiecare aplicație.", "Sincronizare Complicată: Datele nu se sincronizează automat între sisteme, necesitând export/import manual.", "Costuri Ridicate: 5 abonamente lunare = 2000-5000 RON/lună vs 1 abonament FranchiseTech.", "Suport Fragmentat: Fiecare furnizor oferă suport doar pentru propriul sistem.", "Interfețe Învechite: UI/UX din anii 2000 vs interfața modernă FranchiseTech.", "Instalări Complicate: Sisteme on-premise vs cloud-native FranchiseTech.", "Actualizări Costisitoare: Versiuni noi necesită reinstalare vs actualizări automate.", "Lipsa Integrării: Fiecare sistem funcționează independent vs integrare perfectă.", "Training Extensiv: Personalul trebuie să învețe 5 sisteme vs 1 platformă intuitivă.", "Backup-uri Separate: Fiecare sistem are propriul backup vs backup centralizat.", "Facturare Separată: 5 facturi lunare vs 1 factură simplă FranchiseTech."]
                    },
                    ai: {
                        title: "FranchiseTech: 1 Platformă, Toate Funcțiile, 0 Complicații",
                        items: ["1 Abonament, Toate Funcțiile: vânzări + facturare + e-facturare + inventar + analiză într-o singură platformă.", "Interfață Modernă și Intuitivă: UI/UX din 2024 vs interfețele din anii 2000 ale competitorilor.", "Integrare Perfectă: Toate modulele se sincronizează automat, fără export/import manual.", "Economii de 40%: 1 abonament vs 5 abonamente separate (2000-5000 RON economii/lună).", "Suport Dedicat pentru Francize: Echipă specializată vs suport generic pentru toate tipurile de afaceri.", "Cloud-Native: Acces din orice loc, actualizări automate vs instalări complicate.", "Specializat pentru Francize: Construit specific pentru cafenele, restaurante și hospitality.", "Training Minim: Interfață intuitivă vs training extensiv pentru 5 sisteme diferite.", "Backup Centralizat: Toate datele într-un singur loc vs backup-uri separate pentru fiecare sistem.", "Facturare Simplă: 1 factură lunară vs 5 facturi separate de la diferiți furnizori."]
                    }
                },
                features: {
                    scalable: {
                        title: "Scalabilitate Infinită",
                        description: "Arhitectură viitor-proof care crește cu ambițiile tale. Scalează de la startup la enterprise fără dureri de creștere."
                    },
                    integration: {
                        title: "Integrare Perfectă",
                        description: "Conectează fără probleme întregul ecosistem digital. Operațiuni unificate pe toate platformele și sistemele."
                    },
                    support: {
                        title: "Suport Elite 24/7",
                        description: "Asistență expertă la degetul tău. Echipa noastră dedicată îți asigură succesul non-stop."
                    }
                },
                hero: {
                    title: "Sistem Inovator de Gestiune pentru Cafenele în Cloud",
                    subtitle: "Soluții avansate dedicate cafenelelor și afacerilor de cafea. Platformă modernă pentru management complet.",
                    value_prop: "40% reducere costuri, 60% eficiență în 3 luni. 50€/lună .",
                    cta: "Începe Gratuit Acum"
                },
                steps: {
                    manage: {
                        title: "Gestionează",
                        description: "Optimizează operațiunile cu soluțiile integrate de management pentru eficiență maximă"
                    },
                    automate: {
                        title: "Automatizează",
                        description: "Îmbunătățește marketingul și automatizează procesele pentru acoperire și angajament optim"
                    },
                    succeed: {
                        title: "Reușește",
                        description: "Atinge obiectivele de business cu metrici de succes și creștere sustenabilă"
                    }
                }
            },
            services: {
                hero: {
                    title: "Transformă-ți Franciza cu FranchiseTech",
                    subtitle: "La FranchiseTech, înțelegem că proprietarii de francize sunt motivați de dorința de eficiență, creștere și experiențe excepționale pentru clienți.",
                    cta: "Începe Călătoria Ta",
                    contact: "Contactează Vânzări"
                },
                implementationPricing: {
                    title: "Servicii de Configurare și Implementare",
                    subtitle: "Prețuri transparente pentru serviciile noastre de implementare",
                    hourlyRate: "€50/oră",
                    description: "Echipa noastră de specialiști vă ajută să configurați și să implementați soluțiile FranchiseTech pentru afacerea dumneavoastră",
                    services: {
                        title: "Ce Includem în Serviciile Noastre",
                        items: ["Configurarea inventarului la locația dumneavoastră", "Setarea produselor în sistem", "Introducerea datelor clienților", "Instruirea echipei de lucru", "Configurarea personalizată a sistemului", "Suport tehnic în timpul implementării"]
                    },
                    cta: "Solicită Ofertă Personalizată",
                    contact: "Discută cu un Specialist"
                },
                catalog: {
                    title: "Serviciile Noastre",
                    subtitle: "Alege din gama noastră completă de servicii de implementare și configurare",
                    info: {
                        title: "De ce să alegi serviciile noastre?",
                        description: "Toate serviciile noastre sunt oferite la prețuri transparente cu suport complet și garanție de calitate.",
                        transparent: "Prețuri Transparente",
                        transparentDesc: "Fără costuri ascunse, doar prețuri clare și corecte.",
                        fast: "Implementare Rapidă",
                        fastDesc: "Majoritatea serviciilor sunt finalizate în 1-3 zile.",
                        support: "Suport Complet",
                        supportDesc: "Asistență tehnică dedicată în timpul și după implementare."
                    }
                },
                features: {
                    title: "Caracteristici Cheie",
                    subtitle: "Suita noastră comprehensivă de caracteristici este concepută să nu doar să îndeplinească dorințele tale, ci să le transforme în rezultate tangibile.",
                    project_management: {
                        title: "Gestionarea Proiectelor",
                        desire: "Realizează execuția fără probleme a proiectelor",
                        outcome: "Folosește diagrame Gantt și vizualizări Kanban pentru vizualizarea clară a sarcinilor și urmărirea progresului, asigurând finalizarea proiectelor la timp și în buget"
                    },
                    crm: {
                        title: "Gestionarea Relațiilor cu Clienții (CRM)",
                        desire: "Construiește relații durabile cu clienții",
                        outcome: "Captează și îngrijește lead-urile eficient, îmbunătățind ratele de conversie și menținând înregistrări detaliate ale interacțiunilor pentru a ridica livrarea serviciilor"
                    },
                    billing: {
                        title: "Facturare și Invoicing",
                        desire: "Simplifică procesele financiare",
                        outcome: "Automatizează facturarea direct din proiecte, asigurând plăți la timp și reducând sarcinile administrative cu opțiuni de facturare recurentă"
                    },
                    communication: {
                        title: "Instrumente de Comunicare Integrate",
                        desire: "Stimulează colaborarea între echipe",
                        outcome: "Permite comunicarea în timp real prin mesagerie integrată și dashboard-uri, asigurând că toată lumea este aliniată și informată"
                    },
                    agreements: {
                        title: "Gestionarea Acordurilor de Servicii",
                        desire: "Optimizează operațiunile de servicii",
                        outcome: "Gestionează eficient acordurile de servicii, simplificând procesele de urmărire și reînnoire pentru un flux operațional îmbunătățit"
                    },
                    mobile: {
                        title: "Accesibilitate Mobilă",
                        desire: "Gestionează-ți business-ul în mișcare",
                        outcome: "Accesează toate caracteristicile de pe dispozitive mobile, îți oferă puterea de a supraveghea operațiunile oricând, oriunde"
                    },
                    workflows: {
                        title: "Fluxuri de Lucru Personalizabile",
                        desire: "Adaptează procesele la nevoile tale",
                        outcome: "Automatizează sarcinile repetitive cu fluxuri de lucru personalizabile care îmbunătățesc eficiența în toate departamentele"
                    },
                    analytics: {
                        title: "Rapoartele și Analiza",
                        desire: "Ia decizii informate bazate pe date",
                        outcome: "Folosește instrumentele de analiză integrate pentru a monitoriza metricile de performanță, permițând luarea deciziilor strategice pentru creșterea sustenabilă"
                    }
                },
                benefits: {
                    title: "De Ce Să Alegi FranchiseTech?",
                    items: ["Soluție All-in-One pentru Francize: Integrează multiple funcții de franciză într-o singură platformă, eliminând dificultatea gestionării sistemelor disparate", "Design Modular: Selectează doar aplicațiile de care ai nevoie, creând o soluție personalizată care se aliniază cu obiectivele specifice ale francizei tale fără costuri inutile", "Scalabilitate: Pe măsură ce franciza ta crește, scalează ușor operațiunile cu soluția noastră cloud care se adaptează la cerințele în creștere", "Experiență Îmbunătățită pentru Clienți: Îmbunătățește interacțiunile cu clienții prin instrumente CRM eficiente și portaluri self-service care stimulează loialitatea și satisfacția", "Gestionarea Financiară Îmbunătățită: Simplifică procesele de facturare cu caracteristici integrate care asigură plăți la timp și raportare financiară precisă"]
                },
                cta: {
                    title: "Gata să Transformi Franciza Ta?",
                    subtitle: "Experimentează puterea transformatoare a FranchiseTech astăzi.",
                    button: "Începe Acum"
                }
            },
            manufacturing: {
                seo: {
                    title: "Soluții de Gestionare a Francizelor | Software pentru Cafenele și Restaurante",
                    description: "Transformă operațiunile francizei tale cu soluțiile noastre de management alimentate de AI. Caracteristici includ sisteme POS, gestionarea stocurilor și analiza clienților.",
                    keywords: "software franciză, gestionarea cafenelelor, POS restaurant, soluții franciză, gestionarea stocurilor, analiza clienților"
                },
                enterpriseBadge: "Gestionarea Francizelor",
                hero: {
                    title: "Soluții Inteligente pentru Francize în Ospitalitatea Modernă",
                    subtitle: "Transformă operațiunile francizei tale cu platforma noastră alimentată de AI concepută pentru excelența în ospitalitate în era digitală.",
                    scheduleDemo: "Programează Demo",
                    contactSales: "Contactează Vânzări"
                },
                testimonials: {
                    title: "Ce Spun Clienții Noștri",
                    clients: [{
                        name: "Sherif Abdala",
                        company: "Gourmet coffee SRL",
                        rating: 5,
                        text: "Acest software a revoluționat complet modul în care gestionăm cafeneaua noastră. Am redus timpul de producție cu 50% și am dublat tranzacțiile închise în ultimele 6 luni!",
                        image: "https://res.cloudinary.com/do3dahfvh/image/upload/v1731747105/ttt1fmtpdnxfv3gagevm.png"
                    }]
                },
                metrics: {
                    setupTime: "Timp Configurare",
                    setupTimeValue: "2 Zile",
                    cost: "Cost",
                    costValue: "50 €",
                    efficiency: "Creștere Eficiență",
                    efficiencyValue: "70%"
                },
                features: {
                    realTime: {
                        title: "Monitorizare în Timp Real a Operațiunilor",
                        description: "Actualizări live pentru fiecare etapă a procesului de producție.",
                        benefit: "Transparență îmbunătățită și eficiență operațională"
                    },
                    automatedWorkOrders: {
                        title: "Comenzi de Lucru Automatizate",
                        description: "Programare inteligentă și prioritizarea sarcinilor de producție.",
                        benefit: "Flux de lucru îmbunătățit și timp de nefuncționare redus"
                    },
                    inventoryManagement: {
                        title: "Gestionarea Stocurilor",
                        description: "Reaprovizionare automată a stocurilor și scanare coduri de bare.",
                        benefit: "Erori minimizate și niveluri optime de stoc"
                    },
                    bom: {
                        title: "Lista de Materiale (BoM)",
                        description: "Configurații complexe de produse cu BoM-uri multi-nivel.",
                        benefit: "Stocuri optimizate și deșeuri reduse"
                    },
                    qualityControl: {
                        title: "Instrumente de Control al Calității",
                        description: "Verificări dedicate ale calității pe tot parcursul producției.",
                        benefit: "Asigurarea calității consistente a produselor"
                    }
                },
                advantages: {
                    comprehensiveIntegration: {
                        title: "Integrare Comprehensivă",
                        description: "Conectează fără probleme producția, stocurile, vânzările și contabilitatea într-o singură platformă pentru informații în timp real și operațiuni optimizate."
                    },
                    customizationFlexibility: {
                        title: "Personalizare și Flexibilitate",
                        description: "Designul modular permite întreprinderilor să adapteze software-ul la nevoile lor specifice, susținând cerințele operaționale unice și standardele industriale."
                    },
                    costEffectiveSolution: {
                        title: "Soluție Cost-Eficientă",
                        description: "Model de prețuri accesibil conceput pentru întreprinderi de toate dimensiunile, oferind caracteristici de nivel enterprise fără costurile tradiționale ridicate."
                    },
                    regulatoryCompliance: {
                        title: "Regulatory Compliance",
                        description: "Built-in compliance features and automated reporting tools to meet industry standards and regulatory requirements."
                    }
                },
                operationalBenefits: {
                    enhancedVisibility: {
                        title: "Enhanced Visibility",
                        description: "Real-time data access for informed decision-making on inventory, production stages, and order status."
                    },
                    costOptimization: {
                        title: "Cost Optimization",
                        description: "Smart resource allocation and integrated quality management to minimize waste and improve utilization."
                    },
                    increasedProductivity: {
                        title: "Increased Productivity",
                        description: "Automated workflows and intelligent scheduling driving significant efficiency gains across operations."
                    }
                },
                sections: {
                    keyAdvantages: "Key Platform Advantages",
                    enterpriseFeatures: "Enterprise Manufacturing Features",
                    operationalImpact: "Operational Impact",
                    feature: "Feature",
                    description: "Description",
                    benefits: "Benefits"
                }
            },
            realEstate: {
                seo: {
                    title: "Advanced Real Estate Management Solutions | Property Management Software",
                    description: "Comprehensive real estate solutions with AI-powered features for property management, automated billing, and market analytics.",
                    keywords: "real estate software, property management, rental management, real estate CRM, property solutions"
                },
                hero: {
                    badge: "Next-Gen Real Estate Solutions",
                    title: "Advanced Real Estate Management",
                    subtitle: "Comprehensive real estate solutions with AI-powered features and seamless integrations.",
                    scheduleDemo: "Schedule Demo",
                    becomePartner: "Become Partner"
                },
                features: {
                    title: "Core Features",
                    list: [{
                        title: "Property Management 🏢",
                        description: "Complete portfolio management and administration",
                        features: ["Property Units Tracking", "Tenant Management", "Occupancy Reports", "Contracts & Documents", "Project Management"]
                    }, {
                        title: "Project Tracking 📋",
                        description: "Comprehensive property administration",
                        features: ["Project Monitoring", "Unit Records", "Customization Options", "Contract Management"]
                    }, {
                        title: "Sales & Rentals 🤝",
                        description: "Sales and rental administration",
                        features: ["Contract Generation", "Renewal Tracking", "Document Management", "Maintenance"]
                    }, {
                        title: "Property Maintenance 🔧",
                        description: "Building maintenance management",
                        features: ["Ticket System", "Vendor Management", "Scheduled Maintenance", "Utilities"]
                    }, {
                        title: "Utilities & Billing 💰",
                        description: "Utility cost management",
                        features: ["Meter Reading", "Automated Billing", "Custom Rates", "Financial Reports"]
                    }, {
                        title: "CRM & Clients 👥",
                        description: "Customer relationship management",
                        features: ["Client Profiles", "Interaction History", "Tasks & Follow-ups", "Automated Communication"]
                    }]
                },
                advancedFeatures: {
                    title: "Advanced Features & Integrations",
                    list: [{
                        title: "Mobile App",
                        description: "Native mobile application for property managers, agents, and tenants with real-time updates",
                        features: ["Real-time notifications", "Document access on-the-go", "Mobile maintenance requests", "Property viewing scheduler"],
                        icon: "Smartphone"
                    }, {
                        title: "AI/ML Integration",
                        description: "Advanced analytics and automation powered by artificial intelligence",
                        features: ["Predictive rent pricing", "Smart maintenance scheduling", "Automated contract processing", "Market trend analysis"],
                        icon: "Brain"
                    }, {
                        title: "SEO Optimization",
                        description: "Enhanced visibility for property listings on search engines",
                        features: ["Automated meta descriptions", "SEO-optimized property pages", "Local SEO optimization", "Performance analytics"],
                        icon: "Search"
                    }, {
                        title: "Payment Integration",
                        description: "Seamless integration with Romanian payment processors",
                        features: ["PayU integration", "Netopia support", "Automated invoicing", "Payment tracking"],
                        icon: "CreditCard"
                    }, {
                        title: "Smart Notifications",
                        description: "Automated communication system for all stakeholders",
                        features: ["Email notifications", "SMS alerts", "Due date reminders", "Custom notification rules"],
                        icon: "Bell"
                    }, {
                        title: "CRM System",
                        description: "Comprehensive client relationship management",
                        features: ["Client interaction tracking", "Lead management", "Task automation", "Performance analytics"],
                        icon: "Users"
                    }, {
                        title: "Platform Integration",
                        description: "Sync with major Romanian real estate platforms",
                        features: ["Sincronizare Immobiliare.ro", "Integrare OLX.ro", "Actualizări automate listări", "Analitică cross-platform"],
                        icon: "Share2"
                    }, {
                        title: "Marketing Tools",
                        description: "Integrated marketing and advertising solutions",
                        features: ["Integrare Facebook Ads", "Management Google Ads", "Analitică campanii", "Optimizare automată anunțuri"],
                        icon: "Megaphone"
                    }, {
                        title: "Accounting Integration",
                        description: "Seamless financial management and reporting",
                        features: ["Export contabilitate Saga", "Integrare E-factură", "Reconcilieri automate", "Raportare financiară", "Integrare curs BNR 💶"],
                        icon: "Calculator"
                    }]
                },
                testimonials: {
                    title: "What Our Clients Say",
                    clients: [{
                        name: "Costel Ciobanu",
                        company: "Coda Vinci SRL",
                        rating: 5,
                        text: "This software has completely revolutionized how we manage our real estate portfolio. We've reduced document processing time by 70% and doubled transactions closed in the last 6 months!",
                        image: "https://res.cloudinary.com/..."
                    }, {
                        name: "Grigore Anica",
                        company: "BREC Consulting",
                        rating: 5,
                        text: "As a real estate consultant, I need precise tools. This platform provided exactly what I needed - client management to detailed market analyses. Client feedback is exceptional!",
                        image: "https://res.cloudinary.com/..."
                    }]
                },
                metrics: {
                    setupTime: "Timp Configurare",
                    setupTimeValue: "3 Zile",
                    cost: "începe",
                    costValue: "50 €",
                    efficiency: "Creștere Eficiență",
                    efficiencyValue: "75%"
                },
                integrations: {
                    title: "Integration Partners",
                    partners: [{
                        name: "E-factura",
                        logo: "/e-factura.webp"
                    }, {
                        name: "Saga Software",
                        logo: "/saga-logo.png"
                    }, {
                        name: "SAF-T Compliance",
                        logo: "/saft.webp"
                    }, {
                        name: "Property Listings",
                        logo: "/listing.png"
                    }]
                }
            },
            retail: {
                seo: {
                    title: "Coffee Franchise Management System & Software | FranchiseTech",
                    description: "Complete restaurant management solution with sales system, kitchen display, inventory, and more. Perfect for restaurants in Romania. Start free trial today!",
                    keywords: "coffee franchise management, coffee shop software, franchise management romania, coffee shop inventory, coffee franchise software"
                },
                features: {
                    title: "Core Features",
                    list: [{
                        icon: "ShoppingCart",
                        title: "Sistem Inteligent de Vânzări",
                        description: "Modern point-of-sale with AI-powered recommendations",
                        features: ["Offline operation", "Customer recognition", "Dynamic pricing", "Loyalty program integration"]
                    }, {
                        icon: "Package",
                        title: "Kitchen Display System",
                        description: "Streamline kitchen operations with digital order management",
                        features: ["Real-time order updates", "Order prioritization", "Kitchen analytics", "Mobile notifications"]
                    }, {
                        icon: "LineChart",
                        title: "Inventory Management",
                        description: "AI-powered inventory control and forecasting",
                        features: ["Demand forecasting", "Automatic reordering", "Supplier management", "Stock alerts"]
                    }, {
                        icon: "Globe",
                        title: "Online Ordering",
                        description: "Seamless integration with delivery platforms",
                        features: ["Delivery platform integration", "Order synchronization", "Menu management", "Customer tracking"]
                    }, {
                        icon: "Shield",
                        title: "Security & Compliance",
                        description: "Enterprise-grade security and regulatory compliance",
                        features: ["Data encryption", "Role-based access", "Audit logging", "GDPR compliance"]
                    }, {
                        icon: "Wallet",
                        title: "Payment Processing",
                        description: "Flexible payment solutions for all needs",
                        features: ["Multiple payment methods", "Split payments", "Refund management", "Financial reporting"]
                    }]
                },
                benefits: {
                    title: "Impact Afaceri",
                    list: ["Checkout cu 35% mai rapid", "Reducere 28% stocuri epuizate", "Îmbunătățire 40% fidelizare clienți", "Costuri operaționale cu 22% mai mici", "50+ rapoarte predefinite", "Alertă mobile în timp real"]
                },
                integrations: {
                    title: "Integrări Perfecte",
                    partners: [{
                        name: "FiscalNet",
                        logo: "/fiscalnet_logo.png"
                    }, {
                        name: "E-factura",
                        logo: "/e-factura.webp"
                    }, {
                        name: "Saga Software",
                        logo: "/saga-logo.png"
                    }, {
                        name: "Shopify",
                        logo: "/shopify.webp"
                    }]
                },
                metrics: {
                    setupTime: "Timp Configurare",
                    setupTimeValue: "3 Zile",
                    cost: "Cost",
                    costValue: "50 €",
                    efficiency: "Creștere Eficiență",
                    efficiencyValue: "75%"
                },
                testimonials: {
                    title: "Succesul Antreprenorilor",
                    clients: [{
                        name: "Ana Popescu",
                        company: "UrbanFashion România",
                        rating: 5,
                        text: "Funcțiile omnichannel ne-au ajutat să reducem costurile cu stocurile cu 30% crescând satisfacția clienților.",
                        image: "/testimonials/fashion.jpg"
                    }, {
                        name: "Andrei Ionescu",
                        company: "TechGadgets RO",
                        rating: 5,
                        text: "Analiza în timp real ne-a ajutat să optimizăm spațiul în rafturi și să creștem vânzările.",
                        image: "/testimonials/electronics.jpg"
                    }]
                },
                metrics: {
                    setupTime: "Timp Implementare",
                    setupTimeValue: "4 Săptămâni",
                    cost: "ROI Realizat",
                    costValue: "6 Luni",
                    efficiency: "Eficiență Crescută",
                    efficiencyValue: "65%"
                },
                pricing: {
                    title: "Simple, Transparent Pricing",
                    subtitle: "Choose the perfect plan for your restaurant. All plans include our core sales system with 14-day free trial.",
                    allBasicFeatures: "All Basic Features",
                    chooseOneModule: "Choose 1 Module",
                    bestValue: "Best Value",
                    getStarted: "Get Started",
                    setupFee: "Setup Fee",
                    basic: {
                        title: "Basic",
                        price: "79",
                        setup: "299",
                        features: ["Sistem Inteligent de Vânzări", "Kitchen Display System", "Basic Stock Management", "Cash Register Integration", "Multiple Payment Methods", "Table Management", "Priority Support Response"]
                    },
                    standard: {
                        title: "Standard",
                        price: "94",
                        setup: "299",
                        features: ["All Basic Features", "Purchase Module", "Loyalty Program", "Delivery Integration"],
                        modules: ["Self-Ordering Services (QR Code Demo)", "E-Factura Integration", "Saga Connector", "Website & Ecommerce", "Purchase Module", "Loyalty Program", "Delivery Integration", "Advanced Analytics", "Customer Management"]
                    },
                    growth: {
                        title: "Growth Bundle",
                        price: "99",
                        setup: "299",
                        features: ["All Basic Features", "Save 67 RON/month"],
                        modulesIncluded: "All Modules Included"
                    },
                    trial: "Try all features free for 14 days!",
                    faq: {
                        title: "Frequently Asked Questions",
                        setup: {
                            question: "What's included in the Setup Fee?",
                            answer: "8-hour onboarding session including data migration, staff training, and system setup."
                        },
                        modules: {
                            question: "Can I change modules later?",
                            answer: "Yes, you can upgrade or change modules at any time. Changes will be reflected in your next billing cycle."
                        },
                        trial: {
                            question: "How does the 14-day trial work?",
                            answer: "Start with full access to all features. No credit card required. Choose your plan at the end of the trial."
                        }
                    },
                    cta: "Contact Us for Custom Solutions"
                }
            },
            common: {
                company_name: "FranchiseTech",
                learn_more: "Află Mai Multe",
                features: "Features"
            },
            autoLogin: {
                button: "Autentificare",
                opening: "Se deschide Odoo...",
                success: "Odoo se deschide în tab nou...",
                errors: {
                    notAuthenticated: "Nu sunteți autentificat. Vă rugăm să vă conectați mai întâi.",
                    generateFailed: "Nu s-a putut genera URL-ul de auto-conectare. Vă rugăm să încercați din nou.",
                    popupBlocked: "Popup-ul a fost blocat. Vă rugăm să permiteți popup-urile pentru acest site.",
                    networkError: "Eroare de rețea. Verificați conexiunea la internet.",
                    userNotFound: "Utilizatorul nu a fost găsit în Odoo.",
                    sessionExpired: "Sesiunea a expirat. Vă rugăm să vă conectați din nou.",
                    serverError: "Eroare de server. Vă rugăm să încercați din nou mai târziu.",
                    tokenInvalid: "Token-ul de auto-conectare este invalid sau a expirat.",
                    permissionDenied: "Nu aveți permisiuni pentru această acțiune."
                },
                messages: {
                    checkingAvailability: "Se verifică disponibilitatea auto-conectării...",
                    generatingUrl: "Se generează URL-ul de auto-conectare...",
                    redirecting: "Se redirecționează către Odoo...",
                    sessionActive: "Aveți deja acces? Deschideți direct Odoo",
                    popupBlockedFallback: "Popup blocat! Vă rugăm să permiteți popup-urile pentru acest site sau",
                    clickHereToOpen: "apăsați aici pentru a deschide Odoo",
                    autoLoginDescription: "Sau deschideți direct Odoo dacă sunteți deja autentificat:",
                    noteSessionRequired: "* Funcționează doar dacă aveți o sesiune activă"
                }
            },
            websiteBuilder: {
                hero: {
                    title: "Your Complete Online Presence",
                    subtitle: "So good, it's easy to set up - but complete. Design attractive pages and manage your entire franchise from a single unified platform.",
                    cta: "Start Free"
                },
                quickSetup: {
                    title: "Modul Fără Cod",
                    subtitle: "Prezența ta online perfectă ar trebui să fie ușor de creat și întreținut",
                    steps: {
                        business: {
                            title: "Configurează-ți afacerea",
                            description: "Spune-ne despre afacerea ta"
                        },
                        logo: {
                            title: "Adaugă logo-ul",
                            description: "Încarcă identitatea ta de brand"
                        },
                        features: {
                            title: "Selectează funcționalități",
                            description: "Alege ce ai nevoie"
                        },
                        theme: {
                            title: "Alege tema",
                            description: "Alege designul preferat"
                        }
                    }
                },
                websiteFeatures: {
                    title: "Funcționalități Website",
                    subtitle: "Tot ce ai nevoie pentru a crea un website profesional",
                    dragDrop: {
                        title: "Constructor Drag & Drop",
                        description: "Creează site-ul ca un designer cu interfața noastră intuitivă drag-and-drop. Fă ajustări precise, adaugă filtre și animează elementele direct pe pagină."
                    },
                    ai: {
                        title: "Creare cu AI",
                        description: "Lasă AI-ul să sugereze layout-ul și conținutul site-ului în funcție de industria ta. Îmbunătățește-ți copywriting-ul cu integrarea ChatGPT pentru o generare mai bună a conținutului."
                    },
                    mobile: {
                        title: "Responsive pe Mobile",
                        description: "Site-ul tău se adaptează automat la toate dispozitivele. Controlează ce este vizibil pe mobile cu instrumentele noastre de design responsive."
                    },
                    photos: {
                        title: "3M+ Fotografii Gratuite",
                        description: "Accesează o vastă bibliotecă de imagini de calitate de la Unsplash pentru a îmbunătăți aspectul vizual al site-ului tău."
                    }
                },
                ecommerceFeatures: {
                    title: "Funcționalități E-commerce",
                    subtitle: "Tot ce ai nevoie pentru a gestiona un magazin online de succes",
                    products: {
                        title: "Produse Adaptative",
                        description: "Afișează produsele tale în toate aspectele lor cu dimensiuni, culori și variante configurabile. Gestionarea stocurilor se actualizează automat în timp real pentru fiecare variantă."
                    },
                    engagement: {
                        title: "Interacțiune cu Clienții",
                        description: "Construiește relații mai puternice cu suport chat în timp real și recenzii de la clienți. Ajută clienții să găsească următoarea lor achiziție cu recomandări inteligente."
                    },
                    analytics: {
                        title: "Analiză și Creștere",
                        description: "Urmărește performanța magazinului cu analitice integrate. Construiește rapoarte avansate și verifică datele pentru a lua decizii informate."
                    },
                    payments: {
                        title: "Integrare Plăți",
                        description: "Oferă clienților o varietate de opțiuni de plată. Integrează fără probleme cu furnizorii populari de plăți pentru tranzacții sigure."
                    }
                },
                additionalFeatures: {
                    title: "Funcționalități Adiționale",
                    subtitle: "Instrumente suplimentare pentru a îmbunătăți prezența ta online",
                    language: {
                        title: "Suport Multi-Limbă",
                        description: "Instalează diferite limbi și traduce conținutul direct din orice pagină cu instrumentele noastre integrate de traducere."
                    },
                    seo: {
                        title: "Optimizare SEO",
                        description: "Scrie conținut optimizat pentru motoarele de căutare cu instrumentele noastre integrate SEO pentru a îmbunătăți vizibilitatea site-ului tău."
                    },
                    market: {
                        title: "Adaptabilitate la Piață",
                        description: "Extinde-ți raza de acțiune cu integrarea cu marketplace-uri majore precum Amazon și Facebook. Ajungi la mai mulți clienți acolo unde cumpără."
                    },
                    shipping: {
                        title: "Livrare Flexibilă",
                        description: "Oferă multiple opțiuni de livrare, inclusiv click și ridicare. Lasă clienții să cumpere online și să ridice comenzile de la magazinul tău."
                    }
                },
                pricing: {
                    title: "Gratuit Pentru Totdeauna, Utilizatori Nelimitați",
                    subtitle: "Site-ul și magazinul tău online sunt gratuite pentru totdeauna cu planul nostru One App Free, inclusiv găzduire, suport nelimitat și întreținere. Fără reclame sau limite.",
                    cta: "Începe Acum"
                }
            },
            about: {
                hero: {
                    title: "Despre FranchiseTech",
                    description: "FranchiseTech este un furnizor de top al soluțiilor software pentru gestionarea francizelor, specializându-se în sisteme complete de management al afacerilor care ajut organizațiile de francize să-și optimizeze operațiunile și să-și atingă potențialul maxim."
                },
                mission: {
                    title: "Misiunea Noastră",
                    description: "Suntem dedicați să oferim soluții software inovatoare, scalabile și integrate care îi împuternicesc pe francize să prospere într-o lume din ce în ce mai digitală. Ne concentrăm pe livrarea tehnologiei de nivel franciză care este atât puternică cât și ușor de folosit."
                },
                values: {
                    title: "Valorile Noastre",
                    innovation: {
                        title: "Inovație",
                        description: "Evoluăm constant soluțiile noastre pentru a răspunde nevoilor în schimbare ale afacerilor"
                    },
                    quality: {
                        title: "Calitate",
                        description: "Menținem cele mai înalte standarde în dezvoltarea software"
                    },
                    customerSuccess: {
                        title: "Succesul Clienților",
                        description: "Dedicați ajutării clienților noștri să-și atingă obiectivele"
                    },
                    integrity: {
                        title: "Integritate",
                        description: "Operăm cu transparență și practici etice de afaceri"
                    }
                },
                journey: {
                    title: "Călătoria Noastră"
                },
                team: {
                    title: "Cunoaște Echipa Noastră de Conducere"
                }
            },
            services: {
                coffee: {
                    title: "Soluții pentru Cafenele",
                    description: "Soluții complete de management pentru cafenele și coffee shops cu module integrate pentru operațiuni fără probleme",
                    features: ["Sistem Integrat de Vânzări", "Gestionarea Stocurilor în Timp Real", "Program de Fidelitate Clienți", "Programarea și Gestionarea Personalului", "Gestionarea Relațiilor cu Clienții", "Analiză și Raportare Financiară"]
                },
                restaurant: {
                    title: "Management Restaurant",
                    description: "Soluție completă pentru restaurante cu serviciu la masă, afișaj pentru bucătărie și capacități avansate de comandă",
                    features: ["Sistem de Gestionare a Meselor", "Sistem de Afișaj pentru Bucătărie", "Urmărirea și Gestionarea Comenzilor", "Gestionarea Meniurilor", "Sistem de Feedback Clienți", "Suport Multi-locații"]
                },
                fastfood: {
                    title: "Soluții Fast Food",
                    description: "Soluții de serviciu rapid pentru restaurante fast food și francize cu operațiuni optimizate",
                    features: ["Procesare Rapidă a Comenzilor", "Gestionarea Drive-thru", "Inventar Multi-locații", "Analiză Clienți", "Comenzi Mobile", "Integrare Livrare"]
                },
                retail: {
                    title: "Management Retail Alimentar",
                    description: "Soluție completă pentru magazine de conveniență și afaceri de retail alimentar cu sistem de vânzări și inventar integrat",
                    features: ["Sistem Avansat de Vânzări", "Gestionarea Stocurilor", "Gestionarea Furnizorilor", "Analiză Vânzări", "Gestionarea Clienților", "Operațiuni Multi-magazin"]
                }
            },
            thankYou: {
                meta: {
                    title: "Mulțumim - FranchiseTech",
                    description: "Mulțumim că ați contactat FranchiseTech. Apreciem interesul dumneavoastră și vă vom răspunde în curând."
                },
                title: "Mulțumim!",
                message: "Am primit mesajul dumneavoastră și vă vom răspunde cât mai curând posibil.",
                whatNext: {
                    title: "Ce urmează?",
                    step1: "Echipa noastră va analiza mesajul dumneavoastră în termen de 24 de ore",
                    step2: "Un specialist dedicat va fi desemnat să vă asiste",
                    step3: "Vă vom contacta prin email sau telefon pentru a discuta nevoile dumneavoastră"
                },
                backHome: "Înapoi la Pagina Principală"
            }
        }
    }
};
ra.use(fn).use(ln).use(ia).init({
    resources: Yc,
    fallbackLng: "ro",
    debug: !0,
    interpolation: {
        escapeValue: !1
    }
});
const Qc = async () => {
        try {
            await Promise.all([A(() => Promise.resolve({}), __vite__mapDeps([58])), A(() => Promise.resolve({}), __vite__mapDeps([59])), A(() => Promise.resolve({}), __vite__mapDeps([60])), A(() => Promise.resolve({}), __vite__mapDeps([61]))])
        } catch (e) {
            console.warn("Failed to load fonts:", e)
        }
    },
    Jc = () => {
        try {
            return A(() =>
                import ("./index.DUP5BPDA.js"), __vite__mapDeps([62, 2])).then(e => ({
                default: e.Analytics
            }))
        } catch (e) {
            return console.warn("Failed to load analytics:", e), Promise.resolve(null)
        }
    };
Qc().catch(() => {});
const hn = document.getElementById("root");
if (!hn) throw new Error("Root element not found");
const Zc = Or(hn);
Zc.render(n.jsx(B.StrictMode, {
    children: n.jsxs(Nn, {
        client: ca,
        children: [n.jsx(vc, {}), n.jsx(Fa, {})]
    })
}));
setTimeout(() => {
    Jc().then(() => {}).catch(e => {
        console.warn("Analytics loading failed:", e)
    })
}, 1e3);
export {
    Qi as A, V as B, U as C, se as D, Bt as F, ml as H, ge as I, Wi as L, ha as R, qe as V, _t as a, Ce as b, I as c, me as d, pe as e, fe as f, he as g, Z as h, re as i, fo as j, ul as k, cs as l, We as m, Xe as n, Ye as o, Ji as p, qt as t, zt as u
};