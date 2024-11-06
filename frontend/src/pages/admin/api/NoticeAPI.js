import axios from 'axios';

export const fetchNoticeWrite = async (postData) => {
    console.log("postData",postData);
    
  try {
    const response = await axios.post('/api/admin/noticeWrite', postData);
    console.log("response",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishbook data:', error);
    throw error;
  }
};
