import ky, { KyInstance, Options as KyOptions } from "ky";
// import { cookies } from "next/headers";
import { Logger } from "tslog";
import { ApiResponseType } from "./api-response";

const logger = new Logger({ name: "fetch" });

const api = ky.create({
  prefixUrl: `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}`,
  hooks: {
    beforeRequest: [
      // async (request) => {
      //   const cookieStore = cookies();
      //   request.headers.set("Cookie", cookieStore.toString());
      // },
    ],
  },
});

class FetchService {
  _api: KyInstance;

  constructor() {
    this._api = api;
  }

  cleanUrl(url: string) {
    return url.startsWith("/") ? url.slice(1) : url;
  }

  async call<T>(url: string, options: KyOptions) {
    try {
      const updatedUrl = this.cleanUrl(url);
      const response = await this._api<ApiResponseType<T>>(updatedUrl, {
        ...options,
      });
      const responseData = await response.json();
      const { data } = responseData;
      return data;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export const fetchService = new FetchService();

export default FetchService;
