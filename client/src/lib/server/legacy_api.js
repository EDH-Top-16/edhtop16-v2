/**
 * @fileoverview This is a copy of the legacy /api/req code, kept
 * as faithful as possible to the original source. The intention
 * is to support this API going into the future for old consumers,
 * but it may be deprecated in the future.
 */

const isNonEmptyObject = (obj) => !!obj && !Array.isArray(obj) && typeof obj === 'object' && Object.keys(obj).length !== 0;


const dbo = (() => {
  return {
    getDb: function () {
      if (!global.databaseConnection) {
        const { MongoClient } = require("mongodb");
        const client = new MongoClient(process.env.ENTRIES_DB_URL);
        global.databaseConnection = client.db("cedhtop16");
      }

      return global.databaseConnection;
    },
  };
})();

async function parseTourneyFilters(filters) {
  // This generates a list of tournament IDs based on filters.
  // We only want one time-related filter, so we check for the existence of both 'dateCreated' and 'date' in filters (and error if there is).
  // IF we're passed a none-like object or otherwise malformed object (i.e. the query didn't have tourney filters) we set filter to {} to return all tournament IDs.
  let query = {};
  // Error checking
  if (!!filters && filters.constructor === Object) {
    // If filter is a non-null, non-array object

    // Parse date filter

    // Cannot have both date and dateCreated
    if ("date" in filters && "dateCreated" in filters) {
      throw new Error(
        "Error: Request cannot have both date and datecreated fields",
      );
    }

    // dateName is which key we use; dateValue is its value
    let dateName = Object.keys(filters).includes("date")
      ? "date"
      : "dateCreated";
    if (dateName === "date") {
      Object.keys(filters.date).forEach((key) => {
        filters.date[key] = new Date(filters.date[key]);
      });
    }
    let dateValue = dateName === "date" ? filters.date : filters.dateCreated;

    // Get time six months ago; dateValue cannot be less than that.
    const today = new Date();
    const sixMonthsAgo = new Date();

    if(isNonEmptyObject(dateValue)){
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      let dateValueGt = dateValue.$gt ? dateValue.$gt : (dateValue.$gte ? dateValue.$gte : 0);
      let dateValueLt = dateValue.$lt ? dateValue.$lt : (dateValue.$lte ? dateValue.$lte : today);

      if((!!dateValueGt || dateValueGt === 0) && typeof dateValueGt === 'number') dateValueGt *= 1000 // JS dates are coerced to ms; if we have a unix timestamp use ms
      if((!!dateValueLt || dateValueLt === 0) && typeof dateValueLt === 'number') dateValueLt *= 1000


      if(Math.abs(dateValueLt - dateValueGt) > (1000 * 60 * 60 * 24 * 183)) {
        throw new Error(
          "Error: date range must be within 183 days (~6 months)"
        )
      }
    } else {
      dateValue = {$gt: sixMonthsAgo}
    }

    // Form query and add date and size filter.
    query = {
      // If date, size, not included, set filter to more than 0 (get everything)
      [dateName]: dateValue,
      size: Object.keys(filters).includes("size") ? filters.size : { $gt: 0 },
    };

    // Process additional filters
    ["TID", "tournamentName", "swissNum", "topCut"].forEach((element) => {
      if (Object.keys(filters).includes(element)) {
        query[element] = filters[element];
      }
    });
  }

  return dbo
    .getDb()
    .collection("metadata")
    .find(query, { projection: { _id: 0 } })
    .toArray();
}

// Main API endpoint. Returns a list of playerobjects with variouus stats relating performance and deck.
// Alongside filtering these datapoints, you can also filter based on the tournament based on size, recency, etc.
async function reqApi(req, res) {
  let db_connect = dbo.getDb();

  // Parse tournament filters
  try {
    var tourney_ids = await parseTourneyFilters(req.body.tourney_filter);
  } catch (err) {
    console.error(err);
    res.status(400);
    res.send("Error: invalid tournament filters.");
    return;
  }

  var query = {};
  try {
    // Generate query
    // TODO: soft/hard match toggling for colorID
    const keys = [
      "name",
      "profile",
      "decklist",
      "wins",
      "winsSwiss",
      "winsBracket",
      "winRate",
      "winRateSwiss",
      "winRateBracket",
      "draws",
      "losses",
      "lossesSwiss",
      "lossesBracket",
      "standing",
      "colorID",
      "commander",
    ];
    keys.forEach((element) => {
      if (element in req.body) {
        if (!!req.body[element]) {
          query[element] = req.body[element];
        } else {
          console.log("caught", element);
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400);
    res.send("Error: invalid filters.");
    return;
  }
  var results = [];

  // Get entry for each tournament we got from parseTourneyFilters
  for (let i = 0; i < tourney_ids.length; i++) {
    const result = await db_connect
      .collection(tourney_ids[i].TID)
      .find(query, { projection: { _id: 0 } })
      .toArray();

    // Append tournamentName onto entries
    result.map((x) => {
      x.tournamentName = tourney_ids[i].tournamentName;
      x.dateCreated = tourney_ids[i].dateCreated;
    });
    results = results.concat(result);
  }

  res.json(results);
}

// Get a list of all tournaments as well as tournament IDs and metadata
async function listTourneysApi(req, res) {
  // Parse tournament filters and just return it
  try {
    var tourney_ids = await parseTourneyFilters(req.body);
  } catch (err) {
    console.error(err);
    res.status(400);
    res.send("Error: invalid filters.");
    return;
  }
  res.json(tourney_ids);
}

// Get all commanders present, their color IDs, and their count.
// This is only really useful for cursory analysis, as you cannot filter by standing, etc. To do so, use the 'req' endpoint.
// This endpoint is mostly here to use for search bar suggestions and to be quicker than the main 'req' endpoint.
async function getCommandersApi(req, res) {
  let db_connect = dbo.getDb();
  const results = await db_connect
    .collection("commanders")
    .find({}, { projection: { _id: 0 } })
    .toArray();

  res.json(results);
}

module.exports = {
  reqApi,
  listTourneysApi,
  getCommandersApi,
};
