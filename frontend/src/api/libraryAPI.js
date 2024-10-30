import axios from 'axios';

export const fetchLibrary = async () => {
  try {
    const response = await axios.get("/api/library");
    return response.data;
  } catch (error) {
    console.error("Error fetching library:", error);
    throw error;
  }
};

export const fetchLibrarySave = async (userSeq, bookSeq, histDiv, time) => {
  try {

    const response = await axios.post("/api/library-save", { userSeq, bookSeq, histDiv, time } );
    console.log(response, "response");
    
   
    return response.data;
  } catch (error) {
    console.error("Error fetching librarySave:", error);
    throw error;
  }
};