const Pincode = require("../models/Pincode");

// ─── IMPORTANT ───
// The "stateName" field in MongoDB has 39 trailing spaces in its key name.
// We use this constant everywhere we reference that field.
const STATE_FIELD = "stateName                                       ";

// Helper: clean trailing spaces from values
const clean = (val) => (val ? val.trim() : val);

// Helper: transform documents to clean field names and values
const cleanDoc = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  // If the spaced field exists, copy to clean "stateName" and delete the spaced one
  if (obj[STATE_FIELD] !== undefined) {
    obj.stateName = clean(obj[STATE_FIELD]);
    delete obj[STATE_FIELD];
  }
  // Trim string values
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
  }
  return obj;
};

// ──────────────────────────────────────────────
// 1. GET /api/states  → all unique state names
// ──────────────────────────────────────────────
exports.getStates = async (req, res) => {
  try {
    // Use aggregation to get trimmed + deduplicated state names.
    // The DB has values truncated at random lengths (e.g. "ANDHRA PR", "ANDHRA PRADESH").
    // We group by trimmed value, pick the LONGEST variant as the canonical name,
    // then deduplicate prefixes by removing any name that's a prefix of another.
    const raw = await Pincode.aggregate([
      { $match: { [STATE_FIELD]: { $ne: null } } },
      {
        $addFields: {
          _trimmed: { $trim: { input: `$${STATE_FIELD}` } },
        },
      },
      { $match: { _trimmed: { $ne: "" } } },
      { $group: { _id: "$_trimmed" } },
      { $sort: { _id: 1 } },
    ]);

    let names = raw.map((r) => r._id).sort();

    // Remove any name that is a prefix of another longer name
    // e.g. "ANDHRA PR" is a prefix of "ANDHRA PRADESH" → remove it
    const filtered = names.filter((name) => {
      return !names.some(
        (other) => other !== name && other.startsWith(name)
      );
    });

    res.json(filtered.sort());
  } catch (err) {
    console.error("getStates error:", err);
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

// ──────────────────────────────────────────────
// 2. GET /api/states/:state/districts
// ──────────────────────────────────────────────
exports.getDistricts = async (req, res) => {
  try {
    const { state } = req.params;
    const districts = await Pincode.distinct("districtName", {
      [STATE_FIELD]: { $regex: new RegExp(`^\\s*${state}\\s*$`, "i") },
    });
    res.json(districts.filter(Boolean).map(clean).sort());
  } catch (err) {
    console.error("getDistricts error:", err);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
};

// ──────────────────────────────────────────────
// 3. GET /api/states/:state/districts/:district/taluks
// ──────────────────────────────────────────────
exports.getTaluks = async (req, res) => {
  try {
    const { state, district } = req.params;
    const taluks = await Pincode.distinct("taluk", {
      [STATE_FIELD]: { $regex: new RegExp(`^\\s*${state}\\s*$`, "i") },
      districtName: { $regex: new RegExp(`^${district}$`, "i") },
    });
    res.json(taluks.filter(Boolean).map(clean).sort());
  } catch (err) {
    console.error("getTaluks error:", err);
    res.status(500).json({ error: "Failed to fetch taluks" });
  }
};

// ──────────────────────────────────────────────
// 4. GET /api/pincodes?state=&district=&taluk=&page=&limit=
// ──────────────────────────────────────────────
exports.getPincodes = async (req, res) => {
  try {
    const { state, district, taluk, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (state)
      filter[STATE_FIELD] = { $regex: new RegExp(`^\\s*${state}\\s*$`, "i") };
    if (district)
      filter.districtName = { $regex: new RegExp(`^${district}$`, "i") };
    if (taluk) filter.taluk = { $regex: new RegExp(`^${taluk}$`, "i") };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [rawData, total] = await Promise.all([
      Pincode.find(filter).skip(skip).limit(parseInt(limit)).lean(),
      Pincode.countDocuments(filter),
    ]);

    const data = rawData.map(cleanDoc);

    res.json({
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error("getPincodes error:", err);
    res.status(500).json({ error: "Failed to fetch pincodes" });
  }
};

// ──────────────────────────────────────────────
// 5. GET /api/search?q=adi  → fuzzy search
// ──────────────────────────────────────────────
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const regex = new RegExp(q, "i");
    const isNumeric = /^\d+$/.test(q.trim());

    const orConditions = [
      { officeName: regex },
      { districtName: regex },
      { [STATE_FIELD]: regex },
      { taluk: regex },
    ];

    if (isNumeric) {
      orConditions.push({ pincode: parseInt(q.trim()) });
    }

    const rawResults = await Pincode.find({ $or: orConditions })
      .limit(50)
      .lean();

    res.json(rawResults.map(cleanDoc));
  } catch (err) {
    console.error("search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

// ──────────────────────────────────────────────
// 6. GET /api/pincode/:pincode  → single detail
// ──────────────────────────────────────────────
exports.getPincodeDetail = async (req, res) => {
  try {
    const { pincode } = req.params;
    const rawResults = await Pincode.find({
      pincode: parseInt(pincode),
    }).lean();

    if (!rawResults || rawResults.length === 0) {
      return res.status(404).json({ error: "Pincode not found" });
    }

    res.json(rawResults.map(cleanDoc));
  } catch (err) {
    console.error("getPincodeDetail error:", err);
    res.status(500).json({ error: "Failed to fetch pincode details" });
  }
};

// ──────────────────────────────────────────────
// 7. GET /api/stats → overview statistics
// ──────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [totalPincodes, rawStates, deliveryOffices, nonDeliveryOffices] =
      await Promise.all([
        Pincode.countDocuments(),
        Pincode.distinct(STATE_FIELD),
        Pincode.countDocuments({
          deliveryStatus: { $regex: /^Delivery$/i },
        }),
        Pincode.countDocuments({
          deliveryStatus: { $regex: /non/i },
        }),
      ]);

    // Deduplicate: trim, unique, then remove prefixes
    let trimmed = [...new Set(rawStates.map((s) => s && s.trim()).filter(Boolean))].sort();
    const totalStates = trimmed.filter(
      (name) => !trimmed.some((other) => other !== name && other.startsWith(name))
    ).length;

    res.json({
      totalPincodes,
      totalStates,
      deliveryOffices,
      nonDeliveryOffices,
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// ──────────────────────────────────────────────
// 8. GET /api/stats/state-distribution
// ──────────────────────────────────────────────
exports.getStateDistribution = async (req, res) => {
  try {
    const rawDistribution = await Pincode.aggregate([
      { $match: { [STATE_FIELD]: { $ne: null } } },
      {
        $addFields: {
          _trimmedState: { $trim: { input: `$${STATE_FIELD}` } },
        },
      },
      { $match: { _trimmedState: { $ne: "" } } },
      { $group: { _id: "$_trimmedState", count: { $sum: 1 } } },
      { $project: { state: "$_id", count: 1, _id: 0 } },
      { $sort: { state: 1 } },
    ]);

    // Merge truncated prefix names into the longest variant
    // e.g. "ANDHRA PR" (5 records) merges into "ANDHRA PRADESH" (16000 records)
    const merged = {};
    const allStates = rawDistribution.map((d) => d.state).sort((a, b) => b.length - a.length);

    for (const entry of rawDistribution) {
      // Find the longest state name that this entry's state is a prefix of
      const canonical = allStates.find(
        (s) => s.startsWith(entry.state) || entry.state.startsWith(s)
      );
      const key = canonical && canonical.length >= entry.state.length ? canonical : entry.state;
      // Also check if this entry IS the longest prefix for others
      const longestMatch = allStates.find((s) => s !== entry.state && s.startsWith(entry.state));
      const finalKey = longestMatch || key;

      if (!merged[finalKey]) merged[finalKey] = 0;
      merged[finalKey] += entry.count;
    }

    const distribution = Object.entries(merged)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    res.json(distribution);
  } catch (err) {
    console.error("getStateDistribution error:", err);
    res.status(500).json({ error: "Failed to fetch state distribution" });
  }
};

// ──────────────────────────────────────────────
// 9. GET /api/stats/delivery-distribution
// ──────────────────────────────────────────────
exports.getDeliveryDistribution = async (req, res) => {
  try {
    const [delivery, nonDelivery] = await Promise.all([
      Pincode.countDocuments({
        deliveryStatus: { $regex: /^Delivery$/i },
      }),
      Pincode.countDocuments({
        deliveryStatus: { $regex: /non/i },
      }),
    ]);
    res.json({ delivery, nonDelivery });
  } catch (err) {
    console.error("getDeliveryDistribution error:", err);
    res.status(500).json({ error: "Failed to fetch delivery distribution" });
  }
};

// ──────────────────────────────────────────────
// 10. GET /api/export?state=GUJARAT → CSV download
// ──────────────────────────────────────────────
exports.exportCSV = async (req, res) => {
  try {
    const { state, district, taluk } = req.query;
    const filter = {};
    if (state)
      filter[STATE_FIELD] = { $regex: new RegExp(`^\\s*${state}\\s*$`, "i") };
    if (district)
      filter.districtName = { $regex: new RegExp(`^${district}$`, "i") };
    if (taluk) filter.taluk = { $regex: new RegExp(`^${taluk}$`, "i") };

    const rawData = await Pincode.find(filter).lean();

    if (rawData.length === 0) {
      return res.status(404).json({ error: "No data found for export" });
    }

    const data = rawData.map(cleanDoc);

    const headers = [
      "pincode",
      "officeName",
      "officeType",
      "deliveryStatus",
      "divisionName",
      "regionName",
      "circleName",
      "taluk",
      "districtName",
      "stateName",
    ];

    const csvRows = [headers.join(",")];
    for (const row of data) {
      const values = headers.map((h) => {
        const val = row[h] != null ? String(row[h]).trim() : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }

    const csv = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=pincodes_${state || "all"}.csv`
    );
    res.send(csv);
  } catch (err) {
    console.error("exportCSV error:", err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
};
