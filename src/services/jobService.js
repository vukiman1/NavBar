import httpRequest from "../utils/httpRequest";

const jobService = {
    getAllJobPost: async () => {
        const url = "job/web/admin/getAllJobPost";
        return httpRequest.get(url);
    },

    updateJobStatus: async (id, status) => {
        const url = `job/web/admin/job-post/${id}/status`;
        return httpRequest.patch(url, { status });
    },

    deleteJobPost: async (id) => {
        const url = `job/web/admin/job-post/${id}`;
        return httpRequest.delete(url);
    }
};

export default jobService;
