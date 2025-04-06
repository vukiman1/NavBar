import httpRequest from "../utils/httpRequest";

const companyService = {
    getAllCompany: async () => {
        const url = "info/admin/getAllCompany";
        return httpRequest.get(url);
    },

    updateCompany: async (data) => {
        const url = `info/admin/update-company`;
        return httpRequest.post(url, data);
    },

    deleteCompany: async (id) => {
        const url = `info/admin/company/${id}`;
        return httpRequest.delete(url);
    },
    returnCompany: async (id) => {
        const url = `info/admin/company/${id}`;
        return httpRequest.patch(url);
    },

    getCompanyDetails(id) {
        const url = `info/admin/company/${id}`
        return httpRequest.get(url);
    }
};

export default companyService;
