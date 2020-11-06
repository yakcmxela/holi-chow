import * as functions from "firebase-functions";
import axios from "axios";
import _get from "lodash/get";
import { Metafield } from "../../entities";

const cors = require("cors")({ origin: true });
const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;

export const getMeta = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  cors(request, response, async () => {
    const { query } = request;
    const customerId = _get(query, "customerId", null);
    if (!customerId) {
      return response.status(400).send("Missing required parameter customerId");
    }
    try {
      const { data } = await axios.get(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/customers/${customerId}/metafields.json`
      );
      let petData = null;
      data.metafields.forEach((field: Metafield) => {
        if (field.namespace === "customer_pet" && field.key === "pet_json") {
          petData = field.value;
        }
      });
      if (petData) {
        return response.status(200).send(petData);
      } else {
        return response
          .status(404)
          .send(`No pet data found for customer ${customerId}`);
      }
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  });
};

export const saveMeta = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  response.set("Access-Control-Allow-Origin", "*");
  cors(request, response, async () => {
    const { body } = request;
    const customerIdMetafield = _get(body, "metafieldsId", null);
    const petData = _get(body, "petData", null);
    if (!customerIdMetafield || customerIdMetafield === "" || !petData) {
      return response
        .status(400)
        .send("Missing required parameters metafieldsId or petData");
    }
    try {
      const metafieldIdRequest = await axios.get(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/metafields/${customerIdMetafield}.json`
      );
      const customerId = _get(metafieldIdRequest, "data.metafield.value", null);
      if (!customerId) {
        return response.status(404).send("Customer not found");
      }
      const metafieldPetRequest = await axios.get(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/customers/${customerId}/metafields.json`
      );
      let metafieldId = null;
      metafieldPetRequest.data.metafields.forEach((field: Metafield) => {
        if (field.namespace === "customer_pet" && field.key === "pet_json") {
          metafieldId = field.id;
        }
      });
      if (metafieldId) {
        await axios.put(
          `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/metafields/${metafieldId}.json`,
          {
            metafield: {
              id: "12111102574626",
              value: petData,
              value_type: "json_string",
            },
          }
        );
        return response.status(200).send({ success: true });
      } else {
        await axios.post(
          `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/customers/${customerId}/metafields.json`,
          {
            metafield: {
              namespace: "customer_pet",
              key: "pet_json",
              value: petData,
              value_type: "json_string",
            },
          }
        );
        return response.status(200).send({ success: true });
      }
    } catch (error) {
      // console.log(error);
      return response.status(500).send(error.message);
    }
  });
};
