import { createAppRoute } from "@trigger.dev/nextjs";

import "@/jobs";
import { client } from "@/trigger";

//this route is used to send and receive data with Trigger.dev
export const { POST, dynamic } = createAppRoute(client);