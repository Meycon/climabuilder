import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

export const formatDate = (date: number): string => {
  return moment(moment.unix(date)).format('DD [de] MMMM');
};
