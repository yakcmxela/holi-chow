import * as functions from "firebase-functions";

import * as onRequest from "./https";
export const REQUEST = {
  created: functions.https.onRequest(onRequest.fromServer),
  deletePet: functions.https.onRequest(onRequest.deletePet),
  fetchToppers: functions.https.onRequest(onRequest.fetchToppers),
  getMeta: functions.https.onRequest(onRequest.getMeta),
  recommendProduct: functions.https.onRequest(onRequest.recommendProduct),
  saveMeta: functions.https.onRequest(onRequest.saveMeta),
  signup: functions.https.onRequest(onRequest.fromClient),
};

import * as onCall from "./callable";
export const CALL = {
  fetchPets: functions.https.onCall(onCall.fetchPets),
  savePet: functions.https.onCall(onCall.savePet),
};
