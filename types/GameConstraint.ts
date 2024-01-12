export class GameConstraint {
    constructor (
      public displayName: string,
      public constraintType: ConstraintType,
      public scryfallQuery: string,
      public imageSrc: string = '',
      public imageAltText: string = ''
    ) {}
  }
  
  export enum ConstraintType {
    Rarity,
    Type,
    ManaValue,
    Color,
    Set,
  }
  