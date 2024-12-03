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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 0, right: 15, left: 0, bottom: 0 }}>
        <XAxis 
          dataKey="name" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
        />
        <Bar
          dataKey="amount"
          fill="#818cf8"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="spent"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'transparent' }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}