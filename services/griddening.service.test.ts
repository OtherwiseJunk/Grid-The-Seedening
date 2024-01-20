import { expect, test, describe } from "vitest";
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
});
