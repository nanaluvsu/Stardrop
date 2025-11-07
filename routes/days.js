export default async function (fastify) {
        const db = fastify.mongo.client.db('stardew');
        const days = db.collection('days');

    fastify.post('/days', async (req) => {
      try {
        const { season } = req.body;
        const daysArray = Array.from({ length: 28 }, (_, i) => ({ season, day: i + 1 }));
    
        const newDays = await days.insertMany(daysArray);
        return newDays;
      } catch (err) {
        return { error: err.message };
      }
    })
}