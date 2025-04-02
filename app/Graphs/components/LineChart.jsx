"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useRef, useEffect } from "react";
import { FaExpandAlt } from "react-icons/fa";
import { Sparklines, SparklinesCurve, SparklinesLine } from "react-sparklines";

// Function to generate random data within a range
const generateRandomData = (length, min, max) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// Daily data for 14 days (Jan 28 to Feb 10)
const dailyData = {
    dates: [
        "Jan 28", "Jan 29", "Jan 30", "Jan 31", "Feb 01", "Feb 02", "Feb 03",
        "Feb 04", "Feb 05", "Feb 06", "Feb 07", "Feb 08", "Feb 09", "Feb 10",
    ],
    acos: generateRandomData(14, 10, 25),
    tacos: generateRandomData(14, 10, 25),
    roas: generateRandomData(14, 1, 3),
    impressions: generateRandomData(14, 8000, 48000),
    spend: generateRandomData(14, 500, 2000),
    clicked: generateRandomData(14, 200, 1000),
    avgCpc: generateRandomData(14, 1, 5),
    convoRate: generateRandomData(14, 1, 10),
    conversation: generateRandomData(14, 10, 50),
    ctr: generateRandomData(14, 1, 5),
    totalUnits: generateRandomData(14, 20, 100),
    totalRevenue: generateRandomData(14, 1000, 5000),
};

// Function to aggregate daily data into weekly data
const aggregateToWeekly = (dailyData) => {
    const weeklyData = {
        dates: ["Week 1 (Jan 28 - Feb 03)", "Week 2 (Feb 04 - Feb 10)"],
        acos: [],
        tacos: [],
        roas: [],
        impressions: [],
        spend: [],
        clicked: [],
        avgCpc: [],
        convoRate: [],
        conversation: [],
        ctr: [],
        totalUnits: [],
        totalRevenue: [],
    };

    for (let week = 0; week < 2; week++) {
        const start = week * 7;
        const end = (week + 1) * 7;

        const acosSlice = dailyData.acos.slice(start, end);
        const tacosSlice = dailyData.tacos.slice(start, end);
        const roasSlice = dailyData.roas.slice(start, end);
        const impressionsSlice = dailyData.impressions.slice(start, end);
        const spendSlice = dailyData.spend.slice(start, end);
        const clickedSlice = dailyData.clicked.slice(start, end);
        const avgCpcSlice = dailyData.avgCpc.slice(start, end);
        const convoRateSlice = dailyData.convoRate.slice(start, end);
        const conversationSlice = dailyData.conversation.slice(start, end);
        const ctrSlice = dailyData.ctr.slice(start, end);
        const totalUnitsSlice = dailyData.totalUnits.slice(start, end);
        const totalRevenueSlice = dailyData.totalRevenue.slice(start, end);

        weeklyData.acos.push(acosSlice.reduce((sum, val) => sum + val, 0) / acosSlice.length);
        weeklyData.tacos.push(tacosSlice.reduce((sum, val) => sum + val, 0) / tacosSlice.length);
        weeklyData.roas.push(roasSlice.reduce((sum, val) => sum + val, 0) / roasSlice.length);
        weeklyData.impressions.push(impressionsSlice.reduce((sum, val) => sum + val, 0));
        weeklyData.spend.push(spendSlice.reduce((sum, val) => sum + val, 0));
        weeklyData.clicked.push(clickedSlice.reduce((sum, val) => sum + val, 0));
        weeklyData.avgCpc.push(avgCpcSlice.reduce((sum, val) => sum + val, 0) / avgCpcSlice.length);
        weeklyData.convoRate.push(convoRateSlice.reduce((sum, val) => sum + val, 0) / convoRateSlice.length);
        weeklyData.conversation.push(conversationSlice.reduce((sum, val) => sum + val, 0));
        weeklyData.ctr.push(ctrSlice.reduce((sum, val) => sum + val, 0) / ctrSlice.length);
        weeklyData.totalUnits.push(totalUnitsSlice.reduce((sum, val) => sum + val, 0));
        weeklyData.totalRevenue.push(totalRevenueSlice.reduce((sum, val) => sum + val, 0));
    }

    return weeklyData;
};

// Generate weekly data
const weeklyData = aggregateToWeekly(dailyData);

