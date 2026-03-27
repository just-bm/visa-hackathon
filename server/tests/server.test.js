import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("DQS-AI Server Smoke Tests", () => {
  it("GET / should return hello message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hello from Express");
  });

  it("GET /api/health should return ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /non-existent-route should return 404", async () => {
    const res = await request(app).get("/api/non-existent");
    expect(res.statusCode).toBe(404);
  });
});
