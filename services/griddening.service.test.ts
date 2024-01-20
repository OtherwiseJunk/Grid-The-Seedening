import { expect, test, describe, vi } from "vitest";
import { GriddeningService } from "./griddening.service";
import { ConstraintType, GameConstraint } from "../types/GameConstraint";
import * as Scry from "scryfall-sdk";
import { ScryfallHelper } from "../testUtilities/scryfall.helper";
import { IScryfallService, ScryfallService } from "./scryfall.service";
import { ScryfallMockedService } from "../__mocks__/scryfall.service";

const vintageSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "1993-01-01",
  "Vintage",
  "V"
);
const modernSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2003-01-01",
  "Modern",
  "M"
);
const pioneerSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2013-01-01",
  "Pioneer",
  "P"
);
const standardSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2021-01-01",
  "Standard",
  "S"
);
const noReleaseAtSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  undefined,
  "No Release",
  "NR"
);
const firstPioneerSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2012-10-05",
  "Ravnica I think",
  "RTR"
);
const dayAfterFirstPioneerSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2012-10-04",
  "not a set",
  "nas"
);
const dayBeforeFirstPioneerSet: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2012-10-06",
  "not a set",
  "nas"
);
const dayBefore2013Set: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2012-12-31",
  "not a set",
  "nas"
);
const firstDayOf2013Set: Scry.Set = ScryfallHelper.generateScryfallSet(
  "2013-01-01",
  "not a set",
  "nas"
);
const setTypesToFilter = [
  "masters",
  "alchemy",
  "masterpiece",
  "arsenal",
  "from_the_vault",
  "spellbook",
  "premium_deck",
  "duel_deck",
  "draft_innovation",
  "treasure_chest",
  "commander",
  "planeschase",
  "archenemy",
  "vanguard",
  "funny",
  "starter",
  "box",
  "promo",
  "token",
  "memorabilia",
  "minigame",
];

const setsWithExpectedIsPioneerReturns = [
  [vintageSet, false],
  [modernSet, false],
  [noReleaseAtSet, false],
  [dayAfterFirstPioneerSet, false],
  [dayBeforeFirstPioneerSet, false],
  [dayBefore2013Set, false],
  [firstDayOf2013Set, true],
  [firstPioneerSet, true],
  [pioneerSet, true],
  [standardSet, true],
];

const setsWithExpectedConstraintReturns = [
  [
    vintageSet,
    new GameConstraint(
      vintageSet.name,
      ConstraintType.Set,
      `set:${vintageSet.code}`
    ),
  ],
  [
    modernSet,
    new GameConstraint(
      modernSet.name,
      ConstraintType.Set,
      `set:${modernSet.code}`
    ),
  ],
  [
    noReleaseAtSet,
    new GameConstraint(
      noReleaseAtSet.name,
      ConstraintType.Set,
      `set:${noReleaseAtSet.code}`
    ),
  ],
  [
    dayAfterFirstPioneerSet,
    new GameConstraint(
      dayAfterFirstPioneerSet.name,
      ConstraintType.Set,
      `set:${dayAfterFirstPioneerSet.code}`
    ),
  ],
  [
    dayBeforeFirstPioneerSet,
    new GameConstraint(
      dayBeforeFirstPioneerSet.name,
      ConstraintType.Set,
      `set:${dayBeforeFirstPioneerSet.code}`
    ),
  ],
  [
    dayBefore2013Set,
    new GameConstraint(
      dayBefore2013Set.name,
      ConstraintType.Set,
      `set:${dayBefore2013Set.code}`
    ),
  ],
  [
    firstDayOf2013Set,
    new GameConstraint(
      firstDayOf2013Set.name,
      ConstraintType.Set,
      `set:${firstDayOf2013Set.code}`
    ),
  ],
  [
    firstPioneerSet,
    new GameConstraint(
      firstPioneerSet.name,
      ConstraintType.Set,
      `set:${firstPioneerSet.code}`
    ),
  ],
  [
    pioneerSet,
    new GameConstraint(
      pioneerSet.name,
      ConstraintType.Set,
      `set:${pioneerSet.code}`
    ),
  ],
  [
    standardSet,
    new GameConstraint(
      standardSet.name,
      ConstraintType.Set,
      `set:${standardSet.code}`
    ),
  ],
];

