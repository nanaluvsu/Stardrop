export default async function (fastify) {
  const db = fastify.mongo.client.db("stardew");
  const collection = db.collection("items");
  fastify.get("/items", async (_, reply) => {
    try {
      const items = await collection.find({}).toArray();
      reply.send(items);
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch items" });
    }
  });

  fastify.get("/items/name", async (req, reply) => {
    try {
      const name = req.query;
      const item = await collection.findOne({ name: name });
      if (item) {
        reply.send(item);
      } else {
        reply.status(404).send({ error: "Item not found" });
      }
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch item by name" });
    }
  });

  fastify.get("/item/likedBy", async (req, reply) => {
    try {
      const { npc } = req.query;
      if (!npc) {
        return reply.status(400).send({ error: "NPC required" });
      }

      const items = await collection
        .find(
          { likedBy: { $in: [npc] } },
          { projection: { name: 1, type: 1, likedBy: 1 } }
        )
        .toArray();
      reply.send(items);
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch NPCs" });
    }
  });
}
