import axios from 'axios';

const api = axios.create({
  baseURL: `https://us1.locationiq.com/v1/reverse.php?&format=json`,
  params: {
    key: 'pk.1d98fdf0bae49272dc3fd76c683af6c5',
  },
});

export default api;
