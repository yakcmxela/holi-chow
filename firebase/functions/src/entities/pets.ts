import { ProductsResponse, Toppers } from "./products";

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

export enum NeuterValues {
  TRUE = 1.6,
  FALSE = 1.8,
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
  [PetFields.TOPPER]: Toppers;
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

export interface SavedPet {
  pet: Pet;
  recommendation?: AlgorithmResponse;
  kibble?: Array<ProductsResponse>;
  topper?: Array<ProductsResponse>;
}

export interface SavedPets {
  pets: Array<SavedPet>;
}
