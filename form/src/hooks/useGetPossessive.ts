export const useGetPossessive = (name: string) => {
  return name.slice(0, -1) === "s" ? `${name}'` : `${name}'s`;
};
