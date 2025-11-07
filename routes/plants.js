import fastify from "fastify";

export default async function (fastify) {
    const db = fastify.mongo.client.db('stardew');
    const collection = db.collection('plants');

    fastify.post('/newPlant', async (req, reply) => {
        try {
            let { id, name, season, sellPrice, growthTime, regrows, regrowthTime} = req.body;

            if (!Array.isArray(season)) {
                if (typeof season === 'string') {
                    season = season.split(',').map(s => s.trim()).filter(Boolean);
                } else if (season == null) {
                    season = [];
                } else {
                    season = [season];
                }
            }
            const result = await collection.insertOne({"_id": id, name, season, sellPrice, growthTime, regrows, regrowthTime });
            reply.send(result);
        }
        catch (error) {
            reply.status(500).send({ error: 'Failed to create plant' });
        }
    });


fastify.get('/plants', async (_, reply) => {
    try {
        const plants = await collection.find({}).toArray();
        reply.send(plants);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch plants' });
    }
});

fastify.get('/plants/:id', async (req, reply) => {
    try {
        const plantId = req.params.id;
        const plant = await collection.findOne({ _id: plantId });
        if (plant) {
            reply.send(plant);
        } else {
            reply.status(404).send({ error: 'Plant not found' });
        }   
    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch plant' });
    }
});

fastify.get('/plants/season', async (req, reply) => {
    try {
        const {season} = req.query; 
        const plants = await collection.find({ season: { $in: [season] } }).toArray(); 
        reply.send(plants);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch plants by season' });
    }
});

fastify.get('/plants/canPlant', async (req, reply) => {
    try {
        const {day, season} = req.query; 
        
        const plants = await collection.find({ 
            growthTime: { $lte: parseInt(day) }, 
            season: { $in: [season] } 
        }).toArray();
        reply.send(plants);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch plants by growth time' });
    }
});
}
