import _get from "lodash/get";
import { CallableContext } from "firebase-functions/lib/providers/https";
import { IMetafield } from "shopify-api-node";
import { RecommendationMeta } from "../../entities";
import { SavedPet } from "../../entities/pets";
import * as functions from "firebase-functions";
import axios from "axios";

const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;
const apiUrl = `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07`;

interface SavePetRequest extends SavedPet {
  customerId: string;
}

export const fetchPets = async (
  request: SavePetRequest,
  _: CallableContext | null
): Promise<any> => {
  try {
    const { customerId } = request;
    if (!customerId) {
      throw { message: "Missing customer ID or pet to save" };
    }
    const metafieldPetRequest = await axios.get(
      `${apiUrl}/customers/${customerId}/metafields.json`
    );
    let meta: RecommendationMeta | null = null;
    metafieldPetRequest.data.metafields.forEach((field: IMetafield) => {
      if (field.namespace === "saved_pets" && field.key === "pet") {
        const data = JSON.parse(String(field.value));
        meta = data.pets;
      }
    });
    return { meta };
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};
