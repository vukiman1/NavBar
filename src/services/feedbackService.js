import httpRequest from "../utils/httpRequest";

const feedbackService = {
    getAllFeedback: async () => {
        const url = "myjob/web/all-feedbacks";
        return httpRequest.get(url);
    },

    updateFeedbackStatus: async (id, isActive) => {
        const url = `myjob/web/feedbacks/status/${id}`;
        return httpRequest.post(url, { isActive });
    },

    updateFeedback: async (id, data) => {
        const url = `myjob/web/feedbacks/update/${id}`;
        return httpRequest.post(url, data);
    },
};

export default feedbackService;
