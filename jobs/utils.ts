import { IO } from "@trigger.dev/sdk";

export default async function triggerCommonJobs(io: IO, uuid:string) {
  await io.sendEvent(`generate seo for ${uuid}`, {
    name: "generate.seo.for.product",
    payload: {
      uuid: uuid
    }
  });

  await io.sendEvent(`create category for ${uuid}`, {
    name: "generate.category.for.product",
    payload: {
      uuid: uuid
    }
  });

  await io.sendEvent("add intro" + uuid, {
    name: "run.ai.intro",
    payload: {
      uuid: uuid
    }
  })

  await io.sendEvent(`create embedding for ${uuid}`, {
    name: "create.embedding.by.type",
    payload: {
      uuid: uuid,
    }
  });
}