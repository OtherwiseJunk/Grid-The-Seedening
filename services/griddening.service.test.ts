import { expect, test, describe, beforeEach } from "vitest";
import { GriddeningService } from "./griddening.service";
import { ConstraintType, GameConstraint } from "../types/GameConstraint";
import * as Scry from "scryfall-sdk";
import { ScryfallHelper } from "../testUtilities/scryfall.helper";
import { ScryfallMockedService } from "../__mocks__/scryfall.service";
import {
  pioneerSet,
  standardSet,
  setsWithExpectedIsPioneerReturns,
  setTypesToFilter,
  namesToSanitizeWithExpectedResult,
  setsWithExpectedConstraintReturns,
  setInputs,
  expectedSetOutputs,
} from "../testUtilities/consts/griddening.testconstants";
import { PuzzleType } from "../types/Puzzle";
import { cloneMapOfDecks } from "../testUtilities/map.helper";

const scryfallServiceMock = new ScryfallMockedService();
const griddeningService = new GriddeningService(scryfallServiceMock);

describe("Griddening Service", () => {
  describe("createConstraintDeck", () => {
    test("returns map of constraint arrays for each Contraint Type", async () => {
      scryfallServiceMock.setAllSets([pioneerSet, standardSet]);

      const mapConstraintDecks = await griddeningService.createConstraintDeck();
      expect(mapConstraintDecks.size).toBe(ConstraintType.__LENGTH);
    });
  });

  describe("selectValidConstraints", () => {
    test("", () => {
      expect(true).toBeTruthy();
    });
  });

  describe("isPioneerSet", () => {
    test.each(setsWithExpectedIsPioneerReturns)(
      "(%o) -> %o",
      (scrySet, expectedResult) => {
        const isPioneerSet = griddeningService.isPioneerSet(
          scrySet as Scry.Set
        );
        expect(isPioneerSet).toBe(expectedResult);
      }
    );
  });

  describe("sanitizeSet", () => {
    test.each(setTypesToFilter)(
      "(set.setType === %s) -> unmodified set name",
      (setType) => {
        const filteredScryfallSet = ScryfallHelper.generateScryfallSet(
          "1993-01-01",
          setType,
          "f",
          setType
        );
        expect(griddeningService.sanitizeSet(filteredScryfallSet).name).toBe(
          filteredScryfallSet.name
        );
      }
    );
    test.each(namesToSanitizeWithExpectedResult)(
      "(set.setName === %s) -> set.setName === %s",
      (inputSetName, outputSetName) => {
        const scryfallSet = ScryfallHelper.generateScryfallSet(
          "1993-01-01",
          inputSetName,
          "f"
        );
        const outputSet = griddeningService.sanitizeSet(scryfallSet);

        if (outputSet == undefined) {
          expect("").toBe(outputSetName);
        } else {
          expect(outputSet!.name).toBe(outputSetName);
        }
      }
    );
  });

  describe("buildSetConstraintFromScryfallSet", () => {
    test.each(setsWithExpectedConstraintReturns)(
      "(%o) -> %o",
      (inputSet, outputConstraint) => {
        const constraint = griddeningService.buildSetConstraintFromScryfallSet(
          inputSet as Scry.Set
        );
        expect(constraint.displayName).toBe(
          (outputConstraint as GameConstraint).displayName
        );
        expect(constraint.constraintType).toBe(ConstraintType.Set);
        expect(constraint.imageAltText).toBe(
          (outputConstraint as GameConstraint).imageAltText
        );
        expect(constraint.imageSrc).toBe(
          (outputConstraint as GameConstraint).imageSrc
        );
        expect(constraint.scryfallQuery).toBe(
          (outputConstraint as GameConstraint).scryfallQuery
        );
      }
    );
  });

  describe("getSetConstraints", () => {
    test("should return qualifying pioneer set constraints", async () => {
      scryfallServiceMock.setAllSets(setInputs);

      const setConstraints = await griddeningService.getSetConstraints();

      expect(setConstraints.length).toBe(expectedSetOutputs.length);
    });
  });

  describe("intersectionHasMinimumHits", () => {
    const fakeConstraint = new GameConstraint("", ConstraintType.Set, "");

    test("returns true when intersection has 10 or more hits when no MINIMUM_HITS environment varaible is set", async () => {
      scryfallServiceMock.setHitCount(10);
      expect(
        await griddeningService.intersectionHasMinimumHits(
          fakeConstraint,
          fakeConstraint
        )
      ).toBeTruthy();
    });
    test("returns false when intersection has less than 10 hits when no MINIMUM_HITS environment varaible is set", async () => {
      scryfallServiceMock.setHitCount(9);
      expect(
        await griddeningService.intersectionHasMinimumHits(
          fakeConstraint,
          fakeConstraint
        )
      ).toBeFalsy();
    });
    test("returns true when intersection has process.env.MINIMUM_HITS or more hits", async () => {
      scryfallServiceMock.setHitCount(7);
      process.env.MINIMUM_HITS = "7";
      const service = new GriddeningService(scryfallServiceMock);
      expect(
        await service.intersectionHasMinimumHits(fakeConstraint, fakeConstraint)
      ).toBeTruthy();
    });
    test("returns false when intersection has less than process.env.MINIMUM_HITS hits", async () => {
      scryfallServiceMock.setHitCount(6);
      process.env.MINIMUM_HITS = "7";
      const service = new GriddeningService(scryfallServiceMock);
      expect(
        await service.intersectionHasMinimumHits(fakeConstraint, fakeConstraint)
      ).toBeFalsy();
    });
  });

  describe("generateRandomCreatureBoard", async () => {
    const mapOfDecks = await griddeningService.createConstraintDeck();
    let copyDeck: Map<ConstraintType, GameConstraint[]> =
      cloneMapOfDecks(mapOfDecks);
    beforeEach(() => {
      copyDeck = cloneMapOfDecks(mapOfDecks);
    });

    for (let i = 0; i < 4; i++) {
      test(`Should return a puzzle with a type of CreatureFocused Puzzle for subtype ${i}`, async () => {
        const puzzle = griddeningService.generateRandomCreatureBoard(
          copyDeck,
          i
        );
        expect(puzzle.type).toBe(PuzzleType.CreatureFocused);
      });

      test(`Should return a puzzle.subType of ${i} for subtype ${i}`, async () => {
        const puzzle = griddeningService.generateRandomCreatureBoard(
          copyDeck,
          i
        );
        expect(puzzle.subType).toBe(i);
      });
    }

    test("Should return a top row with a Color, Power, and Creature Job constraint and a side row with a Creature Race, Toughness, and Color constraint for subtype 0", async () => {
      const puzzle = griddeningService.generateRandomCreatureBoard(copyDeck, 0);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Power)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureJobTypes
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.Toughness
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureRaceTypes
        ).length
      ).toBe(1);
    });

    test("Should return a top row with a Color, Power, and Creature Job constraint and a side row with a Creature Race, Creature Rules Text, and Color constraint for subtype 1", async () => {
      const puzzle = griddeningService.generateRandomCreatureBoard(copyDeck, 1);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Power)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureJobTypes
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureRulesText
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureRaceTypes
        ).length
      ).toBe(1);
    });

    test("Should return a top row with a Color, Power, and Creature Job constraint and a side row with a Creature Race, Toughness, and Color constraint for subtype 2", async () => {
      const puzzle = griddeningService.generateRandomCreatureBoard(copyDeck, 2);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureRulesText
        ).length
      ).toBe(1);
      expect(
        puzzle.topRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureJobTypes
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.Toughness
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureRaceTypes
        ).length
      ).toBe(1);
    });

    test("Should return a top row with a Color, Rarity, and Creature Job constraint and a side row with a Creature Race, ManaValue, and Color constraint for subtype 3", async () => {
      const puzzle = griddeningService.generateRandomCreatureBoard(copyDeck, 3);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureJobTypes
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.CreatureRaceTypes
        ).length
      ).toBe(1);
    });
  });

  describe("generateRandomArtistBoard", async () => {
    const mapOfDecks = await griddeningService.createConstraintDeck();
    let copyDeck: Map<ConstraintType, GameConstraint[]> =
      cloneMapOfDecks(mapOfDecks);
    beforeEach(() => {
      copyDeck = cloneMapOfDecks(mapOfDecks);
    });

    for (let i = 0; i < 9; i++) {
      test(`Should return a puzzle with a type of ArtistFocused Puzzle for subtype ${i}`, async () => {
        const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, i);
        expect(puzzle.type).toBe(PuzzleType.ArtistFocused);
      });

      test(`Should return a puzzle.subType of ${i} for subtype ${i}`, async () => {
        const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, i);
        expect(puzzle.subType).toBe(i);
      });
    }

    test("Should return a top row with 3 Artist constraints and a side row with a Card Type, Rarity, and Color constraint for subtype 0", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 0);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(3);

      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with 2 Artist constraints and 1 Color constraint, and a side row with a Card Type, Rarity, and Color constraint for subtype 1", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 1);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(2);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);

      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with an Artist constraint, a Mana Value constraint, and a Color constraint, and a side row with a Card Type, Rarity, and Color constraint for subtype 2", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 2);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);

      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with 3 Artist constraints and a side row with a Card Type, Rarity, and Mana Value constraint for subtype 3", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 3);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(3);

      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with 2 Artist constraints and 1 Color constraint, and a side row with a Card Type, Rarity, and Mana Value constraint for subtype 4", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 4);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(2);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);

      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with an Artist constraints, and 2 Color constraints and a side row with a Card Type, Rarity, and Mana Value constraint for subtype 5", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 5);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(2);

      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with 3 Artist constraints and a side row with a Mana Value, Rarity, and Color constraint for subtype 6", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 6);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(3);

      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with 2 Artist constraints, and a Card Type constraint, and a side row with a Mana Value, Rarity, and Color constraint for subtype 7", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 7);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(2);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(1);

      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });

    test("Should return a top row with an Artist constraint, and 2 Card Type constraints, and a side row with a Mana Value, Rarity, and Color constraint for subtype 8", async () => {
      const puzzle = griddeningService.generateRandomArtistBoard(copyDeck, 8);
      expect(puzzle.topRow.length).toBe(3);
      expect(puzzle.sideRow.length).toBe(3);

      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Artist)
          .length
      ).toBe(1);
      expect(
        puzzle.topRow.filter((c) => c.constraintType === ConstraintType.Type)
          .length
      ).toBe(2);

      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Color)
          .length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter(
          (c) => c.constraintType === ConstraintType.ManaValue
        ).length
      ).toBe(1);
      expect(
        puzzle.sideRow.filter((c) => c.constraintType === ConstraintType.Rarity)
          .length
      ).toBe(1);
    });
  });
});
