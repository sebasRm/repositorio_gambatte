import axios from 'axios';

const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(process.env.APY_KEY_GOOGLE_2);


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
        } catch (e) {
            console.log('Error getDataGoogleService', e);
            return reject(e)
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
        } catch (e) {
            console.log('Error getDataGoogleFilterActiveService', e);
            return reject(e)
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