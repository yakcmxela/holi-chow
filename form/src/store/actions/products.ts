import { HoliThunk } from "../../entities/thunks";
import { RecommendationResponse, ATCRequest } from "../../entities/api";
import { savePetsToCustomer } from "./pets";
import { StoreActions } from "../../entities/actions";
import axios from "axios";

const functionsUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_FUNCTIONS_URL
    : process.env.REACT_APP_FUNCTIONS_EMULATOR_URL;

export const addProductsToCart = (): HoliThunk => async (
  dispatch,
  getStore
) => {
  try {
    dispatch({
      type: StoreActions.IS_LOADING_PETS,
      payload: true,
    });
    const recommendations: Array<RecommendationResponse> = getStore()
      .ProductsReducer.recommendations;
    if (recommendations) {
      const items: Array<ATCRequest> = [];
      recommendations.forEach((recommendation) => {
        const { kibble, topper } = recommendation;
        const lineItemsProperties = {
          petId: recommendation.pet.id,
          shipping_interval_frequency: "45",
          shipping_interval_unit_type: "Days",
          dailyCalories: Math.floor(
            recommendation.recommendation.dailyCalories
          ),
          dailyVolumeTbsp:
            Math.round(recommendation.recommendation.dailyVolumeTbsp / 0.5) *
            0.5,
          dailyVolumeCups:
            Math.round(recommendation.recommendation.dailyVolumeCups / 0.25) *
            0.25,
        };

        const kibbleItems = kibble.variants.map((k) => {
          return {
            quantity: k.quantity,
            id: k.variant.id,
            properties: lineItemsProperties,
          };
        });
        const topperItems = topper.variants.map((k) => {
          return {
            quantity: k.quantity,
            id: k.variant.id,
            properties: lineItemsProperties,
          };
        });
        items.push(...topperItems);
        items.push(...kibbleItems);
      });
      const { status } = await axios.post("/cart/add.js", {
        items,
      });
      if (status === 200) {
        window.location.href = "https://www.feedholi.com/cart";
      }
    } else {
      throw { message: "No recommendations yet for this pet" };
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchTopperProducts = (): HoliThunk => async (dispatch) => {
  try {
    dispatch({
      type: StoreActions.IS_LOADING_PETS,
      payload: true,
    });
    const response = await axios.get(`${functionsUrl}/REQUEST-fetchToppers`, {
      params: {
        collection: 171883757602,
      },
    });
    dispatch({
      type: StoreActions.FETCHED_TOPPER,
      payload: response.data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const runRecommendationTool = (customerId: string): HoliThunk => async (
  dispatch,
  getStore
) => {
  dispatch({
    type: StoreActions.IS_LOADING_PETS,
    payload: true,
  });
  const pets = getStore().PetsReducer.pendingPets;
  try {
    const {
      data,
    } = await axios.post(`${functionsUrl}/REQUEST-recommendProduct`, { pets });
    dispatch(savePetsToCustomer(customerId, data.recommendations));
    dispatch({
      type: StoreActions.FETCHED_RECS,
      payload: data.recommendations,
    });
  } catch (error) {
    console.log(error);
  }
};
