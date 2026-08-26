export type Size = "toy" | "small" | "medium" | "large" | "giant";
export type Breed = {
  name:string; slug:string; size:Size; weight:number; lifespan:number; foodCost:number; vetCost:number; groomingCost:number;
  insuranceCost:number; trainingCost:number; suppliesCost:number; walkingCost:number; puppyAdjustment:number; seniorAdjustment:number;
  healthRisk:number; description:string; faq:string[];
};
const b=(name:string,slug:string,size:Size,weight:number,lifespan:number,foodCost:number,vetCost:number,groomingCost:number,insuranceCost:number,trainingCost:number,suppliesCost:number,walkingCost:number,healthRisk:number,description:string):Breed=>({name,slug,size,weight,lifespan,foodCost,vetCost,groomingCost,insuranceCost,trainingCost,suppliesCost,walkingCost,puppyAdjustment:1.18,seniorAdjustment:1.25,healthRisk,description,faq:[`How much does a ${name} cost?`,`How much does a ${name} cost per year?`,`Are ${name}s expensive to own?`]});
export const breeds:Breed[]=[
 b("Labrador Retriever","labrador-retriever", "large",30,12,78,72,38,46,22,42,48,0.55,"Friendly, active and food-motivated; exercise and routine healthcare are the big recurring cost drivers."),
 b("Golden Retriever","golden-retriever","large",30,11,82,78,52,50,24,45,50,0.62,"A popular family breed with moderate-to-high food, grooming and healthcare needs."),
 b("German Shepherd","german-shepherd","large",32,10,84,86,40,58,28,48,55,0.70,"A large active breed where food, exercise and veterinary risk can materially affect lifetime cost."),
 b("French Bulldog","french-bulldog","medium",11,10,48,105,42,68,20,38,32,0.90,"Compact but often more expensive to insure and treat, making health-related costs important."),
 b("English Bulldog","english-bulldog","medium",24,9,66,110,38,72,18,40,30,0.94,"A lower-energy breed with comparatively high potential veterinary costs."),
 b("Poodle","poodle","medium",23,13,62,70,92,52,30,45,40,0.58,"Intelligent and active, with professional grooming as a major recurring expense."),
 b("Toy Poodle","toy-poodle","toy",4,14,25,58,82,38,28,30,22,0.48,"Small food footprint but high grooming and routine-care needs."),
 b("Chihuahua","chihuahua","toy",3,14,24,55,28,34,18,28,18,0.46,"One of the least expensive large recurring categories, although dental care can matter."),
 b("Dachshund","dachshund","small",8,13,32,62,28,38,18,30,24,0.60,"Small body, long lifespan and a meaningful need to budget for back-related care."),
 b("Beagle","beagle","medium",11,13,44,62,30,40,22,34,36,0.50,"Food and exercise are the main lifestyle cost drivers."),
 b("Border Collie","border-collie","medium",19,13,54,65,34,42,38,38,60,0.48,"Very active and intelligent, so enrichment, training and walking can raise costs."),
 b("Australian Shepherd","australian-shepherd","medium",23,12,62,68,52,46,32,42,58,0.56,"An energetic breed with above-average exercise and coat-care needs."),
 b("Rottweiler","rottweiler","large",50,9,115,95,32,65,28,58,60,0.76,"Large-body food and healthcare costs make the ownership budget substantial."),
 b("Boxer","boxer","large",29,10,78,86,34,58,26,45,52,0.72,"Athletic and social; healthcare and exercise costs deserve a healthy buffer."),
 b("Great Dane","great-dane","giant",65,8,145,110,34,82,24,70,65,0.88,"Giant-size food, equipment and veterinary costs can dominate the lifetime budget."),
 b("Bernese Mountain Dog","bernese-mountain-dog","giant",43,8,118,105,60,80,24,65,60,0.90,"A giant breed with high food and healthcare costs and a shorter typical lifespan."),
 b("Yorkshire Terrier","yorkshire-terrier","toy",3,14,24,56,74,36,22,28,20,0.46,"Small food costs, but regular coat care and dental budgeting are important."),
 b("Shih Tzu","shih-tzu","small",6,14,28,60,68,38,20,30,22,0.52,"Small and companion-oriented with regular grooming and dental needs."),
 b("Cavalier King Charles Spaniel","cavalier-king-charles-spaniel","small",8,11,32,78,46,56,20,32,28,0.78,"A small companion breed where health and insurance assumptions can change the budget significantly."),
 b("Cocker Spaniel","cocker-spaniel","medium",13,12,46,68,58,46,24,38,40,0.58,"Moderate food and exercise needs with above-average coat maintenance."),
 b("Pomeranian","pomeranian","toy",3,14,24,58,62,36,20,28,20,0.50,"Small food spend but recurring coat care and routine expenses."),
 b("Maltese","maltese","toy",3,15,23,56,72,36,18,28,18,0.46,"Long-lived small breed with grooming as a notable recurring cost."),
 b("Jack Russell Terrier","jack-russell-terrier","small",7,13,30,58,24,34,24,30,36,0.48,"Energetic and athletic; enrichment and activity can add to the monthly budget."),
 b("Siberian Husky","siberian-husky","large",23,12,70,72,48,52,30,48,62,0.60,"High exercise and food needs make lifestyle choices a major cost factor."),
 b("Akita","akita","large",40,11,95,88,48,62,28,52,48,0.70,"Large and independent, with substantial food, healthcare and equipment needs."),
 b("Doberman","doberman","large",34,10,88,92,34,68,28,50,58,0.76,"An athletic large breed where food, insurance and healthcare can be significant."),
 b("Cane Corso","cane-corso","giant",45,9,120,100,30,76,30,65,55,0.80,"Very large-body costs make food, equipment and veterinary budgeting important."),
 b("Belgian Malinois","belgian-malinois","large",28,12,78,74,32,52,45,48,72,0.62,"Extremely active; training, enrichment and exercise can be major expenses."),
 b("Mixed Breed / Mutt","mixed-breed-mutt","medium",20,13,52,65,38,42,22,38,40,0.52,"A flexible baseline; actual cost depends heavily on size, age, health and lifestyle."),
];
export const breedMap=Object.fromEntries(breeds.map(x=>[x.slug,x])) as Record<string,Breed>;
