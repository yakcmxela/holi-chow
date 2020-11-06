import { IProductVariant } from "shopify-api-node";

interface TotalPriceProps {
  kibble: Array<{ variant: IProductVariant; quantity: number }>;
  topper: Array<{ variant: IProductVariant; quantity: number }>;
}

export const useGetTotalPrice = ({ kibble, topper }: TotalPriceProps) => {
  let totalKibblePrice = 0;
  let totalTopperPrice = 0;
  kibble.forEach((k) => {
    totalKibblePrice = totalKibblePrice + k.quantity * Number(k.variant.price);
  });
  topper.forEach((t) => {
    totalTopperPrice = totalTopperPrice + t.quantity * Number(t.variant.price);
  });
  const totalCombinedPrice = totalKibblePrice + totalTopperPrice;
  return { totalKibblePrice, totalTopperPrice, totalCombinedPrice };
};
