export default async function (fastify) {
     const db = fastify.mongo.client.db('stardew');
    const collection = db.collection('npc');
    
  fastify.post("/item", async (req, reply) => {

     try {
       let {name, birthday, gifts} = req.body;
       if (!Array.isArray(birthday)) {
 
       }
       const result = await collection.insertOne({
         name,
         birthday,
         gifts
       });
       reply.send(result);
     } catch (error) {
       reply.status(500).send({ error: "Failed to create item" });
     }
 
   })
}