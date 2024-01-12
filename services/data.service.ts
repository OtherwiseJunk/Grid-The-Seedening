import { Game, PrismaClient } from "@prisma/client";
import { GameConstraint } from "../types/GameConstraint";

export class DataService {
  constructor(private prisma: PrismaClient) {}

  async getDateOfNewestGame(): Promise<Date|undefined> {
    const games = await this.prisma.game.findMany();

    if (games === undefined) return games;

    const latestGame = games.sort(
      (gameA, gameB) => parseInt(gameB.dateString) - parseInt(gameA.dateString)
    )[0];

    return this.dateStringToDate(latestGame.dateString);
  }

  async createNewGame(dateString: string, validGameConstraints: GameConstraint[]): Promise<Game | undefined> {
    return await this.prisma.game.create({
      data: {
        dateString,
        constraintsJSON: JSON.stringify(validGameConstraints)
      }
    });
  }

  dateStringToDate(dateString: string): Date|undefined {
    if(dateString == null || dateString.length != 8) return undefined;

    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6));
    const day = parseInt(dateString.substring(6));
    console.log(`year: ${year}, month: ${month}, day: ${day}`)
    return new Date(`${month + 1}/${day}/${year}`);
  }
}
