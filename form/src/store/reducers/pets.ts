import { AnyAction } from "redux";
import { StoreActions } from "../../entities/actions";
import { Pets, Pet } from "../../entities/pets";
import { RecommendationResponse } from "../../entities/api";

interface PetsReducer {
  loading: boolean;
  pendingPets: Pets;
  persistedActiveSection: number;
  persistedPet: Pet | null;
  pets: Pets;
  savedRecommendations: Array<RecommendationResponse>;
}

export const initialState: PetsReducer = {
  loading: false,
  pendingPets: [],
  persistedActiveSection: 0,
  persistedPet: null,
  pets: [],
  savedRecommendations: [],
};

export const PetsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case StoreActions.FetchedPets:
      const savedPets = action.payload.map(
        (pet: RecommendationResponse) => pet.pet
      );
      const mergedPets: Pets = [...state.pets];
      savedPets.forEach((pet: Pet) => {
        let petExists: number | false = false;
        mergedPets.forEach((p, i) => {
          if (p.id === pet.id) {
            petExists = i;
          }
        });
        if (petExists !== false) {
          mergedPets[petExists] = pet;
        } else {
          mergedPets.push(pet);
        }
      });
      return Object.assign({}, state, {
        ...state,
        pets: mergedPets,
        savedRecommendations: action.payload,
        loading: false,
      });
    case StoreActions.IsLoadingPets:
      return Object.assign({}, state, {
        ...state,
        loading: action.payload,
      });
    case StoreActions.ResetPendingPets:
      return Object.assign({}, state, {
        ...state,
        pendingPets: [],
        persistedActiveSection: initialState.persistedPet,
        persistedPet: initialState.persistedPet,
      });
    case StoreActions.SavePet:
      const existingPets = [...state.pendingPets].filter(
        (pet) => pet.id === action.payload.pet.id
      );
      const withNewPet = [...state.pendingPets]
        .map((pet) => pet)
        .concat(action.payload.pet);
      const pendingPets = existingPets.length
        ? [...state.pendingPets].map((pet) => {
            if (pet.id === action.payload.pet.id) {
              return action.payload.pet;
            }
            return pet;
          })
        : withNewPet;
      const persistedPet = { ...action.payload.pet };
      const persistedActiveSection = action.payload.activeSection;
      return Object.assign({}, state, {
        ...state,
        pendingPets,
        persistedActiveSection,
        persistedPet,
      });
    case StoreActions.StartFromSaved:
      return Object.assign({}, state, {
        ...state,
        pendingPets: [action.payload],
        persistedActiveSection: initialState.persistedActiveSection,
        persistedPet: action.payload,
      });
    case StoreActions.StartNewPet:
      return Object.assign({}, state, {
        ...state,
        persistedActiveSection: initialState.persistedActiveSection,
        persistedPet: initialState.persistedPet,
      });
    default:
      return state;
  }
};
