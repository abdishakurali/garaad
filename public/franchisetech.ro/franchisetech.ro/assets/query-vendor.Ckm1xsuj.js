var Dt = e => {
    throw TypeError(e)
};
var Ct = (e, t, s) => t.has(e) || Dt("Cannot " + s);
var r = (e, t, s) => (Ct(e, t, "read from private field"), s ? s.call(e) : t.get(e)),
    c = (e, t, s) => t.has(e) ? Dt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s),
    o = (e, t, s, i) => (Ct(e, t, "write to private field"), i ? i.call(e, s) : t.set(e, s), s),
    b = (e, t, s) => (Ct(e, t, "access private method"), s);
var bt = (e, t, s, i) => ({
    set _(n) {
        o(e, t, n, s)
    },
    get _() {
        return r(e, t, i)
    }
});
import {
    r as B
} from "./react-vendor.CoFnG1Cb.js";
import {
    j as ee
} from "./ui-vendor.Bl07kmxE.js";
var mt = class {
        constructor() {
            this.listeners = new Set, this.subscribe = this.subscribe.bind(this)
        }
        subscribe(e) {
            return this.listeners.add(e), this.onSubscribe(), () => {
                this.listeners.delete(e), this.onUnsubscribe()
            }
        }
        hasListeners() {
            return this.listeners.size > 0
        }
        onSubscribe() {}
        onUnsubscribe() {}
    },
    Pt = typeof window > "u" || "Deno" in globalThis;

function j() {}

function se(e, t) {
    return typeof e == "function" ? e(t) : e
}

function ie(e) {
    return typeof e == "number" && e >= 0 && e !== 1 / 0
}

function re(e, t) {
    return Math.max(e + (t || 0) - Date.now(), 0)
}

function qt(e, t) {
    return typeof e == "function" ? e(t) : e
}

function ne(e, t) {
    return typeof e == "function" ? e(t) : e
}

function At(e, t) {
    const {
        type: s = "all",
        exact: i,
        fetchStatus: n,
        predicate: u,
        queryKey: h,
        stale: a
    } = e;
    if (h) {
        if (i) {
            if (t.queryHash !== Et(h, t.options)) return !1
        } else if (!ft(t.queryKey, h)) return !1
    }
    if (s !== "all") {
        const f = t.isActive();
        if (s === "active" && !f || s === "inactive" && f) return !1
    }
    return !(typeof a == "boolean" && t.isStale() !== a || n && n !== t.state.fetchStatus || u && !u(t))
}

function Rt(e, t) {
    const {
        exact: s,
        status: i,
        predicate: n,
        mutationKey: u
    } = e;
    if (u) {
        if (!t.options.mutationKey) return !1;
        if (s) {
            if (it(t.options.mutationKey) !== it(u)) return !1
        } else if (!ft(t.options.mutationKey, u)) return !1
    }
    return !(i && t.state.status !== i || n && !n(t))
}

function Et(e, t) {
    return ((t == null ? void 0 : t.queryKeyHashFn) || it)(e)
}

function it(e) {
    return JSON.stringify(e, (t, s) => Ft(s) ? Object.keys(s).sort().reduce((i, n) => (i[n] = s[n], i), {}) : s)
}

function ft(e, t) {
    return e === t ? !0 : typeof e != typeof t ? !1 : e && t && typeof e == "object" && typeof t == "object" ? !Object.keys(t).some(s => !ft(e[s], t[s])) : !1
}

function zt(e, t) {
    if (e === t) return e;
    const s = jt(e) && jt(t);
    if (s || Ft(e) && Ft(t)) {
        const i = s ? e : Object.keys(e),
            n = i.length,
            u = s ? t : Object.keys(t),
            h = u.length,
            a = s ? [] : {};
        let f = 0;
        for (let g = 0; g < h; g++) {
            const y = s ? g : u[g];
            (!s && i.includes(y) || s) && e[y] === void 0 && t[y] === void 0 ? (a[y] = void 0, f++) : (a[y] = zt(e[y], t[y]), a[y] === e[y] && e[y] !== void 0 && f++)
        }
        return n === h && f === n ? e : a
    }
    return t
}

function ae(e, t) {
    if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
    for (const s in e)
        if (e[s] !== t[s]) return !1;
    return !0
}

function jt(e) {
    return Array.isArray(e) && e.length === Object.keys(e).length
}

function Ft(e) {
    if (!Tt(e)) return !1;
    const t = e.constructor;
    if (t === void 0) return !0;
    const s = t.prototype;
    return !(!Tt(s) || !s.hasOwnProperty("isPrototypeOf") || Object.getPrototypeOf(e) !== Object.prototype)
}

function Tt(e) {
    return Object.prototype.toString.call(e) === "[object Object]"
}

function ue(e) {
    return new Promise(t => {
        setTimeout(t, e)
    })
}

function oe(e, t, s) {
    return typeof s.structuralSharing == "function" ? s.structuralSharing(e, t) : s.structuralSharing !== !1 ? zt(e, t) : t
}

function he(e, t, s = 0) {
    const i = [...e, t];
    return s && i.length > s ? i.slice(1) : i
}

function ce(e, t, s = 0) {
    const i = [t, ...e];
    return s && i.length > s ? i.slice(0, -1) : i
}
var Qt = Symbol();

