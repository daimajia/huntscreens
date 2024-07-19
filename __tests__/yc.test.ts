import { fethcYCLatestCompanies } from "@/lib/yc";
import {expect, test} from "vitest";

test("fetch YC latest portfolio", async () => {
  const r = await fethcYCLatestCompanies();
  expect(r.length).greaterThan(0);
});