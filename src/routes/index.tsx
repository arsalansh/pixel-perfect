import { createFileRoute } from "@tanstack/react-router";
import { Hero, About, Questions, Services, Process, Execution, FieldNotes, Contact } from "@/components/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Strategist — Turning business problems into growth strategies" },
      { name: "description", content: "Senior business strategist, brand consultant and growth advisor. Strategy. Positioning. Growth." },
      { property: "og:title", content: "Turning business problems into growth strategies" },
      { property: "og:description", content: "Strategy. Positioning. Growth. Strategy that doesn't stop at the slide deck." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-obsidian">
      <Hero />
      <About />
      <Questions />
      <Services />
      <Process />
      <Execution />
      <FieldNotes />
      <Contact />
    </main>
  );
}
