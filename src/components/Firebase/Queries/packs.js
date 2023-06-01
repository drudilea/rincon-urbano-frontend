import axios from 'axios';
axios.defaults.baseURL = process.env.API_URL;

export const getAllActivePacks = async () => {
  return await axios
    .post('/api/pack/get-active-preferences')
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return { status: 500, data: null, error };
    });
};
