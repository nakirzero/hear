import axios from 'axios';

export const checkUserId = async (userid) => {
    try {
        console.log('userid', userid);
        
        const response = await axios.post('/api/check-userid', { userid });
        return response.data.exists;
    } catch (error) {
        console.error('Error checking User ID:', error);
        throw error;
    }
};
