const axios = require('axios');

// Hàm Utils này có nhiệm vụ giao tiếp với Service khác
// Khi cần gọi đến Service nào thì thay URL của service đấy.
module.exports.PublishServiceEvent = async (payload, service) => {
    const config = {
        withCredentials: true,
    };

    try {
        return await axios.post(`${service}/service-events/`, payload, config);
    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};
