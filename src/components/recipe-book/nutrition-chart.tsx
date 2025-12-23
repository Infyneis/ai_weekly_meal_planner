"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface NutritionInfo {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
}

interface NutritionChartProps {
  nutrition: NutritionInfo;
}

const MACRO_COLORS = {
  protein: "oklch(0.65 0.18 50)",   // Terracotta - chart-1
  carbs: "oklch(0.75 0.12 80)",     // Golden wheat - chart-3
  fat: "oklch(0.68 0.14 25)",       // Tomato red - chart-4
  fiber: "oklch(0.70 0.15 140)",    // Sage green - chart-2
};

export function NutritionChart({ nutrition }: NutritionChartProps) {
  const { calories, protein, carbs, fat, fiber, sugar } = nutrition;

  // Calculate macro percentages for pie chart
  const macros = [
    { name: "Protein", value: protein || 0, color: MACRO_COLORS.protein },
    { name: "Carbs", value: carbs || 0, color: MACRO_COLORS.carbs },
    { name: "Fat", value: fat || 0, color: MACRO_COLORS.fat },
    { name: "Fiber", value: fiber || 0, color: MACRO_COLORS.fiber },
  ].filter((m) => m.value > 0);

  const totalMacros = macros.reduce((sum, m) => sum + m.value, 0);

  // Bar chart data
  const barData = [
    { name: "Protein", value: protein || 0, fill: MACRO_COLORS.protein },
    { name: "Carbs", value: carbs || 0, fill: MACRO_COLORS.carbs },
    { name: "Fat", value: fat || 0, fill: MACRO_COLORS.fat },
    { name: "Fiber", value: fiber || 0, fill: MACRO_COLORS.fiber },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-4">
      {/* Calories Highlight */}
      {calories && (
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-3xl font-bold text-primary">{calories}</div>
          <div className="text-sm text-muted-foreground">Calories per serving</div>
        </div>
      )}

      {/* Macro Overview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        {macros.length > 0 && (
          <div className="aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macros}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {macros.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}g`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Macro Legend */}
        <div className="flex flex-col justify-center space-y-3">
          {protein !== null && protein !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: MACRO_COLORS.protein }}
                />
                <span className="text-sm">Protein</span>
              </div>
              <span className="font-medium">{protein}g</span>
            </div>
          )}
          {carbs !== null && carbs !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: MACRO_COLORS.carbs }}
                />
                <span className="text-sm">Carbs</span>
              </div>
              <span className="font-medium">{carbs}g</span>
            </div>
          )}
          {fat !== null && fat !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: MACRO_COLORS.fat }}
                />
                <span className="text-sm">Fat</span>
              </div>
              <span className="font-medium">{fat}g</span>
            </div>
          )}
          {fiber !== null && fiber !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: MACRO_COLORS.fiber }}
                />
                <span className="text-sm">Fiber</span>
              </div>
              <span className="font-medium">{fiber}g</span>
            </div>
          )}
          {sugar !== null && sugar !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400" />
                <span className="text-sm">Sugar</span>
              </div>
              <span className="font-medium">{sugar}g</span>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      {barData.length > 0 && (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={60}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}g`, ""]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Compact version for meal cards
export function NutritionBadges({ nutrition }: NutritionChartProps) {
  const { calories, protein, carbs, fat } = nutrition;

  return (
    <div className="flex flex-wrap gap-1 text-xs">
      {calories && (
        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          {calories} kcal
        </span>
      )}
      {protein && (
        <span className="px-2 py-0.5 bg-chart-1/10 text-chart-1 rounded-full">
          P: {protein}g
        </span>
      )}
      {carbs && (
        <span className="px-2 py-0.5 bg-chart-3/10 text-chart-3 rounded-full">
          C: {carbs}g
        </span>
      )}
      {fat && (
        <span className="px-2 py-0.5 bg-chart-4/10 text-chart-4 rounded-full">
          F: {fat}g
        </span>
      )}
    </div>
  );
}
