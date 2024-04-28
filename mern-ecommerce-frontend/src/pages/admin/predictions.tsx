import { Box, Button, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
// import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";
import '../../styles/admin-styles/_predictions.scss';
// import { useStatsQuery } from "../../redux/api/dashboardAPI";
// import { RootState } from "@reduxjs/toolkit/query";

import AdminSidebar from "../../components/admin/AdminSidebar";
import { RevenueResponse } from "../../types/types";

type ExpensesByCategory = {
  salaries: string;
  supplies: string;
  services: string;
}
type Month = {
  month: string;
  revenue: string;
  expenses: string;
  nonOperationalExpenses: string;
  operationalExpenses: string;
}
type Day = {
  date: string;
  revenue: string;
  expenses: string;
}

const Predictions = () => {
  const kpiData : (RevenueResponse) = 
    {
      _id: "63bf8239f03239e002001612",
      totalProfit: "212000.00",
      totalRevenue: "283000.00",
      totalExpenses: "71000.00",
      monthlyData: [
        {
          month: "january",
          revenue: "15989.64",
        },
        {
          month: "february",
          revenue: "15832.77",
        },
        {
          month: "march",
          revenue: "16481.27",
        },
        {
          month: "april",
          revenue: "18229.38",
        },
        {
          month: "may",
          revenue: "17401.79",
        },
        {
          month: "june",
          revenue: "18274.03",
        },
        {
          month: "july",
          revenue: "19349.98",
        },
        {
          month: "august",
          revenue: "16647.29",
        },
        {
          month: "september",
          revenue: "19344.07",
        },
        {
          month: "october",
          revenue: "21160.22",
        },
        {
          month: "november",
          revenue: "22655.03",
        },
        {
          month: "december",
          revenue: "17757.75",        },
      ]
  };
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);

  const formattedData = useMemo(() => {
    if (!kpiData) return [];

    const monthData = kpiData.monthlyData || [{}];
    console.log(monthData);


    const formatted: Array<DataPoint> = monthData.map(
      ( { revenue }, i: number) => {
        return [i, Number(revenue)];
      }
    );    

    const regressionLine = regression.linear(formatted);

    return monthData.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        "Actual Revenue": Number(revenue),
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [kpiData]);
  
  {
    // Extract actual revenue values and predicted revenue values
    const actualRevenue = formattedData.map(dataPoint => dataPoint["Actual Revenue"]);
    const predictedRevenue = formattedData.map(dataPoint => dataPoint["Predicted Revenue"]);
  
    // Calculate Mean Absolute Error (MAE)
    const mae = actualRevenue.reduce((sum, actual, index) => sum + Math.abs(actual - predictedRevenue[index]), 0) / actualRevenue.length;
  
    console.log("actual:", actualRevenue);
    console.log("predicted:", predictedRevenue);
    console.log("Mean Absolute Error (MAE):", mae);    
  }


  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="predictions">
        <Box
            borderRadius="1rem"
            boxShadow="0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .8)"
            width="100%" 
            height="100%" 
            p="1rem" 
            overflow="hidden"
            borderColor={"#2d2d34"}
          >
            <Box
              display="flex"
              m="1rem 2.5rem" 
              gap="1rem"
              className="hello2"
            >
              <Box>
                <Typography variant="h3">Revenue and Predictions</Typography>
                <Typography variant="h6">
                  charted revenue and predicted revenue based on a simple linear
                  regression model
                </Typography>
              </Box>
              <Button
                onClick={() => setIsPredictions(!isPredictions)}
                sx={{
                  color: palette.grey[900],
                  backgroundColor: palette.grey[700],
                  boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
                }}
              >
                Show Predicted Revenue for Next Year
              </Button>
            </Box>

            <ResponsiveContainer width="100%" height="100%" >
              <LineChart
                data={formattedData}
                margin={{
                  top: -15,
                  right: 75,
                  left: 20,
                  bottom: 80,
                }}
                style={{height:"80%"}}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
                <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
                  <Label value="Month" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis
                  domain={[12000, 26000]}
                  axisLine={{ strokeWidth: "0" }}
                  style={{ fontSize: "10px" }}
                  tickFormatter={(v) => `$${v}`}
                >
                  <Label
                    value="Revenue in USD"
                    angle={-90}
                    offset={-5}
                    position="insideLeft"
                  />
                </YAxis>
                <Tooltip />
                <Legend verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey="Actual Revenue"
                  stroke={palette.primary.main}
                  strokeWidth={0}
                  dot={{ strokeWidth: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Regression Line"
                  stroke="#8884d8"
                  dot={false}
                />
                {isPredictions && (
                  <Line
                    strokeDasharray="5 5"
                    dataKey="Predicted Revenue"
                    stroke="#f2b455"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
        </Box>
      </div>
    </div>
  ) 
};

export default Predictions;


