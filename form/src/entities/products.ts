import { IObjectMetafield, IProduct } from "shopify-api-node";

export interface IProductWithMetafields extends IProduct {
  metafields: Array<IObjectMetafield>;
}