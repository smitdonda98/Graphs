"use client"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useEffect, useRef } from "react";

const chartData = {
    dates: [
        "Jan 28",
        "Jan 29",
        "Jan 30",
        "Jan 31",
        "Feb 01",
        "Feb 02",
        "Feb 03",
        "Feb 04",
        "Feb 05",
        "Feb 06",
        "Feb 07",
        "Feb 08",
        "Feb 09",
        "Feb 10",
    ],
    acos: [22, 10, 20, 10, 20, 12, 18, 12, 18, 14, 16, 15, 15, 15],
    tacos: [25, 12, 25, 15, 25, 15, 22, 18, 20, 18, 20, 18, 20, 20],
    roas: [2.2, 1, 2, 1, 2, 1.2, 1.8, 1.2, 1.8, 1.4, 1.6, 1.5, 1.5, 1.5],
    impressions: [
        48000, 8000, 48000, 8000, 40000, 12000, 32000, 12000, 32000, 16000, 24000,
        16000, 24000, 16000,
    ],
};
const Graphspages = () => {
    const chartRef = useRef(null);
    const [view, setView] = useState("Daily");

    const options = {
        title: {
            text: "Charts",
        },
        xAxis: {
            categories: chartData.dates,
            title: {
                text: null,
            },
        },
        yAxis: [
            {
                title: {
                    text: "ACOS / TACOS / ROAS",
                },
                labels: {
                    format: "{value}%",
                },
                max: 25,
            },
            {
                title: {
                    text: "Impressions",
                },
                opposite: true,
                max: 64000,
            },
        ],
        tooltip: {
            shared: true,
        },
        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
        },
        series: [
            {
                name: "ACOS",
                data: chartData.acos,
                yAxis: 0,
                color: "#1E90FF",
                marker: {
                    enabled: true,
                },
            },
            {
                name: "TACOS",
                data: chartData.tacos,
                yAxis: 0,
                color: "#00008B",
                marker: {
                    enabled: true,
                },
            },
            {
                name: "ROAS",
                data: chartData.roas,
                yAxis: 0,
                color: "#00CED1",
                marker: {
                    enabled: true,
                },
            },
            {
                name: "Impressions",
                data: chartData.impressions,
                yAxis: 1,
                color: "#000000",
                marker: {
                    enabled: true,
                },
            },
        ],
    };
    return (
        <>
            <div>
                <div style={{ marginBottom: "10px" }}>
                    <select value={view} onChange={(e) => setView(e.target.value)}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                    </select>
                </div>
                <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
            </div>
        </>
    )
}

export default Graphspages