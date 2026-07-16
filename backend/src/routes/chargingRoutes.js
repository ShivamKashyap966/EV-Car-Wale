const express = require("express");
const router = express.Router();

const { getNearbyStations } = require("../services/chargingService");

router.get("/nearby", async (req, res) => {
    try {
        const { lat, lng } = req.query;

        const stations = await getNearbyStations(lat, lng);

        res.json(stations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch charging stations" });
    }
});

module.exports = router;