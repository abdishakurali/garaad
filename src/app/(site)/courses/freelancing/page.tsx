import { buildMetadata, courseSchema, breadcrumbSchema, faqSchema, SITE_URL, FREELANCING_KEYWORDS } from "@/lib/seo";
import { FreelancingDashboardClient } from "./FreelancingDashboardClient";

const CANONICAL = "/courses/freelancing";
const TITLE = "Bilow Freelancing — Garaad | Lacag Online Soomaali";
const DESCRIPTION =
  "Baro sida loo bilaabo freelancing online oo Af-Soomaali ah. 5 toddobaad, mashruuc la dhisaa, macmiil la helo. Upwork, Fiverr iyo xirfadaha lacagta lagu sameeyo. Bilaash bilow.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: CANONICAL,
  keywords: [
    ...FREELANCING_KEYWORDS,
    "bilow freelancing Soomaali",
    "sida loo helo shaqo online",
    "lacag ka samee internet",
    "Garaad freelancing",
    "online income Somalia",
    "work from home Somalia",
    "freelance beginner Somali",
    "Upwork Somalia tutorial",
    "Fiverr Somalia",
    "how to start freelancing Somalia",
    "freelancing course Somali",
    "earn money Upwork Somali",
  ],
});

const jsonLdCourse = courseSchema({
  name: "Bilow Freelancing — Garaad",
  description:
    "Koorso Af-Soomaali ah oo lagu barto sida loo bilaabo freelancing: xirfad doorasho, profile dhis, macmiil raadi, iyo lacag qaado.",
  url: `${SITE_URL}${CANONICAL}`,
  image: `${SITE_URL}/images/og-main.jpg`,
  level: "beginner",
  slug: "freelancing",
  isFree: true,
  durationHours: 15,
});

const jsonLdBreadcrumb = breadcrumbSchema([
  { name: "Garaad", item: SITE_URL },
  { name: "Korsooyinka", item: `${SITE_URL}/courses` },
  { name: "Bilow Freelancing", item: `${SITE_URL}${CANONICAL}` },
]);

const jsonLdFaq = faqSchema([
  {
    question: "Freelancing maxay tahay Af-Soomaali?",
    answer:
      "Freelancing waa shaqo online ah oo aad ugu shaqeyso macaamiil kala duwan ayadoon shirkad joogto ah loo lahayn. Waxaad lacag ka samaysaa xirfadahaaga sida qorista, naqshadeynta, ama barnaamijyada.",
  },
  {
    question: "Waa maxay Upwork iyo Fiverr?",
    answer:
      "Upwork iyo Fiverr waa goobaha ugu weyn ee dunida ee loo isticmaalo in lagu helo shaqo freelancing. Upwork waxaa lagu qaadaa shaqooyin waaweyn, Fiverr waxaa lagu iibiyaa adeegyada fixed-price.",
  },
  {
    question: "Ma u baahanahay aqoon hore si aan u bilaabo freelancing?",
    answer:
      "Maya. Koorsooyinkeena waxay ka bilaabanayaan aasaasiga. Waxaad bartaa xirfada, ka dibna sida aad lacag uga sameyso.",
  },
  {
    question: "Intee lacag ayaan ka samayn karaa freelancing?",
    answer:
      "Xirfadahaaga iyo waqtiga la bixiyo ayaa go'aamiya. Bilaabayaashu waxay ka bilaabanayaan $5–$20 saacadda. Khibradda kor u kacda, lacagta ayaa kordheysa. Qaar ardaydeena ah waxay gaareen $500–$2000 bishiiba.",
  },
  {
    question: "Garaad freelancing koors waa bilaash mise lacag leh?",
    answer:
      "Casharrada hore waa bilaash. Premium casharo waxay kaa caawiyaan inaad degdeg ugu socoto macmiilka koowaad. Bilow bilaash hadda.",
  },
]);

export default function FreelancingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCourse) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <FreelancingDashboardClient />
    </>
  );
}
