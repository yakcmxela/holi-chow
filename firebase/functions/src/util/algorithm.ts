import _get from "lodash/get";
import { differenceInMonths } from "date-fns";
import {
  AlgorithmResponse,
  Blend,
  BodyValue,
  BreedSize,
  NeuterValues,
  Pet,
  Stool,
  Shipment,
} from "../entities/pets";
import { KibbleHandle } from "../entities/products";

export const runAlgorithm = (data: any): AlgorithmResponse => {
  const {
    activity,
    birthdate,
    body,
    breeds,
    neutered,
    stool,
    weight,
  }: Pet = data;

  const ageMonths = differenceInMonths(Date.now(), Number(birthdate));

  const getBreedAndLifestage = (
    breedSize: BreedSize,
    months: number
  ): number => {
    let ls = 0;
    switch (breedSize) {
      case BreedSize.XS:
        if (months > 9) {
          ls = months < 85 ? 1 : 2;
        }
        break;
      case BreedSize.SM:
        if (months > 12) {
          ls = months < 85 ? 1 : 2;
        }
        break;
      case BreedSize.M:
        if (months > 12) {
          ls = months < 72 ? 1 : 2;
        }
        break;
      case BreedSize.L:
        if (months > 18) {
          ls = months < 60 ? 1 : 2;
        }
        break;
      case BreedSize.XL:
        if (months > 24) {
          ls = months < 60 ? 1 : 2;
        }
        break;
    }
    return ls;
  };

  const lifestage = getBreedAndLifestage(
    breeds.reduce((prev, curr) => {
      const prevResult = getBreedAndLifestage(prev.size, ageMonths);
      const currResult = getBreedAndLifestage(curr.size, ageMonths);
      if (prevResult > currResult) {
        return prev;
      } else {
        return curr;
      }
    }).size,
    ageMonths
  );

  const neuteredValue = neutered ? NeuterValues.true : NeuterValues.false;
  const derFactors: Array<number> = [
    Number(activity),
    Number(body),
    neuteredValue,
  ];
  const derMin = Math.min(...derFactors);
  const derMax = Math.max(...derFactors);
  const derTotal = derFactors.reduce((a, b) => a + b);
  const derAvg = Number((derTotal / derFactors.length).toFixed(2));
  const derFactor =
    lifestage === 0
      ? derMax
      : body === 1 || body === 1.2
      ? derMin
      : body === 1.6 || body === 1.8
      ? derMax
      : derAvg;
  const rer = 70 * Math.pow(Number(weight) / 2.2, 0.75);

  let blend = Blend.adult;
  switch (lifestage) {
    case 0:
      blend = Blend.puppy;
      break;
    case 1:
      if (body <= BodyValue.slightlyOver || stool === Stool.bad) {
        blend = Blend.weightManagement;
      } else if (body >= BodyValue.slightlyUnder) {
        blend = Blend.puppy;
      } else {
        blend = Blend.adult;
      }
      break;
    case 2:
      if (body <= BodyValue.slightlyOver || stool === Stool.bad) {
        blend = Blend.weightManagement;
      } else {
        blend = Blend.adult;
      }
  }

  const kibbleHandle =
    blend === Blend.puppy
      ? KibbleHandle.puppy
      : blend === Blend.weightManagement
      ? KibbleHandle.weight
      : KibbleHandle.adult;

  const dailyCalories = rer * derFactor;
  const dailyVolumeCups =
    (0.95 * dailyCalories) / formulationVolumes[blend].bulk;
  const dailyVolumeTbsp =
    (0.05 * dailyCalories) / formulationVolumes[Blend.topper].bulk;
  const dailyWeightKibble =
    ((0.95 * dailyCalories) / formulationVolumes[blend].cal) * 2.2;
  const dailyWeightProtein =
    ((dailyCalories * 0.05) / formulationVolumes[Blend.topper].cal) * 35.274;
  const fortyFiveWeightKibble = dailyWeightKibble * 45;
  const fortyFiveWeightProtein = dailyWeightProtein * 45;

  const fullShipments = [
    ...Array(Math.floor(fortyFiveWeightKibble / 40)).keys(),
  ].map(() => 40);

  if (fortyFiveWeightKibble % 40 !== 0) {
    fullShipments.push(fortyFiveWeightKibble % 40);
  }

  const getBagSize = (lbs: number) => {
    return lbs < 5
      ? 4
      : lbs < 10
      ? 8
      : lbs < 14
      ? 12
      : lbs < 18
      ? 16
      : lbs < 22
      ? 20
      : lbs < 26
      ? 24
      : lbs <= 28
      ? 28
      : lbs <= 32
      ? 32
      : lbs <= 36
      ? 36
      : 40;
  };

  const shipmentKibbleLbs: Array<Shipment> =
    fullShipments.length === 0
      ? [{ weight: getBagSize(fortyFiveWeightKibble), quantity: 1 }]
      : [];
  let fullShipmentWeight = 0;
  if (fullShipments.length > 0) {
    let shipmentMap: { [key: string]: number } = {};
    fullShipments.forEach((shipment) => {
      const bagSize = getBagSize(shipment);
      fullShipmentWeight = fullShipmentWeight + bagSize;
      if (shipmentMap.hasOwnProperty(String(bagSize))) {
        shipmentMap = {
          ...shipmentMap,
          [bagSize]: shipmentMap[String(bagSize)] + 1,
        };
      } else {
        shipmentMap = {
          ...shipmentMap,
          [bagSize]: 1,
        };
      }
    });
    Object.keys(shipmentMap).forEach((key) => {
      shipmentKibbleLbs.push({
        weight: Number(key),
        quantity: shipmentMap[key],
      });
    });
  }

  const proteinMultiplier = 4;
  const shipmentProteinOz = (fullShipmentWeight / 4) * proteinMultiplier;
  const estimatedRenewal =
    (fullShipmentWeight - fortyFiveWeightKibble) / dailyWeightKibble + 45;

  const response: AlgorithmResponse = {
    blend,
    dailyCalories,
    dailyVolumeCups,
    dailyVolumeTbsp,
    dailyWeightKibble,
    dailyWeightProtein,
    derAvg,
    derFactor,
    derMax,
    derMin,
    derTotal,
    estimatedRenewal,
    fortyFiveWeightKibble,
    fortyFiveWeightProtein,
    kibbleHandle,
    lifestage,
    rer,
    shipmentKibbleLbs,
    shipmentProteinOz,
  };
  return response;
};

const formulationVolumes = {
  [Blend.puppy]: {
    cal: 3799,
    bulk: 441,
  },
  [Blend.adult]: {
    cal: 3847,
    bulk: 435,
  },
  [Blend.weightManagement]: {
    cal: 3594,
    bulk: 409,
  },
  [Blend.topper]: {
    cal: 3900,
    bulk: 17.55,
  },
};
