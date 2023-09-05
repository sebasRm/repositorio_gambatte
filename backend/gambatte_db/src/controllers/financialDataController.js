const SerpApi = require('google-search-results-nodejs');
const { getDataGoogle } = require('../services/googleServices');
const { response } = require('../helpers/utils');
const search = new SerpApi.GoogleSearch("641cf5882802f085a54bd1af6eb5a2620333ca32c6765150296c5270846e63fb");

async function getFinancialActive(req, res) {
    try {
        let dataGoogleFinancial = await getDataGoogle(req.query.active)
        console.log(dataGoogleFinancial);
        if (dataGoogleFinancial) {
            let filterData = dataGoogleFinancial?.futures_chain?.map(el => {
                return {
                    stock: el.stock,
                    price: el.price,
                    extracted_price: el.extracted_price,
                    currency: el.currency,
                    percentage: el.price_movement.prcentage,
                    movement: el?.price_movement?.movement
                }
            })
            return response(
                "Activos encontrados",
                200,
                res,
                "ok",
                filterData
            );
        } else {
            return response(
                "Error al listar países",
                400,
                res,
                "false",
                []
            );
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getFinancialActive
};