export class HttpService {
    constructor(
        private globalFetch: typeof window.fetch
    ){}

    async fetch(input: string, init?: RequestInit | undefined):Promise<Response> {
        return this.globalFetch(input, init)
    }
    
}