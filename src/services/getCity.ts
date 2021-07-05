// eslint-disable-next-line import/no-unresolved
import { Address } from '~/models';

import api from './locationReverseApi';

export async function getCity(lat: number, lon: number): Promise<Address> {
  const res = await api.get('', {
    params: {
      lat,
      lon,
    },
  });

  return res.data;
}
