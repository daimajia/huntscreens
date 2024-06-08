import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "huntscreen2-Nd8p",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
