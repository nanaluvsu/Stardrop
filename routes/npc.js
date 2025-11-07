export default async function (fastify) {
     const db = fastify.mongo.client.db('stardew');
    const collection = db.collection('npc');
    fastify.post('/npc', async (req, reply) => {
       try {
            const { name, birthday } = req.body;
       } catch (error) {
            reply.status(500).send({ error: 'Failed to create NPC' });
    }

    })
}