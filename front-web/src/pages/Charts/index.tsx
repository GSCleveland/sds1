import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters';
import './styles.css';
import Chart from 'react-apexcharts';
import { barOptions, pieOptions } from './chart-options';
import axios from 'axios';
import { buildBarSeries, getPlatformChartData, getGenderChartData } from './helpers';

type PieChartData = {
    labels: string[];
    series: number[];
}

type BarChartData = {
    x: string;
    y: number;
}
const initialPieData = {
    labels: [],
    series: []
}

const BASE_URL = 'https://sds1-cleveland.herokuapp.com';

const Charts = () => {
    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [platformData, setPlatformData] = useState<PieChartData>(initialPieData);
    const [genderData, setGenderData] = useState<PieChartData>(initialPieData);

    useEffect(() => {
        async function getData() {
            const recordsResponse = await axios.get(`${BASE_URL}/records`);
            const gameResponse = await axios.get(`${BASE_URL}/games`);

            const barData = buildBarSeries(gameResponse.data, recordsResponse.data.content);
            console.log(barData)
            setBarChartData(barData);

            const platformChartData = getPlatformChartData(recordsResponse.data.content);
            console.log(platformChartData)
            setPlatformData(platformChartData);
            const genderChartData = getGenderChartData(recordsResponse.data.content);
            console.log(platformChartData)
            setGenderData(genderChartData);
        }
        getData();
    },
        [])

    return (
        <div className="page-container">
            <Filters link="/records" linkText="VER TABELA" />
            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">
                        Jogos mais votados
                    </h1>
                    <div className="games-container">
                        < Chart
                            options={barOptions}
                            type="bar"
                            width="980"
                            height="650"
                            series={[{ data: barChartData }]}
                        />
                    </div>
                </div>
                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title">Plataformas</h2>
                        <Chart
                            options={{ ...pieOptions, labels: platformData.labels }}
                            type="donut"
                            width="350"
                            series={platformData?.series}
                        />
                    </div>
                    <div className="gender-chart">
                        <h2 className="chart-title">Gêneros</h2>
                        <Chart
                            options={{ ...pieOptions, labels: genderData.labels }}
                            type="donut"
                            width="350"
                            series={genderData?.series}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Charts;