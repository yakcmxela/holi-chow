import _get from "lodash/get";
import { Pet } from "../../entities/pets";
import { ProductsResponse, ProteinSkuMap } from "../../entities/products";
import { runAlgorithm } from "../../util";
import * as functions from "firebase-functions";
import Shopify from "shopify-api-node";
import bluebird from "bluebird";
import axios from "axios";
import { RecommendationMeta } from "../../entities";

const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;
const shopify = new Shopify({
  shopName: "holi-chow.myshopify.com",
  apiKey,
  password,
});

const cors = require("cors")({ origin: true });

export const recommendProduct = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  response.set("Access-Control-Allow-Origin", "*");
  cors(request, response, async () => {
    try {
      const { pets = [] } = request.body;
      if (!pets.length) {
        throw { message: "Missing pets from request!" };
      }
      const recommendations: Array<RecommendationMeta> = [];
      const allProducts = await shopify.product.list();
      await bluebird.map(
        pets,
        async (pet: Pet) => {
          const kibbleVariants: ProductsResponse = [];
          const topperVariants: ProductsResponse = [];
          const recommendation = runAlgorithm(pet);
          const kibbleByHandle = allProducts.filter(
            (p) => p.handle === recommendation.kibbleHandle
          );
          const topperByHandle = allProducts.filter(
            (p) => p.handle === pet.topper
          );
          if (!kibbleByHandle.length || !topperByHandle.length) {
            throw { message: "No kibble or topper products found" };
          }
          const kibble = kibbleByHandle[0];
          const topper = topperByHandle[0];
          const metafieldsKibbleRequest = await axios.get(
            `https://${apiKey}:${password}@holi-chow.myshopify.com//admin/products/${kibble.id}/metafields.json`
          );
          const metafieldsTopperRequest = await axios.get(
            `https://${apiKey}:${password}@holi-chow.myshopify.com//admin/products/${topper.id}/metafields.json`
          );
          const metafieldsKibble = metafieldsKibbleRequest.data.metafields;
          const metafieldsTopper = metafieldsTopperRequest.data.metafields;
          recommendation.shipmentKibbleLbs.forEach((shipment) => {
            const quantity = shipment.quantity;
            const byWeight = kibble.variants.filter((v) => {
              return Number(v.weight) === shipment.weight;
            });
            if (!byWeight.length) {
              return;
            }
            const kibbleVariant = byWeight[0];
            const toppersForKibble = ProteinSkuMap.filter(
              (k) => k.kibble === kibbleVariant.sku
            );
            if (!toppersForKibble.length) {
              return;
            }
            const topperBySku = topper.variants.filter((v) => {
              return (
                String(v.sku) ===
                String(toppersForKibble[0].toppers[pet.topper])
              );
            });
            const topperVariant = topperBySku[0];
            kibbleVariants.push({ variant: kibbleVariant, quantity });
            topperVariants.push({ variant: topperVariant, quantity });
          });
          recommendations.push({
            recommendation,
            kibble: {
              metafields: metafieldsKibble,
              product: kibble,
              variants: kibbleVariants,
            },
            pet,
            topper: {
              metafields: metafieldsTopper,
              product: topper,
              variants: topperVariants,
            },
          });
        },
        { concurrency: 1 }
      );
      return response.status(200).send({ recommendations });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  });
};