function $t(e, t) {
    return !e.queryFn && (t != null && t.initialPromise) ? () => t.initialPromise : !e.queryFn || e.queryFn === Qt ? () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`)) : e.queryFn
}
var Z, _, rt, Kt, le = (Kt = class extends mt {
        constructor() {
            super();
            c(this, Z);
            c(this, _);
            c(this, rt);
            o(this, rt, t => {
                if (!Pt && window.addEventListener) {
                    const s = () => t();
                    return window.addEventListener("visibilitychange", s, !1), () => {
                        window.removeEventListener("visibilitychange", s)
                    }
                }
            })
        }
        onSubscribe() {
            r(this, _) || this.setEventListener(r(this, rt))
        }
        onUnsubscribe() {
            var t;
            this.hasListeners() || ((t = r(this, _)) == null || t.call(this), o(this, _, void 0))
        }
        setEventListener(t) {
            var s;
            o(this, rt, t), (s = r(this, _)) == null || s.call(this), o(this, _, t(i => {
                typeof i == "boolean" ? this.setFocused(i) : this.onFocus()
            }))
        }
        setFocused(t) {
            r(this, Z) !== t && (o(this, Z, t), this.onFocus())
        }
        onFocus() {
            const t = this.isFocused();
            this.listeners.forEach(s => {
                s(t)
            })
        }
        isFocused() {
            var t;
            return typeof r(this, Z) == "boolean" ? r(this, Z) : ((t = globalThis.document) == null ? void 0 : t.visibilityState) !== "hidden"
        }
    }, Z = new WeakMap, _ = new WeakMap, rt = new WeakMap, Kt),
    Vt = new le,
    nt, z, at, It, de = (It = class extends mt {
        constructor() {
            super();
            c(this, nt, !0);
            c(this, z);
            c(this, at);
            o(this, at, t => {
                if (!Pt && window.addEventListener) {
                    const s = () => t(!0),
                        i = () => t(!1);
                    return window.addEventListener("online", s, !1), window.addEventListener("offline", i, !1), () => {
                        window.removeEventListener("online", s), window.removeEventListener("offline", i)
                    }
                }
            })
        }
        onSubscribe() {
            r(this, z) || this.setEventListener(r(this, at))
        }
        onUnsubscribe() {
            var t;
            this.hasListeners() || ((t = r(this, z)) == null || t.call(this), o(this, z, void 0))
        }
        setEventListener(t) {
            var s;
            o(this, at, t), (s = r(this, z)) == null || s.call(this), o(this, z, t(this.setOnline.bind(this)))
        }
        setOnline(t) {
            r(this, nt) !== t && (o(this, nt, t), this.listeners.forEach(i => {
                i(t)
            }))
        }
        isOnline() {
            return r(this, nt)
        }
    }, nt = new WeakMap, z = new WeakMap, at = new WeakMap, It),
    Ot = new de;

function fe() {
    let e, t;
    const s = new Promise((n, u) => {
        e = n, t = u
    });
    s.status = "pending", s.catch(() => {});

    function i(n) {
        Object.assign(s, n), delete s.resolve, delete s.reject
    }
    return s.resolve = n => {
        i({
            status: "fulfilled",
            value: n
        }), e(n)
    }, s.reject = n => {
        i({
            status: "rejected",
            reason: n
        }), t(n)
    }, s
}

function ye(e) {
    return Math.min(1e3 * 2 ** e, 3e4)
}

function Jt(e) {
    return (e ? ? "online") === "online" ? Ot.isOnline() : !0
}
var Wt = class extends Error {
    constructor(e) {
        super("CancelledError"), this.revert = e == null ? void 0 : e.revert, this.silent = e == null ? void 0 : e.silent
    }
};

function St(e) {
    return e instanceof Wt
}

function Xt(e) {
    let t = !1,
        s = 0,
        i = !1,
        n;
    const u = fe(),
        h = d => {
            var m;
            i || (p(new Wt(d)), (m = e.abort) == null || m.call(e))
        },
        a = () => {
            t = !0
        },
        f = () => {
            t = !1
        },
        g = () => Vt.isFocused() && (e.networkMode === "always" || Ot.isOnline()) && e.canRun(),
        y = () => Jt(e.networkMode) && e.canRun(),
        l = d => {
            var m;
            i || (i = !0, (m = e.onSuccess) == null || m.call(e, d), n == null || n(), u.resolve(d))
        },
        p = d => {
            var m;
            i || (i = !0, (m = e.onError) == null || m.call(e, d), n == null || n(), u.reject(d))
        },
        M = () => new Promise(d => {
            var m;
            n = E => {
                (i || g()) && d(E)
            }, (m = e.onPause) == null || m.call(e)
        }).then(() => {
            var d;
            n = void 0, i || (d = e.onContinue) == null || d.call(e)
        }),
        S = () => {
            if (i) return;
            let d;
            const m = s === 0 ? e.initialPromise : void 0;
            try {
                d = m ? ? e.fn()
            } catch (E) {
                d = Promise.reject(E)
            }
            Promise.resolve(d).then(l).catch(E => {
                var U;
                if (i) return;
                const R = e.retry ? ? (Pt ? 0 : 3),
                    w = e.retryDelay ? ? ye,
                    D = typeof w == "function" ? w(s, E) : w,
                    x = R === !0 || typeof R == "number" && s < R || typeof R == "function" && R(s, E);
                if (t || !x) {
                    p(E);
                    return
                }
                s++, (U = e.onFail) == null || U.call(e, s, E), ue(D).then(() => g() ? void 0 : M()).then(() => {
                    t ? p(E) : S()
                })
            })
        };
    return {
        promise: u,
        cancel: h,
        continue: () => (n == null || n(), u),
        cancelRetry: a,
        continueRetry: f,
        canStart: y,
        start: () => (y() ? S() : M().then(S), u)
    }
}

function pe() {
    let e = [],
        t = 0,
        s = a => {
            a()
        },
        i = a => {
            a()
        },
        n = a => setTimeout(a, 0);
    const u = a => {
            t ? e.push(a) : n(() => {
                s(a)
            })
        },
        h = () => {
            const a = e;
            e = [], a.length && n(() => {
                i(() => {
                    a.forEach(f => {
                        s(f)
                    })
                })
            })
        };
    return {
        batch: a => {
            let f;
            t++;
            try {
                f = a()
            } finally {
                t--, t || h()
            }
            return f
        },
        batchCalls: a => (...f) => {
            u(() => {
                a(...f)
            })
        },
        schedule: u,
        setNotifyFunction: a => {
            s = a
        },
        setBatchNotifyFunction: a => {
            i = a
        },
        setScheduler: a => {
            n = a
        }
    }
}
var P = pe(),
    tt, kt, Yt = (kt = class {
        constructor() {
            c(this, tt)
        }
        destroy() {
            this.clearGcTimeout()
        }
        scheduleGc() {
            this.clearGcTimeout(), ie(this.gcTime) && o(this, tt, setTimeout(() => {
                this.optionalRemove()
            }, this.gcTime))
        }
        updateGcTime(e) {
            this.gcTime = Math.max(this.gcTime || 0, e ? ? (Pt ? 1 / 0 : 5 * 60 * 1e3))
        }
        clearGcTimeout() {
            r(this, tt) && (clearTimeout(r(this, tt)), o(this, tt, void 0))
        }
    }, tt = new WeakMap, kt),
    ut, ot, A, C, yt, et, T, L, Lt, me = (Lt = class extends Yt {
        constructor(t) {
            super();
            c(this, T);
            c(this, ut);
            c(this, ot);
            c(this, A);
            c(this, C);
            c(this, yt);
            c(this, et);
            o(this, et, !1), o(this, yt, t.defaultOptions), this.setOptions(t.options), this.observers = [], o(this, A, t.cache), this.queryKey = t.queryKey, this.queryHash = t.queryHash, o(this, ut, be(this.options)), this.state = t.state ? ? r(this, ut), this.scheduleGc()
        }
        get meta() {
            return this.options.meta
        }
        get promise() {
            var t;
            return (t = r(this, C)) == null ? void 0 : t.promise
        }
        setOptions(t) {
            this.options = { ...r(this, yt),
                ...t
            }, this.updateGcTime(this.options.gcTime)
        }
        optionalRemove() {
            !this.observers.length && this.state.fetchStatus === "idle" && r(this, A).remove(this)
        }
        setData(t, s) {
            const i = oe(this.state.data, t, this.options);
            return b(this, T, L).call(this, {
                data: i,
                type: "success",
                dataUpdatedAt: s == null ? void 0 : s.updatedAt,
                manual: s == null ? void 0 : s.manual
            }), i
        }
        setState(t, s) {
            b(this, T, L).call(this, {
                type: "setState",
                state: t,
                setStateOptions: s
            })
        }
        cancel(t) {
            var i, n;
            const s = (i = r(this, C)) == null ? void 0 : i.promise;
            return (n = r(this, C)) == null || n.cancel(t), s ? s.then(j).catch(j) : Promise.resolve()
        }
        destroy() {
            super.destroy(), this.cancel({
                silent: !0
            })
        }
        reset() {
            this.destroy(), this.setState(r(this, ut))
        }
        isActive() {
            return this.observers.some(t => ne(t.options.enabled, this) !== !1)
        }
        isDisabled() {
            return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === Qt || this.state.dataUpdateCount + this.state.errorUpdateCount === 0
        }
        isStale() {
            return this.state.isInvalidated ? !0 : this.getObserversCount() > 0 ? this.observers.some(t => t.getCurrentResult().isStale) : this.state.data === void 0
        }
        isStaleByTime(t = 0) {
            return this.state.isInvalidated || this.state.data === void 0 || !re(this.state.dataUpdatedAt, t)
        }
        onFocus() {
            var s;
            const t = this.observers.find(i => i.shouldFetchOnWindowFocus());
            t == null || t.refetch({
                cancelRefetch: !1
            }), (s = r(this, C)) == null || s.continue()
        }
        onOnline() {
            var s;
            const t = this.observers.find(i => i.shouldFetchOnReconnect());
            t == null || t.refetch({
                cancelRefetch: !1
            }), (s = r(this, C)) == null || s.continue()
        }
        addObserver(t) {
            this.observers.includes(t) || (this.observers.push(t), this.clearGcTimeout(), r(this, A).notify({
                type: "observerAdded",
                query: this,
                observer: t
            }))
        }
        removeObserver(t) {
            this.observers.includes(t) && (this.observers = this.observers.filter(s => s !== t), this.observers.length || (r(this, C) && (r(this, et) ? r(this, C).cancel({
                revert: !0
            }) : r(this, C).cancelRetry()), this.scheduleGc()), r(this, A).notify({
                type: "observerRemoved",
                query: this,
                observer: t
            }))
        }
        getObserversCount() {
            return this.observers.length
        }
        invalidate() {
            this.state.isInvalidated || b(this, T, L).call(this, {
                type: "invalidate"
            })
        }
        fetch(t, s) {
            var f, g, y;
            if (this.state.fetchStatus !== "idle") {
                if (this.state.data !== void 0 && (s != null && s.cancelRefetch)) this.cancel({
                    silent: !0
                });
                else if (r(this, C)) return r(this, C).continueRetry(), r(this, C).promise
            }
            if (t && this.setOptions(t), !this.options.queryFn) {
                const l = this.observers.find(p => p.options.queryFn);
                l && this.setOptions(l.options)
            }
            const i = new AbortController,
                n = l => {
                    Object.defineProperty(l, "signal", {
                        enumerable: !0,
                        get: () => (o(this, et, !0), i.signal)
                    })
                },
                u = () => {
                    const l = $t(this.options, s),
                        p = {
                            queryKey: this.queryKey,
                            meta: this.meta
                        };
                    return n(p), o(this, et, !1), this.options.persister ? this.options.persister(l, p, this) : l(p)
                },
                h = {
                    fetchOptions: s,
                    options: this.options,
                    queryKey: this.queryKey,
                    state: this.state,
                    fetchFn: u
                };
            n(h), (f = this.options.behavior) == null || f.onFetch(h, this), o(this, ot, this.state), (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((g = h.fetchOptions) == null ? void 0 : g.meta)) && b(this, T, L).call(this, {
                type: "fetch",
                meta: (y = h.fetchOptions) == null ? void 0 : y.meta
            });
            const a = l => {
                var p, M, S, d;
                St(l) && l.silent || b(this, T, L).call(this, {
                    type: "error",
                    error: l
                }), St(l) || ((M = (p = r(this, A).config).onError) == null || M.call(p, l, this), (d = (S = r(this, A).config).onSettled) == null || d.call(S, this.state.data, l, this)), this.scheduleGc()
            };
            return o(this, C, Xt({
                initialPromise: s == null ? void 0 : s.initialPromise,
                fn: h.fetchFn,
                abort: i.abort.bind(i),
                onSuccess: l => {
                    var p, M, S, d;
                    if (l === void 0) {
                        a(new Error(`${this.queryHash} data is undefined`));
                        return
                    }
                    try {
                        this.setData(l)
                    } catch (m) {
                        a(m);
                        return
                    }(M = (p = r(this, A).config).onSuccess) == null || M.call(p, l, this), (d = (S = r(this, A).config).onSettled) == null || d.call(S, l, this.state.error, this), this.scheduleGc()
                },
                onError: a,
                onFail: (l, p) => {
                    b(this, T, L).call(this, {
                        type: "failed",
                        failureCount: l,
                        error: p
                    })
                },
                onPause: () => {
                    b(this, T, L).call(this, {
                        type: "pause"
                    })
                },
                onContinue: () => {
                    b(this, T, L).call(this, {
                        type: "continue"
                    })
                },
                retry: h.options.retry,
                retryDelay: h.options.retryDelay,
                networkMode: h.options.networkMode,
                canRun: () => !0
            })), r(this, C).start()
        }
    }, ut = new WeakMap, ot = new WeakMap, A = new WeakMap, C = new WeakMap, yt = new WeakMap, et = new WeakMap, T = new WeakSet, L = function(t) {
        const s = i => {
            switch (t.type) {
                case "failed":
                    return { ...i,
                        fetchFailureCount: t.failureCount,
                        fetchFailureReason: t.error
                    };
                case "pause":
                    return { ...i,
                        fetchStatus: "paused"
                    };
                case "continue":
                    return { ...i,
                        fetchStatus: "fetching"
                    };
                case "fetch":
                    return { ...i,
                        ...ve(i.data, this.options),
                        fetchMeta: t.meta ? ? null
                    };
                case "success":
                    return { ...i,
                        data: t.data,
                        dataUpdateCount: i.dataUpdateCount + 1,
                        dataUpdatedAt: t.dataUpdatedAt ? ? Date.now(),
                        error: null,
                        isInvalidated: !1,
                        status: "success",
                        ...!t.manual && {
                            fetchStatus: "idle",
                            fetchFailureCount: 0,
                            fetchFailureReason: null
                        }
                    };
                case "error":
                    const n = t.error;
                    return St(n) && n.revert && r(this, ot) ? { ...r(this, ot),
                        fetchStatus: "idle"
                    } : { ...i,
                        error: n,
                        errorUpdateCount: i.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: i.fetchFailureCount + 1,
                        fetchFailureReason: n,
                        fetchStatus: "idle",
                        status: "error"
                    };
                case "invalidate":
                    return { ...i,
                        isInvalidated: !0
                    };
                case "setState":
                    return { ...i,
                        ...t.state
                    }
            }
        };
        this.state = s(this.state), P.batch(() => {
            this.observers.forEach(i => {
                i.onQueryUpdate()
            }), r(this, A).notify({
                query: this,
                type: "updated",
                action: t
            })
        })
    }, Lt);

function ve(e, t) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: Jt(t.networkMode) ? "fetching" : "paused",
        ...e === void 0 && {
            error: null,
            status: "pending"
        }
    }
}

function be(e) {
    const t = typeof e.initialData == "function" ? e.initialData() : e.initialData,
        s = t !== void 0,
        i = s ? typeof e.initialDataUpdatedAt == "function" ? e.initialDataUpdatedAt() : e.initialDataUpdatedAt : 0;
    return {
        data: t,
        dataUpdateCount: 0,
        dataUpdatedAt: s ? i ? ? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: s ? "success" : "pending",
        fetchStatus: "idle"
    }
}
var K, Ht, ge = (Ht = class extends mt {
        constructor(t = {}) {
            super();
            c(this, K);
            this.config = t, o(this, K, new Map)
        }
        build(t, s, i) {
            const n = s.queryKey,
                u = s.queryHash ? ? Et(n, s);
            let h = this.get(u);
            return h || (h = new me({
                cache: this,
                queryKey: n,
                queryHash: u,
                options: t.defaultQueryOptions(s),
                state: i,
                defaultOptions: t.getQueryDefaults(n)
            }), this.add(h)), h
        }
        add(t) {
            r(this, K).has(t.queryHash) || (r(this, K).set(t.queryHash, t), this.notify({
                type: "added",
                query: t
            }))
        }
        remove(t) {
            const s = r(this, K).get(t.queryHash);
            s && (t.destroy(), s === t && r(this, K).delete(t.queryHash), this.notify({
                type: "removed",
                query: t
            }))
        }
        clear() {
            P.batch(() => {
                this.getAll().forEach(t => {
                    this.remove(t)
                })
            })
        }
        get(t) {
            return r(this, K).get(t)
        }
        getAll() {
            return [...r(this, K).values()]
        }
        find(t) {
            const s = {
                exact: !0,
                ...t
            };
            return this.getAll().find(i => At(s, i))
        }
        findAll(t = {}) {
            const s = this.getAll();
            return Object.keys(t).length > 0 ? s.filter(i => At(t, i)) : s
        }
        notify(t) {
            P.batch(() => {
                this.listeners.forEach(s => {
                    s(t)
                })
            })
        }
        onFocus() {
            P.batch(() => {
                this.getAll().forEach(t => {
                    t.onFocus()
                })
            })
        }
        onOnline() {
            P.batch(() => {
                this.getAll().forEach(t => {
                    t.onOnline()
                })
            })
        }
    }, K = new WeakMap, Ht),
    I, F, st, k, N, Gt, we = (Gt = class extends Yt {
        constructor(t) {
            super();
            c(this, k);
            c(this, I);
            c(this, F);
            c(this, st);
            this.mutationId = t.mutationId, o(this, F, t.mutationCache), o(this, I, []), this.state = t.state || Zt(), this.setOptions(t.options), this.scheduleGc()
        }
        setOptions(t) {
            this.options = t, this.updateGcTime(this.options.gcTime)
        }
        get meta() {
            return this.options.meta
        }
        addObserver(t) {
            r(this, I).includes(t) || (r(this, I).push(t), this.clearGcTimeout(), r(this, F).notify({
                type: "observerAdded",
                mutation: this,
                observer: t
            }))
        }
        removeObserver(t) {
            o(this, I, r(this, I).filter(s => s !== t)), this.scheduleGc(), r(this, F).notify({
                type: "observerRemoved",
                mutation: this,
                observer: t
            })
        }
        optionalRemove() {
            r(this, I).length || (this.state.status === "pending" ? this.scheduleGc() : r(this, F).remove(this))
        }
        continue () {
            var t;
            return ((t = r(this, st)) == null ? void 0 : t.continue()) ? ? this.execute(this.state.variables)
        }
        async execute(t) {
            var n, u, h, a, f, g, y, l, p, M, S, d, m, E, R, w, D, x, U, vt;
            o(this, st, Xt({
                fn: () => this.options.mutationFn ? this.options.mutationFn(t) : Promise.reject(new Error("No mutationFn found")),
                onFail: (O, Y) => {
                    b(this, k, N).call(this, {
                        type: "failed",
                        failureCount: O,
                        error: Y
                    })
                },
                onPause: () => {
                    b(this, k, N).call(this, {
                        type: "pause"
                    })
                },
                onContinue: () => {
                    b(this, k, N).call(this, {
                        type: "continue"
                    })
                },
                retry: this.options.retry ? ? 0,
                retryDelay: this.options.retryDelay,
                networkMode: this.options.networkMode,
                canRun: () => r(this, F).canRun(this)
            }));
            const s = this.state.status === "pending",
                i = !r(this, st).canStart();
            try {
                if (!s) {
                    b(this, k, N).call(this, {
                        type: "pending",
                        variables: t,
                        isPaused: i
                    }), await ((u = (n = r(this, F).config).onMutate) == null ? void 0 : u.call(n, t, this));
                    const Y = await ((a = (h = this.options).onMutate) == null ? void 0 : a.call(h, t));
                    Y !== this.state.context && b(this, k, N).call(this, {
                        type: "pending",
                        context: Y,
                        variables: t,
                        isPaused: i
                    })
                }
                const O = await r(this, st).start();
                return await ((g = (f = r(this, F).config).onSuccess) == null ? void 0 : g.call(f, O, t, this.state.context, this)), await ((l = (y = this.options).onSuccess) == null ? void 0 : l.call(y, O, t, this.state.context)), await ((M = (p = r(this, F).config).onSettled) == null ? void 0 : M.call(p, O, null, this.state.variables, this.state.context, this)), await ((d = (S = this.options).onSettled) == null ? void 0 : d.call(S, O, null, t, this.state.context)), b(this, k, N).call(this, {
                    type: "success",
                    data: O
                }), O
            } catch (O) {
                try {
                    throw await ((E = (m = r(this, F).config).onError) == null ? void 0 : E.call(m, O, t, this.state.context, this)), await ((w = (R = this.options).onError) == null ? void 0 : w.call(R, O, t, this.state.context)), await ((x = (D = r(this, F).config).onSettled) == null ? void 0 : x.call(D, void 0, O, this.state.variables, this.state.context, this)), await ((vt = (U = this.options).onSettled) == null ? void 0 : vt.call(U, void 0, O, t, this.state.context)), O
                } finally {
                    b(this, k, N).call(this, {
                        type: "error",
                        error: O
                    })
                }
            } finally {
                r(this, F).runNext(this)
            }
        }
    }, I = new WeakMap, F = new WeakMap, st = new WeakMap, k = new WeakSet, N = function(t) {
        const s = i => {
            switch (t.type) {
                case "failed":
                    return { ...i,
                        failureCount: t.failureCount,
                        failureReason: t.error
                    };
                case "pause":
                    return { ...i,
                        isPaused: !0
                    };
                case "continue":
                    return { ...i,
                        isPaused: !1
                    };
                case "pending":
                    return { ...i,
                        context: t.context,
                        data: void 0,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        isPaused: t.isPaused,
                        status: "pending",
                        variables: t.variables,
                        submittedAt: Date.now()
                    };
                case "success":
                    return { ...i,
                        data: t.data,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        status: "success",
                        isPaused: !1
                    };
                case "error":
                    return { ...i,
                        data: void 0,
                        error: t.error,
                        failureCount: i.failureCount + 1,
                        failureReason: t.error,
                        isPaused: !1,
                        status: "error"
                    }
            }
        };
        this.state = s(this.state), P.batch(() => {
            r(this, I).forEach(i => {
                i.onMutationUpdate(t)
            }), r(this, F).notify({
                mutation: this,
                type: "updated",
                action: t
            })
        })
    }, Gt);

function Zt() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: "idle",
        variables: void 0,
        submittedAt: 0
    }
}
var q, pt, Nt, Oe = (Nt = class extends mt {
    constructor(t = {}) {
        super();
        c(this, q);
        c(this, pt);
        this.config = t, o(this, q, new Map), o(this, pt, Date.now())
    }
    build(t, s, i) {
        const n = new we({
            mutationCache: this,
            mutationId: ++bt(this, pt)._,
            options: t.defaultMutationOptions(s),
            state: i
        });
        return this.add(n), n
    }
    add(t) {
        const s = gt(t),
            i = r(this, q).get(s) ? ? [];
        i.push(t), r(this, q).set(s, i), this.notify({
            type: "added",
            mutation: t
        })
    }
    remove(t) {
        var i;
        const s = gt(t);
        if (r(this, q).has(s)) {
            const n = (i = r(this, q).get(s)) == null ? void 0 : i.filter(u => u !== t);
            n && (n.length === 0 ? r(this, q).delete(s) : r(this, q).set(s, n))
        }
        this.notify({
            type: "removed",
            mutation: t
        })
    }
    canRun(t) {
        var i;
        const s = (i = r(this, q).get(gt(t))) == null ? void 0 : i.find(n => n.state.status === "pending");
        return !s || s === t
    }
    runNext(t) {
        var i;
        const s = (i = r(this, q).get(gt(t))) == null ? void 0 : i.find(n => n !== t && n.state.isPaused);
        return (s == null ? void 0 : s.continue()) ? ? Promise.resolve()
    }
    clear() {
        P.batch(() => {
            this.getAll().forEach(t => {
                this.remove(t)
            })
        })
    }
    getAll() {
        return [...r(this, q).values()].flat()
    }
    find(t) {
        const s = {
            exact: !0,
            ...t
        };
        return this.getAll().find(i => Rt(s, i))
    }
    findAll(t = {}) {
        return this.getAll().filter(s => Rt(t, s))
    }
    notify(t) {
        P.batch(() => {
            this.listeners.forEach(s => {
                s(t)
            })
        })
    }
    resumePausedMutations() {
        const t = this.getAll().filter(s => s.state.isPaused);
        return P.batch(() => Promise.all(t.map(s => s.continue().catch(j))))
    }
}, q = new WeakMap, pt = new WeakMap, Nt);

function gt(e) {
    var t;
    return ((t = e.options.scope) == null ? void 0 : t.id) ? ? String(e.mutationId)
}

function xt(e) {
    return {
        onFetch: (t, s) => {
            var y, l, p, M, S;
            const i = t.options,
                n = (p = (l = (y = t.fetchOptions) == null ? void 0 : y.meta) == null ? void 0 : l.fetchMore) == null ? void 0 : p.direction,
                u = ((M = t.state.data) == null ? void 0 : M.pages) || [],
                h = ((S = t.state.data) == null ? void 0 : S.pageParams) || [];
            let a = {
                    pages: [],
                    pageParams: []
                },
                f = 0;
            const g = async () => {
                let d = !1;
                const m = w => {
                        Object.defineProperty(w, "signal", {
                            enumerable: !0,
                            get: () => (t.signal.aborted ? d = !0 : t.signal.addEventListener("abort", () => {
                                d = !0
                            }), t.signal)
                        })
                    },
                    E = $t(t.options, t.fetchOptions),
                    R = async (w, D, x) => {
                        if (d) return Promise.reject();
                        if (D == null && w.pages.length) return Promise.resolve(w);
                        const U = {
                            queryKey: t.queryKey,
                            pageParam: D,
                            direction: x ? "backward" : "forward",
                            meta: t.options.meta
                        };
                        m(U);
                        const vt = await E(U),
                            {
                                maxPages: O
                            } = t.options,
                            Y = x ? ce : he;
                        return {
                            pages: Y(w.pages, vt, O),
                            pageParams: Y(w.pageParams, D, O)
                        }
                    };
                if (n && u.length) {
                    const w = n === "backward",
                        D = w ? Pe : Ut,
                        x = {
                            pages: u,
                            pageParams: h
                        },
                        U = D(i, x);
                    a = await R(x, U, w)
                } else {
                    const w = e ? ? u.length;
                    do {
                        const D = f === 0 ? h[0] ? ? i.initialPageParam : Ut(i, a);
                        if (f > 0 && D == null) break;
                        a = await R(a, D), f++
                    } while (f < w)
                }
                return a
            };
            t.options.persister ? t.fetchFn = () => {
                var d, m;
                return (m = (d = t.options).persister) == null ? void 0 : m.call(d, g, {
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal
                }, s)
            } : t.fetchFn = g
        }
    }
}

function Ut(e, {
    pages: t,
    pageParams: s
}) {
    const i = t.length - 1;
    return t.length > 0 ? e.getNextPageParam(t[i], t, s[i], s) : void 0
}

function Pe(e, {
    pages: t,
    pageParams: s
}) {
    var i;
    return t.length > 0 ? (i = e.getPreviousPageParam) == null ? void 0 : i.call(e, t[0], t, s[0], s) : void 0
}
var v, $, V, ht, ct, J, lt, dt, Bt, qe = (Bt = class {
        constructor(e = {}) {
            c(this, v);
            c(this, $);
            c(this, V);
            c(this, ht);
            c(this, ct);
            c(this, J);
            c(this, lt);
            c(this, dt);
            o(this, v, e.queryCache || new ge), o(this, $, e.mutationCache || new Oe), o(this, V, e.defaultOptions || {}), o(this, ht, new Map), o(this, ct, new Map), o(this, J, 0)
        }
        mount() {
            bt(this, J)._++, r(this, J) === 1 && (o(this, lt, Vt.subscribe(async e => {
                e && (await this.resumePausedMutations(), r(this, v).onFocus())
            })), o(this, dt, Ot.subscribe(async e => {
                e && (await this.resumePausedMutations(), r(this, v).onOnline())
            })))
        }
        unmount() {
            var e, t;
            bt(this, J)._--, r(this, J) === 0 && ((e = r(this, lt)) == null || e.call(this), o(this, lt, void 0), (t = r(this, dt)) == null || t.call(this), o(this, dt, void 0))
        }
        isFetching(e) {
            return r(this, v).findAll({ ...e,
                fetchStatus: "fetching"
            }).length
        }
        isMutating(e) {
            return r(this, $).findAll({ ...e,
                status: "pending"
            }).length
        }
        getQueryData(e) {
            var s;
            const t = this.defaultQueryOptions({
                queryKey: e
            });
            return (s = r(this, v).get(t.queryHash)) == null ? void 0 : s.state.data
        }
        ensureQueryData(e) {
            const t = this.defaultQueryOptions(e),
                s = r(this, v).build(this, t),
                i = s.state.data;
            return i === void 0 ? this.fetchQuery(e) : (e.revalidateIfStale && s.isStaleByTime(qt(t.staleTime, s)) && this.prefetchQuery(t), Promise.resolve(i))
        }
        getQueriesData(e) {
            return r(this, v).findAll(e).map(({
                queryKey: t,
                state: s
            }) => {
                const i = s.data;
                return [t, i]
            })
        }
        setQueryData(e, t, s) {
            const i = this.defaultQueryOptions({
                    queryKey: e
                }),
                n = r(this, v).get(i.queryHash),
                u = n == null ? void 0 : n.state.data,
                h = se(t, u);
            if (h !== void 0) return r(this, v).build(this, i).setData(h, { ...s,
                manual: !0
            })
        }
        setQueriesData(e, t, s) {
            return P.batch(() => r(this, v).findAll(e).map(({
                queryKey: i
            }) => [i, this.setQueryData(i, t, s)]))
        }
        getQueryState(e) {
            var s;
            const t = this.defaultQueryOptions({
                queryKey: e
            });
            return (s = r(this, v).get(t.queryHash)) == null ? void 0 : s.state
        }
        removeQueries(e) {
            const t = r(this, v);
            P.batch(() => {
                t.findAll(e).forEach(s => {
                    t.remove(s)
                })
            })
        }
        resetQueries(e, t) {
            const s = r(this, v),
                i = {
                    type: "active",
                    ...e
                };
            return P.batch(() => (s.findAll(e).forEach(n => {
                n.reset()
            }), this.refetchQueries(i, t)))
        }
        cancelQueries(e, t = {}) {
            const s = {
                    revert: !0,
                    ...t
                },
                i = P.batch(() => r(this, v).findAll(e).map(n => n.cancel(s)));
            return Promise.all(i).then(j).catch(j)
        }
        invalidateQueries(e, t = {}) {
            return P.batch(() => {
                if (r(this, v).findAll(e).forEach(i => {
                        i.invalidate()
                    }), (e == null ? void 0 : e.refetchType) === "none") return Promise.resolve();
                const s = { ...e,
                    type: (e == null ? void 0 : e.refetchType) ? ? (e == null ? void 0 : e.type) ? ? "active"
                };
                return this.refetchQueries(s, t)
            })
        }
        refetchQueries(e, t = {}) {
            const s = { ...t,
                    cancelRefetch: t.cancelRefetch ? ? !0
                },
                i = P.batch(() => r(this, v).findAll(e).filter(n => !n.isDisabled()).map(n => {
                    let u = n.fetch(void 0, s);
                    return s.throwOnError || (u = u.catch(j)), n.state.fetchStatus === "paused" ? Promise.resolve() : u
                }));
            return Promise.all(i).then(j)
        }
        fetchQuery(e) {
            const t = this.defaultQueryOptions(e);
            t.retry === void 0 && (t.retry = !1);
            const s = r(this, v).build(this, t);
            return s.isStaleByTime(qt(t.staleTime, s)) ? s.fetch(t) : Promise.resolve(s.state.data)
        }
        prefetchQuery(e) {
            return this.fetchQuery(e).then(j).catch(j)
        }
        fetchInfiniteQuery(e) {
            return e.behavior = xt(e.pages), this.fetchQuery(e)
        }
        prefetchInfiniteQuery(e) {
            return this.fetchInfiniteQuery(e).then(j).catch(j)
        }
        ensureInfiniteQueryData(e) {
            return e.behavior = xt(e.pages), this.ensureQueryData(e)
        }
        resumePausedMutations() {
            return Ot.isOnline() ? r(this, $).resumePausedMutations() : Promise.resolve()
        }
        getQueryCache() {
            return r(this, v)
        }
        getMutationCache() {
            return r(this, $)
        }
        getDefaultOptions() {
            return r(this, V)
        }
        setDefaultOptions(e) {
            o(this, V, e)
        }
        setQueryDefaults(e, t) {
            r(this, ht).set(it(e), {
                queryKey: e,
                defaultOptions: t
            })
        }
        getQueryDefaults(e) {
            const t = [...r(this, ht).values()],
                s = {};
            return t.forEach(i => {
                ft(e, i.queryKey) && Object.assign(s, i.defaultOptions)
            }), s
        }
        setMutationDefaults(e, t) {
            r(this, ct).set(it(e), {
                mutationKey: e,
                defaultOptions: t
            })
        }
        getMutationDefaults(e) {
            const t = [...r(this, ct).values()];
            let s = {};
            return t.forEach(i => {
                ft(e, i.mutationKey) && (s = { ...s,
                    ...i.defaultOptions
                })
            }), s
        }
        defaultQueryOptions(e) {
            if (e._defaulted) return e;
            const t = { ...r(this, V).queries,
                ...this.getQueryDefaults(e.queryKey),
                ...e,
                _defaulted: !0
            };
            return t.queryHash || (t.queryHash = Et(t.queryKey, t)), t.refetchOnReconnect === void 0 && (t.refetchOnReconnect = t.networkMode !== "always"), t.throwOnError === void 0 && (t.throwOnError = !!t.suspense), !t.networkMode && t.persister && (t.networkMode = "offlineFirst"), t.queryFn === Qt && (t.enabled = !1), t
        }
        defaultMutationOptions(e) {
            return e != null && e._defaulted ? e : { ...r(this, V).mutations,
                ...(e == null ? void 0 : e.mutationKey) && this.getMutationDefaults(e.mutationKey),
                ...e,
                _defaulted: !0
            }
        }
        clear() {
            r(this, v).clear(), r(this, $).clear()
        }
    }, v = new WeakMap, $ = new WeakMap, V = new WeakMap, ht = new WeakMap, ct = new WeakMap, J = new WeakMap, lt = new WeakMap, dt = new WeakMap, Bt),
    W, X, Q, H, G, wt, Mt, _t, Ce = (_t = class extends mt {
        constructor(t, s) {
            super();
            c(this, G);
            c(this, W);
            c(this, X);
            c(this, Q);
            c(this, H);
            o(this, W, t), this.setOptions(s), this.bindMethods(), b(this, G, wt).call(this)
        }
        bindMethods() {
            this.mutate = this.mutate.bind(this), this.reset = this.reset.bind(this)
        }
        setOptions(t) {
            var i;
            const s = this.options;
            this.options = r(this, W).defaultMutationOptions(t), ae(this.options, s) || r(this, W).getMutationCache().notify({
                type: "observerOptionsUpdated",
                mutation: r(this, Q),
                observer: this
            }), s != null && s.mutationKey && this.options.mutationKey && it(s.mutationKey) !== it(this.options.mutationKey) ? this.reset() : ((i = r(this, Q)) == null ? void 0 : i.state.status) === "pending" && r(this, Q).setOptions(this.options)
        }
        onUnsubscribe() {
            var t;
            this.hasListeners() || (t = r(this, Q)) == null || t.removeObserver(this)
        }
        onMutationUpdate(t) {
            b(this, G, wt).call(this), b(this, G, Mt).call(this, t)
        }
        getCurrentResult() {
            return r(this, X)
        }
        reset() {
            var t;
            (t = r(this, Q)) == null || t.removeObserver(this), o(this, Q, void 0), b(this, G, wt).call(this), b(this, G, Mt).call(this)
        }
        mutate(t, s) {
            var i;
            return o(this, H, s), (i = r(this, Q)) == null || i.removeObserver(this), o(this, Q, r(this, W).getMutationCache().build(r(this, W), this.options)), r(this, Q).addObserver(this), r(this, Q).execute(t)
        }
    }, W = new WeakMap, X = new WeakMap, Q = new WeakMap, H = new WeakMap, G = new WeakSet, wt = function() {
        var s;
        const t = ((s = r(this, Q)) == null ? void 0 : s.state) ? ? Zt();
        o(this, X, { ...t,
            isPending: t.status === "pending",
            isSuccess: t.status === "success",
            isError: t.status === "error",
            isIdle: t.status === "idle",
            mutate: this.mutate,
            reset: this.reset
        })
    }, Mt = function(t) {
        P.batch(() => {
            var s, i, n, u, h, a, f, g;
            if (r(this, H) && this.hasListeners()) {
                const y = r(this, X).variables,
                    l = r(this, X).context;
                (t == null ? void 0 : t.type) === "success" ? ((i = (s = r(this, H)).onSuccess) == null || i.call(s, t.data, y, l), (u = (n = r(this, H)).onSettled) == null || u.call(n, t.data, null, y, l)) : (t == null ? void 0 : t.type) === "error" && ((a = (h = r(this, H)).onError) == null || a.call(h, t.error, y, l), (g = (f = r(this, H)).onSettled) == null || g.call(f, void 0, t.error, y, l))
            }
            this.listeners.forEach(y => {
                y(r(this, X))
            })
        })
    }, _t),
    te = B.createContext(void 0),
    Se = e => {
        const t = B.useContext(te);
        if (!t) throw new Error("No QueryClient set, use QueryClientProvider to set one");
        return t
    },
    Ae = ({
        client: e,
        children: t
    }) => (B.useEffect(() => (e.mount(), () => {
        e.unmount()
    }), [e]), ee.jsx(te.Provider, {
        value: e,
        children: t
    }));

function Fe(e, t) {
    return typeof e == "function" ? e(...t) : !!e
}

function Me() {}

function Re(e, t) {
    const s = Se(),
        [i] = B.useState(() => new Ce(s, e));
    B.useEffect(() => {
        i.setOptions(e)
    }, [i, e]);
    const n = B.useSyncExternalStore(B.useCallback(h => i.subscribe(P.batchCalls(h)), [i]), () => i.getCurrentResult(), () => i.getCurrentResult()),
        u = B.useCallback((h, a) => {
            i.mutate(h, a).catch(Me)
        }, [i]);
    if (n.error && Fe(i.options.throwOnError, [n.error])) throw n.error;
    return { ...n,
        mutate: u,
        mutateAsync: n.mutate
    }
}
export {
    qe as Q, Ae as a, Re as u
};