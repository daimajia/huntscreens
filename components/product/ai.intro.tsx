import { db } from "@/db/db";
import { intro } from "@/db/schema";
import { eq } from "drizzle-orm";
import Markdown from "react-markdown";

export default async function AIIntro({ uuid, overwrite }: { uuid: string, overwrite?: string }) {
  let markdown = overwrite;
  if (!markdown) {
    const aiintro = await db.query.intro.findFirst({
      where: eq(intro.uuid, uuid)
    });
    if (!aiintro) return <></>;
    markdown = aiintro.description;
  }

  markdown = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  return <>
    <div className="prose dark:prose-invert w-full
  prose-h1:font-bold prose-h1:text-lg prose-h2:text-lg
  prose-p:mt-2 prose-h2:mt-0 !max-w-none prose-p:text-justify prose-img:rounded-xl">
      <Markdown>{markdown.replace(/\\n/g, '\n')}</Markdown>
    </div>
  </>
}