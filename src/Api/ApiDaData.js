import axios from 'axios'

const daDataWithToken = axios.create({
    withCredentials: false,
    baseURL: `https://suggestions.dadata.ru/`
})

const tokenDaData = '036431f74bdd1f7b7dd0e5f6dd1b1cd819296ed8';

daDataWithToken.interceptors.request.use(config => {
    config.headers.Authorization = `Token ${tokenDaData}`
    return config
});

export const daData = (data) => {
    return daDataWithToken({
        method: 'post',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        url: `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party`,
        data: JSON.stringify({ query: data, count: 10 })
    })
}
