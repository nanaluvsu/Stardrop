import Fastify from "fastify";
import npc from "./routes/npc.js";
import days from "./routes/days.js";
import plants from "./routes/plants.js";
import items from "./routes/items.js";
const fastify = Fastify({ logger: true });
import fastifyMongo from "@fastify/mongodb";
import dotenv from "dotenv";
dotenv.config();

const { MongoClient, ServerApiVersion } = import("mongodb");

fastify.register(fastifyMongo, {
  url: process.env.MONGO_URL,
});
fastify.register(import("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});
fastify.register(npc);
fastify.register(days);
fastify.register(plants);
fastify.register(items);

fastify.get("/", async function (request, reply) {
  const db = fastify.mongo.client.db("stardew");
  const collection = db.collection("npc");
  const result = await collection.find({}).toArray();
  reply.send(result);
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
