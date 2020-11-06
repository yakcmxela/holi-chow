import { Sex } from "../entities/pets";

export const useGetGender = (sex: Sex) => {
  return sex === Sex.male
    ? { himHer: "him", hisHers: "his", heShe: "he" }
    : { himHer: "her", hisHers: "hers", heShe: "she" };
};
