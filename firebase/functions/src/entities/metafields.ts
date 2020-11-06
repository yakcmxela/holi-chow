import { AlgorithmResponse, Pet } from "./pets";
import Shopify from "shopify-api-node";

export interface Metafield {
  id: number;
  namespace: string;
  key: string;
  value: string | number;
  value_type: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  owner_resource: string;
  admin_graphql_api_id: string;
}

export interface RecommendationMeta {
  recommendation: AlgorithmResponse;
  kibble: {
    metafields: Array<Shopify.IObjectMetafield>;
    product: Shopify.IProduct;
    variants: Array<{ variant: Shopify.IProductVariant; quantity: number }>;
  };
  pet: Pet;
  topper: {
    metafields: Array<Shopify.IObjectMetafield>;
    product: Shopify.IProduct;
    variants: Array<{ variant: Shopify.IProductVariant; quantity: number }>;
  };
}
