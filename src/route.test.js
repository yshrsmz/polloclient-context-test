const express = require("express");
const initRoute = require("./route");
const nock = require("nock");
const request = require("supertest");

describe("route", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.urlencoded({ extended: true }));
    initRoute(app);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test("/test", async () => {
    const scope = nock("https://example.com")
      .post("/graphql", {
        operationName: "TestQuery",
        query: /.+/i,
        variables: {}
      })
      .matchHeader("user-agent", "user-agent-string")
      .matchHeader("cookie", "cookie-value")
      .reply(200, {
        data: {}
      });

    await request(app)
      .get("/test")
      .set("user-agent", "user-agent-string")
      .set("cookie", "cookie-value")
      .expect(200);
  });
});
