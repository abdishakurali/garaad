import {
    j as e
} from "./ui-vendor.Bl07kmxE.js";
import {
    r as g
} from "./react-vendor.CoFnG1Cb.js";
import {
    D as Q,
    i as X,
    m as ee,
    n as se,
    o as ae,
    F as te,
    b as l,
    d,
    e as m,
    f as u,
    I as x,
    B as N,
    g as p,
    L as re,
    t as ne
} from "./index.DrC_YY1K.js";
import {
    P as ie,
    v as L,
    g as oe,
    p as O
} from "./odooVATHelper.BJeXAh4R.js";
import {
    C as ce
} from "./checkbox.DrjMjESB.js";
import {
    z as c,
    b as le
} from "./form-vendor.CYdr9quq.js";
import {
    e as M
} from "./index.DfBlkqaH.js";
import {
    as as de,
    r as F,
    E as V,
    b as U,
    A as me,
    y as ue,
    L as k
} from "./icons-vendor.BaRxkmJj.js";
import "./query-vendor.Ckm1xsuj.js";
import "./utils-vendor.B2rm_Apj.js";
import "./i18n-vendor.CxbKsUuT.js";
import "./motion-vendor.CwL1EI4n.js";
const xe = c.object({
        company: c.string().min(1, "Numele companiei este obligatoriu"),
        cui: c.string().min(1, "Numărul CUI este obligatoriu"),
        cod_postal: c.string(),
        address: c.string().optional(),
        county: c.string().optional(),
        phone: c.string().optional(),
        numar_reg_com: c.string().optional(),
        adminName: c.string().min(1, "Numele administratorului este obligatoriu"),
        email: c.string().email("Adresa de email nu este validă"),
        adminPassword: c.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
        confirmPassword: c.string(),
        acceptTermsAndPrivacy: c.boolean().refine(j => j === !0, "Trebuie să acceptați termenii și condițiile și politica de confidențialitate"),
        acceptMarketing: c.boolean().optional()
    }).refine(j => j.adminPassword === j.confirmPassword, {
        message: "Parolele nu se potrivesc",
        path: ["confirmPassword"]
    }),
    _ = {
        COMPANY_DETAILS: "Detalii Companie",
        ADMIN_SETUP: "Configurare Cont Administrator",
        COMPLETED: "Înregistrare Completă"
    };

