export enum ActivityDescription {
  JOGGER = "Jogger",
  OLYMPIAN = "Olympian",
  POTATO = "Couch Potato",
  RUNNER = "Runner",
  WALKER = "Walker",
}

export enum ActivityValue {
  JOGGER = 1.4,
  OLYMPIAN = 1.8,
  POTATO = 1,
  RUNNER = 1.6,
  WALKER = 1.3,
}

export enum Blend {
  ADULT = "Adult",
  PUPPY = "Puppy",
  PUPPY_WEIGHT = "Puppy + Weight",
  TOPPER = "Topper",
  WEIGHT_MANAGEMENT = "Weight Management",
  WEIGHT_ONLY = "Weight Only",
}

export enum BodyDescription {
  IDEAL = "Ideal",
  OVERWEIGHT = "Overweight",
  SLIGHTLY_OVER = "Slightly Over",
  SLIGHTLY_UNDER = "Slightly Under",
  UNDER = "Very Under",
}

export enum BodyValue {
  IDEAL = 1.4,
  OVERWEIGHT = 1,
  SLIGHTLY_OVER = 1.2,
  SLIGHTLY_UNDER = 1.6,
  UNDER = 1.8,
}

export interface Breed {
  type: string;
  size: BreedSize;
}

export enum BreedCount {
  SINGLE = "Single Breed",
  MIXED = "Mixed Breed",
  MUTT = "Supermutt",
}

export enum BreedSize {
  L = "large",
  M = "medium",
  SM = "small",
  XL = "x-large",
  XS = "x-small",
}

export enum KibbleHandle {
  DEFAULT = "kibble",
  PUPPY = "kibble-puppy",
  ADULT = "kibble-adult",
  WEIGHT = "kibble-weight-management",
}

export type Pet = {
  [PetFields.ACTIVITY]: ActivityValue;
  [PetFields.ALLERGIES]: Array<string>;
  [PetFields.BIRTHDATE]: number;
  [PetFields.BODY]: BodyValue;
  [PetFields.BREEDS]: Array<Breed>;
  [PetFields.NEUTERED]: boolean;
  [PetFields.ISSUES]: Array<string>;
  [PetFields.ID]: string;
  [PetFields.NAME]: string;
  [PetFields.PICKY]: number;
  [PetFields.SCRAPS]: number;
  [PetFields.SEX]: Sex;
  [PetFields.STOOL]: Stool;
  [PetFields.TOPPER]: string;
  [PetFields.TREATS]: number;
  [PetFields.WEIGHT]: number;
};

export enum PetFields {
  ACTIVITY = "activity",
  ALLERGIES = "allergies",
  BIRTHDATE = "birthdate",
  BODY = "body",
  BREEDS = "breeds",
  NEUTERED = "neutered",
  ISSUES = "issues",
  ID = "id",
  NAME = "name",
  PICKY = "picky",
  SCRAPS = "scraps",
  SEX = "sex",
  STOOL = "stool",
  TOPPER = "topper",
  TREATS = "treats",
  WEIGHT = "weight",
}

export type Pets = Array<Pet>;

export enum Stool {
  GOOD = "good",
  BAD = "bad",
}

export enum Sex {
  MALE = "boy",
  FEMALE = "girl",
}

export type AlgorithmResponse = {
  blend: Blend;
  dailyCalories: number;
  dailyVolumeCups: number;
  dailyVolumeTbsp: number;
  dailyWeightKibble: number;
  dailyWeightProtein: number;
  derAvg: number;
  derFactor: number;
  derMax: number;
  derMin: number;
  derTotal: number;
  estimatedRenewal: number;
  fortyFiveWeightKibble: number;
  fortyFiveWeightProtein: number;
  kibbleHandle: string;
  lifestage: number;
  rer: number;
  shipmentKibbleLbs: Array<Shipment>;
  shipmentProteinOz: number;
};

export interface Shipment {
  weight: number;
  quantity: number;
}

export enum Toppers {
  BEEF_LIVER = "beef-liver-protein-pack",
  LAMB_LIVER = "lamb-liver-protein-pack",
  TURKEY = "turkey-breast-protein-pack",
  SALMON = "wild-caught-salmon-protein-pack",
  RABBIT = "rabbit-protein-pack",
  CHICKEN = "chicken-breast-protein-pack",
  VARIETY_CLASSIC = "variety-pack-classic",
  VARIETY_LAND = "variety-pack-land-lovers",
  VARIETY_SURF_TURF = "variety-pack-surf-turf-and-sky",
  VARIETY_FISH_FOWL = "variety-pack-fish-fowl",
}
