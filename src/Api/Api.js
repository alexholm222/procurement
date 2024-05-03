import axios from 'axios'

export const baseUrl = process.env.REACT_APP_API_URL;


const instanceWithToken = axios.create({
    withCredentials: false,
    baseURL: baseUrl
})

const token = document.getElementById('root_purchases').getAttribute('token');

instanceWithToken.interceptors.request.use(config => {
    config.headers.Authorization = token
    return config
});

export const getPurchases = () => {
    return instanceWithToken.get(`${baseUrl}api/purchases/list?perPage=${50}`);
}

export const getPurchasesCursor = (cursorNext) => {
    return instanceWithToken.get(`${cursorNext}&perPage=${30}`);
}

export const getPurchase = (id) => {
    return instanceWithToken.get(`${baseUrl}api/purchases/detail/${id}`);
}

export const getVendors = () => {
    return instanceWithToken.get(`${baseUrl}api/purchases/stock/vendors`);
}

export const getPayersList = () => {
    return instanceWithToken.get(`${baseUrl}api/purchases/stock/settings/payers`);
}

export const getCategories = () => {
    return instanceWithToken.get(`${baseUrl}api/purchases/stock/settings/categories`);
}

export const savePurchase = (data) => {
    return instanceWithToken({
        method: 'post',
        mode: "cors",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        url: `${baseUrl}api/purchases/save`,
        data: data
    })
}