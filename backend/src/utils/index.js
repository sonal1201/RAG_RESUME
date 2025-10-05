// Lightweight fallback skills extractor for when AI is unavailable or returns no skills
const COMMON_SKILLS = [
  // Programming languages
  "javascript","typescript","python","java","c#","c++","go","ruby","php","swift","kotlin","rust",
  // Web/Frontend
  "react","redux","next.js","vue","angular","svelte","html","css","sass","tailwind","bootstrap",
  // Backend/Frameworks
  "node","express","nestjs","django","flask","spring","laravel","rails","fastapi",".net","asp.net",
  // Databases
  "mysql","postgres","postgresql","mongodb","redis","sqlite","oracle","dynamodb","elasticsearch",
  // Cloud/DevOps
  "aws","azure","gcp","docker","kubernetes","k8s","terraform","ansible","ci/cd","github actions","gitlab ci",
  // Data/ML
  "pandas","numpy","scikit-learn","tensorflow","pytorch","matplotlib","seaborn","spark","hadoop",
  // Testing/Tools
  "jest","mocha","chai","cypress","playwright","pytest","junit","selenium",
  // Other
  "grpc","graphql","rest","microservices","serverless","webpack","vite","babel","rxjs"
];

const STOP_WORDS = new Set([
  "problem","solving","teamwork","leadership","management","time management","projects","project",
  "high","scaling","load","balancing","efficient","crud","development","software","engineer","developer",
  "experience","frameworks","tools","libraries","strong","good","excellent","communication","skills"
]);

export const extractSkills = (text) => {
  if (!text || typeof text !== "string") return [];
  const hay = text.toLowerCase();
  const found = new Set();
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sanitize = (s) => s
    .toLowerCase()
    .replace(/[^a-z0-9+#+.\- ]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const skill of COMMON_SKILLS) {
    const needle = skill.toLowerCase();
    // word boundary-ish match; allow symbols like . and # in tech names
    const pattern = new RegExp(`(^|[^a-z0-9+#+.])${escapeRegex(needle)}([^a-z0-9+#+.]|$)`, "i");
    if (pattern.test(hay)) found.add(skill.replace(/\s+/g, " "));
  }
  // Additionally, parse an explicit Skills: section if present
  const sectionMatch = hay.match(/skills\s*[:\-]\s*([\s\S]{0,400})/i);
  if (sectionMatch) {
    const list = sectionMatch[1]
      .split(/[\n,\u2022\-|•,]/)
      .map((s) => sanitize(s))
      .filter((s) => s.length >= 2 && s.length <= 40)
      .filter((s) => /^[a-z0-9+#+.\- ]+$/i.test(s))
      .filter((s) => !STOP_WORDS.has(s));
    for (const item of list) {
      // keep short items as skills
      if (item && item.split(" ").length <= 4) found.add(item);
    }
  }
  return Array.from(found).slice(0, 50);
};

export default { extractSkills };

