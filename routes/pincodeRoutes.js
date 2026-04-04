const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/pincodeController");

// ── Location hierarchy ──
router.get("/states", ctrl.getStates);
router.get("/states/:state/districts", ctrl.getDistricts);
router.get("/states/:state/districts/:district/taluks", ctrl.getTaluks);

// ── Pincode data ──
router.get("/pincodes", ctrl.getPincodes);
router.get("/search", ctrl.search);
router.get("/pincode/:pincode", ctrl.getPincodeDetail);

// ── Statistics ──
router.get("/stats", ctrl.getStats);
router.get("/stats/state-distribution", ctrl.getStateDistribution);
router.get("/stats/delivery-distribution", ctrl.getDeliveryDistribution);

// ── Export ──
router.get("/export", ctrl.exportCSV);

module.exports = router;
