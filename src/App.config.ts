interface AppConfig {
    remoteUrl:string
}

const dev:AppConfig = {
    remoteUrl:'http://127.0.0.1:5000'
}

const prod:AppConfig = {
    remoteUrl:''
}

// @ts-ignore
export const config = process.env.NODE_ENV === 'development' ? dev : prod; 