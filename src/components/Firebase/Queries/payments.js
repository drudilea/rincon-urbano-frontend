import axios from 'axios';

export const postManualPayment = async (body) => {
  return await axios
    .post('/api/mp/procesar-pago-mock', body)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: 500,
        data: null,
        error,
        message: 'Error while creating payment',
      };
    });
};
