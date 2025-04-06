import httpRequest from "../utils/httpRequest";

const jobService = {
    getAllJobPost: async () => {
        const url = "job/web/admin/getAllJobPost";
        return httpRequest.get(url);
    },

    updateJobStatus: async (id, status) => {
        const url = `job/web/admin/job-posts/status/${id}/${status}`;
        return httpRequest.patch(url);
    },

    deleteJobPost: async (id) => {
        const url = `job/web/admin/job-post/${id}`;
        return httpRequest.delete(url);
    },

    getJobDetail: async (id) => {
        const url = `job/web/admin/job-posts/detail/${id}`;
        return httpRequest.get(url);
    },

    getAllJobCategories: async () => {
        const url = "common/career";
        return httpRequest.get(url);
    },

    uploadCareerFile(file) {
        const url = "common/career/file"
        return httpRequest.post(url, file, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    },

    updateJobPost(id,data) {
        const url = `admin-job/update/${id}`;
        return httpRequest.patch(url, data);
    },

    createJobCategory: async (data) => {
        const url = "common/career";
        return httpRequest.post(url, data);
    },

    updateJobCategory: async (id, data) => {
        const url = `common/career/${id}`;
        return httpRequest.patch(url, data);
    },

    deleteJobCategory: async (id) => {
        const url = `common/career/${id}`;
        return httpRequest.delete(url);
    },

    getAllJobseekers: async (params = {}) => {
        const url = "/info/web/resumes-all/";
        return httpRequest.get(url, { params: params });
    },

    updateJobseekerStatus: async (id, status) => {
        const url = `job/web/admin/jobseekers/${id}/status`;
        return httpRequest.patch(url, { status });
    },

    deleteJobseeker: async (id) => {
        const url = `job/web/admin/jobseekers/${id}`;
        return httpRequest.delete(url);
    },
};

export default jobService;
