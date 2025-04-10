"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useRef, useEffect } from "react";
import { FaExpandAlt, FaDownload } from "react-icons/fa";
import { Sparklines, SparklinesCurve } from "react-sparklines";
import * as XLSX from "xlsx";

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
    const [toggle, setToggle] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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
            text: "",
        },
        xAxis: {
            categories: currentData.dates,
            title: {
                text: null,
            },
        },
        yAxis: [
            { title: { text: "ACOS" }, labels: { format: "{value}%" }, min: 0, max: 100, visible: visibleSeries.acos },
            { title: { text: "TACOS" }, labels: { format: "{value}%" }, min: 0, max: 100, visible: visibleSeries.tacos, opposite: true },
            { title: { text: "ROAS" }, labels: { format: "{value}" }, min: 0, max: 5, visible: visibleSeries.roas },
            { title: { text: "Impressions" }, min: 0, max: view === "Daily" ? 60000 : 300000, visible: visibleSeries.impressions, opposite: true },
            { title: { text: "Spend ($)" }, min: 0, max: view === "Daily" ? 3000 : 15000, visible: visibleSeries.spend },
            { title: { text: "Clicked" }, min: 0, max: view === "Daily" ? 1500 : 7500, visible: visibleSeries.clicked, opposite: true },
            { title: { text: "Avg CPC ($)" }, labels: { format: "{value}" }, min: 0, max: 10, visible: visibleSeries.avgCpc },
            { title: { text: "Convo Rate (%)" }, labels: { format: "{value}%" }, min: 0, max: 100, visible: visibleSeries.convoRate, opposite: true },
            { title: { text: "Conversions" }, min: 0, max: view === "Daily" ? 100 : 500, visible: visibleSeries.conversation },
            { title: { text: "CTR (%)" }, labels: { format: "{value}%" }, min: 0, max: 100, visible: visibleSeries.ctr, opposite: true },
            { title: { text: "Total Units" }, min: 0, max: view === "Daily" ? 150 : 750, visible: visibleSeries.totalUnits },
            { title: { text: "Total Revenue ($)" }, min: 0, max: view === "Daily" ? 6000 : 30000, visible: visibleSeries.totalRevenue, opposite: true },
        ],
        tooltip: {
            shared: true,
            outside: true,
            style: {
                zIndex: 9999,
            },
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

    // Function to export data to Excel
    const exportToExcel = () => {
        const seriesMetadata = [
            { name: "Date", key: "dates" },
            { name: "ACOS", key: "acos" },
            { name: "TACOS", key: "tacos" },
            { name: "ROAS", key: "roas" },
            { name: "Impressions", key: "impressions" },
            { name: "Spend", key: "spend" },
            { name: "Clicked", key: "clicked" },
            { name: "Avg CPC", key: "avgCpc" },
            { name: "Convo Rate", key: "convoRate" },
            { name: "Conversions", key: "conversation" },
            { name: "CTR", key: "ctr" },
            { name: "Total Units", key: "totalUnits" },
            { name: "Total Revenue", key: "totalRevenue" },
        ];

        const excelData = [];
        const headers = seriesMetadata.map((series) => series.name);
        excelData.push(headers);

        const rowCount = currentData.dates.length;
        for (let i = 0; i < rowCount; i++) {
            const row = seriesMetadata.map((series) => currentData[series.key][i]);
            excelData.push(row);
        }

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, view);
        XLSX.writeFile(wb, `${view}_Chart_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current.chart;

            // Update xAxis categories and series data
            chart.xAxis[0].update({ categories: currentData.dates });

            // Update series data
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

            // Update yAxis visibility
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
                    tooltip: {
                        shared: true,
                        outside: true,
                        style: {
                            zIndex: 9999,
                        },
                    },
                    xAxis: {
                        labels: {
                            useHTML: true,
                            overflow: "allow",
                            formatter: function () {
                                const notifications = 2; // Example condition for showing notifications
                                const index = currentData.dates.indexOf(this.value);
                                const tooltipData = index !== -1 ? currentData.spend[index] : "N/A"; // Example data
                                const exampleLink = `https://example.com/date=${encodeURIComponent(this.value)}`; // Example clickable link

                                return `
                                    <div style="position: relative; display: inline-block; text-align: center;">
                                        ${toggle
                                        ? `
                                            <div class="notification-wrapper" style="
                                                position: absolute;
                                                top: -40px;
                                                left: 50%;
                                                transform: translateX(-50%);
                                                display: inline-block;
                                                padding-bottom: 20px;
                                                z-index: 10;">
                                                <span class="notification-circle" style="
                                                    background-color: #4573d2;
                                                    color: white;
                                                    font-size: 12px;
                                                    font-weight: bold;
                                                    border-radius: 100%;
                                                    padding: 3px 7px;
                                                    cursor: pointer;
                                                    display: inline-block;
                                                    position: relative;
                                                    z-index: 11;">
                                                    ${notifications}
                                                </span>
                                                <span class="notification-tooltip" style="
                                                    position: absolute;
                                                    top: -40px;
                                                    left: 50%;
                                                    transform: translateX(-10%);
                                                    background-color: #333;
                                                    color: white;
                                                    font-size: 12px;
                                                    padding: 2px 10px;
                                                    border-radius: 4px;
                                                    white-space: nowrap;
                                                    display: none;
                                                    z-index: 12;">
                                                    <br/>
                                                    <a href="${exampleLink}" target="_blank" style="
                                                        color: #1e90ff;
                                                        text-decoration: underline;
                                                        cursor: pointer;">
                                                        View Details
                                                    </a>
                                                </span>
                                            </div>`
                                        : ""}
                                        ${this.value}
                                    </div>
                                    <style>
                                        .notification-wrapper:hover .notification-tooltip {
                                            display: block !important;
                                        }
                                        .notification-wrapper {
                                            min-width: 20px;
                                            min-height: 60px;
                                        }
                                        .notification-circle:after {
                                            content: '';
                                            position: absolute;
                                            top: -50px;
                                            left: 50%;
                                            transform: translateX(-50%);
                                            width: 100px;
                                            height: 60px;
                                            z-index: 10;
                                        }
                                    </style>
                                `;
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
    }, [currentData, visibleSeries, showDataLabels, isExpanded, toggle]);

    const DataTable = () => {
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

        const toggleSeries = (key) => {
            setVisibleSeries((prev) => ({
                ...prev,
                [key]: !prev[key],
            }));
        };

        return (
            <div style={{ marginTop: "20px" }}>
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
                            whiteSpace: "nowrap"
                        }}>
                            <thead>
                                <tr>
                                    <th style={{ position: "sticky", left: 0, backgroundColor: "#fff", zIndex: 10, padding: "8px", textAlign: "left", fontWeight: "bold", fontSize: "14px", color: "#333", borderRight: "1px solid #ddd" }}>
                                        METRICS
                                    </th>
                                    {currentData.dates.map((date) => (
                                        <th key={date} style={{ padding: "8px", textAlign: "right", fontWeight: "normal", fontSize: "12px", color: "#666", borderBottom: "1px solid #ddd" }}>
                                            {date}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {seriesMetadata.map((series) => {
                                    if (!visibleSeries[series.key]) return null;
                                    return (
                                        <tr key={series.name}>
                                            <td style={{ position: "sticky", left: 0, backgroundColor: "#fff", zIndex: 9, padding: "8px", fontSize: "12px", color: "#333", borderBottom: "1px solid #f0f0f0", borderRight: "1px solid #ddd" }}>
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
                                                <td key={index} style={{ padding: "8px", textAlign: "right", fontSize: "12px", color: "#333", borderBottom: "1px solid #f0f0f0" }}>
                                                    {series.format(value)}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                    {seriesMetadata.map((series) => (
                        <div key={series.key} onClick={() => toggleSeries(series.key)} style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "relative", paddingBottom: "4px" }}>
                            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: series.color, marginRight: "5px" }} />
                            <span style={{ fontSize: "12px", color: visibleSeries[series.key] ? "#000" : "#666", fontWeight: visibleSeries[series.key] ? "bold" : "normal" }}>
                                {series.name}
                            </span>
                            {visibleSeries[series.key] && (
                                <div style={{ position: "absolute", bottom: "0", left: "0", width: "100%", height: "2px", backgroundColor: series.color }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div style={{ marginBottom: "10px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "10px 35px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Charts</p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <p onClick={() => setShowTable(!showTable)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ padding: "5px 10px", color: "#1a73e8", border: "none", borderRadius: "4px", cursor: "pointer", display: "inline-block", textDecoration: isHovered ? "underline" : "none", textUnderlineOffset: "3px", margin: 0, fontSize: "14px", fontWeight: 500, transition: "text-decoration 0.2s ease" }}>
                        {showTable ? "Show Chart" : "View as table"}
                    </p>
                    <select value={view} onChange={(e) => setView(e.target.value)} style={{ padding: "5px 20px 5px 10px", fontSize: "14px", color: "#333", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff", cursor: "pointer", appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 5px center", backgroundSize: "16px" }}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                    </select>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial, sans-serif" }}>
                        <button onClick={() => setShowDataLabels(!showDataLabels)} style={{ position: "relative", width: "50px", height: "26px", borderRadius: "13px", border: "1px solid #ccc", backgroundColor: showDataLabels ? "#868a8d" : "#fff", cursor: "pointer", padding: "0", outline: "none", transition: "all 0.3s ease", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}>
                            <div style={{ position: "absolute", top: "3px", left: showDataLabels ? "calc(100% - 23px)" : "3px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: showDataLabels ? "#fff" : "#ccc", transition: "all 0.3s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#333", minWidth: "30px", textAlign: "center" }}>
                            Data Labels
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial, sans-serif" }}>
                        <button onClick={() => setToggle(prev => !prev)} style={{ position: "relative", width: "50px", height: "26px", borderRadius: "13px", border: "1px solid #ccc", backgroundColor: toggle ? "#868a8d" : "#fff", cursor: "pointer", padding: "0", outline: "none", transition: "all 0.3s ease", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}>
                            <div style={{ position: "absolute", top: "3px", left: toggle ? "calc(100% - 23px)" : "3px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: toggle ? "#fff" : "#ccc", transition: "all 0.3s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#333", minWidth: "30px", textAlign: "center" }}>
                            View Changes
                        </span>
                        <button onClick={() => setIsExpanded(!isExpanded)} style={{ padding: "5px", backgroundColor: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title={isExpanded ? "Shrink Chart" : "Expand Chart"}>
                            <FaExpandAlt size={16} />
                        </button>
                        <button onClick={exportToExcel} style={{ padding: "5px", backgroundColor: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Download as Excel">
                            <FaDownload size={16} />
                        </button>
                    </div>
                </div>
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