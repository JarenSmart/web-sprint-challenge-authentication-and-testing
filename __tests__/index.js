const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

// a global jest hook to run before each individual test
beforeEach(async () => {
  // re-run the seeds and start with a fresh database for each test
  await db("users").truncate();
});

afterAll(async () => {
  // closes the database connection after running all the tests,
  // so the jest command doesn't stall
  await db.destroy();
});

const user1 = {
  username: "secret user 1",
  password: "password",
};
const user2 = {
  username: "secret user 2",
  password: "password",
};

describe("integration tests", () => {
  //-------Registration-------
  it("POST /register - Receive status 201", async () => {
    const res = await supertest(server).post("/api/auth/register").send(user1);
    expect(res.statusCode).toBe(201);
  });

  it("POST /register - Return ${username} once created", async () => {
    const res = await supertest(server).post("/api/auth/register").send(user1);
    expect(res.body.username).toBe(user1.username);
  });

  //-------Login-------
  it("POST /login - Return status 200", async () => {
    const res1 = await supertest(server).post("/api/auth/register").send(user1);
    const res2 = await supertest(server).post("/api/auth/login").send(user1);
    expect(res2.statusCode).toBe(200);
  });

  it("POST /login - Return weclome message", async () => {
    const res1 = await supertest(server).post("/api/auth/register").send(user1);
    const res2 = await supertest(server).post("/api/auth/login").send(user1);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.message).toBe("Welcome secret user 1!");
  });

  //-------jokes-------
  it("GET /jokes - Return status 200", async () => {
    const res1 = await supertest(server).post("/api/auth/register").send(user1);
    const res2 = await supertest(server).post("/api/auth/login").send(user1);
    const res3 = await supertest(server)
      .get("/api/jokes")
      .set("Authorization", res2.body.token);
    expect(res3.statusCode).toBe(200);
  });

  it("GET /jokes/:id - Return status 200 & correct joke", async () => {
    const res1 = await supertest(server).post("/api/auth/register").send(user1);
    const res2 = await supertest(server).post("/api/auth/login").send(user1);
    const res3 = await supertest(server)
      .get("/api/jokes")
      .set("Authorization", res2.body.token);
    expect(res3.statusCode).toBe(200);
    expect(res3.body[0].joke).toBe(
      "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
    );
  });
});
