import privateApi from "../../config/private";

export const postStatusLogForQuote = async (quoteId, entry) => {
  try {
    const { data } = await privateApi.post(`/quote/${quoteId}/logs`, entry, {
      headers: { "Content-Type": "application/json" },
    });
    return data.data;
  } catch (error) {}
};

export const fetchStatusLogsForQuote = async (quoteId) => {
  try {
    const { data } = await privateApi.get(`/quote/${quoteId}/logs`);
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
