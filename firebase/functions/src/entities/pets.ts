import { Toppers, ProductsResponse } from "./products";

export enum ActivityDescription {
  jogger = "Jogger",
  olympian = "Olympian",
  potato = "Couch Potato",
  runner = "Runner",
  walker = "Walker",
}

export enum ActivityValue {
  jogger = 1.4,
  olympian = 1.8,
  potato = 1,
  runner = 1.6,
  walker = 1.3,
}

export enum Blend {
  adult = "Adult",
  puppy = "Puppy",
  topper = "Topper",
  weightManagement = "Weight Management",
}

export enum BodyDescription {
  ideal = "Ideal",
  overweight = "Overweight",
  slightlyOver = "Slightly Over",
  slightlyUnder = "Slightly Under",
  under = "Very Under",
}

export enum BodyValue {
  ideal = 1.4,
  overweight = 1,
  slightlyOver = 1.2,
  slightlyUnder = 1.6,
  under = 1.8,
}

export interface Breed {
  type: string;
  size: BreedSize;
}

export enum BreedCount {
  single = "Single Breed",
  mixed = "Mixed Breed",
  mutt = "Supermutt",
}

export enum BreedSize {
  L = "large",
  M = "medium",
  SM = "small",
  XL = "x-large",
  XS = "x-small",
}

export enum NeuterValues {
  true = 1.6,
  false = 1.8,
}

export type Pet = {
  [PetFields.activity]: ActivityValue;
  [PetFields.allergies]: Array<string>;
  [PetFields.birthdate]: number;
  [PetFields.body]: BodyValue;
  [PetFields.breeds]: Array<Breed>;
  [PetFields.neutered]: number;
  [PetFields.issues]: Array<string>;
  [PetFields.id]: string;
  [PetFields.name]: string;
  [PetFields.picky]: number;
  [PetFields.scraps]: number;
  [PetFields.sex]: Sex;
  [PetFields.stool]: Stool;
  [PetFields.topper]: Toppers;
  [PetFields.treats]: number;
  [PetFields.weight]: number;
};

export enum PetFields {
  activity = "activity",
  allergies = "allergies",
  birthdate = "birthdate",
  body = "body",
  breeds = "breeds",
  neutered = "neutered",
  issues = "issues",
  id = "id",
  name = "name",
  picky = "picky",
  scraps = "scraps",
  sex = "sex",
  stool = "stool",
  topper = "topper",
  treats = "treats",
  weight = "weight",
}

export type Pets = Array<Pet>;

export enum Stool {
  good = "good",
  bad = "bad",
}

export enum Sex {
  male = "boy",
  female = "girl",
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
