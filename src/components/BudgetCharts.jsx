// src/components/BudgetCharts.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = {
  budget: ['#3b82f6', '#059669', '#f59e0b', '#8b5cf6', '#ec4899'],
  spending: {
    gradient: ['#3b82f6', '#818cf8']
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-600">
          Amount: {payload[0].value}€
        </p>
      </div>
    );
  }
  return null;
};

// export const BudgetPieChart = ({ data }) => {
//   return (
//     <div className="h-52">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             outerRadius={60}
//             fill="#8884d8"
//             dataKey="amount"
//             label={({ name, value }) => `${name}: ${value}€`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS.budget[index % COLORS.budget.length]} />
//             ))}
//           </Pie>
//           <Tooltip content={<CustomTooltip />} />
//           <Legend verticalAlign="bottom" height={36} />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

export const SpendingBarChart = ({ data }) => {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.spending.gradient[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.spending.gradient[1]} stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="spent" 
            fill="url(#colorSpent)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};