/**
 * /debug/mobile-css
 *
 * Visual smoke-test page for CSS compatibility on old Android / Chrome 56+.
 * Renders all core design primitives so you can confirm spacing, borders,
 * colours, buttons, cards and layout work on a real/emulated old device.
 *
 * NOT intended for end users — keep behind auth or remove before public launch.
 * Contains no sensitive data.
 */

export const metadata = { title: "Mobile CSS Debug | Garaad" };

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200 text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Swatch ───────────────────────────────────────────────────────────────────
function Swatch({ label, bg, text = "text-white" }: { label: string; bg: string; text?: string }) {
  return (
    <div
      className={`${bg} ${text} px-3 py-2 rounded text-xs font-mono inline-block m-1`}
      style={{ minWidth: 120 }}
    >
      {label}
    </div>
  );
}

export default function MobileCssDebugPage() {
  return (
    <div className="bg-background text-foreground min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-bold text-yellow-800 text-sm">🔧 CSS Debug Page</p>
          <p className="text-yellow-700 text-xs mt-1">
            Use this page on a real Android device / emulator to verify spacing, colours,
            borders and layout render correctly. If styles are missing, check the PostCSS
            pipeline (postcss.config.mjs).
          </p>
        </div>

        {/* ── 1. Spacing scale ──────────────────────────────────────────────── */}
        <Section title="1. Spacing — padding &amp; margin">
          <div className="space-y-2">
            {[1, 2, 3, 4, 6, 8, 12].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">p-{n}</span>
                <div className={`p-${n} bg-blue-100 border border-blue-300 rounded text-xs text-blue-800`}>
                  padding {n}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-12">px-4 py-2</span>
              <div className="px-4 py-2 bg-green-100 border border-green-300 rounded text-xs text-green-800">
                px-4 py-2
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-12">m-4</span>
              <div className="m-4 inline-block bg-purple-100 border border-purple-300 rounded text-xs text-purple-800 px-2 py-1">
                m-4 applied
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. Gap ────────────────────────────────────────────────────────── */}
        <Section title="2. Flex gap">
          {[2, 4, 6, 8].map((n) => (
            <div key={n} className={`flex gap-${n} mb-3 items-center`}>
              <span className="text-xs text-gray-500 w-10">gap-{n}</span>
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-8 bg-indigo-200 border border-indigo-400 rounded flex items-center justify-center text-xs text-indigo-800">
                  {i}
                </div>
              ))}
            </div>
          ))}
        </Section>

        {/* ── 3. Borders & border-radius ───────────────────────────────────── */}
        <Section title="3. Borders &amp; border-radius">
          <div className="flex flex-wrap gap-3">
            {[
              { cls: "rounded-none",  label: "none"  },
              { cls: "rounded",       label: "rounded" },
              { cls: "rounded-md",    label: "md" },
              { cls: "rounded-lg",    label: "lg" },
              { cls: "rounded-xl",    label: "xl" },
              { cls: "rounded-full",  label: "full" },
            ].map(({ cls, label }) => (
              <div
                key={cls}
                className={`${cls} border-2 border-gray-400 w-20 h-12 flex items-center justify-center text-xs text-gray-700 bg-gray-50`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="border border-gray-200 px-3 py-2 rounded text-xs">border</div>
            <div className="border-2 border-blue-500 px-3 py-2 rounded text-xs">border-2 blue</div>
            <div className="border border-dashed border-gray-400 px-3 py-2 rounded text-xs">dashed</div>
            <div className="ring-2 ring-purple-500 px-3 py-2 rounded text-xs">ring-2</div>
          </div>
        </Section>

        {/* ── 4. Colours ────────────────────────────────────────────────────── */}
        <Section title="4. Background &amp; text colours">
          <p className="text-xs text-gray-500 mb-3">App theme variables (hex, should always work):</p>
          <div className="flex flex-wrap">
            <Swatch label="bg-primary" bg="bg-primary" text="text-primary-foreground" />
            <Swatch label="bg-secondary" bg="bg-secondary" text="text-secondary-foreground" />
            <Swatch label="bg-muted" bg="bg-muted" text="text-muted-foreground" />
            <Swatch label="bg-accent" bg="bg-accent" text="text-accent-foreground" />
            <Swatch label="bg-destructive" bg="bg-destructive" text="text-white" />
            <Swatch label="bg-card" bg="bg-card" text="text-card-foreground" />
          </div>

          <p className="text-xs text-gray-500 mb-3 mt-4">Tailwind palette (oklch → rgb fallback):</p>
          <div className="flex flex-wrap">
            <Swatch label="bg-blue-600" bg="bg-blue-600" />
            <Swatch label="bg-blue-100" bg="bg-blue-100" text="text-blue-900" />
            <Swatch label="bg-green-500" bg="bg-green-500" />
            <Swatch label="bg-green-100" bg="bg-green-100" text="text-green-900" />
            <Swatch label="bg-red-500" bg="bg-red-500" />
            <Swatch label="bg-red-100" bg="bg-red-100" text="text-red-900" />
            <Swatch label="bg-amber-400" bg="bg-amber-400" text="text-amber-900" />
            <Swatch label="bg-gray-100" bg="bg-gray-100" text="text-gray-900" />
            <Swatch label="bg-gray-900" bg="bg-gray-900" />
            <Swatch label="bg-emerald-500" bg="bg-emerald-500" />
          </div>

          <p className="text-xs text-gray-500 mb-3 mt-4">Text colours:</p>
          <div className="space-y-1">
            <p className="text-gray-900 text-sm">text-gray-900 — should be near-black</p>
            <p className="text-gray-500 text-sm">text-gray-500 — should be mid-grey</p>
            <p className="text-blue-600 text-sm">text-blue-600 — should be blue</p>
            <p className="text-red-600 text-sm">text-red-600 — should be red</p>
            <p className="text-green-600 text-sm">text-green-600 — should be green</p>
            <p className="text-muted-foreground text-sm">text-muted-foreground (CSS var)</p>
          </div>
        </Section>

        {/* ── 5. Buttons ────────────────────────────────────────────────────── */}
        <Section title="5. Buttons">
          <div className="flex flex-wrap gap-3">
            <button className="btn-gold">Gold CTA</button>
            <button className="btn-ghost">Ghost</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700">
              bg-blue-600
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm">
              Destructive
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm bg-white">
              Outline
            </button>
            <button disabled className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed">
              Disabled
            </button>
          </div>
        </Section>

        {/* ── 6. Cards ──────────────────────────────────────────────────────── */}
        <Section title="6. Cards">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-sm mb-2">Card title</h3>
              <p className="text-muted-foreground text-xs">Card body text using CSS variable colours.</p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">badge</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">active</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow">
              <h3 className="font-semibold text-sm mb-2 text-gray-900">White card</h3>
              <p className="text-gray-500 text-xs">shadow + border + rounded-xl.</p>
            </div>
          </div>
        </Section>

        {/* ── 7. Shadows ────────────────────────────────────────────────────── */}
        <Section title="7. Shadows">
          <div className="flex flex-wrap gap-4 py-2">
            {["shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl"].map((s) => (
              <div
                key={s}
                className={`${s} bg-white border border-gray-100 rounded-lg w-24 h-16 flex items-center justify-center text-xs text-gray-600`}
              >
                {s}
              </div>
            ))}
          </div>
        </Section>

        {/* ── 8. Forms ──────────────────────────────────────────────────────── */}
        <Section title="8. Forms">
          <div className="space-y-3 max-w-sm">
            <input
              type="text"
              placeholder="Text input"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white">
              <option>Select option</option>
              <option>Option A</option>
              <option>Option B</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              Checkbox
            </label>
            <textarea
              placeholder="Textarea"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white resize-none"
            />
          </div>
        </Section>

        {/* ── 9. Badges & alerts ────────────────────────────────────────────── */}
        <Section title="9. Badges &amp; alerts">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { bg: "bg-blue-100", text: "text-blue-700",   label: "Info"    },
              { bg: "bg-green-100",text: "text-green-700",  label: "Success" },
              { bg: "bg-red-100",  text: "text-red-700",    label: "Error"   },
              { bg: "bg-yellow-100",text:"text-yellow-700", label: "Warning" },
              { bg: "bg-gray-100", text: "text-gray-700",   label: "Default" },
            ].map(({ bg, text, label }) => (
              <span key={label} className={`${bg} ${text} px-2 py-1 rounded-full text-xs font-medium`}>
                {label}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              ℹ Info alert with border + bg + text colour
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              ✖ Error alert
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              ✓ Success alert
            </div>
          </div>
        </Section>

        {/* ── 10. Grid layout ───────────────────────────────────────────────── */}
        <Section title="10. Grid layout (simulated product grid)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
                <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-gray-400 text-xs">
                  image
                </div>
                <p className="font-medium text-sm text-gray-900">Product {n}</p>
                <p className="text-muted-foreground text-xs mt-1">$9.99</p>
                <button className="mt-2 w-full py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                  Add
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 11. Typography ────────────────────────────────────────────────── */}
        <Section title="11. Typography scale">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">text-xs (12px)</p>
            <p className="text-sm text-gray-600">text-sm (14px)</p>
            <p className="text-base text-gray-700">text-base (16px) — body default</p>
            <p className="text-lg font-medium text-gray-800">text-lg font-medium</p>
            <p className="text-xl font-semibold text-gray-900">text-xl font-semibold</p>
            <p className="text-2xl font-bold text-gray-900">text-2xl font-bold</p>
            <p className="text-3xl font-extrabold text-gray-900">text-3xl font-extrabold</p>
          </div>
        </Section>

        {/* ── 12. Responsive columns ────────────────────────────────────────── */}
        <Section title="12. Responsive breakpoints">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-indigo-800 text-sm">
                Col {n} — spans full on mobile, half on md, third on lg
              </div>
            ))}
          </div>
        </Section>

        {/* ── 13. Flex layout ───────────────────────────────────────────────── */}
        <Section title="13. Flex layout">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <span className="font-medium text-sm text-gray-900">Left</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">tag</span>
              <button className="text-gray-500 text-xs">Action</button>
            </div>
          </div>
        </Section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          /debug/mobile-css — CSS compat smoke test — not for end users
        </div>
      </div>
    </div>
  );
}
