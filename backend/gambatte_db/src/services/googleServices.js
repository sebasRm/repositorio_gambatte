import axios from 'axios';

const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("641cf5882802f085a54bd1af6eb5a2620333ca32c6765150296c5270846e63fb");


const getDataGoogleService = (param) => {
    const params = {
        engine: "google_finance",
        q: `${param}`
    };

    return new Promise((resolve, reject) => {
        try {
            search.json(params, (data) => {
                if (data) {
                    return resolve(data)
                }
            });
        } catch (error) {
            console.log('Error getDataGoogleService', error);
            return reject(error)
        }

    })
}

const getDataGoogleFilterActiveService = (url) => {
    // console.log('url ==============> ', url);
    const params = {
        api_key: process.env.APY_KEY_GOOGLE_1,
    };
    return new Promise(async (resolve, reject) => {
        try {
            let { data } = await axios.get(url, { params })
            return resolve(data)
        } catch (error) {
            console.log('Error getDataGoogleFilterActiveService', error);
            return reject(error)
        }

    })
}
export {
    getDataGoogleService,
    getDataGoogleFilterActiveService
}

{/* <const callback = function (data) {
    console.log(data);
    let { markets } = data
    Object.keys(markets).forEach(el => {
        console.log(markets[el])
    })
    console.log(Object.keys(markets));
};

// Show result as JSON
search.json(params, callback>); */}