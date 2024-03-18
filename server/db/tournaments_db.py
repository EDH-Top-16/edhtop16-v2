from typing import List, Any
import logging

from .base_db import get_db_async
from utils.types import AllFilters, TournamentFilters, Tournament, Commander, Entry


async def get_tournaments(tournament_filters: TournamentFilters) -> List[Tournament]:
    """
    Returns the metadata document from the database.
    """
    db = await get_db_async("cedhtop16")
    metadata = db["metadata"]

    db_filters = tournament_filters.model_dump(
        by_alias=True, exclude_unset=True, exclude_none=True
    )
    result: List[Any] = await metadata.find(db_filters, {"_id": 0}).to_list(length=10000)  # type: ignore
    return [Tournament(**t) for t in result]


async def get_commanders(filters: AllFilters) -> dict[str, Commander]:
    """
    Aggregates and returns a list of commanders that match the filters.
    """
    players = await get_entries(filters)

    commanders: dict[str, Commander] = {}
    for player in players:
        # For each player, check if the commander is in the dictionary.
        commander = player.commander or ""
        if not commander:
            logging.warning(f"Can't get commander for player: {player}")
            continue

        if commander == "Unknown Commander":
            logging.debug(f"Unknown commander for player: {player}")
            continue

        if commander not in commanders:
            # If the commander is not in the dictionary, add it.
            commanders[commander] = Commander(
                colorID=player.colorID or "",
                wins=player.wins or 0,
                winsSwiss=player.winsSwiss or 0,
                winsBracket=player.winsBracket or 0,
                draws=player.draws or 0,
                losses=player.losses or 0,
                lossesSwiss=player.lossesSwiss or 0,
                lossesBracket=player.lossesBracket or 0,
                topCuts=(
                    1
                    if (player.standing or float("inf")) <= (player.topCut or 0)
                    else 0
                ),
                count=1,
            )
        else:
            # If the commander is in the dictionary, update it.
            c = commanders.get(commander)
            if c is None:
                logging.warning(f"Malformed commander: {commander}")
                continue

            # If the colorID is not set, set it if this player has a valid colorID.
            if player.colorID in {"", "N/A"} and not c.colorID:
                c.colorID = player.colorID

            # Update counting stat fields
            c.wins = (c.wins or 0) + (player.wins or 0)
            c.winsSwiss = (c.winsSwiss or 0) + (player.winsSwiss or 0)
            c.winsBracket = (c.winsBracket or 0) + (player.winsBracket or 0)
            c.draws = (c.draws or 0) + (player.draws or 0)
            c.losses = (c.losses or 0) + (player.losses or 0)
            c.lossesSwiss = (c.lossesSwiss or 0) + (player.lossesSwiss or 0)
            c.lossesBracket = (c.lossesBracket or 0) + (player.lossesBracket or 0)

            if (player.standing or float("inf")) <= (player.topCut or 0):
                c.topCuts = (c.topCuts or 0) + 1
            # Increment counter
            c.count = (c.count or 0) + 1

    # Calculate the winRate, winRateSwiss, and winRateBracket
    for commander in commanders:
        c = commanders[commander]
        c.winRate = (
            (c.wins or 0) / ((c.wins or 0) + (c.losses or 0) + (c.draws or 0))
            if ((c.wins or 0) + (c.losses or 0) + (c.draws or 0)) > 0
            else None
        )
        c.winRateSwiss = (
            (c.winsSwiss or 0)
            / ((c.winsSwiss or 0) + (c.lossesSwiss or 0) + (c.draws or 0))
            if ((c.winsSwiss or 0) + (c.lossesSwiss or 0) + (c.draws or 0)) > 0
            else None
        )
        c.winRateBracket = (
            (c.winsBracket or 0) / ((c.wins or 0) + (c.losses or 0))
            if ((c.wins or 0) + (c.losses or 0)) > 0
            else None
        )
        c.conversionRate = (c.topCuts or 0) / (c.count or 0)

    return commanders


async def get_entries(filters: AllFilters) -> List[Entry]:
    """
    Returns a list of players from the database.
    """
    db = await get_db_async("cedhtop16")

    tournament_filters = filters.tournament_filters or TournamentFilters()
    tournaments = await get_tournaments(tournament_filters)
    if filters.tournament_filters is not None:
        filters.tournament_filters = None

    res: List[Entry] = []
    for tournament in tournaments:
        # Get the TID from the metadata document
        tid = tournament.TID
        if tid is None or tid == "":
            logging.warning(f"Empty TID for tournament: {tournament}")
            continue

        # Get the tournament with matching TID from the database
        t = db[tid]

        # Get the tournament data from the database
        db_filters = filters.model_dump(
            by_alias=True, exclude_unset=True, exclude_none=True
        )
        result: List[Any] = await t.find(db_filters).to_list(length=10000)  # type: ignore
        for i in result:
            i["TID"] = tid
            i["tournamentName"] = tournament.tournamentName
            i["topCut"] = tournament.topCut or 0
            i["tournamentSize"] = tournament.size or 0

        res.extend([Entry(**e, id=str(e["_id"])) for e in result])

    return res
