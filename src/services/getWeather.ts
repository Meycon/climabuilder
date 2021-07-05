// eslint-disable-next-line import/no-unresolved
import { Weather } from '~/models';

import api from './api';

export async function getWeather(lat: number, lng: number): Promise<Weather> {
  const res = await api.get(
    `/onecall?lat=${lat}&lon=${lng}&exclude=minutely&&units=metric&appid=866ab997a6ee64d800038532ff765c4d`,
  );

  return res.data;
}
