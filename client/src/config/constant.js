import axioss from 'axios';
// const ApiLink =" https://api-oneup.herokuapp.com/api/";

const ApiLink = "http://localhost:8800/api/";

const axios = axioss.create({
    baseURL: ApiLink,
    timeout: 15 * 1000,
})

export { ApiLink, axios };