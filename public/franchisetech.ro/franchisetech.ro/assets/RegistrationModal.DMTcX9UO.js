import {
    j as e
} from "./ui-vendor.Bl07kmxE.js";
import {
    r as h
} from "./react-vendor.CoFnG1Cb.js";
import {
    D as Q,
    i as X,
    m as ee,
    n as se,
    o as ae,
    F as te,
    b as c,
    d as l,
    e as m,
    f as d,
    I as u,
    B as N,
    g as x,
    L as re,
    t as ie
} from "./index.DrC_YY1K.js";
import {
    C as ne
} from "./checkbox.DrjMjESB.js";
import {
    P as oe,
    v as M,
    g as ce,
    p as O
} from "./odooVATHelper.BJeXAh4R.js";
import {
    z as o,
    b as le
} from "./form-vendor.CYdr9quq.js";
import {
    e as F
} from "./index.DfBlkqaH.js";
import {
    as as me,
    r as de,
    E as V,
    b as k,
    A as ue,
    y as xe,
    L as U
} from "./icons-vendor.BaRxkmJj.js";
import "./query-vendor.Ckm1xsuj.js";
import "./utils-vendor.B2rm_Apj.js";
import "./i18n-vendor.CxbKsUuT.js";
import "./motion-vendor.CwL1EI4n.js";
const pe = o.object({
        company: o.string().min(1, "Numele companiei este obligatoriu"),
        cui: o.string().min(1, "Numărul CUI este obligatoriu"),
        cod_postal: o.string(),
        address: o.string().optional(),
        county: o.string().optional(),
        phone: o.string().optional(),
        numar_reg_com: o.string().optional(),
        adminName: o.string().min(1, "Numele administratorului este obligatoriu"),
        email: o.string().email("Adresa de email nu este validă"),
        adminPassword: o.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
        confirmPassword: o.string(),
        acceptTermsAndPrivacy: o.boolean().refine(j => j === !0, "Trebuie să acceptați termenii și condițiile și politica de confidențialitate"),
        acceptMarketing: o.boolean().optional()
    }).refine(j => j.adminPassword === j.confirmPassword, {
        message: "Parolele nu se potrivesc",
        path: ["confirmPassword"]
    }),
    E = {
        COMPANY_DETAILS: "Detalii Companie",
        ADMIN_SETUP: "Configurare Cont Administrator",
        COMPLETED: "Înregistrare Completă"
    },
    Ee = ({
        open: j,
        onOpenChange: z
    }) => {
        const [i, b] = h.useState("COMPANY_DETAILS"), [v, R] = h.useState(!1), [C, Y] = h.useState(!1), [y, A] = h.useState(!1), [$, g] = h.useState(!1), [J, w] = h.useState({
            stage: "init",
            message: ""
        }), [_, T] = h.useState(null);
        h.useEffect(() => {
            try {
                F.init("Zf4lxizbewKMs2_SJ")
            } catch (s) {
                console.error("Failed to initialize EmailJS:", s)
            }
        }, []);
        const t = le({
                resolver: ie(pe),
                defaultValues: {
                    company: "",
                    cui: "",
                    cod_postal: "",
                    address: "",
                    county: "",
                    phone: "",
                    numar_reg_com: "",
                    adminName: "",
                    email: "",
                    adminPassword: "",
                    confirmPassword: "",
                    acceptTermsAndPrivacy: !1,
                    acceptMarketing: !1
                }
            }),
            S = "https://api.franchisetech.ro",
            D = async s => {
                if (!s) return t.setError("cui", {
                    message: "Numărul CUI este obligatoriu"
                }), g(!1), !1;
                const a = M(s);
                if (!a.isValid) return t.setError("cui", {
                    message: `Format CUI invalid. Formate acceptate: ${ce()}`
                }), g(!1), !1;
                const n = a.formattedVAT;
                try {
                    const p = n.startsWith("RO") ? n.substring(2) : n,
                        f = await fetch(`${S}/api/anaf-lookup?cui=${p}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                    if (f.ok) {
                        const r = await f.json();
                        return r.found ? (t.clearErrors("cui"), g(!0), r.denumire && !t.watch("company") && t.setValue("company", r.denumire), r.adresa && !t.watch("address") && t.setValue("address", r.adresa), r.judet && !t.watch("county") && t.setValue("county", r.judet), r.telefon && !t.watch("phone") && t.setValue("phone", r.telefon), r.numar_reg_com && !t.watch("numar_reg_com") && t.setValue("numar_reg_com", r.numar_reg_com), r.cod_postal && !t.watch("cod_postal") && t.setValue("cod_postal", r.cod_postal), !0) : (t.setError("cui", {
                            message: r.error || "CUI-ul nu a fost găsit în baza de date ANAF"
                        }), g(!1), !1)
                    } else return t.clearErrors("cui"), g(!0), !0
                } catch (p) {
                    return console.error("CUI validation error:", p), t.clearErrors("cui"), g(!0), !0
                }
            },
            B = () => {
                if (i === "COMPLETED") return !0;
                const s = {
                    COMPANY_DETAILS: ["company", "cui"],
                    ADMIN_SETUP: ["adminName", "email", "adminPassword", "confirmPassword", "acceptTermsAndPrivacy"]
                }[i];
                if (!s) return !1;
                if (i === "COMPANY_DETAILS") {
                    const a = t.watch("cui"),
                        n = t.watch("company");
                    return !(!n || n.trim().length === 0 || !a || a.trim().length === 0)
                }
                return s.every(a => {
                    const n = t.watch(a);
                    return typeof n == "boolean" ? n === !0 : n && n.length > 0
                })
            },
            K = (() => {
                const s = ["COMPANY_DETAILS", "ADMIN_SETUP", "COMPLETED"];
                return s.indexOf(i) / (s.length - 1) * 100
            })(),
            Z = () => {
                if (B()) {
                    const s = ["COMPANY_DETAILS", "ADMIN_SETUP", "COMPLETED"],
                        a = s.indexOf(i);
                    a < s.length - 1 && b(s[a + 1])
                }
            },
            G = () => {
                const s = ["COMPANY_DETAILS", "ADMIN_SETUP", "COMPLETED"],
                    a = s.indexOf(i);
                a > 0 && b(s[a - 1])
            },
            H = async s => {
                try {
                    const a = O(s);
                    (await F.send("service_4eg860j", "template_jhudei4", {
                        subject: `[Înregistrare Nouă] ${a.company} - ${a.adminName}`,
                        type: "registration",
                        company: a.company,
                        email: a.email,
                        phone: a.phone || "N/A",
                        address: a.address || "N/A",
                        county: a.county || "N/A",
                        cui: a.cui || "N/A",
                        admin_name: a.adminName,
                        numar_reg_com: a.numar_reg_com || "N/A",
                        cod_postal: a.cod_postal || "N/A"
                    })).status === 200 && console.log("Email sent successfully")
                } catch (a) {
                    console.error("EmailJS error:", a)
                }
            },
            W = async s => {
                var f;
                if (!await D(s.cui || "")) {
                    console.error("CUI validation failed");
                    return
                }
                const n = M(s.cui || ""),
                    p = { ...s,
                        cui: n.formattedVAT
                    };
                A(!0), T(null);
                try {
                    w({
                        stage: "company",
                        message: "Se creează compania..."
                    });
                    const r = O(p),
                        I = await fetch(`${S}/api/odoo/create-company`, {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: r.company,
                                email: r.email,
                                cod_postal: r.cod_postal,
                                phone: r.phone || void 0,
                                street: r.address || void 0,
                                cui: r.cui || void 0,
                                county: r.county || void 0,
                                numar_reg_com: r.numar_reg_com || void 0,
                                adminName: r.adminName,
                                adminLogin: r.email,
                                adminPassword: r.adminPassword
                            })
                        }),
                        P = await I.json();
                    if (!I.ok) throw new Error(P.error || "Nu s-a putut crea compania");
                    if (w({
                            stage: "admin",
                            message: "Se configurează contul..."
                        }), await H(p), w({
                            stage: "finalizing",
                            message: "Se finalizează..."
                        }), (f = P.data) != null && f.auto_login_url) {
                        b("COMPLETED");
                        const L = P.data.auto_login_url;
                        console.log("Auto-login URL generated:", L), window.location.href = L
                    } else b("COMPLETED"), A(!1), w({
                        stage: "init",
                        message: ""
                    })
                } catch (r) {
                    console.error("Submission error:", r), T(r.message || "A apărut o eroare neașteptată. Vă rugăm să încercați din nou."), A(!1), w({
                        stage: "init",
                        message: ""
                    })
                }
            },
            q = ({
                stage: s
            }) => e.jsx("div", {
                className: "py-6 space-y-6 text-center",
                children: e.jsxs("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [e.jsx(U, {
                        className: "h-12 w-12 animate-spin text-primary"
                    }), e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("h3", {
                            className: "text-lg font-semibold text-primary",
                            children: s.message
                        }), e.jsx("p", {
                            className: "text-sm text-muted-foreground max-w-md mx-auto",
                            children: "Vă rugăm să nu închideți această fereastră"
                        })]
                    })]
                })
            });
        return e.jsx(Q, {
            open: j,
            onOpenChange: z,
            children: e.jsxs(X, {
                className: "sm:max-w-[600px] max-h-[90vh] overflow-y-auto",
                children: [e.jsx(ee, {
                    children: e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx(se, {
                            className: "text-xl md:text-3xl font-bold bg-gradient-to-r from-[#9747FF] via-[#8A43E6] to-[#6E35B9] bg-clip-text text-transparent pb-1",
                            children: "Începeți cu FranchiseTech"
                        }), i !== "COMPLETED" && e.jsxs(e.Fragment, {
                            children: [e.jsx(ae, {
                                className: "text-sm md:text-base font-medium text-foreground/80",
                                children: E[i]
                            }), e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx(oe, {
                                    value: K,
                                    className: "h-2"
                                }), e.jsxs("p", {
                                    className: "text-xs md:text-sm text-muted-foreground",
                                    children: ["Pasul", " ", Object.keys(E).indexOf(i) + 1, " ", "din ", Object.keys(E).length]
                                })]
                            })]
                        })]
                    })
                }), _ && e.jsx("div", {
                    className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-4",
                    children: e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx("div", {
                            className: "w-5 h-5 text-red-500",
                            children: "⚠️"
                        }), e.jsx("p", {
                            className: "text-sm text-red-700",
                            children: _
                        })]
                    })
                }), y ? e.jsx(q, {
                    stage: J
                }) : i === "COMPLETED" ? e.jsxs("div", {
                    className: "py-6 md:py-8 text-center space-y-4",
                    children: [e.jsx("div", {
                        className: "flex justify-center",
                        children: e.jsx(me, {
                            className: "h-12 w-12 md:h-16 md:w-16 text-primary"
                        })
                    }), e.jsx("h3", {
                        className: "text-xl md:text-2xl font-semibold text-primary",
                        children: "Vă Mulțumim că Ați Ales FranchiseTech!"
                    }), e.jsx("p", {
                        className: "text-sm md:text-base text-muted-foreground max-w-md mx-auto",
                        children: "Compania dvs. a fost creată cu succes. Veți fi redirecționat către dashboard în câteva momente..."
                    })]
                }) : e.jsx(te, { ...t,
                    children: e.jsxs("form", {
                        onSubmit: t.handleSubmit(W),
                        className: "space-y-4 md:space-y-6",
                        children: [i === "COMPANY_DETAILS" && e.jsxs("div", {
                            className: "space-y-4",
                            children: [e.jsx(c, {
                                control: t.control,
                                name: "cui",
                                render: ({
                                    field: s
                                }) => e.jsxs(l, {
                                    children: [e.jsx(m, {
                                        children: "Numărul CUI *"
                                    }), e.jsx(d, {
                                        children: e.jsxs("div", {
                                            className: "flex gap-2",
                                            children: [e.jsxs("div", {
                                                className: "relative flex-1",
                                                children: [e.jsx(de, {
                                                    className: "absolute left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-muted-foreground"
                                                }), e.jsx(u, {
                                                    placeholder: "Introduceți CUI (ex: RO18752774 sau 18752774)",
                                                    className: "pl-10 text-sm md:text-base",
                                                    type: "text",
                                                    ...s,
                                                    autoFocus: !0,
                                                    onKeyDown: a => {
                                                        const n = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
                                                            p = /^[0-9]$/.test(a.key),
                                                            f = /^[A-Za-z]$/.test(a.key),
                                                            r = n.includes(a.key);
                                                        !p && !f && !r && a.preventDefault()
                                                    },
                                                    onChange: a => {
                                                        s.onChange(a.target.value), $ && g(!1)
                                                    }
                                                })]
                                            }), e.jsx(N, {
                                                type: "button",
                                                variant: "outline",
                                                onClick: () => {
                                                    const a = t.watch("cui");
                                                    a && D(a)
                                                },
                                                className: "text-sm md:text-base whitespace-nowrap",
                                                children: "Validare CUI"
                                            })]
                                        })
                                    }), e.jsx(x, {})]
                                })
                            }), e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: [e.jsx(c, {
                                    control: t.control,
                                    name: "company",
                                    render: ({
                                        field: s
                                    }) => e.jsxs(l, {
                                        children: [e.jsx(m, {
                                            children: "Numele Companiei"
                                        }), e.jsx(d, {
                                            children: e.jsx(u, {
                                                placeholder: "Numele Companiei",
                                                className: "text-sm md:text-base",
                                                ...s
                                            })
                                        }), e.jsx(x, {})]
                                    })
                                }), e.jsx(c, {
                                    control: t.control,
                                    name: "numar_reg_com",
                                    render: ({
                                        field: s
                                    }) => e.jsxs(l, {
                                        children: [e.jsx(m, {
                                            children: "Nr. Reg. Com."
                                        }), e.jsx(d, {
                                            children: e.jsx(u, {
                                                placeholder: "Nr. Reg. Com.",
                                                className: "text-sm md:text-base",
                                                ...s
                                            })
                                        }), e.jsx(x, {})]
                                    })
                                })]
                            }), e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: [e.jsx(c, {
                                    control: t.control,
                                    name: "address",
                                    render: ({
                                        field: s
                                    }) => e.jsxs(l, {
                                        children: [e.jsx(m, {
                                            children: "Adresa"
                                        }), e.jsx(d, {
                                            children: e.jsx(u, {
                                                placeholder: "Adresa Companiei",
                                                className: "text-sm md:text-base",
                                                ...s
                                            })
                                        }), e.jsx(x, {})]
                                    })
                                }), e.jsx(c, {
                                    control: t.control,
                                    name: "county",
                                    render: ({
                                        field: s
                                    }) => e.jsxs(l, {
                                        children: [e.jsx(m, {
                                            children: "Județul"
                                        }), e.jsx(d, {
                                            children: e.jsx(u, {
                                                placeholder: "Județul",
                                                className: "text-sm md:text-base",
                                                ...s
                                            })
                                        }), e.jsx(x, {})]
                                    })
                                })]
                            })]
                        }), i === "ADMIN_SETUP" && e.jsxs("div", {
                            className: "space-y-4",
                            children: [e.jsx(c, {
                                control: t.control,
                                name: "adminName",
                                render: ({
                                    field: s
                                }) => e.jsxs(l, {
                                    children: [e.jsx(m, {
                                        children: "Numele Administratorului"
                                    }), e.jsx(d, {
                                        children: e.jsx(u, {
                                            placeholder: "Numele Complet",
                                            className: "text-sm md:text-base",
                                            ...s
                                        })
                                    }), e.jsx(x, {})]
                                })
                            }), e.jsx(c, {
                                control: t.control,
                                name: "email",
                                render: ({
                                    field: s
                                }) => e.jsxs(l, {
                                    children: [e.jsx(m, {
                                        children: "Adresa de Email"
                                    }), e.jsx(d, {
                                        children: e.jsx(u, {
                                            type: "email",
                                            placeholder: "email.dvs@companie.com",
                                            className: "text-sm md:text-base",
                                            ...s
                                        })
                                    }), e.jsx(x, {})]
                                })
                            }), e.jsx(c, {
                                control: t.control,
                                name: "adminPassword",
                                render: ({
                                    field: s
                                }) => e.jsxs(l, {
                                    children: [e.jsx(m, {
                                        children: "Parola"
                                    }), e.jsx(d, {
                                        children: e.jsxs("div", {
                                            className: "relative",
                                            children: [e.jsx(u, {
                                                type: v ? "text" : "password",
                                                placeholder: "Minim 6 caractere",
                                                className: "text-sm md:text-base",
                                                ...s
                                            }), e.jsx(N, {
                                                type: "button",
                                                variant: "ghost",
                                                size: "sm",
                                                className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                                onClick: () => R(!v),
                                                children: v ? e.jsx(V, {
                                                    className: "h-4 w-4"
                                                }) : e.jsx(k, {
                                                    className: "h-4 w-4"
                                                })
                                            })]
                                        })
                                    }), e.jsx(x, {})]
                                })
                            }), e.jsx(c, {
                                control: t.control,
                                name: "confirmPassword",
                                render: ({
                                    field: s
                                }) => e.jsxs(l, {
                                    children: [e.jsx(m, {
                                        children: "Confirmați Parola"
                                    }), e.jsx(d, {
                                        children: e.jsxs("div", {
                                            className: "relative",
                                            children: [e.jsx(u, {
                                                type: C ? "text" : "password",
                                                placeholder: "Confirmați parola dvs",
                                                className: "text-sm md:text-base",
                                                ...s
                                            }), e.jsx(N, {
                                                type: "button",
                                                variant: "ghost",
                                                size: "sm",
                                                className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                                onClick: () => Y(!C),
                                                children: C ? e.jsx(V, {
                                                    className: "h-4 w-4"
                                                }) : e.jsx(k, {
                                                    className: "h-4 w-4"
                                                })
                                            })]
                                        })
                                    }), e.jsx(x, {})]
                                })
                            }), e.jsxs("div", {
                                className: "space-y-4 pt-4 border-t",
                                children: [e.jsx("h4", {
                                    className: "text-sm font-medium text-gray-900",
                                    children: "Termeni și Condiții"
                                }), e.jsx("div", {
                                    className: "space-y-4",
                                    children: e.jsxs("div", {
                                        className: "flex items-start space-x-3",
                                        children: [e.jsx(ne, {
                                            id: "acceptTermsAndPrivacy",
                                            checked: t.watch("acceptTermsAndPrivacy"),
                                            onCheckedChange: s => t.setValue("acceptTermsAndPrivacy", s)
                                        }), e.jsx("div", {
                                            className: "grid gap-1.5 leading-none",
                                            children: e.jsxs(re, {
                                                htmlFor: "acceptTermsAndPrivacy",
                                                className: "text-sm",
                                                children: ["Accept ", e.jsx("a", {
                                                    href: "/legal/terms-and-conditions",
                                                    target: "_blank",
                                                    className: "text-primary hover:underline",
                                                    children: "Termenii și Condițiile"
                                                }), " și ", e.jsx("a", {
                                                    href: "/legal/privacy-policy",
                                                    target: "_blank",
                                                    className: "text-primary hover:underline",
                                                    children: "Politica de Confidențialitate"
                                                }), " *"]
                                            })
                                        })]
                                    })
                                }), t.formState.errors.acceptTermsAndPrivacy && e.jsx("p", {
                                    className: "text-sm text-red-500 mt-1",
                                    children: t.formState.errors.acceptTermsAndPrivacy.message
                                })]
                            })]
                        }), e.jsx("div", {
                            className: "flex justify-between pt-4",
                            children: i !== "COMPLETED" && e.jsxs(e.Fragment, {
                                children: [e.jsxs(N, {
                                    type: "button",
                                    variant: "outline",
                                    onClick: G,
                                    disabled: i === "COMPANY_DETAILS" || y,
                                    className: "text-sm md:text-base",
                                    children: [e.jsx(ue, {
                                        className: "mr-2 h-4 w-4"
                                    }), "Înapoi"]
                                }), i !== "ADMIN_SETUP" ? e.jsxs(N, {
                                    type: "button",
                                    onClick: Z,
                                    disabled: y || i === "COMPANY_DETAILS" && !t.watch("cui"),
                                    className: "text-sm md:text-base",
                                    children: ["Următorul", e.jsx(xe, {
                                        className: "ml-2 h-4 w-4"
                                    })]
                                }) : e.jsx(N, {
                                    type: "submit",
                                    disabled: y,
                                    className: "text-sm md:text-base",
                                    children: y ? e.jsxs(e.Fragment, {
                                        children: [e.jsx(U, {
                                            className: "mr-2 h-4 w-4 animate-spin"
                                        }), "Se Creează..."]
                                    }) : "Creați Compania"
                                })]
                            })
                        })]
                    })
                })]
            })
        })
    };
export {
    Ee as
    default
};