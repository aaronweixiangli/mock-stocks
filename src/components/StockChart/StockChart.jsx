import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';

export default function StockChart( { stockData } ) {
    const [chartData, setChartData] = useState(null);
    const [hoveredValue, setHoveredValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);
    
    useEffect(function() {
        if (stockData) {
            setChartData({
                labels: stockData.values.slice().reverse().map((value) => value.datetime),
                datasets: [{
                    label: 'Stock Price',
                    data: stockData.values.slice().reverse().map((value) => value.open),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'white',
                    pointHoverBorderWidth: 1,
                    pointHoverBorderColor: 'black',
                    pointRadius: 0,
                    pointHitRadius: 0
                }]
            });
            setCurrentValue(stockData.values[0].open);
        }
    }, [stockData]);

    const canvasRef = useRef(null);

    useEffect(() => {
        if (!chartData) return;
        const ctx = canvasRef.current.getContext('2d');

        Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

        const verticalLiner = {
            id: 'verticalLiner',
            afterInit: (chart, args, opts) => {
              chart.verticalLiner = {}
            },
            afterEvent: (chart, args, options) => {
                const {inChartArea} = args
                chart.verticalLiner = {draw: inChartArea}
            },
            beforeTooltipDraw: (chart, args, options) => {
                const {draw} = chart.verticalLiner
                if (!draw) return
        
                const {ctx} = chart
                const {top, bottom} = chart.chartArea
                const {tooltip} = args
                const x = tooltip?.caretX
                if (!x) return
        
                ctx.save();
                ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, top);
                ctx.lineTo(x, bottom);
                ctx.stroke();
                
                ctx.restore();
            }
        }

        const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                onHover: function(evt, chartElement) {
                    // if hovering over a data point
                    if (chartElement.length > 0) {
                        // get index of the data point that corresponds to the hovered element
                        const index = chartElement[0].index;
                        // get the value of the data point at this index
                        const value = chartData.datasets[0].data[index];
                        setHoveredValue(value);
                    } else {
                        setHoveredValue(stockData.values[0].open);
                    }
                },
                plugins: {
                    tooltip: {
                        xAlign: 'left',
                        caretPadding: 15,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: 10,
                        borderColor: 'rgba(255,255,255,0.5)',
                        borderWidth: 1,
                        zIndex: 20
                    },
                    verticalLiner: {}
                },
                scales: {
                    x: {
                        ticks: {
                            display: false
                        }
                    }
                }
            },
            plugins: [verticalLiner]
        });

        // cleanup function
        return () => {
            chart.destroy();
        };
    }, [chartData]);

    return (
        <>
            { 
                chartData ?
                <div id="chart-container">
                    {hoveredValue ? <p>${hoveredValue}</p> : <p>${currentValue}</p>}
                    <canvas id="stock-chart" ref={canvasRef} onMouseLeave={()=>setHoveredValue(null)}/>
                </div>
                :
                <p> Chart is still loading. Try refreshing the page. </p>
            }
        </>
    )
}

