import React, { createContext, useContext, useState } from "react";

export type Category = {
  name: string;
  icon: string;
  color: string;
};

export type CategoriesContextType = {
  categories: Category[];
  addCategory: (category: Category) => void;
};

const seedCategories: Category[] = [
  { name: "Work", icon: "briefcase", color: "#FFD600" },
  { name: "Personal", icon: "person", color: "#4CAF50" },
  { name: "Shopping", icon: "cart", color: "#2196F3" },
  { name: "Health", icon: "fitness", color: "#E57373" },
];

const CategoryContext = createContext<CategoriesContextType>({
  categories: [],
  addCategory: () => {},
});

import { ReactNode } from "react";

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const addCategory = (category: Category) => setCategories((prev) => [...prev, category]);
  return <CategoryContext.Provider value={{ categories, addCategory }}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  return useContext(CategoryContext);
}
