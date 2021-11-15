import { config } from "../App.config";
import { HttpService } from "./http.service";
import mockData from '../constants/sample.json'
import { StockData } from "../models/StockData";

export class StockService {
    constructor(
        private httpService:HttpService
    ){}

    private stockCache:{[ticker:string]:{[timeFrame:string]:StockData}} = {}

    async getTickerData(ticker:string, timeFrame: string): Promise<StockData> {
        if(this.stockCache[ticker]) {
            return this.stockCache[ticker][timeFrame]
        }

        if(timeFrame == '1D') {
            const res = await this.httpService.fetch(
                `${config.remoteUrl}/one`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({ticker})
                }
            )
            this.throwIfNot200(res)

            // Kick off all request
            this.httpService.fetch(
                `${config.remoteUrl}/all`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({ticker})
                }
            ).then(res => res.json())
            .then(data => this.stockCache[ticker] = data)

            return res.json()
        }
        
        // Default
        await new Promise(resolve => setTimeout(resolve, 200))

        return this.getTickerData(ticker, timeFrame)

    }
   
    private throwIfNot200(res:Response) {
        if(res.status != 200 && res.status != 201) {
            throw res.statusText
        }
    }
}
