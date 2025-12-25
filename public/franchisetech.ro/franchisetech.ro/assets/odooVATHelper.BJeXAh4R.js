import {
    a as $,
    j as n,
    P as g
} from "./ui-vendor.Bl07kmxE.js";
import {
    r as u
} from "./react-vendor.CoFnG1Cb.js";
import {
    c as b
} from "./index.DrC_YY1K.js";
var f = "Progress",
    c = 100,
    [O, L] = $(f),
    [h, E] = O(f),
    x = u.forwardRef((e, r) => {
        const {
            __scopeProgress: s,
            value: t = null,
            max: a,
            getValueLabel: y = I,
            ...R
        } = e;
        (a || a === 0) && !p(a) && console.error(_(`${a}`, "Progress"));
        const i = p(a) ? a : c;
        t !== null && !m(t, i) && console.error(w(`${t}`, "Progress"));
        const o = m(t, i) ? t : null,
            N = d(o) ? y(o, i) : void 0;
        return n.jsx(h, {
            scope: s,
            value: o,
            max: i,
            children: n.jsx(g.div, {
                "aria-valuemax": i,
                "aria-valuemin": 0,
                "aria-valuenow": d(o) ? o : void 0,
                "aria-valuetext": N,
                role: "progressbar",
                "data-state": A(o, i),
                "data-value": o ? ? void 0,
                "data-max": i,
                ...R,
                ref: r
            })
        })
    });
x.displayName = f;
var V = "ProgressIndicator",
    P = u.forwardRef((e, r) => {
        const {
            __scopeProgress: s,
            ...t
        } = e, a = E(V, s);
        return n.jsx(g.div, {
            "data-state": A(a.value, a.max),
            "data-value": a.value ? ? void 0,
            "data-max": a.max,
            ...t,
            ref: r
        })
    });
P.displayName = V;

function I(e, r) {
    return `${Math.round(e/r*100)}%`
}

function A(e, r) {
    return e == null ? "indeterminate" : e === r ? "complete" : "loading"
}

function d(e) {
    return typeof e == "number"
}

function p(e) {
    return d(e) && !isNaN(e) && e > 0
}

function m(e, r) {
    return d(e) && !isNaN(e) && e <= r && e >= 0
}

function _(e, r) {
    return `Invalid prop \`max\` of value \`${e}\` supplied to \`${r}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${c}\`.`
}

function w(e, r) {
    return `Invalid prop \`value\` of value \`${e}\` supplied to \`${r}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${c} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`
}
var T = x,
    j = P;
const S = u.forwardRef(({
    className: e,
    value: r,
    ...s
}, t) => n.jsx(T, {
    ref: t,
    className: b("relative h-4 w-full overflow-hidden rounded-full bg-secondary", e),
    ...s,
    children: n.jsx(j, {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: {
            transform: `translateX(-${100-(r||0)}%)`
        }
    })
}));
S.displayName = T.displayName;
const l = {
    company: /^RO\d{10}$/,
    individual1: /^8\d{12}$/,
    individual2: /^9\d{12}$/,
    legacy: /^\d{6,10}$/
};

function D(e) {
    if (!e) return {
        isValid: !1,
        formattedVAT: "",
        error: "VAT number is required",
        type: "invalid"
    };
    let r = e.toString().trim().toUpperCase();
    return r = r.replace(/[\s\-\.]/g, ""), r.startsWith("RO") ? l.company.test(r) ? {
        isValid: !0,
        formattedVAT: r,
        type: "company"
    } : {
        isValid: !1,
        formattedVAT: r,
        error: "Invalid RO VAT format. Expected: RO1234567897",
        type: "invalid"
    } : l.individual1.test(r) ? {
        isValid: !0,
        formattedVAT: r,
        type: "individual"
    } : l.individual2.test(r) ? {
        isValid: !0,
        formattedVAT: r,
        type: "individual"
    } : l.legacy.test(r) ? {
        isValid: !0,
        formattedVAT: `RO${r}`,
        type: "company"
    } : {
        isValid: !1,
        formattedVAT: r,
        error: "Invalid VAT format. Expected: RO1234567897, 8001011234567, 9000123456789, or 6-10 digits",
        type: "invalid"
    }
}

function G() {
    return "RO1234567897, 8001011234567, 9000123456789, or 6-10 digits"
}

function v(e) {
    if (!e) return "";
    const r = D(e);
    return r.isValid ? r.formattedVAT : (console.warn("VAT number validation failed:", e, r.error), e)
}

function U(e) {
    const r = { ...e
    };
    return r.cui && (r.cui = v(r.cui)), r.vat && (r.vat = v(r.vat)), r
}
export {
    S as P, G as g, U as p, D as v
};