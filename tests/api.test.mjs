import test, { before } from "node:test";
import assert from "node:assert/strict";
import { BASE, postJSON, mintToken, ensureServer } from "./helpers.mjs";

before(ensureServer);

test("valid lead is accepted and stored (returns id)", async () => {
  const res = await postJSON("/api/leads", {
    name: "Auto Test",
    phone: "+91 90000 55555",
    source: "home",
    message: "automated test lead",
  });
  assert.equal(res.status, 200);
  const j = await res.json();
  assert.ok(j.ok && typeof j.id === "string", "should return ok + id");
});

test("invalid lead (short name / bad phone) is rejected 422", async () => {
  const res = await postJSON("/api/leads", { name: "A", phone: "1", source: "home" });
  assert.equal(res.status, 422);
});

test("honeypot submission is silently accepted (200, not stored)", async () => {
  const res = await postJSON("/api/leads", {
    name: "Bot",
    phone: "+91 9000000000",
    source: "home",
    website: "http://spam.example",
  });
  assert.equal(res.status, 200);
});

test("CSV export requires authentication (401 without cookie)", async () => {
  const res = await fetch(BASE + "/api/leads/export");
  assert.equal(res.status, 401);
});

test("CSV export works with a business session cookie", async () => {
  const token = await mintToken("BUSINESS");
  const res = await fetch(BASE + "/api/leads/export", {
    headers: { cookie: `fk_session=${token}` },
  });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") || "", /text\/csv/);
  const body = await res.text();
  assert.match(body, /"Name","Phone"/, "CSV header present");
});

test("image upload requires authentication (401)", async () => {
  const res = await fetch(BASE + "/api/upload", { method: "POST" });
  assert.equal(res.status, 401);
});
