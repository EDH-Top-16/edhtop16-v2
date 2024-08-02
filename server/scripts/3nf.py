# Flags:
# [-o] overwrite existing data assuming upstream 1nf db is correct;
#       Will ignore existing tournaments and only add new tournaments if not provided.

from pymongo import MongoClient, collection
from dotenv import dotenv_values
import sys
import datetime
from tqdm import tqdm

# Converts entries/tournamnets schema into 3rd normal form database
if __name__ == "__main__":
    client = MongoClient(dotenv_values("./config.env")["ATLAS_URI"])

    overwrite_data = (
        True if "-o" in sys.argv else False
    )  # if true, this script will overwrite/update existing data assuming upstream data from 1nf db is true

    db_1nf = client["cedhtop16"]  # Current entry-tournament-metadata db
    db_3nf = client["edhtop16-3nf"]  # 3NF database we will be writing to

    for tournament in tqdm(db_1nf["metadata"].find()):
        # Copy over tournament metadata from 1nf database into tournaments
        if (
            overwrite_data
            or db_3nf["tournaments"].count_documents({"TID": tournament["TID"]}) < 1
        ):
            try:
                db_3nf["tournaments"].find_one_and_update(
                    {"TID": tournament["TID"]}, {"$set": tournament}, upsert=True
                )
            except Exception as e:
                print(
                    f"[{datetime.datetime.now().strftime('%Y-%m-%d')}] Error updating {tournament['TID']}. Error: {e}"
                )

        for entry in db_1nf[tournament["TID"]].find():
            # Add player to collection if does not exist
            player_id = None
            try:
                if "profile" not in entry.keys():
                    entry["profile"] = None
                if overwrite_data:
                    player_id = db_3nf["players"].find_one_and_update(
                        {"name": entry["name"], "profile": entry["profile"]},
                        {"$set": {"name": entry["name"], "profile": entry["profile"]}},
                        upsert=True,
                        return_document=collection.ReturnDocument.AFTER,
                    )["_id"]
                elif (
                    db_3nf["players"].count_documents(
                        {"name": entry["name"], "profile": entry["profile"]}
                    )
                    < 1
                ):
                    player_id = (
                        db_3nf["players"]
                        .insert_one(
                            {"name": entry["name"], "profile": entry["profile"]}
                        )
                        .inserted_id
                    )
                else:
                    player_id = db_3nf["players"].find_one(
                        {"name": entry["name"], "profile": entry["profile"]}
                    )["_id"]
            except Exception as e:
                print(
                    f"Error while processing player -- tournament: {tournament['TID']}     entry: {entry['_id']}     error: {e}"
                )

            # Add commander to collection if does not exist
            commander_id = None
            try:
                if "commander" not in entry.keys():
                    print(
                        f"Warning: no commander for -- tournament: {tournament['TID']}     entry: {entry['_id']}"
                    )
                elif overwrite_data:
                    commander_id = db_3nf["commanders"].find_one_and_update(
                        {"name": entry["commander"]},
                        {
                            "$set": {
                                "name": entry["commander"],
                                "colorID": entry["colorID"],
                            }
                        },
                        upsert=True,
                        return_document=collection.ReturnDocument.AFTER,
                    )["_id"]
                elif (
                    db_3nf["commanders"].count_documents({"name": entry["commander"]})
                    < 1
                ):
                    commander_id = (
                        db_3nf["commanders"]
                        .insert_one(
                            {"name": entry["commander"], "colorID": entry["colorID"]}
                        )
                        .inserted_id
                    )
                else:
                    commander_id = db_3nf["commanders"].find_one(
                        {"name": entry["commander"]}
                    )["_id"]
            except Exception as e:
                print(
                    f"Error while processing commander -- tournament: {tournament['TID']}     entry: {entry['_id']}     error: {e}"
                )
            # TODO: Add/update entries collection with entries information
            try:
                if "decklist" not in entry:
                    entry["decklist"] = None
                if (
                    overwrite_data
                    or db_3nf["entries"].count_documents(
                        {"playerID": player_id, "commanderID": commander_id}
                    )
                    < 1
                ):
                    db_3nf["entries"].find_one_and_update(
                        {"playerID": player_id, "commanderID": commander_id},
                        {
                            "$set": {
                                "playerID": player_id,
                                "commanderID": commander_id,
                                "TID": tournament["TID"],
                                "standing": entry["standing"],
                                "decklist": entry["decklist"],
                                "winsSwiss": entry["winsSwiss"] or 0,
                                "winsBracket": entry["winsBracket"] or 0,
                                "draws": entry["draws"] or 0,
                                "lossesSwiss": entry["lossesSwiss"] or 0,
                                "lossesBracket": entry["lossesBracket"] or 0,
                            }
                        },
                        upsert=True,
                    )
            except Exception as e:
                print(
                    f"Error while processing entry -- tournament: {tournament['TID']}     entry: {entry['_id']}     error: {e}"
                )
