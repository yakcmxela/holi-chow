import { AnyAction } from 'redux';
import { StoreActions } from '../../entities/actions';
import { Pets, Pet } from '../../entities/pets';
import { RecommendationResponse } from '../../entities/api';

interface PetsReducer {
  canSavePersisted: boolean;
  loading: boolean;
  pendingPets: Pets;
  pets: Pets;
  savedRecommendations: Array<RecommendationResponse>;
}

export const initialState: PetsReducer = {
  canSavePersisted: false,
  loading: false,
  pendingPets: [],
  pets: [],
  savedRecommendations: [],
};

export const PetsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case StoreActions.FETCHED_PETS:
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
        canSavePersisted: true,
        pets: mergedPets,
        savedRecommendations: action.payload,
        loading: false,
      });
    case StoreActions.IS_LOADING_PETS:
      return Object.assign({}, state, {
        ...state,
        loading: action.payload,
      });
    case StoreActions.PERSIST_PETS:
      return Object.assign({}, state, {
        ...state,
        pendingPets: action.payload,
      });
    case StoreActions.RESET_PENDING_PETS:
      return Object.assign({}, state, {
        ...state,
        pendingPets: [],
      });
    case StoreActions.SAVE_PET:
      const existingPets = [...state.pendingPets].filter(
        (pet) => pet.id === action.payload.id
      );
      const withNewPet = [...state.pendingPets]
        .map((pet) => pet)
        .concat(action.payload);
      const pendingPets = existingPets.length
        ? [...state.pendingPets].map((pet) => {
            if (pet.id === action.payload.id) {
              return action.payload;
            }
            return pet;
          })
        : withNewPet;
      return Object.assign({}, state, {
        ...state,
        pendingPets,
      });
    case StoreActions.START_FROM_SAVED:
      return Object.assign({}, state, {
        ...state,
        pendingPets: [action.payload],
      });
    default:
      return state;
  }
};
