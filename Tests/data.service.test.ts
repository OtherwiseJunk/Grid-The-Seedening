import { DataService } from "../services/data.service.js";
import { prismaMock } from "../__mocks__/databaseClient.js";
import { expect, test, describe } from "vitest";
import { Game } from "@prisma/client";

const invalidDateStrings = [
  { invalidDateString: "" },
  { invalidDateString: "0123456" },
  { invalidDateString: "012345678" },
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
];

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
      expect(gameDate!.toDateString()).toBe(
        new Date("06/21/1984").toDateString(),
      );
    });
  });

  describe("dateStringToDate", () => {
    test.each(invalidDateStrings)(
      "($invalidDateString) -> undefined",
      (testCase) => {
        expect(dataService.dateStringToDate(testCase.invalidDateString)).toBe(
          undefined,
        );
      },
    );

    test("should return expected datetime for valid string", () => {
      const dateOne = dataService.dateStringToDate("19841131");
      expect(dateOne!.toDateString()).toBe(
        new Date("12/31/1984").toDateString(),
      );
      const dateTwo = dataService.dateStringToDate("19840001");
      expect(dateTwo!.toDateString()).toBe(
        new Date("01/01/1984").toDateString(),
      );
    });
  });
});
