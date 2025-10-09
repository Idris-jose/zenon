"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



export default function DoughnutChart({accounts}: DoughnutChartProps) {
    
    const data = {
        datasets: [
            {
                label: 'Banks',
                data: [1250,2500,3750],
              backgroundColor: [
  '#B64800', 
  '#E86E00', 
  '#FFA733', 
],

            }
        ],
        labels: ['Bank 1','Bank 2','Bank 3']
    }
    return <Doughnut 
    options={{
        cutout: '70%',
         plugins: {
            legend: {
                display: false
            }
         }
        
    }}
    data={data} />
}