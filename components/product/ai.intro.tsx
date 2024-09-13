import { db } from "@/db/db";
import { intro } from "@/db/schema";
import { eq } from "drizzle-orm";
import Markdown from "react-markdown";

function optimizeMarkdown(markdown: string): string {
  return markdown
    .replace(/^# (.+)$/gm, '## $1') // Convert h1 to h2
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
    .replace(/\\n/g, '\n'); // Replace escaped newlines
}

export default async function AIIntro({ uuid, overwrite }: { uuid: string, overwrite?: string }) {
  let markdown = overwrite;
  if (!markdown) {
    const aiintro = await db.query.intro.findFirst({
      where: eq(intro.uuid, uuid)
    });
    if (!aiintro) return <></>;
    markdown = aiintro.description;
  }

  markdown = optimizeMarkdown(markdown);

  return (
    <div className="prose dark:prose-invert w-full
  prose-h1:font-bold prose-h1:text-lg prose-h2:text-lg
  prose-p:mt-2 prose-h2:mt-0 !max-w-none prose-p:text-justify prose-img:rounded-xl">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}