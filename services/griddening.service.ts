import {
  colorConstraints,
  creatureRulesText as creatureRulesTextConstraints,
  manaValueConstraints,
  powerConstraints,
  rarityConstraints,
  toughnessConstraints,
  cardTypeConstraints,
  creatureRaceConstraints,
  creatureJobConstraints,
  enchantmentSubtypeTypeConstraints,
  artifactSubtypesConstraints,
} from "../constants/constraintTypes";
import { ConstraintType, GameConstraint } from "../types/GameConstraint";
import * as Scry from "scryfall-sdk";
import { IScryfallService } from "./scryfall.service";

export class GriddeningService {
  constructor(private scryfallService: IScryfallService) {}
  minimumHits = process.env.MINIMUM_HITS
    ? parseInt(process.env.MINIMUM_HITS)
    : 10;

  async createConstraintDeck(): Promise<Map<ConstraintType, GameConstraint[]>> {
    const setConstraints = this.shuffleArray(await this.getSetConstraints());

    return new Map<ConstraintType, GameConstraint[]>([
      [ConstraintType.Set, setConstraints],
      [ConstraintType.Color, this.shuffleArray(colorConstraints)],
      [ConstraintType.ManaValue, this.shuffleArray(manaValueConstraints)],
      [ConstraintType.Rarity, this.shuffleArray(rarityConstraints)],
      [ConstraintType.Type, this.shuffleArray(cardTypeConstraints)],
      [ConstraintType.Power, this.shuffleArray(powerConstraints)],
      [ConstraintType.Toughness, this.shuffleArray(toughnessConstraints)],
      [ConstraintType.Artist, this.shuffleArray(toughnessConstraints)],
      [
        ConstraintType.CreatureRulesText,
        this.shuffleArray(creatureRulesTextConstraints),
      ],
      [
        ConstraintType.CreatureRaceTypes,
        this.shuffleArray(creatureRaceConstraints),
      ],
      [
        ConstraintType.CreatureJobTypes,
        this.shuffleArray(creatureJobConstraints),
      ],
      [
        ConstraintType.EnchantmentSubtypes,
        this.shuffleArray(enchantmentSubtypeTypeConstraints),
      ],
      [
        ConstraintType.ArtifactSubtypes,
        this.shuffleArray(artifactSubtypesConstraints),
      ],
    ]);
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  isPioneerSet(set: Scry.Set) {
    if (set.released_at == undefined) return false;

    const releaseYear = parseInt(set.released_at.split("-")[0]);
    if (releaseYear > 2012) {
      return true;
    } else if (set.released_at === "2012-10-05") {
      return true;
    }

    return false;
  }

  sanitizeSet(set: Scry.Set): Scry.Set {
    const sanitizeSetName = (setName: string): string => {
      return setName
        .replace("Foreign Black Border", "")
        .replace("Limited Edition Alpha", "Alpha")
        .replace("Limited Edition Beta", "Beta")
        .replace("Unlimited Edition", "Unlimited")
        .replace("Revised Edition", "Revised")
        .replace("Fourth Edition", "4th Edition")
        .replace("Fifth Edition", "5th Edition")
        .replace("Classic Sixth Edition", "6th Edition")
        .replace("Seventh Edition", "7th Edition")
        .replace("Eighth Edition", "8th Edition")
        .replace("Ninth Edition", "9th Edition")
        .replace("Tenth Edition", "10th Edition")
        .trim();
    };
    if (!["core", "expansion"].includes(set.set_type)) return set;

    set.name = sanitizeSetName(set.name);

    return set;
  }

  buildSetConstraintFromScryfallSet(set: Scry.Set) {
    return new GameConstraint(set.name, ConstraintType.Set, `set:${set.code}`);
  }

  async getSetConstraints(): Promise<GameConstraint[]> {
    let sets = await this.scryfallService.getAllSets();

    if (sets == undefined) return [];
    sets = sets.filter((set) => set != undefined);

    return sets
      .map((set) => this.sanitizeSet(set))
      .filter(this.isPioneerSet)
      .map(this.buildSetConstraintFromScryfallSet);
  }

  async selectValidConstraints(
    constraintMap: Map<ConstraintType, GameConstraint[]>
  ): Promise<GameConstraint[]> {
    console.log(constraintMap);
    return [];
  }

  getTodaysDateString(dayOffset: number = 0): string {
    let now = new Date();
    now = this.addDays(now, dayOffset);
    return `${now.getFullYear()}${now
      .getMonth()
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
  }

  async intersectionHasMinimumHits(
    gameConstraintOne: GameConstraint,
    gameConstraintTwo: GameConstraint
  ): Promise<boolean> {
    const query = `${gameConstraintOne.scryfallQuery} ${gameConstraintTwo.scryfallQuery}`;
    const cardCount = await this.scryfallService.getFirstPageCardCount(query);
    return cardCount >= this.minimumHits;
  }

  private addDays(dateToAddTo: Date, days: number): Date {
    const date = new Date(dateToAddTo.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
}
