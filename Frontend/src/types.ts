export type Screen = "dashboard" | "menu" | "pricing" | "inventory" | "activity" | "customer";

export interface Dish {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
  price: number;
}

export interface ActivityEntry {
  id: number;
  user: string;
  action: string;
  item: string;
  field: string;
  prev: string;
  next: string;
  datetime: string;
  avatar: string;
}
