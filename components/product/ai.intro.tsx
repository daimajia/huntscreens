import Markdown from "react-markdown";

function optimizeMarkdown(markdown: string): string {
  return markdown
    .replace(/^# (.+)$/gm, '## $1') // Convert h1 to h2
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
    .replace(/\\n/g, '\n') // Replace escaped newlines  
    .replace(/[\[\]]/g, ""); // Remove brackets
}

export default async function AIIntro({ markdown }: { markdown: string | undefined | null }) {
  if (!markdown || markdown === "") return <></>;
  markdown = optimizeMarkdown(markdown);

  return (
    <div className="prose dark:prose-invert w-full
  prose-h1:font-bold prose-h3:text-lg prose-p:mt-2
  prose-h2:mt-0 !max-w-none prose-p:text-justify prose-img:rounded-xl">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}