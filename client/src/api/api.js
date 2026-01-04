import { axiosInstance } from "./axiosInstance";
export const evaluateDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    "/file-csv",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};


export const getTableData = async ({ dbLink, tableName }) => {
    try {
        console.log("sending")
        const res = await axiosInstance.post("/tables/postgres", { 
            connectionString:dbLink ,
            tableName:tableName
        });
        console.log(res.data)
        return res.data;
    } catch (error) {
        // Log the error for debugging
        console.error("Database Connection Error:", error.response?.data || error.message);
        // Re-throw so the UI component can show an error message to the user
        throw error;
    }
};



export const apiData = async ({ apiUrl }) => {
    try {
        console.log("sending")

        console.log(apiUrl)
        const res = await axiosInstance.post("/source", { 
            apiUrl:apiUrl
        });
        console.log(res.data)
        return res.data;
    } catch (error) {
        // Log the error for debugging
        console.error("Database Connection Error:", error.response?.data || error.message);
        // Re-throw so the UI component can show an error message to the user
        throw error;
    }
};