const LineChart = () => {
    const chartRef = useRef(null);
    const [view, setView] = useState("Daily");
    const [showDataLabels, setShowDataLabels] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [visibleSeries, setVisibleSeries] = useState({
        acos: true,
        tacos: true,
        roas: true,
        impressions: true,
        spend: false,
        clicked: false,
        avgCpc: false,
        convoRate: false,
        conversation: false,
        ctr: false,
        totalUnits: false,
        totalRevenue: true,
    });

    // Select data based on the view
    const currentData = view === "Daily" ? dailyData : weeklyData;

    const options = {
        chart: {
            height: isExpanded ? 800 : 500,
            width: null,
        },
        title: {
            text: "Charts",
        },
        xAxis: {
            categories: currentData.dates,
            title: {
                text: null,
            },
        },
        yAxis: [
            { title: { text: "ACOS" }, labels: { format: "{value}%" }, min: 0, max: 30, visible: visibleSeries.acos },
            { title: { text: "TACOS" }, labels: { format: "{value}%" }, min: 0, max: 30, visible: visibleSeries.tacos, opposite: true },
            { title: { text: "ROAS" }, labels: { format: "{value}" }, min: 0, max: 5, visible: visibleSeries.roas },
            { title: { text: "Impressions" }, min: 0, max: view === "Daily" ? 60000 : 300000, visible: visibleSeries.impressions, opposite: true },
            { title: { text: "Spend ($)" }, min: 0, max: view === "Daily" ? 3000 : 15000, visible: visibleSeries.spend },
            { title: { text: "Clicked" }, min: 0, max: view === "Daily" ? 1500 : 7500, visible: visibleSeries.clicked, opposite: true },
            { title: { text: "Avg CPC ($)" }, labels: { format: "{value}" }, min: 0, max: 10, visible: visibleSeries.avgCpc },
            { title: { text: "Convo Rate (%)" }, labels: { format: "{value}%" }, min: 0, max: 15, visible: visibleSeries.convoRate, opposite: true },
            { title: { text: "Conversions" }, min: 0, max: view === "Daily" ? 100 : 500, visible: visibleSeries.conversation },
            { title: { text: "CTR (%)" }, labels: { format: "{value}%" }, min: 0, max: 10, visible: visibleSeries.ctr, opposite: true },
            { title: { text: "Total Units" }, min: 0, max: view === "Daily" ? 150 : 750, visible: visibleSeries.totalUnits },
            { title: { text: "Total Revenue ($)" }, min: 0, max: view === "Daily" ? 6000 : 30000, visible: visibleSeries.totalRevenue, opposite: true },
        ],
        tooltip: {
            shared: true,
        },
        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                fontSize: "12px",
            },
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 3000,
                    easing: "easeOutBounce",
                },
                dataLabels: {
                    enabled: showDataLabels,
                    format: "{y}",
                    style: {
                        fontSize: "12px",
                        fontWeight: "normal",
                        color: "#333",
                    },
                    y: -10,
                },
                events: {
                    legendItemClick: function () {
                        const seriesNameMap = {
                            "acos": "acos",
                            "tacos": "tacos",
                            "roas": "roas",
                            "impressions": "impressions",
                            "spend": "spend",
                            "clicked": "clicked",
                            "avgcpc": "avgCpc",
                            "convorate": "convoRate",
                            "conversions": "conversation",
                            "ctr": "ctr",
                            "totalunits": "totalUnits",
                            "totalrevenue": "totalRevenue",
                        };
                        const transformedName = this.name.toLowerCase().replace(/\s+/g, '');
                        const stateKey = seriesNameMap[transformedName];
                        if (stateKey) {
                            setVisibleSeries((prev) => ({
                                ...prev,
                                [stateKey]: !prev[stateKey],
                            }));
                        }
                    },
                },
            },
        },
        series: [
            { name: "ACOS", type: "spline", data: currentData.acos, yAxis: 0, color: "#1E90FF", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.acos },
            { name: "TACOS", type: "spline", data: currentData.tacos, yAxis: 1, color: "#00008B", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.tacos },
            { name: "ROAS", type: "spline", data: currentData.roas, yAxis: 2, color: "#00CED1", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.roas },
            { name: "Impressions", type: "spline", data: currentData.impressions, yAxis: 3, color: "#000000", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.impressions },
            { name: "Spend", type: "spline", data: currentData.spend, yAxis: 4, color: "#FF4500", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.spend },
            { name: "Clicked", type: "spline", data: currentData.clicked, yAxis: 5, color: "#32CD32", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.clicked },
            { name: "Avg CPC", type: "spline", data: currentData.avgCpc, yAxis: 6, color: "#FFD700", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.avgCpc },
            { name: "Convo Rate", type: "spline", data: currentData.convoRate, yAxis: 7, color: "#FF69B4", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.convoRate },
            { name: "Conversions", type: "spline", data: currentData.conversation, yAxis: 8, color: "#8A2BE2", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.conversation },
            { name: "CTR", type: "spline", data: currentData.ctr, yAxis: 9, color: "#20B2AA", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.ctr },
            { name: "Total Units", type: "spline", data: currentData.totalUnits, yAxis: 10, color: "#FFA500", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.totalUnits },
            { name: "Total Revenue", type: "spline", data: currentData.totalRevenue, yAxis: 11, color: "#DC143C", lineWidth: 2, marker: { enabled: true, symbol: "circle", radius: 4 }, visible: visibleSeries.totalRevenue },
        ],
    };

    // Update the chart when view, showDataLabels, visibleSeries, or isExpanded changes
    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current.chart;

            chart.xAxis[0].update({ categories: currentData.dates });
            chart.series[0].update({ data: currentData.acos, visible: visibleSeries.acos }, false);
            chart.series[1].update({ data: currentData.tacos, visible: visibleSeries.tacos }, false);
            chart.series[2].update({ data: currentData.roas, visible: visibleSeries.roas }, false);
            chart.series[3].update({ data: currentData.impressions, visible: visibleSeries.impressions }, false);
            chart.series[4].update({ data: currentData.spend, visible: visibleSeries.spend }, false);
            chart.series[5].update({ data: currentData.clicked, visible: visibleSeries.clicked }, false);
            chart.series[6].update({ data: currentData.avgCpc, visible: visibleSeries.avgCpc }, false);
            chart.series[7].update({ data: currentData.convoRate, visible: visibleSeries.convoRate }, false);
            chart.series[8].update({ data: currentData.conversation, visible: visibleSeries.conversation }, false);
            chart.series[9].update({ data: currentData.ctr, visible: visibleSeries.ctr }, false);
            chart.series[10].update({ data: currentData.totalUnits, visible: visibleSeries.totalUnits }, false);
            chart.series[11].update({ data: currentData.totalRevenue, visible: visibleSeries.totalRevenue }, false);

            chart.yAxis[0].update({ visible: visibleSeries.acos }, false);
            chart.yAxis[1].update({ visible: visibleSeries.tacos }, false);
            chart.yAxis[2].update({ visible: visibleSeries.roas }, false);
            chart.yAxis[3].update({ visible: visibleSeries.impressions }, false);
            chart.yAxis[4].update({ visible: visibleSeries.spend }, false);
            chart.yAxis[5].update({ visible: visibleSeries.clicked }, false);
            chart.yAxis[6].update({ visible: visibleSeries.avgCpc }, false);
            chart.yAxis[7].update({ visible: visibleSeries.convoRate }, false);
            chart.yAxis[8].update({ visible: visibleSeries.conversation }, false);
            chart.yAxis[9].update({ visible: visibleSeries.ctr }, false);
            chart.yAxis[10].update({ visible: visibleSeries.totalUnits }, false);
            chart.yAxis[11].update({ visible: visibleSeries.totalRevenue }, false);

            chart.update(
                {
                    chart: {
                        height: isExpanded ? 800 : 500,
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: showDataLabels,
                            },
                        },
                    },
                },
                true,
                true,
                {
                    duration: 1000,
                    easing: "easeOutBounce",
                }
            );
        }
    }, [view, showDataLabels, visibleSeries, isExpanded]);

    const DataTable = () => {
        // Define series metadata for the table and legend
        const seriesMetadata = [
            { name: "Spend", key: "spend", color: "#FF4500", format: (val) => `$${val}` },
            { name: "Conversions", key: "conversation", color: "#8A2BE2", format: (val) => val },
            { name: "ROAS", key: "roas", color: "#00CED1", format: (val) => val.toFixed(2) },
            { name: "ACOS", key: "acos", color: "#1E90FF", format: (val) => `${val.toFixed(2)}%` },
            { name: "Impressions", key: "impressions", color: "#000000", format: (val) => val },
            { name: "Clicks", key: "clicked", color: "#32CD32", format: (val) => val },
            { name: "CTR", key: "ctr", color: "#20B2AA", format: (val) => `${val.toFixed(2)}%` },
            { name: "AVG CPC", key: "avgCpc", color: "#FFD700", format: (val) => `$${val.toFixed(2)}` },
            { name: "Conv Rate", key: "convoRate", color: "#FF69B4", format: (val) => `${val.toFixed(2)}%` },
            { name: "Total ACOS (TACOS)", key: "tacos", color: "#00008B", format: (val) => `${val.toFixed(2)}%` },
            { name: "Total Units", key: "totalUnits", color: "#FFA500", format: (val) => val },
            { name: "Total Revenue", key: "totalRevenue", color: "#DC143C", format: (val) => `$${val}` },
        ];

        // Function to handle toggling series visibility
        const toggleSeries = (key) => {
            setVisibleSeries((prev) => ({
                ...prev,
                [key]: !prev[key],
            }));
        };

        return (
            <div style={{ marginTop: "20px" }}>
                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <div style={{
                        width: "100%",
                        overflowX: "auto",
                        position: "relative"
                    }}>
                        <table style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            minWidth: "600px",
                            fontFamily: "Arial, sans-serif",
                            whiteSpace: "nowrap" // Prevents text wrapping
                        }}>
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            position: "sticky",
                                            left: 0,
                                            backgroundColor: "#fff",
                                            zIndex: 10,
                                            padding: "8px",
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                            color: "#333",
                                            borderRight: "1px solid #ddd"
                                        }}
                                    >
                                        METRICS
                                    </th>
                                    {currentData.dates.map((date) => (
                                        <th
                                            key={date}
                                            style={{
                                                padding: "8px",
                                                textAlign: "right",
                                                fontWeight: "normal",
                                                fontSize: "12px",
                                                color: "#666",
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {date}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {seriesMetadata.map((series) => {
                                    if (!visibleSeries[series.key]) return null; // Skip if series is not visible
                                    return (
                                        <tr key={series.name}>
                                            <td
                                                style={{
                                                    position: "sticky",
                                                    left: 0,
                                                    backgroundColor: "#fff",
                                                    zIndex: 9,
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                    color: "#333",
                                                    borderBottom: "1px solid #f0f0f0",
                                                    borderRight: "1px solid #ddd"
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                                                    <span>{series.name}</span>
                                                    <div style={{ width: "150px", height: "30px" }}>
                                                        <Sparklines data={currentData[series.key]} width={150} height={30}>
                                                            <SparklinesCurve color={series.color} style={{ strokeWidth: 1 }} />
                                                        </Sparklines>
                                                    </div>
                                                </div>
                                            </td>
                                            {currentData[series.key].map((value, index) => (
                                                <td
                                                    key={index}
                                                    style={{
                                                        padding: "8px",
                                                        textAlign: "right",
                                                        fontSize: "12px",
                                                        color: "#333",
                                                        borderBottom: "1px solid #f0f0f0",
                                                    }}
                                                >
                                                    {series.format(value)}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Legend for toggling rows (at the bottom) */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "15px",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                    {seriesMetadata.map((series) => (
                        <div
                            key={series.key}
                            onClick={() => toggleSeries(series.key)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                position: "relative",
                                paddingBottom: "4px",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: series.color,
                                    marginRight: "5px",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: visibleSeries[series.key] ? "#000" : "#666",
                                    fontWeight: visibleSeries[series.key] ? "bold" : "normal",
                                }}
                            >
                                {series.name}
                            </span>
                            {visibleSeries[series.key] && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "0",
                                        left: "0",
                                        width: "100%",
                                        height: "2px",
                                        backgroundColor: series.color,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div style={{ marginBottom: "10px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <select value={view} onChange={(e) => setView(e.target.value)}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                </select>
                <button
                    onClick={() => setShowDataLabels(!showDataLabels)}
                    style={{
                        padding: "5px 10px",
                        backgroundColor: showDataLabels ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {showDataLabels ? "Hide Data Labels" : "Show Data Labels"}
                </button>
                <button
                    onClick={() => setShowTable(!showTable)}
                    style={{
                        padding: "5px 10px",
                        backgroundColor: showTable ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {showTable ? "Show Chart" : "View in Table"}
                </button>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        padding: "5px",
                        backgroundColor: isExpanded ? "#ccc" : "#ff5722",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    title={isExpanded ? "Shrink Chart" : "Expand Chart"}
                >
                    <FaExpandAlt size={20} />
                </button>
            </div>
            {showTable ? (
                <DataTable />
            ) : (
                <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
            )}
        </div>
    );
};

export default LineChart;