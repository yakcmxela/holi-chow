import { HoliThunk } from '../../entities/thunks';
import { Pet, AlgorithmResponse } from '../../entities/pets';
import { RecommendationResponse } from '../../entities/api';
import { StoreActions } from '../../entities/actions';
import firebase from 'firebase';

export const loadCustomerPets = (customerId: string): HoliThunk => async (
  dispatch
) => {
  firebase
    .functions()
    .httpsCallable('CALL-fetchPets')({
      customerId,
    })
    .then(({ data }) => {
      const { meta } = data;
      dispatch({
        type: StoreActions.FETCHED_PETS,
        payload: meta || [],
      });
      dispatch({
        type: StoreActions.IS_LOADING_PETS,
        payload: false,
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: StoreActions.IS_LOADING_PETS,
        payload: false,
      });
    });
};

export const savePetsToCustomer = (
  customerId: string,
  recommendations: Array<RecommendationResponse> | null
): HoliThunk => (dispatch, getStore) => {
  dispatch({
    type: StoreActions.IS_LOADING_PETS,
    payload: true,
  });
  interface RecommendationsForSave {
    pet: Pet;
    recommendation?: AlgorithmResponse;
    kibble?: {
      product: {
        title: string;
      };
    };
    topper?: {
      product: {
        title: string;
      };
    };
  }

  let savedRecommendations: Array<RecommendationsForSave> = getStore().PetsReducer.savedRecommendations.map(
    (rec: RecommendationResponse) => {
      return {
        ...(rec.pet && { pet: rec.pet }),
        ...(rec.recommendation && { recommendation: rec.recommendation }),
        ...(rec.kibble &&
          rec.kibble.product &&
          rec.kibble.product.title && {
            kibble: { product: { title: rec.kibble.product.title } },
          }),
        ...(rec.topper &&
          rec.topper.product &&
          rec.topper.product.title && {
            topper: { product: { title: rec.topper.product.title } },
          }),
      };
    }
  );

  if (recommendations) {
    let isDuplicate: false | number = false;
    recommendations.forEach((rec) => {
      savedRecommendations.forEach((r, i) => {
        if (r.pet.id === rec.pet.id) {
          isDuplicate = i;
        }
      });
      if (isDuplicate !== false) {
        savedRecommendations[isDuplicate] = {
          pet: rec.pet,
          recommendation: rec.recommendation,
          kibble: { product: { title: rec.kibble.product.title } },
          topper: { product: { title: rec.topper.product.title } },
        };
      } else {
        savedRecommendations.push({
          pet: rec.pet,
          recommendation: rec.recommendation,
          kibble: { product: { title: rec.kibble.product.title } },
          topper: { product: { title: rec.topper.product.title } },
        });
      }
    });
  } else {
    getStore().PetsReducer.pendingPets.forEach((pet: Pet) => {
      let isSaved = false;
      savedRecommendations.forEach((rec, i) => {
        if (rec.pet.id === pet.id) {
          savedRecommendations[i] = { pet };
          isSaved = true;
        }
      });
      if (!isSaved) {
        savedRecommendations.push({ pet });
      }
    });
  }

  firebase
    .functions()
    .httpsCallable('CALL-savePet')({
      customerId:
        process.env.NODE_ENV === 'development'
          ? process.env.REACT_APP_CUSTOMER_ID
          : customerId,
      pets: savedRecommendations,
    })
    .then(() => {
      dispatch({
        type: StoreActions.IS_LOADING_PETS,
        payload: false,
      });
      dispatch({
        type: StoreActions.FETCHED_PETS,
        payload: savedRecommendations,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
