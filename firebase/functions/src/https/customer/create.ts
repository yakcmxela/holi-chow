import * as functions from "firebase-functions";
import axios from "axios";
import _get from "lodash/get";

const cors = require("cors")({ origin: true });
const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;

export const fromClient = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  response.set("Access-Control-Allow-Origin", "*");
  cors(request, response, async () => {
    const { body } = request;
    const email = _get(body, "email", null);
    const firstName = _get(body, "firstName", null);
    const lastName = _get(body, "lastName", null);
    if (!email) {
      return response
        .status(400)
        .send("Missing required parameters email, firstName, or lastName");
    }
    try {
      const { data } = await axios.post(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/customers.json`,
        {
          customer: {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        }
      );
      return response.status(200).send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  });
};


export const fromServer = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  response.set("Access-Control-Allow-Origin", "*");
  cors(request, response, async () => {
    const { body } = request;
    try {
      const { data } = await axios.post(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/customers/${body.id}/metafields.json`,
        {
          metafield: {
            namespace: "customer_pet",
            key: "customer_id",
            value: body.id,
            value_type: "integer",
          },
        }
      );
      await axios.post(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-07/customers/${body.id}/metafields.json`,
        {
          metafield: {
            namespace: "customer_pet",
            key: "customer_id_metafield",
            value: data.metafield.id,
            value_type: "integer",
          },
        }
      );
      return response.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  });
};

