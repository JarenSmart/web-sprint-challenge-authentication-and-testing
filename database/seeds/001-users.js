exports.seed = async function (knex) {
  await knex("users").truncate();
  await knex("users").insert([
    { username: "Jaren", password: "password" },
    { username: "test1", password: "test1" },
    { username: "test2", password: "test2" },
    { username: "test3", password: "test3" },
  ]);
};