const setInputs = [
  vintageSet,
  modernSet,
  noReleaseAtSet,
  dayAfterFirstPioneerSet,
  dayBeforeFirstPioneerSet,
  dayBefore2013Set,
  firstDayOf2013Set,
  firstPioneerSet,
  pioneerSet,
  standardSet,
];

const expectedSetOutputs = [
  new GameConstraint(
    standardSet.name,
    ConstraintType.Set,
    `set:${standardSet.code}`
  ),
  new GameConstraint(
    pioneerSet.name,
    ConstraintType.Set,
    `set:${pioneerSet.code}`
  ),
  new GameConstraint(
    firstPioneerSet.name,
    ConstraintType.Set,
    `set:${firstPioneerSet.code}`
  ),
  new GameConstraint(
    firstDayOf2013Set.name,
    ConstraintType.Set,
    `set:${firstDayOf2013Set.code}`
  ),

]

const namesToSanitizeWithExpectedResult = [
  ["Foreign Black Border", ""],
  ["Limited Edition Alpha", "Alpha"],
  ["Limited Edition Beta", "Beta"],
  ["Unlimited Edition", "Unlimited"],
  ["Revised Edition", "Revised"],
  ["Fourth Edition", "4th Edition"],
  ["Fifth Edition", "5th Edition"],
  ["Classic Sixth Edition", "6th Edition"],
  ["Seventh Edition", "7th Edition"],
  ["Eighth Edition", "8th Edition"],
  ["Ninth Edition", "9th Edition"],
  ["Tenth Edition", "10th Edition"],
  [" Set With Whitespace ", "Set With Whitespace"],
  ["OtherwiseUneditedEdition", "OtherwiseUneditedEdition"],
];
let scryfallServiceMock = new ScryfallMockedService();
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
        expect(
          griddeningService.sanitizeSet(
            filteredScryfallSet
          ).name
        ).toBe(filteredScryfallSet.name);
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
        const outputSet = griddeningService.sanitizeSet(
          scryfallSet
        );

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
    test('should return qualifying pioneer set constraints', async () => {
      scryfallServiceMock.setAllSets(setInputs);

      const setConstraints = await griddeningService.getSetConstraints();

      expect(setConstraints.length).toBe(expectedSetOutputs.length);
    });
  });

  describe("intersectionHasMinimumHits", () => {
    const fakeConstraint = new GameConstraint('', ConstraintType.Set, '');

    test('returns true when intersection has 10 or more hits when no MINIMUM_HITS environment varaible is set', async () => {
      scryfallServiceMock.setHitCount(10);
      expect(await griddeningService.intersectionHasMinimumHits(fakeConstraint, fakeConstraint)).toBeTruthy();
    });
    test('returns false when intersection has less than 10 hits when no MINIMUM_HITS environment varaible is set', async () => {
      scryfallServiceMock.setHitCount(9);
      expect(await griddeningService.intersectionHasMinimumHits(fakeConstraint, fakeConstraint)).toBeFalsy();
    });
    test('returns true when intersection has process.env.MINIMUM_HITS or more hits', async () => {
      scryfallServiceMock.setHitCount(7);
      process.env.MINIMUM_HITS = '7';
      const service = new GriddeningService(scryfallServiceMock);
      expect(await service.intersectionHasMinimumHits(fakeConstraint, fakeConstraint)).toBeTruthy();
    });
    test('returns false when intersection has less than process.env.MINIMUM_HITS hits', async () => {
      scryfallServiceMock.setHitCount(6);
      process.env.MINIMUM_HITS = '7';
      const service = new GriddeningService(scryfallServiceMock);
      expect(await service.intersectionHasMinimumHits(fakeConstraint, fakeConstraint)).toBeFalsy();
    });
  });
});
