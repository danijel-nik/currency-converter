import axios from 'axios';

const { REACT_APP_API_HOST, REACT_APP_API_KEY } = process.env;
const headers = {
    "x-rapidapi-host": REACT_APP_API_HOST,
    "x-rapidapi-key": REACT_APP_API_KEY
}

class Data {

    getData(lang) {
        let langLink = `/assets/lang/${lang}.json`;
        return axios.get(langLink);
    }

    getCurrencyList() {
        const currenciesLink = `https://${REACT_APP_API_HOST}/currency/list`;
        return axios(currenciesLink, {
            params: {
                format: "json"
            },
            headers,
            timeout: 1500
        });
    }

    convertCurrency(amount, from, to, date, historical) {

        let link = (historical) ? `https://${REACT_APP_API_HOST}/currency/historical/${date}` : `https://${REACT_APP_API_HOST}/currency/convert`;

        return axios.get(link, {
            params: {
                format: "json",
                from: from,
                to: to,
                amount: amount
            },
            headers
        });
    }
}

export default new Data();