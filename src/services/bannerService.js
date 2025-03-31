import httpRequest from "../utils/httpRequest";

export const bannerService = {
    getAllBanner: async () => {
        const url = "myjob/admin/banner";
        return httpRequest.get(url);
    },

    uploadBannerFile(file) {
        const url = "myjob/admin/banner/file"
        return httpRequest.post(url, file, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    },

    createBanner(data) {
        const url = "myjob/admin/banner";
        return httpRequest.post(url, data);
    },

    uploadBanner(id, data) {
        const url = `myjob/admin/banner/${id}`;
        return httpRequest.post(url, data);
    },

    updateBanner: (id, data) => {
        return httpRequest.put(`myjob/admin/banner/${id}`, data);
    },
    updateBannerStatus: (id, isActive) => {
        const url = `myjob/web/banner/status/${id}`;
        return httpRequest.post(url, { isActive });
    },
    deleteBanner: (id) => {
        const url = `myjob/admin/banner/${id}`;
        return httpRequest.delete(url);
    }
};
