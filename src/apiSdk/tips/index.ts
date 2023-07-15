import axios from 'axios';
import queryString from 'query-string';
import { TipInterface, TipGetQueryInterface } from 'interfaces/tip';
import { GetQueryInterface } from '../../interfaces';

export const getTips = async (query?: TipGetQueryInterface) => {
  const response = await axios.get(`/api/tips${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTip = async (tip: TipInterface) => {
  const response = await axios.post('/api/tips', tip);
  return response.data;
};

export const updateTipById = async (id: string, tip: TipInterface) => {
  const response = await axios.put(`/api/tips/${id}`, tip);
  return response.data;
};

export const getTipById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tips/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTipById = async (id: string) => {
  const response = await axios.delete(`/api/tips/${id}`);
  return response.data;
};
