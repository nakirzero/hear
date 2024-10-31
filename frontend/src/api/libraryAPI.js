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

export const highlight = async (startPoint, endPoint, userSeq, bookSeq, test) => {
  try {
    const response = await axios.post("/api/highlight", {startPoint,endPoint, userSeq, bookSeq, test})
    console.log(response, "응답하라 ");
    
  }catch (error){
    console.error("Error fetching highlight:", error);
    throw error;
  }
}
