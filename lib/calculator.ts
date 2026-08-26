import type { Breed, Size } from "@/data/breeds";

export type Scenario = "budget" | "average" | "premium";
export type Country = "US" | "UK" | "CA" | "AU" | "BE" | "NL";
export type Currency = "USD" | "GBP" | "CAD" | "AUD" | "EUR";
export type LifeStage = "puppy" | "adult" | "senior";
export type Insurance = "none" | "basic" | "standard" | "premium";

export type Inputs = {
  breed: Breed;
  age: number;
  weight: number;
  lifespan: number;
  profile: LifeStage;
  scenario: Scenario;
  country: Country;
  currency: Currency;
  sex: "female" | "male";
  measurementSystem: "metric" | "imperial";
  foodType: string;
  foodPricePerKg: number;
  foodGramsPerDay: number;
  treatsPerDay: number;
  treatPriceEach: number;
  routineVet: number;
  vaccines: number;
  prevention: number;
  fleaTick: number;
  worming: number;
  dental: number;
  emergencyFund: number;
  unexpected: number;
  insurance: Insurance;
  premium: number;
  deductible: number;
  reimbursement: number;
  annualLimit: number;
  groomingSessions: number;
  groomingPrice: number;
  homeGrooming: number;
  training: number;
  walkingPerWeek: number;
  walkPrice: number;
  daycareDays: number;
  daycarePrice: number;
  sitter: number;
  travel: number;
  toys: number;
  accessories: number;
  housing: number;
  cleaning: number;
  damage: number;
  oneTime: number;
  purchase: number;
  income: number;
  expenses: number;
  savings: number;
  existingEmergency: number;
};

export type Breakdown = {
  food: number;
  vet: number;
  insurance: number;
  grooming: number;
  training: number;
  supplies: number;
  walking: number;
  travel: number;
  housing: number;
  unexpected: number;
};

export type Result = {
  monthly: number;
  yearly: number;
  firstYear: number;
  lifetime: number;
  breakdown: Breakdown;
  timeline: { year: number; cost: number }[];
  emergency: { low: number; high: number };
  affordability: "comfortable" | "manageable" | "risky";
};

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));

export const scenarioMultiplier = (s: Scenario) =>
  s === "budget" ? 0.78 : s === "premium" ? 1.35 : 1;

const SIZE_FACTORS: Record<Size, number> = { toy: 0.55, small: 0.72, medium: 1, large: 1.35, giant: 1.75 };
export const sizeFactor = (s: Size) => SIZE_FACTORS[s];

const safe = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);

/** Food inputs are monthly prices/quantities, so the result is monthly. */
export const calculateFoodCost = (i: Inputs) =>
  safe(i.foodPricePerKg) * (safe(i.foodGramsPerDay) / 1000) * 30.4375 +
  safe(i.treatsPerDay) * safe(i.treatPriceEach) * 30.4375;

/** Healthcare inputs are annual amounts; this function returns annual cost. */
export const calculateVetCost = (i: Inputs) =>
  safe(i.routineVet) +
  safe(i.vaccines) +
  safe(i.prevention) +
  safe(i.fleaTick) +
  safe(i.worming) +
  safe(i.dental);

export const calculateGroomingCost = (i: Inputs) =>
  safe(i.groomingSessions) * safe(i.groomingPrice) + safe(i.homeGrooming);

export const calculateInsuranceCost = (i: Inputs) =>
  i.insurance === "none" ? 0 : safe(i.premium);

/** Training is entered as an annual budget and converted to monthly below. */
export const calculateTrainingCost = (i: Inputs) => safe(i.training) / 12;

export const calculateSuppliesCost = (i: Inputs) =>
  safe(i.toys) + safe(i.accessories);

export const calculateWalkingCost = (i: Inputs) =>
  safe(i.walkingPerWeek) * safe(i.walkPrice) * 52 / 12 +
  safe(i.daycareDays) * safe(i.daycarePrice) +
  safe(i.sitter);

export const calculateTravelCost = (i: Inputs) => safe(i.travel);

export function calculateEmergencyFund(i: Inputs) {
  const riskMultiplier = 1 + clamp(i.breed.healthRisk, 0, 1);
  const base = Math.max(500, safe(i.breed.vetCost) * 4 * riskMultiplier);
  const ageFactor = i.age >= 8 ? 1.2 : 1;
  return {
    low: Math.round(base * 0.8 * ageFactor),
    high: Math.round(base * 1.8 * ageFactor),
  };
}

