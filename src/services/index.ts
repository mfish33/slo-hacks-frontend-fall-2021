import { DependencyInjector, InjectionToken, makeInjector } from "@mindspace-io/react";
import { HttpService } from "./http.service";
import { StockService } from "./stock.service";

const LOCAL_STORAGE = new InjectionToken<Storage>('local-storage')
const FETCH = new InjectionToken<typeof fetch>('fetch')

export const injector:DependencyInjector = makeInjector([
    { provide: LOCAL_STORAGE, useValue:window.localStorage },
    { provide: FETCH, useFactory:() => window.fetch.bind(window) },
    { provide: HttpService, useClass: HttpService, deps:[FETCH] },
    { provide: StockService, useClass: StockService, deps:[HttpService] }
])

export { HttpService, StockService }
