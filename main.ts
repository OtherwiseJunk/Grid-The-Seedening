import { cloneMapOfDecks } from "./Utilities/map.helper";
import { GriddeningService } from "./services/griddening.service";
import { ScryfallService } from "./services/scryfall.service";
import * as Scry from "scryfall-sdk";
import { Puzzle, PuzzleType } from "./types/Puzzle";
import { ConstraintType, GameConstraint } from "./types/GameConstraint";
const scryfall = new ScryfallService(Scry);
const griddening = new GriddeningService(scryfall);

async function start() {
  console.log("Starting...");
  const deckMap = await griddening.createConstraintDeck();
  for (let i = 0; i < 100; i++) {
    console.log(`Generating ${i + 1} puzzle...`);
    let puzzle = griddening.generateRandomPuzzleBoard(cloneMapOfDecks(deckMap));
    while (puzzle == undefined) {
      console.log("Generated puzzle undefined :-( rolling new type.");
      puzzle = griddening.generateRandomPuzzleBoard(cloneMapOfDecks(deckMap));
    }
    let rerollCount = 0;
    let isValid = false;
    const start = Date.now();
    while (!isValid) {
      const topRow = puzzle.topRow as GameConstraint[];
      const sideRow = puzzle.sideRow as GameConstraint[];
      let intersectionsValid = true;
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[0], sideRow[0]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[0], sideRow[1]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[0], sideRow[2]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[1], sideRow[0]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[1], sideRow[1]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[1], sideRow[2]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[2], sideRow[0]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[2], sideRow[1]));
      intersectionsValid =
        intersectionsValid &&
        (await griddening.intersectionHasMinimumHits(topRow[2], sideRow[2]));

      if (intersectionsValid) {
        isValid = true;
        rerollCount = 0;
        console.log("Puzzle is valid!");
        const timeTaken = Date.now() - start;
        console.log(
          `Total time taken to generate valid puzzle: ${timeTaken / 1000} seconds`
        );
        console.log(`Number of rerolls: ${rerollCount}`);
        logPuzzle(puzzle);
        console.log("\r\n");
        console.log("Generating next puzzle...");
      } else {
        puzzle = rerollPuzzle(cloneMapOfDecks(deckMap), puzzle!);
        rerollCount++;
      }
    }
  }
}

start();

function rerollPuzzle(
  deckMap: Map<ConstraintType, GameConstraint[]>,
  puzzle: Puzzle
): Puzzle {
  switch (puzzle!.type) {
    case PuzzleType.ArtistFocused:
      return griddening.generateRandomArtistBoard(
        cloneMapOfDecks(deckMap),
        puzzle!.subType!
      );
    case PuzzleType.Colorless:
      return griddening.generateRandomColorlessBoard(
        cloneMapOfDecks(deckMap),
        puzzle!.subType!
      );
    case PuzzleType.TwoColors:
      return griddening.generateRandomTwoColorBoard(
        cloneMapOfDecks(deckMap),
        puzzle!.subType!
      );
    case PuzzleType.CreatureFocused:
      return griddening.generateRandomCreatureBoard(
        cloneMapOfDecks(deckMap),
        puzzle!.subType!
      );
    case PuzzleType.FourColors:
      return griddening.generateRandomFourColorBoard(
        cloneMapOfDecks(deckMap),
        puzzle!.subType!
      );
  }
}
function logPuzzle(puzzle: Puzzle) {
  console.log(
    `Generated puzzle of type ${puzzle?.type} with subtype ${puzzle?.subType}`
  );
  console.log("Top Row:");
  console.log(`${puzzle?.topRow[0].displayName}`);
  console.log(`${puzzle?.topRow[1].displayName}`);
  console.log(`${puzzle?.topRow[2].displayName}`);
  console.log("Side Row:");
  console.log(`${puzzle?.sideRow[0].displayName}`);
  console.log(`${puzzle?.sideRow[1].displayName}`);
  console.log(`${puzzle?.sideRow[2].displayName}`);
}
