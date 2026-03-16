import { Lobby } from './../../../shared/model/Lobby';

export default function useLobbiesList() {
  return useFetch<Lobby[]>('/lobby/list', {
    baseURL: 'http://localhost:4000',
  });
}
