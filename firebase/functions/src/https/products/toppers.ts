import * as functions from "firebase-functions";
import axios from "axios";
import _get from "lodash/get";
import bluebird from "bluebird";

const cors = require("cors")({ origin: true });
const apiKey = functions.config().shopify.api_key;
const password = functions.config().shopify.password;

export const fetchToppers = async (
  request: functions.https.Request,
  response: functions.Response<any>
): Promise<any> => {
  response.set("Access-Control-Allow-Origin", "*");
  cors(request, response, async () => {
    const { query } = request;
    const { collection = null } = query;
    if (!collection) {
      return response.status(400).send("Must request a collection by ID");
    }
    try {
      const products: Array<any> = [];
      const { data } = await axios.get(
        `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/api/2020-10/collections/${collection}/products.json`
      );
      await bluebird.map(
        data.products,
        async (p: {}) => {
          let product = { ...p };
          const productId = _get(product, "id", null);
          if (productId) {
            const metafieldsResponse = await axios.get(
              `https://${apiKey}:${password}@holi-chow.myshopify.com/admin/products/${productId}/metafields.json`
            );
            if (metafieldsResponse.data) {
              const { metafields = [] } = metafieldsResponse.data;
              product = {
                ...product,
                metafields,
              };
              products.push(product);
            }
          }
        },
        { concurrency: 10 }
      );
      return response.status(200).send(products);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  });
};
