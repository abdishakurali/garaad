if (!self.define) {
    let s, e = {};
    const i = (i, l) => (i = new URL(i + ".js", l).href, e[i] || new Promise(e => {
        if ("document" in self) {
            const s = document.createElement("script");
            s.src = i, s.onload = e, document.head.appendChild(s)
        } else s = i, importScripts(i), e()
    }).then(() => {
        let s = e[i];
        if (!s) throw new Error(`Module ${i} didn’t register its module`);
        return s
    }));
    self.define = (l, r) => {
        const n = s || ("document" in self ? document.currentScript.src : "") || location.href;
        if (e[n]) return;
        let a = {};
        const u = s => i(s, n),
            o = {
                module: {
                    uri: n
                },
                exports: a,
                require: u
            };
        e[n] = Promise.all(l.map(s => o[s] || u(s))).then(s => (r(...s), a))
    }
}
define(["./workbox-b833909e"], function(s) {
    "use strict";
    self.skipWaiting(), s.clientsClaim(), s.precacheAndRoute([{
        url: "about.jpeg",
        revision: "9091e3f9e5bb3130d1d474bad2cdad19"
    }, {
        url: "android-chrome-192x192.png",
        revision: "8f9da1276b1d436098c2d56f3ab0115f"
    }, {
        url: "android-chrome-512x512.png",
        revision: "e86d2fe3a7fc87f55e1bb2fcb9d7daa8"
    }, {
        url: "apple-touch-icon.png",
        revision: "cf98ad5319173e11d43b96618141721c"
    }, {
        url: "assets/400.B1KYXuNF.css",
        revision: null
    }, {
        url: "assets/500.CCGSBh5v.css",
        revision: null
    }, {
        url: "assets/600.tM8HDwJA.css",
        revision: null
    }, {
        url: "assets/700.DWvkSAE_.css",
        revision: null
    }, {
        url: "assets/About.Cj6J2FQL.js",
        revision: null
    }, {
        url: "assets/axios.DeQKcNki.js",
        revision: null
    }, {
        url: "assets/badge.DUAjxJ8Z.js",
        revision: null
    }, {
        url: "assets/Blog_details.Dtwwugmn.js",
        revision: null
    }, {
        url: "assets/BlogList.D3aV3a3Q.js",
        revision: null
    }, {
        url: "assets/card.D6MdgTl_.js",
        revision: null
    }, {
        url: "assets/CaseStudies.DBbReiqf.js",
        revision: null
    }, {
        url: "assets/cash-register.BWWN4lX-.js",
        revision: null
    }, {
        url: "assets/ChargeTracking.CRURB2U7.js",
        revision: null
    }, {
        url: "assets/checkbox.DrjMjESB.js",
        revision: null
    }, {
        url: "assets/chunk-K6AXKMTT.CM-rszQI.js",
        revision: null
    }, {
        url: "assets/CloudManagement.CNNR3c-P.js",
        revision: null
    }, {
        url: "assets/CoffeeShop.4Qy9fikc.js",
        revision: null
    }, {
        url: "assets/Contact.muXGP9_K.js",
        revision: null
    }, {
        url: "assets/CRM.2sgl7ZjX.js",
        revision: null
    }, {
        url: "assets/EFactura.DgXnRONL.js",
        revision: null
    }, {
        url: "assets/form-vendor.CYdr9quq.js",
        revision: null
    }, {
        url: "assets/Franchiza.C7M5rnbV.js",
        revision: null
    }, {
        url: "assets/generateCategoricalChart.DP6sKCY0.js",
        revision: null
    }, {
        url: "assets/Glossary.CiGoW3OO.js",
        revision: null
    }, {
        url: "assets/GradientCustomizer.D73vJfCP.js",
        revision: null
    }, {
        url: "assets/Helmet.B9sVbWhk.js",
        revision: null
    }, {
        url: "assets/Home.PIWbmZ7T.js",
        revision: null
    }, {
        url: "assets/i18n-vendor.CxbKsUuT.js",
        revision: null
    }, {
        url: "assets/icons-vendor.BaRxkmJj.js",
        revision: null
    }, {
        url: "assets/index.CB__606f.css",
        revision: null
    }, {
        url: "assets/index.DfBlkqaH.js",
        revision: null
    }, {
        url: "assets/index.DrC_YY1K.js",
        revision: null
    }, {
        url: "assets/index.DUP5BPDA.js",
        revision: null
    }, {
        url: "assets/index.JulBJio6.js",
        revision: null
    }, {
        url: "assets/Inventory.DSz2hkpU.js",
        revision: null
    }, {
        url: "assets/Invitation.DRHN0drX.js",
        revision: null
    }, {
        url: "assets/isPlainObject.CetwFt8Z.js",
        revision: null
    }, {
        url: "assets/Layout.DUkNegbY.js",
        revision: null
    }, {
        url: "assets/motion-vendor.CwL1EI4n.js",
        revision: null
    }, {
        url: "assets/NotFound.DR51RrEt.js",
        revision: null
    }, {
        url: "assets/odooVATHelper.BJeXAh4R.js",
        revision: null
    }, {
        url: "assets/OnboardingModal.Bf5Dzp1K.js",
        revision: null
    }, {
        url: "assets/OrderSummary.6OpUxMDB.js",
        revision: null
    }, {
        url: "assets/Partnership.BGpkdVzh.js",
        revision: null
    }, {
        url: "assets/Payment.Bln1KxSH.js",
        revision: null
    }, {
        url: "assets/PaymentResult.BMrlAx3y.js",
        revision: null
    }, {
        url: "assets/POS.Ck5IEX-F.js",
        revision: null
    }, {
        url: "assets/PrivacyPolicy.B4aSkR6f.js",
        revision: null
    }, {
        url: "assets/Products.BLO4A7eA.js",
        revision: null
    }, {
        url: "assets/query-vendor.Ckm1xsuj.js",
        revision: null
    }, {
        url: "assets/react-vendor.CoFnG1Cb.js",
        revision: null
    }, {
        url: "assets/RegistrationModal.DMTcX9UO.js",
        revision: null
    }, {
        url: "assets/Resources.CshW3Jlm.js",
        revision: null
    }, {
        url: "assets/Services.D0Az0Ifa.js",
        revision: null
    }, {
        url: "assets/slugUtils.BdJNSh-n.js",
        revision: null
    }, {
        url: "assets/structuredData.D5Vl_LyK.js",
        revision: null
    }, {
        url: "assets/tablet.X6v6lqiO.js",
        revision: null
    }, {
        url: "assets/terminal.DBki-0kE.js",
        revision: null
    }, {
        url: "assets/TermsAndConditions.D8avKlBd.js",
        revision: null
    }, {
        url: "assets/textarea.DC4Xp0Yi.js",
        revision: null
    }, {
        url: "assets/ThankYou.DwQzWf0U.js",
        revision: null
    }, {
        url: "assets/ui-vendor.Bl07kmxE.js",
        revision: null
    }, {
        url: "assets/utils-vendor.B2rm_Apj.js",
        revision: null
    }, {
        url: "assets/VideoModel.DcuMuUNj.js",
        revision: null
    }, {
        url: "assets/WebsiteBuilder.DJ9KkLDi.js",
        revision: null
    }, {
        url: "custome.webp",
        revision: "f14e143d5cbe6dc6752fb6f68defa29a"
    }, {
        url: "customerdolcenera.png",
        revision: "0154bccadaaaa96b3246b6a492f84891"
    }, {
        url: "e-factura.webp",
        revision: "7e195dece5d96d79e5f85b614319ef61"
    }, {
        url: "favicon-1.ico",
        revision: "41933cd31bffa13e0cd75cedc0d1a7cc"
    }, {
        url: "favicon-16x16.png",
        revision: "10e099878c8cd33badfb5baf7bfdeaad"
    }, {
        url: "favicon-32x32.png",
        revision: "211f5612e8ddcb44d0e177394e8dd3da"
    }, {
        url: "favicon.ico",
        revision: "41933cd31bffa13e0cd75cedc0d1a7cc"
    }, {
        url: "fiscalnet_logo.png",
        revision: "d9e8b2784aac8618f822b75893c489b7"
    }, {
        url: "hardware.png",
        revision: "9aefd1d1195b4ea4666c389883814b5b"
    }, {
        url: "index.html",
        revision: "2b1efe7d8e6a2c2f4948d6c315e29904"
    }, {
        url: "kiosk.webp",
        revision: "a2550390185c8fc9d61a90421f154080"
    }, {
        url: "listing.png",
        revision: "8e0a5255e83776c0a1f25f36a1ea4ddb"
    }, {
        url: "logo.jpeg",
        revision: "43798fe20c7ad3a58b759e754bf59aa6"
    }, {
        url: "logo.png",
        revision: "2d30c73bb03d15777fe7b4b7264eeb7c"
    }, {
        url: "mobile-pos.jpg",
        revision: "425ab1bd1693e77b7dcac8f4d1cb882c"
    }, {
        url: "package.png",
        revision: "3b48090370bb86eba9b007665be507a2"
    }, {
        url: "placeholder.jpg",
        revision: "2d30c73bb03d15777fe7b4b7264eeb7c"
    }, {
        url: "pos-register.jpg",
        revision: "5fc36565a3317450aa9ff30d5e8db876"
    }, {
        url: "pos.png",
        revision: "0c766a7bb2ea3dfb8cba3666ee8ebb00"
    }, {
        url: "purchase.png",
        revision: "570b238e227959ad135caf2167f0b7a0"
    }, {
        url: "pwa-192x192.png",
        revision: "8f9da1276b1d436098c2d56f3ab0115f"
    }, {
        url: "pwa-512x512.png",
        revision: "e86d2fe3a7fc87f55e1bb2fcb9d7daa8"
    }, {
        url: "registerSW.js",
        revision: "1872c500de691dce40960bb85481de07"
    }, {
        url: "retail.png",
        revision: "1f91c281efc2df5edc47a9dce4e838fc"
    }, {
        url: "saft.webp",
        revision: "6ffec8adf47f89562cf77d32d4a34e76"
    }, {
        url: "saga-logo.png",
        revision: "437ab6306a51c700553ae45afd99a72b"
    }, {
        url: "shopify.webp",
        revision: "447fd07ef5ed4e4af16e5e152c1186ec"
    }, {
        url: "tablet.jpg",
        revision: "b6e4cf92079d9a8666d4a847ede0af6b"
    }, {
        url: "tablet.webp",
        revision: "5d8db6ef7d7c6cf046417823a4ae6bf8"
    }, {
        url: "apple-touch-icon.png",
        revision: "cf98ad5319173e11d43b96618141721c"
    }, {
        url: "favicon.ico",
        revision: "41933cd31bffa13e0cd75cedc0d1a7cc"
    }, {
        url: "pwa-192x192.png",
        revision: "8f9da1276b1d436098c2d56f3ab0115f"
    }, {
        url: "pwa-512x512.png",
        revision: "e86d2fe3a7fc87f55e1bb2fcb9d7daa8"
    }, {
        url: "manifest.webmanifest",
        revision: "0996ba9bd2e52c5c4a87f7b46fd3f7e9"
    }], {}), s.cleanupOutdatedCaches(), s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))), s.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new s.CacheFirst({
        cacheName: "google-fonts-cache",
        plugins: [new s.ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 31536e3
        }), new s.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET"), s.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new s.CacheFirst({
        cacheName: "gstatic-fonts-cache",
        plugins: [new s.ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 31536e3
        }), new s.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET")
});