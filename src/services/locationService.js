import httpRequest from "../utils/httpRequest";

const locationService = {
    getAllLocation: async () => {
        const url = 'common/city';
        return httpRequest.get(url);
    },
    getDistrictsByCityId: async (cityId) => {
        const url = `common/districts?cityId=${cityId}`;
        return httpRequest.get(url);
    }
};

export default locationService;
