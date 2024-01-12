import { DataService } from "./data.service";
import { prismaMock } from "../__mocks__/client";
import { expect, test, describe } from "vitest";
import { Game } from "@prisma/client";
import { before } from "node:test";

const invalidDateStrings = [
  { invalidDateString: "" },
  { invalidDateString: "0123456" },
  { invalidDateString: "012345678" },
];

const validDateStringsWithExpectedDate:{dateString: string, expected: Date}[] = [
  { dateString: "19841131", expected: new Date("12/31/1984") },
  { dateString: "19840001", expected: new Date("01/01/1984") },
];

const games: Game[] = [
  {
    id: 1,
    dateString: "19690420",
    constraintsJSON: "",
  },
  {
    id: 2,
    dateString: "19840521",
    constraintsJSON: "",
  },
]

const dataService = new DataService(prismaMock);

describe("Data Service", () => {
  describe("getDateOfNewestGame", () => {

    test("() -> undefined", async () => {
      const latestDate = await dataService.getDateOfNewestGame();

      expect(latestDate).toBe(undefined);
    });

    test("() -> most recent date", async () => {
      prismaMock.game.findMany.mockResolvedValue(games);

      const gameDate: Date | undefined =
        await dataService.getDateOfNewestGame();

      expect(gameDate).not.toBe(undefined);
      expect(gameDate!.toDateString()).toBe(new Date('06/21/1984').toDateString())
    });

  });

  describe("dateStringToDate", () => {

    test.each(invalidDateStrings)("($invalidDateString) -> undefined", (testCase) => {
      expect(dataService.dateStringToDate(testCase.invalidDateString)).toBe(
        undefined
      );
    });

    test.each(validDateStringsWithExpectedDate)("($dateString) -> $expected", (testCase) => {
      const date = dataService.dateStringToDate(testCase.dateString);
      expect(date?.toDateString()).toBe(testCase.expected.toDateString());
    });

  });

});
