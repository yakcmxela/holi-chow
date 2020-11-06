import * as functions from "firebase-functions";
import axios from "axios";
import _get from "lodash/get";
import { IMetafield } from "shopify-api-node";
import { RecommendationMeta } from "../../entities";

const cors = require("cors")({ origin: true });
const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;
const apiUrl = `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07`;

export const deletePet = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  response.set("Access-Control-Allow-Origin", "*");
  cors(request, response, async () => {
    const { customerId = null, petId = null } = request.body;
    try {
      const metafieldPetRequest = await axios.get(
        `${apiUrl}/customers/${customerId}/metafields.json`
      );
      let metafield: IMetafield | null = null;
      metafieldPetRequest.data.metafields.forEach((field: IMetafield) => {
        if (field.namespace === "saved_pets" && field.key === "pet") {
          metafield = field;
        }
      });
      if (metafield) {
        const field = metafield as IMetafield;
        const { pet } = JSON.parse(String(field.value));
        const newPets = pet.filter((meta: RecommendationMeta) => {
          return meta.pet.id !== petId;
        });
        await axios.put(`${apiUrl}/metafields/${field.id}.json`, {
          metafield: {
            value: JSON.stringify({ pet: newPets }),
            value_type: "json_string",
          },
        });
      }
      response.status(200).send({ success: true })
    } catch (error) {
      console.log(error);
      response.sendStatus(500).end()
    }
  });
};
