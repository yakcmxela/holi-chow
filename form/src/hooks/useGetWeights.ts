import { IProductVariant } from "shopify-api-node";

interface TotalPriceProps {
  kibble: Array<{ variant: IProductVariant; quantity: number }>;
  topper: Array<{ variant: IProductVariant; quantity: number }>;
}

export const useGetWeights = ({ kibble, topper }: TotalPriceProps) => {
  let kibbleWeight = 0;
  let topperWeight = 0;
  kibble.forEach((k) => {
    kibbleWeight = kibbleWeight + k.quantity * k.variant.weight;
  });
  topper.forEach((t) => {
    topperWeight = topperWeight + t.quantity * t.variant.weight;
  });
  return { kibbleWeight, topperWeight };
};
