import { PetFields, Pet } from './pets';

export enum FormSections {
  activity = 2,
  habits = 3,
  onboarding = 0,
  profile = 1,
  results = 5,
  toppers = 4,
}

export interface ChangePetArguments {
  value: any;
  field: PetFields;
  index?: number;
}

export interface FormSectionProps {
  onChangePet: (changePetField: ChangePetArguments) => void;
  onNavigateForm: (index: FormSections) => void;
  onSavePet?: () => void;
  onSavePendingPet?: () => void;
  pet: Pet;
  plural?: boolean;
}
