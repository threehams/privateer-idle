export type StarId = string;
export type StarData = {
  name: string;
  type: "star";
  id: StarId;
  systemIndex: number;
};

export const stars: { [Key in StarId]: StarData } = {
  "star-1": {
    name: "Sol",
    type: "star",
    id: "star-1",
    systemIndex: 0,
  },
};
