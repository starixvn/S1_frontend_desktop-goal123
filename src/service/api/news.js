import { newsRequest } from "./base";

export const api_news_GetNews = ({ langId, PageNumber, PageSize }) =>
	newsRequest.post(`/GetNews/${langId}`, {
		PageNumber,
		PageSize
	});

export const api_news_GetNewsById = ({ langId, NewsId }) =>
	newsRequest.post(`/GetNewsById/${langId}`, {
		NewsId
	});
