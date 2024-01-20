import { GameConstraint, ConstraintType } from "../types/GameConstraint";

const cardTypes = [
  // Card Types
  "Sorcery",
  "Instant",
  "Enchantment",
  "Artifact",
  "Planeswalker",
  "Land",
  "Legendary",
];

const artifactTypes = ["Equipment"];

const enchantmentTypes = ["Aura"];

const creatureRaceTypes = [
  "Goblin",
  "Elf",
  "Merfolk",
  "Zombie",
  "Human",
  "Beast",
  "Elemental",
  "Spirit",
  "Dragon",
  "Angel",
  "Hydra",
  "Demon",
  "Sphinx",
  "Treefolk",
  "Vampire",
  "Dinosaur",
  "Sliver",
  "Cat",
  "Phyrexian",
  "Eldrazi",
  "Horror",
  "Faerie",
  "Werewolf",
  "Wall",
  "Rat",
  "Insect",
  "Bear",
  "Spider",
  "God",
  "Bird",
];

const creatureJobTypes = [
  "Cleric",
  "Soldier",
  "Warrior",
  "Wizard",
  "Rogue",
  "Druid",
  "Ranger",
  "Knight",
  "Pirate",
  "Ninja",
  "Shaman",
];

export const cardTypeConstraints: GameConstraint[] = cardTypes.map(
  (cardType) =>
    new GameConstraint(cardType, ConstraintType.Type, `t:${cardType}`)
);

export const creatureRaceConstraints: GameConstraint[] = creatureRaceTypes.map(
  (cardType) =>
    new GameConstraint(
      cardType,
      ConstraintType.CreatureRaceTypes,
      `t:${cardType}`
    )
);

export const creatureJobConstraints: GameConstraint[] = creatureJobTypes.map(
  (cardType) =>
    new GameConstraint(
      cardType,
      ConstraintType.CreatureJobTypes,
      `t:${cardType}`
    )
);

export const artifactSubtypesConstraints: GameConstraint[] = artifactTypes.map(
  (cardType) =>
    new GameConstraint(
      cardType,
      ConstraintType.ArtifactSubtypes,
      `t:${cardType}`
    )
);

export const enchantmentSubtypeTypeConstraints: GameConstraint[] =
  enchantmentTypes.map(
    (cardType) =>
      new GameConstraint(
        cardType,
        ConstraintType.EnchantmentSubtypes,
        `t:${cardType}`
      )
  );

export const rarityConstraints: GameConstraint[] = [
  new GameConstraint("Mythic", ConstraintType.Rarity, "r:m"),
  new GameConstraint("Rare", ConstraintType.Rarity, "r:r"),
  new GameConstraint("Uncommon", ConstraintType.Rarity, "r:u"),
  new GameConstraint("Common", ConstraintType.Rarity, "r:c"),
];

export const creatureRulesText: GameConstraint[] = [
  new GameConstraint(
    "Rules Text: Enters the Battlefield Tapped",
    ConstraintType.CreatureRulesText,
    'o:"~ enters the battlefield tapped"'
  ),
  new GameConstraint(
    "Rules Text: Trample",
    ConstraintType.CreatureRulesText,
    "o:Trample"
  ),
  new GameConstraint(
    "Rules Text: Flying",
    ConstraintType.CreatureRulesText,
    "o:Flying"
  ),
  new GameConstraint(
    "Rules Text: Vigilance",
    ConstraintType.CreatureRulesText,
    "o:Vigilance"
  ),
  new GameConstraint(
    "Rules Text: Deathtouch",
    ConstraintType.CreatureRulesText,
    "o:Deathtouch"
  ),
  new GameConstraint(
    "Rules Text: Haste",
    ConstraintType.CreatureRulesText,
    "o:Haste"
  ),
  new GameConstraint(
    "Rules Text: Hexproof",
    ConstraintType.CreatureRulesText,
    "o:Hexproof"
  ),
  new GameConstraint(
    "Rules Text: Defender",
    ConstraintType.CreatureRulesText,
    "o:Defender"
  ),
  new GameConstraint(
    "Rules Text: Double Strike",
    ConstraintType.CreatureRulesText,
    'o:"Double Strike"'
  ),
  new GameConstraint(
    "Rules Text: First Strike",
    ConstraintType.CreatureRulesText,
    'o:"First Strike"'
  ),
  new GameConstraint(
    "Rules Text: Flash",
    ConstraintType.CreatureRulesText,
    "o:Flash"
  ),
  new GameConstraint(
    "Rules Text: Indestructible",
    ConstraintType.CreatureRulesText,
    "o:Indestructible"
  ),
  new GameConstraint(
    "Rules Text: Lifelink",
    ConstraintType.CreatureRulesText,
    "o:Lifelink"
  ),
  new GameConstraint(
    "Rules Text: Menace",
    ConstraintType.CreatureRulesText,
    "o:Menace"
  ),
  new GameConstraint(
    "Rules Text: Reach",
    ConstraintType.CreatureRulesText,
    "o:Reach"
  ),
  new GameConstraint(
    "Rules Text: Ward",
    ConstraintType.CreatureRulesText,
    "o:Ward"
  ),
  new GameConstraint(
    "Rules Text: Can't Block",
    ConstraintType.CreatureRulesText,
    'o:"~ can\'t block"'
  ),
  new GameConstraint(
    "Rules Text: Attacks Each Combat",
    ConstraintType.CreatureRulesText,
    'o:"~ attacks each combat if able"'
  ),
];

