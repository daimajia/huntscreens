import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { invokeTrigger } from "@trigger.dev/sdk";
import { fetchPHPosts } from "@/libs/producthunt";
import { Producthunt, producthunt } from "@/db/schema/ph";
import { db } from "@/db/db";
import { takeScreenshot } from "@/libs/screenshotone";
import { v4 as uuidv4 } from 'uuid';
import { prettyURL } from "@/libs/utils/url";

client.defineJob({
  id: "fetch-ph-newest",
  name: "fetch ph newest",
  version: "0.0.1",
  trigger: invokeTrigger(),
  run: async (payload, io, ctx) => {
    await io.logger.info('start fetch ph newest');
    const edges = await fetchPHPosts();
    edges.forEach(async element => {
      element.node.uuid = uuidv4();
      if(element.node.website){
        const resp = await fetch(element.node.website);
        element.node.website = prettyURL(resp.url);
        element.node.screenshot = await takeScreenshot(element.node.website, element.node.uuid);
      }
      await db.insert(producthunt).values(element.node).onConflictDoNothing()
    });
  }
});