import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DollarSign, ShoppingCart, MapPin, Star } from "lucide-react";
import {
  useBranchesPerformanceQuery,
  useBranchesQuery,
  useBranchStatisticsQuery,
  useMonthlyRevenuQuery,
  useSummaryQuery,
  useTotalSellingItemsQuery,
} from "../store/apiSlice/apiSlice";
import { OwnerDashboardSkeleton } from "../components/skeleton/OwnerDashboardSkeleton";
import { useState } from "react";

const performanceChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--secondary))",
  },
  avgRating: {
    label: "Avg. Rating",
    color: "hsl(var(--destructive))",
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 text-sm bg-background border rounded-lg shadow-lg">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between">
            <div className="flex items-center">
              <span
                className="w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: p.color }}
              ></span>
              <span>{performanceChartConfig[p.dataKey].label}:</span>
            </div>
            <span className="font-medium ml-4">
              {p.dataKey === "avgRating" ? (
                <span className="flex items-center">
                  {p.value}
                  <Star className="w-4 h-4 ml-1.5 fill-yellow-500 text-yellow-500" />
                </span>
              ) : (
                p.value.toLocaleString()
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [selectedValue, setSelectedValue] = useState("all");
  const { data: summary, isLoading } = useSummaryQuery();
  const { data: monthlyRevenue } = useMonthlyRevenuQuery();
  const { data: branchesPerformance } = useBranchesPerformanceQuery();
  const { data: branchesResponse } = useBranchesQuery();
  const { data: totalSellingItems } = useTotalSellingItemsQuery();
  const { data: branchStatistics, isLoading: branchStatisticsIsLoading } =
    useBranchStatisticsQuery(selectedValue, {
      skip: selectedValue === "all",
    });

  const loading =
    selectedValue === "all" ? isLoading : branchStatisticsIsLoading;

  const branchStatisticsInfo = {
    name: branchStatistics?.branch_name,
    totalOrders: branchStatistics?.total_orders,
    totalRevenue: branchStatistics?.total_revenue,
    avreageRating: branchStatistics?.average_rating,
    monthlyStatus: branchStatistics?.monthly_stats,
    packagesStatus: branchStatistics?.packageStats,
  };

  const transformedSummaryData = {
    branches: 1,
    totalRevenu: branchStatisticsInfo.totalRevenue,
    totalOrders: branchStatisticsInfo.totalOrders,
    avarageRating: branchStatisticsInfo.avreageRating,
  };

  const transformedBranchPerformanceData = {
    branch: branchStatisticsInfo.name,
    revenue: branchStatisticsInfo.totalRevenue,
    orders: branchStatisticsInfo.totalOrders,
    avgRating: branchStatisticsInfo.avreageRating,
  };

  const transformedMonthlyRevenueData = {};
  for (const month in branchStatisticsInfo.monthlyStatus) {
    if (!transformedMonthlyRevenueData[month]) {
      transformedMonthlyRevenueData[month] = { month: month };
    }
    transformedMonthlyRevenueData[month][branchStatisticsInfo.name] =
      branchStatisticsInfo.monthlyStatus[month];
  }
  Object.values(transformedMonthlyRevenueData);

  const transformedTopSellingItemsData =
    branchStatisticsInfo.packagesStatus?.map((item, inx) => {
      return {
        items: {
          id: inx + 1,
          name: item.name,
          orders: item.total_orders,
          revenue: item.total_revenue,
        },
      };
    });
  const transformedallItems = transformedTopSellingItemsData?.flatMap(
    (branch) => branch.items
  );

  const branchesNames = branchesResponse?.branches.map((branch) => {
    return {
      id: branch.id,
      name: branch.name,
    };
  });
  const summaryData = {
    branches: summary?.branches_count,
    totalRevenu: summary?.total_revenue,
    totalOrders: summary?.total_orders,
    avarageRating: summary?.average_rating,
  };

  const { avarageRating, branches, totalOrders, totalRevenu } =
    selectedValue !== "all" ? transformedSummaryData : summaryData;

  const branchPerformanceData = branchesPerformance?.branches.map((branch) => {
    return {
      branch: branch.branch_name,
      revenue: branch.total_revenue,
      orders: branch.total_orders,
      avgRating: branch.average_rating,
    };
  });

  const monthlyRevenuConfig = {};

  const monthlyRevenueData = {};

  branchesNames?.forEach((branch) => {
    monthlyRevenuConfig[branch.name] = {
      label: branch.name,
      color: "hsl(var(--primary))",
    };
  });

  monthlyRevenue?.branches.forEach((branch) => {
    const branchName = branch.branch_name;
    const revenues = branch.monthly_revenue;

    for (const month in revenues) {
      if (!monthlyRevenueData[month]) {
        monthlyRevenueData[month] = { month: month };
      }
      monthlyRevenueData[month][branchName] = revenues[month];
    }

    return Object.values(monthlyRevenueData);
  });

  const topSellingItemsData = totalSellingItems?.statistics.map((item) => {
    return {
      items: item.package_stats.map((pkg, inx) => {
        return {
          id: inx + 1,
          name: pkg.name,
          orders: pkg.total_orders,
          revenue: pkg.total_revenue,
        };
      }),
    };
  });

  const allItems = topSellingItemsData?.flatMap((branch) => branch.items);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-(--primaryFont)">
            {selectedValue === "all"
              ? "Chain Owner Dashboard"
              : branchStatisticsInfo.name}
          </h1>
          <div className="flex gap-2">
            <Select
              defaultValue="all"
              value={selectedValue}
              onValueChange={setSelectedValue}
            >
              <SelectTrigger className="w-full md:w-[220px] text-(--secondaryFont)">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branchesNames?.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <OwnerDashboardSkeleton />
        ) : (
          <>
            {/* Main KPI cards */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-(--primaryFont)">
                    Total Chain Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-(--secondaryFont)" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-(--primaryFont)">
                    {totalRevenu}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-(--primaryFont)">
                    Total Chain Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-(--secondaryFont)" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-(--primaryFont)">
                    {totalOrders}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-(--primaryFont)">
                    Active Branches
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-(--secondaryFont)" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-(--primaryFont)">
                    {branches}
                  </div>
                  <p className="text-xs text-(--secondaryFont)">
                    Currently operating branches
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-(--primaryFont)">
                    Average Customer Satisfaction
                  </CardTitle>
                  <Star className="h-4 w-4 text-(--secondaryFont)" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-(--primaryFont)">
                    {avarageRating}
                  </div>
                  <p className="text-xs text-(--secondaryFont)">
                    Across all branches
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {/* Branch performance comparison chart */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Branch Performance Comparison</CardTitle>
                  <CardDescription>
                    Comparing revenue, orders, and average rating between
                    branches.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={performanceChartConfig}
                    className="aspect-auto h-[300px] w-full"
                  >
                    <BarChart
                      data={
                        selectedValue === "all"
                          ? [branchPerformanceData]
                          : [transformedBranchPerformanceData]
                      }
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="branch"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis yAxisId="left" hide />
                      <YAxis yAxisId="right" orientation="right" hide />
                      <YAxis
                        yAxisId="rating"
                        orientation="right"
                        domain={[0, 5]}
                        hide
                      />

                      {/* Use the custom tooltip component */}
                      <Tooltip cursor={false} content={<CustomTooltip />} />

                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="var(--color-primary)"
                        radius={4}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="var(--color-secondary)"
                        radius={4}
                      />
                      <Line
                        yAxisId="rating"
                        type="monotone"
                        dataKey="avgRating"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "var(--color-destructive)",
                          stroke: "var(--color-background)",
                          strokeWidth: 2,
                        }}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Monthly revenue growth chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-(--primaryFont)">
                    Monthly Revenue Growth
                  </CardTitle>
                  <CardDescription className="text-(--secondaryFont)">
                    Track the revenue growth of each branch individually.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={monthlyRevenuConfig}
                    className="aspect-auto h-[300px] w-full"
                  >
                    <LineChart
                      data={
                        selectedValue === "all"
                          ? [monthlyRevenueData]
                          : [transformedMonthlyRevenueData]
                      }
                      margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "var(--color-primaryFont)" }}
                      />
                      <YAxis
                        stroke="var(--color-primary)"
                        tick={{ fill: "var(--color-primaryFont)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      {selectedValue === "all" ? (
                        branchesNames?.map((branch) => (
                          <Line
                            type="monotone"
                            dataKey={`${branch.name}`}
                            stroke="var(--color-primary)"
                            strokeWidth={2}
                            dot={false}
                          />
                        ))
                      ) : (
                        <Line
                          type="monotone"
                          dataKey={`${branchStatisticsInfo.name}`}
                          stroke="var(--color-primary)"
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top-selling items table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-(--primaryFont)">
                  Top Selling Items Analysis{" "}
                  {selectedValue === "all"
                    ? "All branches"
                    : branchStatisticsInfo.name}
                </CardTitle>
                <CardDescription className="text-(--secondaryFont)">
                  You can change the branch from the filter above to see
                  different data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-(--primaryFont)">
                        Item
                      </TableHead>
                      <TableHead className="text-center text-(--primaryFont)">
                        Number of Orders
                      </TableHead>
                      <TableHead className="text-right text-(--primaryFont)">
                        Revenue
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedValue === "all"
                      ? allItems
                      : transformedallItems?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium text-(--primaryFont)">
                              {item.name}
                            </TableCell>
                            <TableCell className="text-center text-(--secondaryFont)">
                              {item.orders}
                            </TableCell>
                            <TableCell className="text-right text-(--secondaryFont)">
                              SAR {item.revenue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
