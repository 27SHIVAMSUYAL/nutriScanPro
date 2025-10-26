import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const genders = ["Male", "Female"];
const ages = Array.from({ length: 100 }, (_, i) => i + 1); // 1-100
const dietTypes = ["Vegan", "Vegetarian", "Non-Veg"];

function calculateBMI(weight: number, height: number) {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

function getStatus(bmi: number) {
  if (bmi >= 30) return "Obese";
  if (bmi >= 25) return "Not Healthy";
  if (bmi >= 18.5) return "Healthy";
  return "Not Healthy";
}

const diets = {
  Male: {
    Obese: {
      Vegan: [
        "Oats, almond milk, salad",
        "Chia pudding, lentils, steamed veggies",
        "Tofu scramble, beans, quinoa",
        "Smoothie, chickpeas, greens",
        "Fruit bowl, tempeh, broccoli",
        "Vegan yogurt, seitan, spinach",
        "Granola, hummus, mixed salad",
      ],
      Vegetarian: [
        "Oats, paneer, salad",
        "Greek yogurt, dal, steamed veggies",
        "Eggs, beans, quinoa",
        "Smoothie, cottage cheese, greens",
        "Fruit bowl, cheese, broccoli",
        "Vegetarian omelette, lentils, spinach",
        "Granola, paneer, mixed salad",
      ],
      "Non-Veg": [
        "Oats, grilled chicken, salad",
        "Greek yogurt, fish, steamed veggies",
        "Eggs, turkey, quinoa",
        "Smoothie, lean beef, greens",
        "Cottage cheese, salmon, broccoli",
        "Scrambled eggs, chicken, spinach",
        "Fruit bowl, tofu, mixed salad",
      ],
    },
    "Not Healthy": {
      Vegan: [
        "Poha, lentils, veggies",
        "Paratha, dal, salad",
        "Upma, beans, greens",
        "Dosa, tofu, veggies",
        "Idli, chickpeas, salad",
        "Fruit, tempeh, mixed veggies",
        "Oats, hummus, salad",
      ],
      Vegetarian: [
        "Eggs, rice, veggies",
        "Paratha, dal, salad",
        "Poha, paneer, beans",
        "Upma, cheese, greens",
        "Dosa, tofu, veggies",
        "Idli, beans, salad",
        "Fruit, paneer, mixed veggies",
      ],
      "Non-Veg": [
        "Eggs, rice, veggies",
        "Paratha, dal, salad",
        "Poha, chicken, beans",
        "Upma, fish, greens",
        "Dosa, beef, veggies",
        "Idli, turkey, salad",
        "Fruit, paneer, mixed veggies",
      ],
    },
    Healthy: {
      Vegan: [
        "Oats, almond milk, salad",
        "Vegan yogurt, lentils, veggies",
        "Tofu scramble, beans, quinoa",
        "Smoothie, chickpeas, greens",
        "Fruit bowl, tempeh, broccoli",
        "Granola, seitan, spinach",
        "Oats, hummus, salad",
      ],
      Vegetarian: [
        "Oats, paneer, salad",
        "Yogurt, dal, veggies",
        "Eggs, beans, quinoa",
        "Smoothie, cottage cheese, greens",
        "Cheese, lentils, broccoli",
        "Eggs, paneer, spinach",
        "Fruit, tofu, salad",
      ],
      "Non-Veg": [
        "Oats, chicken, salad",
        "Yogurt, fish, veggies",
        "Eggs, turkey, quinoa",
        "Smoothie, beef, greens",
        "Cheese, salmon, broccoli",
        "Eggs, chicken, spinach",
        "Fruit, tofu, salad",
      ],
    },
  },
  Female: {
    Obese: {
      Vegan: [
        "Oats, almond milk, salad",
        "Chia pudding, lentils, steamed veggies",
        "Tofu scramble, beans, quinoa",
        "Smoothie, chickpeas, greens",
        "Fruit bowl, tempeh, broccoli",
        "Vegan yogurt, seitan, spinach",
        "Granola, hummus, mixed salad",
      ],
      Vegetarian: [
        "Oats, paneer, salad",
        "Greek yogurt, dal, steamed veggies",
        "Eggs, beans, quinoa",
        "Smoothie, cottage cheese, greens",
        "Fruit bowl, cheese, broccoli",
        "Vegetarian omelette, lentils, spinach",
        "Granola, paneer, mixed salad",
      ],
      "Non-Veg": [
        "Oats, grilled chicken, salad",
        "Yogurt, fish, steamed veggies",
        "Eggs, tofu, quinoa",
        "Smoothie, beans, greens",
        "Cheese, salmon, broccoli",
        "Scrambled eggs, chicken, spinach",
        "Fruit bowl, tofu, mixed salad",
      ],
    },
    "Not Healthy": {
      Vegan: [
        "Poha, lentils, veggies",
        "Paratha, dal, salad",
        "Upma, beans, greens",
        "Dosa, tofu, veggies",
        "Idli, chickpeas, salad",
        "Fruit, tempeh, mixed veggies",
        "Oats, hummus, salad",
      ],
      Vegetarian: [
        "Eggs, rice, veggies",
        "Paratha, dal, salad",
        "Poha, paneer, beans",
        "Upma, cheese, greens",
        "Dosa, tofu, veggies",
        "Idli, beans, salad",
        "Fruit, paneer, mixed veggies",
      ],
      "Non-Veg": [
        "Eggs, rice, veggies",
        "Paratha, dal, salad",
        "Poha, chicken, beans",
        "Upma, fish, greens",
        "Dosa, beef, veggies",
        "Idli, turkey, salad",
        "Fruit, paneer, mixed veggies",
      ],
    },
    Healthy: {
      Vegan: [
        "Oats, almond milk, salad",
        "Vegan yogurt, lentils, veggies",
        "Tofu scramble, beans, quinoa",
        "Smoothie, chickpeas, greens",
        "Fruit bowl, tempeh, broccoli",
        "Granola, seitan, spinach",
        "Oats, hummus, salad",
      ],
      Vegetarian: [
        "Oats, paneer, salad",
        "Yogurt, dal, veggies",
        "Eggs, beans, quinoa",
        "Smoothie, cottage cheese, greens",
        "Cheese, lentils, broccoli",
        "Eggs, paneer, spinach",
        "Fruit, tofu, salad",
      ],
      "Non-Veg": [
        "Oats, chicken, salad",
        "Yogurt, fish, veggies",
        "Eggs, turkey, quinoa",
        "Smoothie, beef, greens",
        "Cheese, salmon, broccoli",
        "Eggs, chicken, spinach",
        "Fruit, tofu, salad",
      ],
    },
  },
};


export default function BMIPage() {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState("Male");
  const [dietType, setDietType] = useState("Vegetarian");
  const [bmi, setBMI] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [showDiet, setShowDiet] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bmiVal = calculateBMI(weight, height);
    setBMI(bmiVal);
    const stat = getStatus(bmiVal);
    setStatus(stat);
    setShowDiet(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-6 md:p-10 space-y-8 shadow-2xl rounded-2xl border-2 border-green-200">
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl md:text-6xl">🧑‍⚕️</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-green-700 mb-2 tracking-tight">BMI & Diet Planner</h1>
          <p className="text-gray-600 text-center text-base md:text-lg">Get your BMI and a personalized 7-day diet plan for men and women.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-green-700">Age</label>
              <select value={age} onChange={e => setAge(Number(e.target.value))} className="w-full p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400">
                {ages.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-green-700">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400">
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-green-700">Diet Type</label>
              <select value={dietType} onChange={e => setDietType(e.target.value)} className="w-full p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400">
                {dietTypes.map(dt => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-green-700">Weight (kg)</label>
              <Input type="number" min={30} max={200} value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-green-700">Height (cm)</label>
              <Input type="number" min={100} max={220} value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg font-bold py-3 rounded-xl shadow-lg transition-all">Calculate BMI & Suggest Diet</Button>
        </form>
        {showDiet && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
              <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md px-6 py-4 border-2 border-green-300">
                <span className="text-2xl font-bold text-green-700">Your BMI</span>
                <span className="text-3xl font-extrabold text-green-700 mt-1">{bmi?.toFixed(1)}</span>
              </div>
              <div className={`flex flex-col items-center justify-center bg-white rounded-xl shadow-md px-6 py-4 border-2 ${status === 'Obese' ? 'border-red-400' : status === 'Healthy' ? 'border-green-400' : 'border-yellow-400'}`}>
                <span className="text-2xl font-bold">Status</span>
                <span className={`text-2xl font-bold mt-1 ${status === 'Obese' ? 'text-red-600' : status === 'Healthy' ? 'text-green-600' : 'text-yellow-600'}`}>{status}</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">7-Day Diet Plan ({gender}, {dietType})</h2>
            <ul className="space-y-3 text-left mx-auto max-w-md">
              {diets[gender][status][dietType].map((day, i) => (
                <li key={i} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow p-4 border-l-4 border-green-400 font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-green-500 font-bold">Day {i+1}:</span> <span>{day}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
