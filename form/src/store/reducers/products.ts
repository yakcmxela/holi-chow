import { AnyAction } from "redux";
import { StoreActions } from "../../entities/actions";
import { IProduct } from "shopify-api-node";
import { RecommendationResponse } from "../../entities/api";

interface ProductsReducer {
  loading: boolean;
  error: Error | null;
  products: Array<IProduct>;
  toppers: Array<IProduct>;
  recommendations?: Array<RecommendationResponse>;
  redirectToCart: boolean;
}

export const initialState: ProductsReducer = {
  loading: false,
  error: null,
  products: [],
  toppers: [],
  recommendations: undefined,
  redirectToCart: false,
};

export const ProductsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case StoreActions.IsLoadingProducts:
      return Object.assign({}, state, {
        ...state,
        loading: action.payload,
      });
    case StoreActions.FetchedRecommendations:
      return Object.assign({}, state, {
        ...state,
        error: null,
        loading: false,
        recommendations: action.payload,
      });
    case StoreActions.FetchedToppers:
      return Object.assign({}, state, {
        ...state,
        error: null,
        loading: false,
        toppers: action.payload,
      });
    case StoreActions.ThrewError:
      return Object.assign({}, state, {
        ...state,
        error: action.payload,
        loading: false,
      });
    case StoreActions.RedirectToCart:
      return Object.assign({}, state, {
        ...state,
        redirectToCart: true,
      });
    default:
      return state;
  }
};
