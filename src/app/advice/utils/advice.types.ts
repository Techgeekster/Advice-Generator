export interface IAdviceSlipResponse {
  slip: IAdviceSlip;
}

export interface IAdviceSlip {
  id: number;
  advice: string;
  gifUrl?: string;
  gifTitle?: string;
}

export interface IAdviceSearch {
  total_results: number;
  query: string;
  slips: IAdviceSlip[];
}

export type AdviceState = {
  adviceList: IAdviceSlip[];
  isLoading: boolean;
};

export interface IAdviceGiphyResponse {
  data: IAdviceGiphy | IAdviceGiphy[];
}

export interface IAdviceGiphy {
  id: string;
  title: string;
  images: IAdviceGiphyOriginalImage;
}

export interface IAdviceGiphyOriginalImage {
  original: IAdviceGiphyImage;
}

export interface IAdviceGiphyImage {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size: string;
  mp4: string;
  webp_size: string;
  webp: string;
  frames: string;
  hash: string;
}
