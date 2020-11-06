import _get from "lodash/get";
import { CallableContext } from "firebase-functions/lib/providers/https";
import { IMetafield } from "shopify-api-node";
import { SavedPets } from "../../entities/pets";
import * as functions from "firebase-functions";
import axios from "axios";

const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;
const apiUrl = `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07`;

interface SavePetRequest extends SavedPets {
  customerId: string;
}

export const savePet = async (
  request: SavePetRequest,
  _: CallableContext | null
): Promise<any> => {
  try {
    const { customerId, pets } = request;
    if (!customerId || !pets) {
      throw { message: "Missing customer ID or pet to save" };
    }
    const metafieldPetRequest = await axios.get(
      `${apiUrl}/customers/${customerId}/metafields.json`
    );
    let metafieldId: number | null = null;
    metafieldPetRequest.data.metafields.forEach((field: IMetafield) => {
      if (field.namespace === "saved_pets" && field.key === "pet") {
        metafieldId = field.id;
      }
    });
    if (metafieldId) {
      await axios.put(`${apiUrl}/metafields/${metafieldId}.json`, {
        metafield: {
          value: JSON.stringify({pets}),
          value_type: "json_string",
        },
      });
      return { status: 200 };
    } else {
      await axios.post(`${apiUrl}/customers/${customerId}/metafields.json`, {
        metafield: {
          namespace: "saved_pets",
          key: "pet",
          value: JSON.stringify({pets}),
          value_type: "json_string",
        },
      });
    }
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};
