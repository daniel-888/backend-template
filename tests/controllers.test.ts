import { expect } from "chai";
import request from "supertest";
import { Express, Request } from "express";
import { createServer } from "../src/utils/createServer";
import { sleep } from "../src/utils/time_tools";

describe("controllers test", () => {
  var app: Express;
  before(async () => {
    app = await createServer();
    return new Promise<void>((resolve) => {
      app.listen(process.env.PORT || 5000, () => {
        console.log("Test server is running on 5000");
        resolve();
      });
    });
  });

  describe("Get lookup of given domain", () => {
    it("GET v1/tools/lookup should return 'domain is required' message", async function () {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/tools/lookup")
          .expect("Content-Type", /json/)
          .expect(404)
          .end((err, res) => {
            expect(res.body.message).to.equal(
              "The query 'domain' is required."
            );
            resolve();
          });
      })
    });

    it("GET v1/tools/lookup?domain=***.com should return IPv4 list of given domain", async function () {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/tools/lookup?domain=mividas.com")
          .set({ "x-forwarded-for": "10.10.10.10" })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).have.nested.property("addresses[0].ip");
            expect(res.body).have.property("created_at");
            expect(res.body).have.property("client_ip");
            expect(res.body).have.property("domain");
            expect(res.body.domain).to.equal("mividas.com");
            resolve();
          });
      });
    });

    it("GET v1/tools/lookup?domain=INVALID DOMAIN should return 'The domain is invalid.'", async function () {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/tools/lookup?domain=afdfds")
          .set({ "x-forwarded-for": "10.10.10.10" })
          .expect("Content-Type", /json/)
          .expect(400)
          .end((err, res) => {
            expect(res.body.message).to.equal("The domain is invalid");
            resolve();
          });
      });
    });

    it("GET v1/tools/lookup?domain=UNEXSITING DOMAIN should return 'The domain is not found.'", async function () {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/tools/lookup?domain=afdfds.com")
          .set({ "x-forwarded-for": "10.10.10.10" })
          .expect("Content-Type", /json/)
          .expect(404)
          .end((err, res) => {
            expect(res.body.message).to.equal("The domain is not found.");
            resolve();
          });
      });
    });
  });

  describe("IPv4 Validate", () => {
    it("POST v1/tools/validate should return { status: true } with valid Ip address.", async function () {
      return new Promise((resolve) => {
        request(app)
          .post("/v1/tools/validate")
          .send({ ip: "10.10.10.10" })
          .set({ "Content-Type": "application/json" })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal(true);
            resolve();
          });
      });
    });

    it("POST v1/tools/validate should return { status: false } with invalid Ip address.", async function () {
      return new Promise((resolve) => {
        request(app)
          .post("/v1/tools/validate")
          .send({ ip: "10.10.10.1000" })
          .set({ "Content-Type": "application/json" })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal(false);
            resolve();
          });
      });
    });
  });

  describe("Get latest 20 queries", () => {
    it("GET v1/history should return latest 20 histories", async function () {
      return new Promise((resolve) => {
        request(app)
          .get("/v1/history")
          .send({ ip: "10.10.10.1000" })
          .set({ "Content-Type": "application/json" })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.an("array");
            expect(res.body.length <= 20).to.equal(true);
            for (let i = 0; i < res.body.length; i++) {
              const query = res.body[i];
              expect(query).have.nested.property("addresses[0].ip");
              expect(query).have.property("created_at");
              expect(query).have.property("client_ip");
              expect(query).have.property("domain");
              if (i != 0) {
                expect(query.created_at < res.body[i - 1].created_at).to.equal(
                  true
                );
              }
            }
            resolve();
          });
      });
    });
  });
});
