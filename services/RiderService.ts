import { Rider } from "@/dtos/Rider.dto";
import { fetchApi } from "@/helpers/utilities";

const API_URL_BASE = `${process.env.NEXT_PUBLIC_API_RIDERSERVICE_BASE}`;

export class RiderService {
  async getRiders(): Promise<Rider[]> {
    try {
      const res = await fetchApi<Rider[]>(API_URL_BASE,{
        method: 'GET'
      });

      return res;
      
    } catch (error) {
      console.error('Error fetching riders:', error);
      throw error;
    }
  }
}