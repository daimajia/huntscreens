import { db } from "@/db/db";
import { intro } from "@/db/schema";
import { eq } from "drizzle-orm";
import Markdown from "react-markdown";

export default async function AIIntro({ uuid }: { uuid: string }) {
  const aiintro = await db.query.intro.findFirst({
    where: eq(intro.uuid, uuid)
  });
  if (!aiintro) return <></>;

  return <>
    <div className="prose dark:prose-invert
  prose-h1:font-bold prose-h1:text-lg prose-h2:text-lg
  prose-p:mt-2 prose-h2:mt-0
  prose-a:text-blue-600 prose-p:text-justify prose-img:rounded-xl">
      <Markdown>{aiintro.description.replace("\n", '')}</Markdown>
    </div>
  </>
}