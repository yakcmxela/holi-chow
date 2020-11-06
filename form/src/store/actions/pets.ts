import { HoliThunk } from "../../entities/thunks";
import { Pet, AlgorithmResponse } from "../../entities/pets";
import { StoreActions } from "../../entities/actions";
import firebase from "firebase";
import { RecommendationResponse } from "../../entities/api";

export const loadCustomerPets = (customerId: string): HoliThunk => async (
  dispatch
) => {
  firebase
    .functions()
    .httpsCallable("CALL-fetchPets")({
      customerId,
    })
    .then(({ data }) => {
      const { meta } = data;
      dispatch({
        type: StoreActions.FetchedPets,
        payload: meta,
      });
      dispatch({
        type: StoreActions.IsLoadingPets,
        payload: false,
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: StoreActions.IsLoadingPets,
        payload: false,
      });
    });
};

export const resetPendingPets = (): HoliThunk => async (dispatch) => {
  dispatch({
    type: StoreActions.ResetPendingPets,
  });
};

export const saveCurrentPet = (
  pet: Pet,
  activeSection: number
): HoliThunk => async (dispatch) => {
  dispatch({
    type: StoreActions.SavePet,
    payload: {
      activeSection,
      pet,
    },
  });
};

export const savePetsToCustomer = (
  customerId: string,
  recommendations: Array<RecommendationResponse>
): HoliThunk => (dispatch, getStore) => {
  interface RecommendationsForSave {
    pet: Pet;
    recommendation: AlgorithmResponse;
    kibble: {
      product: {
        title: string;
      };
    };
    topper: {
      product: {
        title: string;
      };
    };
  }
  const savedRecommendations: Array<RecommendationsForSave> = getStore().PetsReducer.savedRecommendations.map(
    (rec: RecommendationResponse) => {
      return {
        pet: rec.pet,
        recommendation: rec.recommendation,
        kibble: { product: { title: rec.kibble.product.title } },
        topper: { product: { title: rec.topper.product.title } },
      };
    }
  );
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
  firebase
    .functions()
    .httpsCallable("CALL-savePet")({
      customerId:
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_CUSTOMER_ID
          : customerId,
      pets: savedRecommendations,
    })
    .catch((error) => {
      console.log(error);
    });
};

export const startNewPet = (): HoliThunk => async (dispatch) => {
  dispatch({
    type: StoreActions.StartNewPet,
  });
};