function monthlyBreakdown(i: Inputs): Breakdown {
  const scenario = scenarioMultiplier(i.scenario);
  const size = sizeFactor(i.breed.size);
  const puppyFactor = i.profile === "puppy" ? i.breed.puppyAdjustment : 1;
  const seniorFactor = i.profile === "senior" ? i.breed.seniorAdjustment : 1;

  const food = calculateFoodCost(i) * scenario;
  const vet = (calculateVetCost(i) / 12) * scenario * seniorFactor * puppyFactor;
  const insurance = calculateInsuranceCost(i) * scenario;
  const grooming = calculateGroomingCost(i) * scenario;
  const training = calculateTrainingCost(i) * scenario * puppyFactor;
  const supplies = calculateSuppliesCost(i) * scenario;
  const walking = calculateWalkingCost(i) * scenario;
  const travel = calculateTravelCost(i) * scenario;
  const housing = (safe(i.housing) + safe(i.cleaning) + safe(i.damage)) * scenario;
  const unexpected =
    (safe(i.unexpected) / 12) * scenario * seniorFactor + size * 4 * scenario;

  return {
    food,
    vet,
    insurance,
    grooming,
    training,
    supplies,
    walking,
    travel,
    housing,
    unexpected,
  };
}

export function calculateTotalCost(i: Inputs): Result {
  const normalized = {
    ...i,
    age: clamp(i.age, 0, 100),
    lifespan: clamp(i.lifespan, 1, 100),
  };
  const b = monthlyBreakdown(normalized);
  const monthly = Object.values(b).reduce((sum, value) => sum + value, 0);
  const yearly = monthly * 12;
  const oneTime = safe(normalized.purchase) + safe(normalized.oneTime);
  const years = Math.max(1, Math.ceil(normalized.lifespan - normalized.age));

  const timeline = Array.from({ length: years }, (_, index) => {
    const year = index + 1;
    const ageAtEnd = normalized.age + year;
    const seniorThreshold = Math.max(7, normalized.lifespan - 4);
    const seniorFactor = ageAtEnd >= seniorThreshold ? normalized.breed.seniorAdjustment : 1;
    const puppyFactor = normalized.age < 1 && year === 1 ? normalized.breed.puppyAdjustment : 1;
    const firstYearFactor = year === 1 ? 1.16 : 1;
    const cost = yearly * seniorFactor * puppyFactor * firstYearFactor + (year === 1 ? oneTime : 0);
    return { year, cost: Math.round(cost) };
  });

  const lifetime = timeline.reduce((sum, row) => sum + row.cost, 0);
  const firstYear = timeline[0]?.cost ?? yearly + oneTime;
  const breakdown = Object.fromEntries(
    Object.entries(b).map(([key, value]) => [key, monthly > 0 ? value / monthly : 0]),
  ) as Breakdown;

  const emergency = calculateEmergencyFund(normalized);
  const disposable = safe(normalized.income) - safe(normalized.expenses);
  const ratio = disposable > 0 ? monthly / disposable : Infinity;
  const savings = safe(normalized.savings) + safe(normalized.existingEmergency);
  const affordability =
    ratio <= 0.12 && savings >= emergency.low
      ? "comfortable"
      : ratio <= 0.22 && savings >= emergency.low * 0.5
        ? "manageable"
        : "risky";

  return { monthly, yearly, firstYear, lifetime, breakdown, timeline, emergency, affordability };
}

export const defaultInputs = (breed: Breed): Inputs => ({
  breed,
  age: 1,
  weight: breed.weight,
  lifespan: breed.lifespan,
  profile: "adult",
  scenario: "average",
  country: "US",
  currency: "USD",
  sex: "female",
  measurementSystem: "imperial",
  foodType: "dry",
  foodPricePerKg: 5,
  foodGramsPerDay: Math.round(breed.weight * 14),
  treatsPerDay: 1,
  treatPriceEach: 0.65,
  routineVet: breed.vetCost,
  vaccines: 90,
  prevention: 216,
  fleaTick: 144,
  worming: 72,
  dental: 216,
  emergencyFund: 0,
  unexpected: 600,
  insurance: "standard",
  premium: breed.insuranceCost,
  deductible: 250,
  reimbursement: 80,
  annualLimit: 10000,
  groomingSessions: breed.groomingCost > 70 ? 1.5 : 0.5,
  groomingPrice: 55,
  homeGrooming: breed.groomingCost > 70 ? 12 : 7,
  training: breed.trainingCost * 12,
  walkingPerWeek: breed.walkingCost > 55 ? 5 : 2,
  walkPrice: 20,
  daycareDays: 0,
  daycarePrice: 30,
  sitter: 25,
  travel: 25,
  toys: breed.suppliesCost * 0.45,
  accessories: breed.suppliesCost * 0.55,
  housing: 0,
  cleaning: 0,
  damage: 0,
  oneTime: 500,
  purchase: 1000,
  income: 3500,
  expenses: 2600,
  savings: 2500,
  existingEmergency: 1000,
});
