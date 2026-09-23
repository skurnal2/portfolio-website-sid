// Everything on the Projects deck. Facts come from the résumé
// (~/Documents/Tasks/Jobs/builder/profile.mjs) and the NOZARIA code; keep the
// numbers identical to the résumé. `visual` is either an image or the name of
// a drawn illustration in src/components/visuals.js.
import nozaria_url from "../images/nozaria.jpg";
import rag_url from "../images/rag.jpg";
import sortable_tree_webm from "../images/sortable_tree.webm";
import sortable_tree_mp4 from "../images/sortable_tree.mp4";
import sortable_tree_static_url from "../images/sortable_tree_static.png";

export const PROJECTS = [
  {
    id: "nozaria-admin",
    where: "NOZARIA",
    kind: "Personal",
    title: "Retail admin and API",
    summary: "The back office for a jewelry retailer selling in Canada, the US and India.",
    visual: { drawn: "admin" },
    points: [
      <>A <b>Next.js</b> admin and <b>REST API</b> on <b>PostgreSQL</b> (Supabase, Drizzle) that runs the whole business: products, stock, sales and payments.</>,
      <>Imported the full <b>Etsy</b> sales history into the admin, so every past sale lives in one place.</>,
      <>Integrated <b>Razorpay</b> payment webhooks for the India region.</>,
      <>Deployed the <b>Canada and India regions from one shared codebase</b>.</>,
      <>AI-generated product listings with the <b>Gemini</b> and <b>OpenAI</b> APIs.</>,
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Drizzle", "REST", "Webhooks", "Gemini", "OpenAI"],
    link: { href: "https://admin.nozaria.com", label: "admin.nozaria.com", cta: "Explore the live admin" },
  },
  {
    id: "nozaria-pos",
    where: "NOZARIA",
    kind: "Personal",
    title: "Point of sale and inventory app",
    summary: "An offline-first Flutter app the shop runs on every day.",
    visual: { drawn: "pos" },
    points: [
      <>Every piece has a <b>QR-coded inventory unit</b>. The app scans it for lookups, stock transfers and sales.</>,
      <><b>Thermal label and receipt printing</b> straight from the app.</>,
      <>Purchase batches, <b>transfers between locations</b>, rentals with an <b>audit trail</b>, and repair lookups.</>,
      <>Works <b>offline</b>: the shop keeps selling without internet and the app reconciles when it reconnects.</>,
    ],
    stack: ["Flutter", "Dart", "Offline sync", "QR scanning", "Thermal printing"],
  },
  {
    id: "nozaria-store",
    where: "NOZARIA",
    kind: "Personal",
    title: "Storefront and AI try-on",
    summary: "A headless Shopify storefront where customers can try a piece on from one photo.",
    visual: { image: nozaria_url, alt: "The NOZARIA storefront home page, showing its AI try-on feature: a woman holding a phone next to the headline One photo. Any piece. Fifteen seconds." },
    points: [
      <>A headless <b>Shopify</b> storefront built on the shared admin and API.</>,
      <><b>AI virtual try-on</b>: one photo, any piece, about fifteen seconds.</>,
      <>Kept one-of-a-kind stock accurate across the shop, Etsy and Shopify with <b>absolute stock counts</b> and Shopify <b>webhooks</b>, so a piece sold in one place can't sell again elsewhere.</>,
    ],
    stack: ["Shopify", "Next.js", "Webhooks", "Gemini", "OpenAI"],
    link: { href: "https://nozaria.com", label: "nozaria.com", cta: "Visit the live store" },
  },
  {
    id: "nozaria-cctv",
    where: "NOZARIA",
    kind: "Personal",
    title: "Remote CCTV over a private network",
    summary: "Live shop cameras on a TV in another city, with no cloud service and no extra cost.",
    visual: { drawn: "cctv" },
    points: [
      <>Two <b>Raspberry Pis</b>: one at the shop reads the cameras from the NVR over <b>RTSP</b>, the other drives a TV and boots straight into the stream.</>,
      <>Connected them with a private <b>Tailscale VPN</b>, working around the ISP's <b>carrier-grade NAT</b> after the cameras' cloud streaming couldn't feed the TV.</>,
      <>Reliable, and the only running cost is the internet both ends already pay for.</>,
    ],
    stack: ["Raspberry Pi", "Linux", "Tailscale", "RTSP", "Networking"],
  },
  {
    id: "kortext-reviewer",
    where: "Kortext",
    kind: "Work",
    title: "AI pull-request reviewer",
    summary: "Won a company-wide AI hackathon against teams across North America and Europe.",
    visual: { drawn: "review" },
    points: [
      <>Reviews pull requests using <b>RAG</b> over <b>1,700+</b> engineering wiki pages and the team's code, so feedback cites the team's own standards.</>,
      <>Embeddings stored in <b>PostgreSQL</b>.</>,
      <>Built as a hackathon prototype, then used by the team on real pull requests.</>,
    ],
    stack: ["RAG", "Embeddings", "PostgreSQL", "Azure DevOps", "LLMs"],
  },
  {
    id: "kortext-i18n",
    where: "Kortext",
    kind: "Work",
    title: "Internationalization and accessibility",
    summary: "One Angular front end, thirteen languages, and WCAG 2.2.",
    visual: { drawn: "i18n" },
    points: [
      <>Set up <b>Transloco</b> internationalization across <b>13 languages</b>, including right-to-left scripts, in an <b>Nx</b> monorepo of 9 apps.</>,
      <>Delivered <b>WCAG 2.2</b> accessibility improvements across the Angular front end.</>,
      <>Brought books' accessibility metadata into the book details screens, so readers can see how accessible a title is before choosing it.</>,
    ],
    stack: ["Angular", "TypeScript", "Nx", "Transloco", "WCAG 2.2"],
  },
  {
    id: "bis-chatbot",
    where: "BIS Safety Software",
    kind: "Work",
    title: "AI support chatbot and knowledge base",
    summary: "A RAG agent that answers from the company's knowledge base. Support inquiries dropped by 50%.",
    visual: { image: rag_url, alt: "Diagram of a retrieval-augmented generation pipeline: a prompt and query search a knowledge base, the relevant information is returned as enhanced context, and a large language model endpoint generates the response." },
    points: [
      <>Used <b>Pinecone</b> to store and retrieve vector embeddings, improving how accurately the chatbot finds answers.</>,
      <>Implemented <b>Retrieval-Augmented Generation</b> to bring external knowledge into context-aware responses.</>,
      <>Streamed responses with real-time <b>markdown</b> rendering.</>,
      <>Ran the <b>Python</b> backend on <b>AWS EC2</b>, with knowledge base uploads in <b>AWS S3</b>.</>,
      <>Built the chat interface in <b>React</b> with <b>Redux</b>, and let users tune temperature, topK and score thresholds.</>,
    ],
    stack: ["Python", "Pinecone", "RAG", "OpenAI", "AWS EC2", "AWS S3", "React", "Redux"],
  },
  {
    id: "bis-forms",
    where: "BIS Safety Software",
    kind: "Work",
    title: "AI form generator",
    summary: "Build a form from a sentence, a PDF or a photo. Form creation time dropped by 40%.",
    visual: { drawn: "forms" },
    points: [
      <>Uses the <b>OpenAI API</b> to create forms from a prompt or an uploaded <b>PDF or image</b>.</>,
      <>An <b>AI chat</b> alongside the builder helps refine and customize the form.</>,
      <><b>Prompt engineering</b> so the model returns output the form builder can use directly.</>,
      <>Built in <b>React</b> and <b>Redux</b> inside the existing form builder.</>,
    ],
    stack: ["OpenAI", "Prompt engineering", "Structured output", "React", "Redux"],
  },
  {
    id: "bis-tree",
    where: "BIS Safety Software",
    kind: "Work",
    title: "Locations management hierarchy",
    summary: "Drag-and-drop management of thousands of company locations, without lag.",
    visual: { video: [sortable_tree_webm, sortable_tree_mp4], poster: sortable_tree_static_url, alt: "A nested, drag-and-drop location tree with expand and collapse controls and a search bar, showing rows being reordered between parent and child nodes." },
    points: [
      <>Customized <b>React Sortable Tree</b> for recursive, drag-and-drop location management.</>,
      <><b>Virtualized</b> the tree, rendering only what's on screen, so thousands of locations stay smooth.</>,
      <>Responsive with <b>SASS</b>, so drag and drop works on desktop and mobile.</>,
      <>State managed with <b>Redux</b>.</>,
    ],
    stack: ["React", "Redux", "Virtualization", "SASS"],
  },
  {
    id: "bis-library",
    where: "BIS Safety Software",
    kind: "Work",
    title: "React component library",
    summary: "One shared UI kit on NPM. UI development time dropped by 50%.",
    visual: { drawn: "library" },
    points: [
      <>Built a reusable <b>React</b> component library published on <b>NPM</b>.</>,
      <>Eliminated duplicate components and kept the library up to date.</>,
      <>Interactive docs in <b>Storybook</b>, used by <b>70 developers</b>.</>,
    ],
    stack: ["React", "NPM", "Storybook", "Design systems"],
  },
  {
    id: "bis-realtime",
    where: "BIS Safety Software",
    kind: "Work",
    title: "Real-time sessions and caching",
    summary: "Less load on the database for an application serving over 2 million users.",
    visual: { drawn: "realtime" },
    points: [
      <>Replaced long polling with a <b>Node.js WebSocket</b> server on <b>AWS EC2</b> for user session tracking, cutting database load by <b>30%</b>.</>,
      <>Rebuilt the settings page with <b>React-Redux</b> and <b>Redis</b> caching, cutting load times by <b>80%</b>.</>,
    ],
    stack: ["Node.js", "WebSockets", "AWS EC2", "Redis", "React-Redux"],
  },
];
