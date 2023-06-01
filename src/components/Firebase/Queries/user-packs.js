import axios from 'axios';

export const getUserAvailablePacks = async (userId) => {
  return await axios
    .post('/api/firebase/updated-user-packs?user=' + userId)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: 500,
        data: null,
        error,
        message: 'Error while getting updated user-packs',
      };
    });
};
