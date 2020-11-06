import { IProduct, IProductVariant, IObjectMetafield } from "shopify-api-node";
import { AlgorithmResponse, Pet } from "./pets";

export interface RecommendationResponse {
  recommendation: AlgorithmResponse;
  kibble: {
    metafields: Array<IObjectMetafield>;
    product: IProduct;
    variants: Array<{ variant: IProductVariant; quantity: number }>;
  };
  pet: Pet;
  topper: {
    metafields: Array<IObjectMetafield>;
    product: IProduct;
    variants: Array<{ variant: IProductVariant; quantity: number }>;
  };
}

export interface ATCRequest {
  quantity: number;
  id: number;
  properties: {
    [key: string]: any;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