function Pe({
    open: j,
    onOpenChange: z
}) {
    const [o, v] = g.useState("COMPANY_DETAILS"), [w, Y] = g.useState(!1), [C, R] = g.useState(!1), [y, A] = g.useState(!1), [S, f] = g.useState(!1), [$, b] = g.useState({
        stage: "init",
        message: ""
    }), [T, P] = g.useState(null);
    g.useEffect(() => {
        try {
            M.init("Zf4lxizbewKMs2_SJ")
        } catch (s) {
            console.error("Failed to initialize EmailJS:", s)
        }
    }, []);
    const a = le({
            resolver: ne(xe),
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
        D = "https://api.franchisetech.ro",
        J = async s => {
            if (!s) return a.setError("cui", {
                message: "Numărul CUI este obligatoriu"
            }), f(!1), !1;
            const t = L(s);
            if (!t.isValid) return a.setError("cui", {
                message: `Format CUI invalid. Formate acceptate: ${oe()}`
            }), f(!1), !1;
            const i = t.formattedVAT;
            try {
                const h = i.startsWith("RO") ? i.substring(2) : i,
                    r = await fetch(`${D}/api/anaf-lookup?cui=${h}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                if (r.ok) {
                    const n = await r.json();
                    return n.found ? (a.clearErrors("cui"), f(!0), n.denumire && !a.watch("company") && a.setValue("company", n.denumire), n.adresa && !a.watch("address") && a.setValue("address", n.adresa), n.judet && !a.watch("county") && a.setValue("county", n.judet), n.telefon && !a.watch("phone") && a.setValue("phone", n.telefon), n.numar_reg_com && !a.watch("numar_reg_com") && a.setValue("numar_reg_com", n.numar_reg_com), n.cod_postal && !a.watch("cod_postal") && a.setValue("cod_postal", n.cod_postal), !0) : (a.setError("cui", {
                        message: n.error || "CUI-ul nu a fost găsit în baza de date ANAF"
                    }), f(!1), !1)
                } else return a.clearErrors("cui"), f(!0), !0
            } catch (h) {
                return console.error("CUI validation error:", h), a.clearErrors("cui"), f(!0), !0
            }
        },
        B = async s => {
            try {
                const t = O(s);
                (await M.send("service_4eg860j", "template_jhudei4", {
                    subject: `[Înregistrare Nouă] ${t.company} - ${t.adminName}`,
                    type: "registration",
                    company: t.company,
                    email: t.email,
                    phone: t.phone || "N/A",
                    address: t.address || "N/A",
                    county: t.county || "N/A",
                    cui: t.cui || "N/A",
                    admin_name: t.adminName,
                    numar_reg_com: t.numar_reg_com || "N/A",
                    cod_postal: t.cod_postal || "N/A"
                })).status === 200 && console.log("Email sent successfully")
            } catch (t) {
                console.error("EmailJS error:", t)
            }
        },
        K = async s => {
            var h;
            if (!S) {
                P("Vă rugăm să validați CUI-ul companiei apăsând butonul 'Validare CUI' înainte de a continua."), a.setError("cui", {
                    message: "CUI-ul trebuie validat apăsând butonul 'Validare CUI'"
                });
                return
            }
            const t = L(s.cui || ""),
                i = { ...s,
                    cui: t.formattedVAT
                };
            A(!0), P(null);
            try {
                b({
                    stage: "company",
                    message: "Se creează compania..."
                });
                const r = O(i),
                    n = await fetch(`${D}/api/odoo/create-company`, {
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
                    E = await n.json();
                if (!n.ok) throw new Error(E.error || "Nu s-a putut crea compania");
                if (b({
                        stage: "admin",
                        message: "Se configurează contul..."
                    }), await B(i), b({
                        stage: "finalizing",
                        message: "Se finalizează..."
                    }), (h = E.data) != null && h.auto_login_url) {
                    v("COMPLETED");
                    const I = E.data.auto_login_url;
                    console.log("Auto-login URL generated:", I), window.location.href = I
                } else v("COMPLETED"), A(!1), b({
                    stage: "init",
                    message: ""
                })
            } catch (r) {
                console.error("Submission error:", r), P(r.message || "A apărut o eroare neașteptată. Vă rugăm să încercați din nou."), A(!1), b({
                    stage: "init",
                    message: ""
                })
            }
        },
        Z = () => {
            if (o === "COMPLETED") return !0;
            const s = {
                COMPANY_DETAILS: ["company", "cui"],
                ADMIN_SETUP: ["adminName", "email", "adminPassword", "confirmPassword", "acceptTermsAndPrivacy"]
            }[o];
            if (!s) return !1;
            if (o === "COMPANY_DETAILS") {
                const t = a.watch("cui"),
                    i = a.watch("company");
                return !(!i || i.trim().length === 0 || !t || t.trim().length === 0)
            }
            return s.every(t => {
                const i = a.watch(t);
                return typeof i == "boolean" ? i === !0 : i && i.length > 0
            })
        },
        G = (() => {
            const s = ["COMPANY_DETAILS", "ADMIN_SETUP", "COMPLETED"];
            return s.indexOf(o) / (s.length - 1) * 100
        })(),
        H = () => {
            if (Z()) {
                const s = ["COMPANY_DETAILS", "ADMIN_SETUP", "COMPLETED"],
                    t = s.indexOf(o);
                t < s.length - 1 && v(s[t + 1])
            }
        },
        W = () => {
            const s = ["COMPANY_DETAILS", "ADMIN_SETUP", "COMPLETED"],
                t = s.indexOf(o);
            t > 0 && v(s[t - 1])
        },
        q = ({
            stage: s
        }) => e.jsx("div", {
            className: "py-8 space-y-6 text-center",
            children: e.jsxs("div", {
                className: "flex flex-col items-center gap-4",
                children: [e.jsx(k, {
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
                    }), o !== "COMPLETED" && e.jsxs(e.Fragment, {
                        children: [e.jsx(ae, {
                            className: "text-sm md:text-base font-medium text-foreground/80",
                            children: _[o]
                        }), e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx(ie, {
                                value: G,
                                className: "h-2"
                            }), e.jsxs("p", {
                                className: "text-xs md:text-sm text-muted-foreground",
                                children: ["Pasul", " ", Object.keys(_).indexOf(o) + 1, " ", "din ", Object.keys(_).length]
                            })]
                        })]
                    })]
                })
            }), T && e.jsx("div", {
                className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-4",
                children: e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx("div", {
                        className: "w-5 h-5 text-red-500",
                        children: "⚠️"
                    }), e.jsx("p", {
                        className: "text-sm text-red-700",
                        children: T
                    })]
                })
            }), y ? e.jsx(q, {
                stage: $
            }) : o === "COMPLETED" ? e.jsxs("div", {
                className: "py-8 md:py-12 text-center space-y-6",
                children: [e.jsx("div", {
                    className: "flex justify-center",
                    children: e.jsxs("div", {
                        className: "relative",
                        children: [e.jsx("div", {
                            className: "w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse",
                            children: e.jsx(de, {
                                className: "h-10 w-10 text-white"
                            })
                        }), e.jsx("div", {
                            className: "absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"
                        }), e.jsx("div", {
                            className: "absolute -bottom-1 -left-1 w-4 h-4 bg-green-300 rounded-full animate-bounce",
                            style: {
                                animationDelay: "0.5s"
                            }
                        })]
                    })
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsx("h3", {
                        className: "text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent",
                        children: "Infrastructură Digitală Creată cu Succes!"
                    }), e.jsxs("p", {
                        className: "text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed",
                        children: ["Spațiul de lucru profesional pentru ", e.jsx("strong", {
                            children: a.watch("company")
                        }), " este gata. Veți fi redirecționat către dashboard-ul personalizat în câteva momente..."]
                    })]
                }), e.jsx("div", {
                    className: "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto",
                    children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "w-8 h-8 bg-green-500 rounded-full flex items-center justify-center",
                            children: e.jsx(F, {
                                className: "w-4 h-4 text-white"
                            })
                        }), e.jsxs("div", {
                            className: "text-left",
                            children: [e.jsx("p", {
                                className: "text-sm font-semibold text-green-800",
                                children: "Spațiu de Lucru Activ"
                            }), e.jsx("p", {
                                className: "text-xs text-green-600",
                                children: "Toate modulele sunt configurate și funcționale"
                            })]
                        })]
                    })
                })]
            }) : e.jsx(te, { ...a,
                children: e.jsxs("form", {
                    onSubmit: a.handleSubmit(K),
                    className: "space-y-4 md:space-y-6",
                    children: [o === "COMPANY_DETAILS" && e.jsxs("div", {
                        className: "space-y-4",
                        children: [e.jsx(l, {
                            control: a.control,
                            name: "cui",
                            render: ({
                                field: s
                            }) => e.jsxs(d, {
                                children: [e.jsx(m, {
                                    children: "Numărul CUI *"
                                }), e.jsx(u, {
                                    children: e.jsxs("div", {
                                        className: "flex gap-2",
                                        children: [e.jsxs("div", {
                                            className: "relative flex-1",
                                            children: [e.jsx(F, {
                                                className: "absolute left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-muted-foreground"
                                            }), e.jsx(x, {
                                                placeholder: "Introduceți CUI",
                                                className: "pl-10 text-sm md:text-base",
                                                type: "text",
                                                ...s,
                                                autoFocus: !0,
                                                onKeyDown: t => {
                                                    const i = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
                                                        h = /^[0-9]$/.test(t.key),
                                                        r = /^[A-Za-z]$/.test(t.key),
                                                        n = i.includes(t.key);
                                                    !h && !r && !n && t.preventDefault()
                                                },
                                                onChange: t => {
                                                    s.onChange(t.target.value), S && f(!1)
                                                }
                                            })]
                                        }), e.jsx(N, {
                                            type: "button",
                                            variant: "outline",
                                            onClick: async () => {
                                                const t = a.watch("cui");
                                                t && await J(t)
                                            },
                                            className: "text-sm md:text-base whitespace-nowrap",
                                            children: "Validare CUI"
                                        })]
                                    })
                                }), e.jsx(p, {})]
                            })
                        }), e.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                            children: [e.jsx(l, {
                                control: a.control,
                                name: "company",
                                render: ({
                                    field: s
                                }) => e.jsxs(d, {
                                    children: [e.jsx(m, {
                                        children: "Numele Companiei"
                                    }), e.jsx(u, {
                                        children: e.jsx(x, {
                                            placeholder: "Numele Companiei",
                                            className: "text-sm md:text-base",
                                            ...s
                                        })
                                    }), e.jsx(p, {})]
                                })
                            }), e.jsx(l, {
                                control: a.control,
                                name: "numar_reg_com",
                                render: ({
                                    field: s
                                }) => e.jsxs(d, {
                                    children: [e.jsx(m, {
                                        children: "Nr. Reg. Com."
                                    }), e.jsx(u, {
                                        children: e.jsx(x, {
                                            placeholder: "Nr. Reg. Com.",
                                            className: "text-sm md:text-base",
                                            ...s
                                        })
                                    }), e.jsx(p, {})]
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                            children: [e.jsx(l, {
                                control: a.control,
                                name: "address",
                                render: ({
                                    field: s
                                }) => e.jsxs(d, {
                                    children: [e.jsx(m, {
                                        children: "Adresa"
                                    }), e.jsx(u, {
                                        children: e.jsx(x, {
                                            placeholder: "Adresa Companiei",
                                            className: "text-sm md:text-base",
                                            ...s
                                        })
                                    }), e.jsx(p, {})]
                                })
                            }), e.jsx(l, {
                                control: a.control,
                                name: "county",
                                render: ({
                                    field: s
                                }) => e.jsxs(d, {
                                    children: [e.jsx(m, {
                                        children: "Județul"
                                    }), e.jsx(u, {
                                        children: e.jsx(x, {
                                            placeholder: "Județul",
                                            className: "text-sm md:text-base",
                                            ...s
                                        })
                                    }), e.jsx(p, {})]
                                })
                            })]
                        })]
                    }), o === "ADMIN_SETUP" && e.jsxs("div", {
                        className: "space-y-4",
                        children: [e.jsx(l, {
                            control: a.control,
                            name: "adminName",
                            render: ({
                                field: s
                            }) => e.jsxs(d, {
                                children: [e.jsx(m, {
                                    children: "Numele Administratorului"
                                }), e.jsx(u, {
                                    children: e.jsx(x, {
                                        placeholder: "Numele Complet",
                                        className: "text-sm md:text-base",
                                        ...s
                                    })
                                }), e.jsx(p, {})]
                            })
                        }), e.jsx(l, {
                            control: a.control,
                            name: "email",
                            render: ({
                                field: s
                            }) => e.jsxs(d, {
                                children: [e.jsx(m, {
                                    children: "Adresa de Email"
                                }), e.jsx(u, {
                                    children: e.jsx(x, {
                                        type: "email",
                                        placeholder: "email.dvs@companie.com",
                                        className: "text-sm md:text-base",
                                        ...s
                                    })
                                }), e.jsx(p, {})]
                            })
                        }), e.jsx(l, {
                            control: a.control,
                            name: "adminPassword",
                            render: ({
                                field: s
                            }) => e.jsxs(d, {
                                children: [e.jsx(m, {
                                    children: "Parola"
                                }), e.jsx(u, {
                                    children: e.jsxs("div", {
                                        className: "relative",
                                        children: [e.jsx(x, {
                                            type: w ? "text" : "password",
                                            placeholder: "Minim 6 caractere",
                                            className: "text-sm md:text-base",
                                            ...s
                                        }), e.jsx(N, {
                                            type: "button",
                                            variant: "ghost",
                                            size: "sm",
                                            className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                            onClick: () => Y(!w),
                                            children: w ? e.jsx(V, {
                                                className: "h-4 w-4"
                                            }) : e.jsx(U, {
                                                className: "h-4 w-4"
                                            })
                                        })]
                                    })
                                }), e.jsx(p, {})]
                            })
                        }), e.jsx(l, {
                            control: a.control,
                            name: "confirmPassword",
                            render: ({
                                field: s
                            }) => e.jsxs(d, {
                                children: [e.jsx(m, {
                                    children: "Confirmați Parola"
                                }), e.jsx(u, {
                                    children: e.jsxs("div", {
                                        className: "relative",
                                        children: [e.jsx(x, {
                                            type: C ? "text" : "password",
                                            placeholder: "Confirmați parola dvs",
                                            className: "text-sm md:text-base",
                                            ...s
                                        }), e.jsx(N, {
                                            type: "button",
                                            variant: "ghost",
                                            size: "sm",
                                            className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                            onClick: () => R(!C),
                                            children: C ? e.jsx(V, {
                                                className: "h-4 w-4"
                                            }) : e.jsx(U, {
                                                className: "h-4 w-4"
                                            })
                                        })]
                                    })
                                }), e.jsx(p, {})]
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
                                    children: [e.jsx(ce, {
                                        id: "acceptTermsAndPrivacy",
                                        checked: a.watch("acceptTermsAndPrivacy"),
                                        onCheckedChange: s => a.setValue("acceptTermsAndPrivacy", s)
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
                            }), a.formState.errors.acceptTermsAndPrivacy && e.jsx("p", {
                                className: "text-sm text-red-500 mt-1",
                                children: a.formState.errors.acceptTermsAndPrivacy.message
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "flex justify-between pt-4",
                        children: o !== "COMPLETED" && e.jsxs(e.Fragment, {
                            children: [e.jsxs(N, {
                                type: "button",
                                variant: "outline",
                                onClick: W,
                                disabled: o === "COMPANY_DETAILS" || y,
                                className: "text-sm md:text-base",
                                children: [e.jsx(me, {
                                    className: "mr-2 h-4 w-4"
                                }), "Înapoi"]
                            }), o !== "ADMIN_SETUP" ? e.jsxs(N, {
                                type: "button",
                                onClick: H,
                                disabled: y || o === "COMPANY_DETAILS" && !a.watch("cui"),
                                className: "text-sm md:text-base",
                                children: ["Următorul", e.jsx(ue, {
                                    className: "ml-2 h-4 w-4"
                                })]
                            }) : e.jsx(N, {
                                type: "submit",
                                disabled: y,
                                className: "text-sm md:text-base",
                                children: y ? e.jsxs(e.Fragment, {
                                    children: [e.jsx(k, {
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
}
export {
    Pe as OnboardingModal
};