export const artistConstraints: GameConstraint[] = [
  new GameConstraint("Artist: Rebecca Guay", ConstraintType.Artist, `a:Guay`),
  new GameConstraint("Artist: John Avon", ConstraintType.Artist, `a:Avon`),
  new GameConstraint(
    "Artist: Magali Villeneuve",
    ConstraintType.Artist,
    "a:Villeneuve"
  ),
  new GameConstraint(
    "Artist: Alayna Danner",
    ConstraintType.Artist,
    "a:Danner"
  ),
  new GameConstraint("Artist: Kev Walker", ConstraintType.Artist, "a:Walker"),
  new GameConstraint("Artist: Sam Burley", ConstraintType.Artist, "a:Burley"),
  new GameConstraint("Artist: Mark Poole", ConstraintType.Artist, "a:Poole"),
  new GameConstraint("Artist: Chris Rahn", ConstraintType.Artist, "a:Rahn"),
  new GameConstraint("Artist: Nils Hamm", ConstraintType.Artist, "a:Hamm"),
  new GameConstraint("Artist: Johannes Voss", ConstraintType.Artist, "a:Voss"),
  new GameConstraint("Artist: Thomas Baxa", ConstraintType.Artist, "a:Baxa"),
  new GameConstraint(
    "Artist: Wayne Reynolds",
    ConstraintType.Artist,
    "a:Reynolds"
  ),
  new GameConstraint("Artist: Randy Vargas", ConstraintType.Artist, "a:Vargas"),
  new GameConstraint("Artist: Livia Prima", ConstraintType.Artist, "a:Prima"),
  new GameConstraint("Artist: Volkan Baga", ConstraintType.Artist, "a:Baga"),
];

export const colorConstraints: GameConstraint[] = [
  new GameConstraint(
    "Black",
    ConstraintType.Color,
    "c:B",
    "/swamp.png",
    "A black mana symbol; a poorly drawn skull sillouhete on a dark gray field."
  ),
  /* Colorless is kind of a paint right now because you can't have a Colorless-Green (etc) creature
     Probably when I go to fix this when we "Draw" a colorless constraint we'll have the other constraint be Land or Artifact?
     But that will take some finessing and I want to find a cleverer way of generating these.

    new GameConstraint(
        "Colorless",
        ConstraintType.Color,
        "colorless.png",
        "A black mana symbol; a poorly drawn skull sillouhete on a dark gray field."
    ), */
  new GameConstraint(
    "Red",
    ConstraintType.Color,
    "c:R",
    "/mountain.png",
    "A red mana symbol; a poorly drawn fireball sillouhete on a red field."
  ),
  new GameConstraint(
    "Green",
    ConstraintType.Color,
    "c:G",
    "/forest.png",
    "A green mana symbol; a poorly drawn tree sillouhete on a green field."
  ),
  new GameConstraint(
    "Blue",
    ConstraintType.Color,
    "c:U",
    "/island.png",
    "A blue mana symbol; a poorly drawn water droplet sillouhete on a blue field."
  ),
  new GameConstraint(
    "White",
    ConstraintType.Color,
    "c:W",
    "/plains.png",
    "A white mana symbol; a poorly drawn sun sillouhete on a pale yellow field."
  ),
];

export const manaValueConstraints: GameConstraint[] = Array.from(
  { length: 9 },
  (_, index) =>
    new GameConstraint(
      `Mana Value ${index}`,
      ConstraintType.ManaValue,
      `cmc:${index}`
    )
);

export const toughnessConstraints: GameConstraint[] = Array.from(
  { length: 10 },
  (_, index) =>
    new GameConstraint(
      `Toughness ${index + 1}`,
      ConstraintType.ManaValue,
      `tou:${index + 1}`
    )
);

export const powerConstraints: GameConstraint[] = Array.from(
  { length: 11 },
  (_, index) =>
    new GameConstraint(
      `Power ${index}`,
      ConstraintType.ManaValue,
      `pow:${index}`
    )
);
