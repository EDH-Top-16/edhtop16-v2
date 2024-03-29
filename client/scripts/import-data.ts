/**
 * @fileoverview Script to normalize tournaments data from raw entries into a
 * well-shaped form specified in schema.prisma.
 */

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { MongoClient } from "mongodb";
import { z } from "zod";
import { workerPool } from "@reverecre/promise";
import { subYears } from "date-fns";

const env = z.object({ ENTRIES_DB_URL: z.string() }).parse(process.env);

// Connection to the raw entries database.
const mongo = new MongoClient(env.ENTRIES_DB_URL);
// Connection to the normalized database, well typed using Prisma.
const prisma = new PrismaClient();

function isNotFalse<T>(v: T | false): v is T {
  return !!v;
}

async function getTournaments() {
  const tournamentsSchema = z.object({
    TID: z.string(),
    tournamentName: z.string(),
    size: z.number().int(),
    date: z.date(),
    dateCreated: z.number().int(),
    swissNum: z.number().int(),
    topCut: z.number().int(),
  });

  const tournaments = mongo
    .db("cedhtop16")
    .collection("metadata")
    .find()
    .map((doc) => {
      const result = tournamentsSchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `Could not parse document ${doc.TID} (${doc.tournamentName}): ${result.error.message}`,
        );

        return false;
      }

      return result.data;
    });

  return (await tournaments.toArray()).filter(isNotFalse);
}

async function getTournamentEntries(tournamentId: string) {
  const entrySchema = z.object({
    name: z.string().trim(),
    profile: z.string().nullable(),
    decklist: z.string().nullable(),
    winsSwiss: z.number().int(),
    winsBracket: z.number().int(),
    draws: z.number().int(),
    lossesSwiss: z.number().int(),
    lossesBracket: z.number().int(),
    standing: z.number().int(),
    colorID: z.string(),
    commander: z.string(),
  });

  const entries = mongo
    .db("cedhtop16")
    .collection(tournamentId)
    .find()
    .map((doc) => {
      const result = entrySchema.safeParse(doc);
      if (!result.success) {
        console.error(
          `Could not parse document ${tournamentId} / ${doc.name}: ${result.error.message}`,
        );

        return false;
      }

      return result.data;
    });

  return (await entries.toArray()).filter(isNotFalse);
}

const playerUuidByName = new Map<string, string>();
function trackPlayer(playerName: string) {
  if (playerUuidByName.has(playerName)) {
    return playerUuidByName.get(playerName)!;
  } else {
    const uuid = randomUUID();
    playerUuidByName.set(playerName, uuid);
    return uuid;
  }
}
function isPlayerTracked(playerName: string) {
  return playerUuidByName.has(playerName);
}

const commanderUuidByName = new Map<string, string>();
function trackCommander(commanderName: string) {
  if (commanderUuidByName.has(commanderName)) {
    return commanderUuidByName.get(commanderName)!;
  } else {
    const uuid = randomUUID();
    commanderUuidByName.set(commanderName, uuid);
    return uuid;
  }
}
function isCommanderTracked(commanderName: string) {
  return commanderUuidByName.has(commanderName);
}

async function main() {
  const tournaments = await getTournaments();
  console.log("Found", tournaments.length, "tournaments!");

  const uuidByTid = new Map(tournaments.map((t) => [t.TID, randomUUID()]));

  await workerPool(tournaments, async (t) => {
    console.log("Creating", t.tournamentName);
    await prisma.tournament.create({
      data: {
        uuid: uuidByTid.get(t.TID)!,
        TID: t.TID,
        name: t.tournamentName,
        size: t.size,
        swissRounds: t.swissNum,
        topCut: t.topCut,
        tournamentDate: t.date,
      },
    });

    const entries = await getTournamentEntries(t.TID);

    const newCommanders = new Map(
      entries
        .filter((e) => !isCommanderTracked(e.commander))
        .map((e) => [e.commander, e.colorID]),
    );

    if (newCommanders.size) {
      console.log("Creating", newCommanders.size, "new commanders");
      await prisma.commander.createMany({
        // Create commanders ahead of time to ensure transactionality.
        data: Array.from(newCommanders).map(([commander, colorId]) => ({
          uuid: trackCommander(commander),
          name: commander,
          colorId,
        })),
      });
    }

    const newPlayers = new Map(
      entries
        .filter((e) => !isPlayerTracked(e.name))
        .map((e) => [e.name, e.profile]),
    );

    if (newPlayers.size) {
      console.log("Creating", newCommanders.size, "new players");
      await prisma.player.createMany({
        // Create players ahead of time to ensure transactionality.
        data: Array.from(newPlayers).map(([playerName, topdeckProfile]) => ({
          uuid: trackPlayer(playerName),
          name: playerName,
          topdeckProfile,
        })),
      });
    }

    console.log("Creating", entries.length, "entries");
    await prisma.entry.createMany({
      data: entries.map((e) => {
        const entryUuid = randomUUID();
        const playerUuid = trackPlayer(e.name);
        const commanderUuid = trackCommander(e.commander);
        const tournamentUuid = uuidByTid.get(t.TID)!;

        return {
          uuid: entryUuid,
          decklist: e.decklist,
          draws: e.draws,
          lossesBracket: e.lossesBracket,
          lossesSwiss: e.lossesSwiss,
          standing: e.standing,
          winsBracket: e.winsBracket,
          winsSwiss: e.winsSwiss,
          playerUuid,
          commanderUuid,
          tournamentUuid,
        };
      }),
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongo.close();
    await prisma.$disconnect();
  });
