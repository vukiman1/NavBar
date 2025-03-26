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
    },

    getAllJobCategories: async () => {
        const url = "common/career";
        return httpRequest.get(url);
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

    getAllJobseekers: async () => {
        const url = "/info/web/resumes-all/?academicLevelId=&careerId=&cityId=&experienceId=&genderId=&jobTypeId=&kw=&maritalStatusId=&page=1&pageSize=10&positionId=&typeOfWorkplaceId=";
        return httpRequest.get(url);
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
