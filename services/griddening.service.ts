import { ConstraintType, GameConstraint } from "../types/GameConstraint";
import * as Scry from "scryfall-sdk";
import { IScryfallService } from "./scryfall.service";
import { PuzzleType, Puzzle } from "../types/Puzzle";
import {
  colorConstraints,
  manaValueConstraints,
  rarityConstraints,
  cardTypeConstraints,
  powerConstraints,
  toughnessConstraints,
  creatureRaceConstraints,
  creatureJobConstraints,
  enchantmentSubtypeTypeConstraints,
  artifactSubtypesConstraints,
  creatureRulesTextConstraints,
  artistConstraints,
} from "../constants/constraintTypes";
import { Game } from "@prisma/client";

export class GriddeningService {
  constructor(private scryfallService: IScryfallService) {}
  minimumHits = process.env.MINIMUM_HITS
    ? parseInt(process.env.MINIMUM_HITS)
    : 10;

  generateRandomPuzzleBoard(
    constraintDeckByConstraintType: Map<ConstraintType, GameConstraint[]>
  ) {
    const boardType = this.randomEnum(PuzzleType);
    let boardSubtype: number;
    switch (boardType) {
      case PuzzleType.CreatureFocused:
        boardSubtype = this.getRandomInt(5);
        return this.generateRandomCreatureBoard(
          constraintDeckByConstraintType,
          boardSubtype
        );
      case PuzzleType.FourColors:
        break;
      case PuzzleType.TwoColors:
        break;
      case PuzzleType.Colorless:
        break;
      case PuzzleType.ArtistFocused:
        break;
    }
  }

  generateRandomCreatureBoard(
    constraintDeckByConstraintType: Map<ConstraintType, GameConstraint[]>,
    creatureBoardType: number
  ): Puzzle {
    const [
      creatureRaceConstraints,
      creatureJobConstraints,
      creatureRulesTextConstraints,
      colorConstraints,
      powerConstraints,
      toughnessConstraints,
      rarityConstraints,
      manaValueConstraints,
    ] = this.getCreatureDecks(constraintDeckByConstraintType);
    const puzzle = {
      type: PuzzleType.CreatureFocused,
      subType: creatureBoardType,
      topRow: [],
      sideRow: [],
    } as Puzzle;

    puzzle.topRow.push(creatureJobConstraints.shift() as GameConstraint);
    puzzle.topRow.push(colorConstraints.shift() as GameConstraint);
    puzzle.sideRow.push(creatureRaceConstraints.shift() as GameConstraint);
    puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);

    switch (creatureBoardType) {
      case 0:
        puzzle.topRow.push(powerConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(toughnessConstraints.shift() as GameConstraint);
        break;
      case 1:
        puzzle.topRow.push(powerConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(
          creatureRulesTextConstraints.shift() as GameConstraint
        );
        break;
      case 2:
        puzzle.topRow.push(
          creatureRulesTextConstraints.shift() as GameConstraint
        );
        puzzle.sideRow.push(toughnessConstraints.shift() as GameConstraint);
        break;
      default:
        puzzle.topRow.push(rarityConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
    }

    return puzzle;
  }

  generateRandomArtistBoard(
    constraintDeckByConstraintType: Map<ConstraintType, GameConstraint[]>,
    colorBoardType: number
  ): Puzzle {
    const [
      colorConstraints,
      cardTypeConstraints,
      rarityConstraints,
      manaValueConstraints,
      artistConstraints,
    ] = this.getDefaultDecks(constraintDeckByConstraintType);

    const puzzle = {
      type: PuzzleType.ArtistFocused,
      subType: colorBoardType,
      topRow: [],
      sideRow: [],
    } as Puzzle;

    puzzle.topRow.push(artistConstraints.shift() as GameConstraint);

    switch (colorBoardType) {
      case 0:
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 1:
        puzzle.topRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 2:
        puzzle.topRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.topRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 3:
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 4:
        puzzle.topRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 5:
        puzzle.topRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.topRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 6:
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 7:
        puzzle.topRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.topRow.push(artistConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
      case 8:
        puzzle.topRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.topRow.push(cardTypeConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(colorConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(manaValueConstraints.shift() as GameConstraint);
        puzzle.sideRow.push(rarityConstraints.shift() as GameConstraint);
        break;
    }

    return puzzle;
  }

  private getDefaultDecks(
    constraintDeckByConstraintType: Map<ConstraintType, GameConstraint[]>
  ) {
    const colorConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Color
      ) as GameConstraint[]
    );
    const rarityConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Rarity
      ) as GameConstraint[]
    );
    const manaValueConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.ManaValue
      ) as GameConstraint[]
    );
    const cardTypeConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Type
      ) as GameConstraint[]
    );
    const artistConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Artist
      ) as GameConstraint[]
    );

    return [
      colorConstraints,
      cardTypeConstraints,
      rarityConstraints,
      manaValueConstraints,
      artistConstraints,
    ];
  }

  private getCreatureDecks(
    constraintDeckByConstraintType: Map<ConstraintType, GameConstraint[]>
  ) {
    const creatureRaceConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.CreatureRaceTypes
      ) as GameConstraint[]
    );
    const creatureJobConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.CreatureJobTypes
      ) as GameConstraint[]
    );
    const creatureRulesTextConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.CreatureRulesText
      ) as GameConstraint[]
    );
    const powerConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Power
      ) as GameConstraint[]
    );
    const toughnessConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Toughness
      ) as GameConstraint[]
    );
    const colorConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Color
      ) as GameConstraint[]
    );
    const rarityConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.Rarity
      ) as GameConstraint[]
    );
    const manaValueConstraints = this.shuffleArray(
      constraintDeckByConstraintType.get(
        ConstraintType.ManaValue
      ) as GameConstraint[]
    );

    return [
      creatureRaceConstraints,
      creatureJobConstraints,
      creatureRulesTextConstraints,
      colorConstraints,
      powerConstraints,
      toughnessConstraints,
      rarityConstraints,
      manaValueConstraints,
    ];
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
    if (!["core", "expansion"].includes(set.set_type)) return set;

    set.name = set.name
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

    return set;
  }

  buildSetConstraintFromScryfallSet(set: Scry.Set) {
    return new GameConstraint(set.name, ConstraintType.Set, `set:${set.code}`);
  }

  getTodaysDateString(dayOffset: number = 0): string {
    let now = new Date();
    now = this.addDays(now, dayOffset);
    return `${now.getFullYear()}${now
      .getMonth()
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
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

  async intersectionHasMinimumHits(
    gameConstraintOne: GameConstraint,
    gameConstraintTwo: GameConstraint
  ): Promise<boolean> {
    const query = `${gameConstraintOne.scryfallQuery} ${gameConstraintTwo.scryfallQuery}`;
    const cardCount = await this.scryfallService.getFirstPageCardCount(query);
    return cardCount >= this.minimumHits;
  }

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
      [ConstraintType.Artist, this.shuffleArray(artistConstraints)],
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

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  private addDays(dateToAddTo: Date, days: number): Date {
    const date = new Date(dateToAddTo.valueOf());
    date.setDate(date.getDate() + days);
    return date;
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

  private randomEnum(enumeration) {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
  }
}
