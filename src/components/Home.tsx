import { tickers } from "../constants/tickers"
import { AutoComplete } from "./AutoComplete"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useService } from "../hooks"
import { StockService } from "../services"
import { useEffect, useState } from "react"
import './home.css'
import { StockData } from "../models/StockData"
import sampleData from '../constants/sample.json'
import ClipLoader from "react-spinners/ClipLoader";

export function Home() {
    const [stockData, setStockData] = useState<StockData>(sampleData as any)
    const [ticker, setTicker] = useState('AAPL')
    const [dataRange, setDataRange] = useState('1D')
    const [loading, setLoading] = useState(false)

    const baseHighChartsOptions = {

    }

    const defaultOptions:Highcharts.Options = {
        series: [{
            type: 'line',
            data: [1, 2, 3]
        }],
        ...baseHighChartsOptions
    }

    const [highChartsConfig, setHighChartsConfig] = useState(defaultOptions)
    const [stockService] = useService(StockService)

    useEffect(() => {
        async function getStockData() {
            setLoading(true)
            const data = await stockService.getTickerData(ticker, dataRange)
            setLoading(false)
            console.log(data)
            setStockData(data)
        }
        getStockData()
    }, [ticker, dataRange])


    useEffect(() => {
        const updatedOptions:Highcharts.Options = {
            series: [{
                type: 'line',
                data: stockData.historical,
                name:`Historical ${ticker}`,
                color:'rgba(59, 130, 246, 1)'
            },
            {
                type: 'line',
                data: stockData.historical.map(d => d-5),
                name:`Historical ${ticker}`,
                color:'rgba(239, 68, 68, 1)'
            }],
            title:{
                text:''
            },
            xAxis:{
                visible:false
            },
            legend:{
                enabled:false
            },
            yAxis:{
                title:{
                    text:'',
                    
                },
                labels:{
                    format:'${value:.2f}'
                },
                gridLineColor:'white'
            },
            chart:{
                width:600,
                borderRadius:5,
                borderColor:'black',
                borderWidth:2,
                style:{
                    'z-index': 0
                }
            },
            responsive:{
                rules:[{
                    condition:{
                        maxWidth:600
                    }
                }]
            },
            ...baseHighChartsOptions
        }
        setHighChartsConfig(updatedOptions)
   
    },[stockData])




    return (
        <div className="flex flex-col items- m-auto" style={{width:'100%', maxWidth:600}}>
            <h2 className="text-4xl text-center mb-6">Laplace</h2>
            <div className="w-full">
                <AutoComplete suggestions={tickers} onResult={setTicker} placeholder="Enter Stock Ticker: Ex AAPL"/>
            </div>
            <div className="flex mt-12">
                <div className="graphs relative m-auto">
                    {loading ?
                        <ClipLoader loading={loading} size={150} /> :
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={highChartsConfig}
                        />

                    }
                    
                </div>
            </div>
            <div className="flex mt-2">
                <div className={`graphButton ${dataRange == '1D' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('1D')}>1D</div>
                <div className={`graphButton ${dataRange == '5D' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('5D')}>5D</div>
                <div className={`graphButton ${dataRange == '1M' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('1M')}>1M</div>
                <div className={`graphButton ${dataRange == '3M' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('3M')}>3M</div>
                <div className={`graphButton ${dataRange == '6M' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('6M')}>6M</div>
                <div className={`graphButton ${dataRange == '1Y' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('1Y')}>1Y</div>
                <div className={`graphButton ${dataRange == '5Y' ? 'graphButtonHighlighted' : ''}`} onClick={() => setDataRange('5Y')}>ALL</div>
            </div>
        </div>
    )
}