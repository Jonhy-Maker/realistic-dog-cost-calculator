import { describe, expect, it } from "vitest";
import { breeds } from "@/data/breeds";
import {
  calculateFoodCost,
  calculateTotalCost,
  defaultInputs,
} from "@/lib/calculator";

const lab = defaultInputs(breeds[0]);

describe("calculator engine", () => {
  it("calculates food from food and treat inputs", () => {
    const base = calculateFoodCost(lab);
    const moreTreats = calculateFoodCost({ ...lab, treatsPerDay: 2 });
    expect(base).toBeGreaterThan(0);
    expect(moreTreats).toBeGreaterThan(base);
  });

  it("keeps annual healthcare and training inputs annual", () => {
    const base = calculateTotalCost(lab);
    const doubledVet = calculateTotalCost({ ...lab, routineVet: lab.routineVet * 2 });
    expect(doubledVet.monthly - base.monthly).toBeCloseTo(lab.routineVet / 12, 6);
  });

  it("keeps yearly equal to monthly times twelve", () => {
    const result = calculateTotalCost(lab);
    expect(result.yearly).toBeCloseTo(result.monthly * 12, 8);
  });

  it("includes one-time costs in the first year and lifetime", () => {
    const base = calculateTotalCost(lab);
    const more = calculateTotalCost({ ...lab, purchase: lab.purchase + 1000 });
    expect(more.firstYear - base.firstYear).toBe(1000);
    expect(more.lifetime - base.lifetime).toBe(1000);
  });

  it("uses breed puppy and senior adjustments", () => {
    const puppy = calculateTotalCost({ ...lab, age: 0, lifespan: 12, profile: "puppy" });
    const adult = calculateTotalCost({ ...lab, age: 0, lifespan: 12, profile: "adult" });
    const senior = calculateTotalCost({ ...lab, age: 9, lifespan: 12, profile: "senior" });
    expect(puppy.firstYear).toBeGreaterThan(adult.firstYear);
    expect(senior.monthly).toBeGreaterThan(adult.monthly);
  });

  it("changes totals between budget and premium scenarios", () => {
    const budget = calculateTotalCost({ ...lab, scenario: "budget" });
    const premium = calculateTotalCost({ ...lab, scenario: "premium" });
    expect(premium.monthly).toBeGreaterThan(budget.monthly);
    expect(premium.lifetime).toBeGreaterThan(budget.lifetime);
  });

  it("handles extreme input without NaN or Infinity", () => {
    const result = calculateTotalCost({ ...lab, foodPricePerKg: 0, foodGramsPerDay: 0, income: 0, expenses: 0 });
    expect(Number.isFinite(result.monthly)).toBe(true);
    expect(Number.isFinite(result.lifetime)).toBe(true);
  });
});
