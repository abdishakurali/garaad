import { BriefcaseBusiness, Code2, Hammer, CheckCircle2 } from "lucide-react";

const REQUEST_ACCESS = "mailto:info@garaad.org?subject=Codsi%20Garaad%20Access";

const paths = [
  {
    title: "Freelancer",
    icon: BriefcaseBusiness,
    summary: "Dhis xirfad aad client ugu shaqeyn karto.",
    curriculum: ["Portfolio service", "Proposal system", "Client outreach", "Delivery workflow", "Invoice + handoff"],
  },
  {
    title: "Builder",
    icon: Hammer,
    summary: "Dhis product yar oo demo iyo launch leh.",
    curriculum: ["Idea validation", "MVP scope", "Frontend + backend", "AI feature", "Launch page + demo"],
  },
  {
    title: "Worker",
    icon: Code2,
    summary: "Diyaarso jid shaqo: proof, CV, interview.",
    curriculum: ["Core coding", "GitHub projects", "CV + LinkedIn", "Interview prep", "Job applications"],
  },
];

export function TrackGridClient() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Your Path</p>
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Choose Builder, Freelancer, or Worker
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          No signup. No login. No payment. Request access and you will be approved.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {paths.map(({ title, icon: Icon, summary, curriculum }) => (
          <section key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{summary}</p>
            <div className="border-t border-border pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Curriculum</p>
              <ul className="space-y-3">
                {curriculum.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href={REQUEST_ACCESS} className="btn-gold inline-flex">
          Request access →
        </a>
      </div>
    </div>
  );
}
