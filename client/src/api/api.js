import { nodeInstance, aiInstance } from "./axiosInstance";

const fetchAIAnalysis = async (metadata) => {
  try {
    const aiRes = await aiInstance.post("/analyze-dqs", metadata);
    return { ...metadata, ...aiRes.data };
  } catch (error) {
    console.error("AI Analysis failed, returning metadata only", error);
    return metadata;
  }
};

export const evaluateDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const metaRes = await nodeInstance.post(
    "/csv",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return await fetchAIAnalysis(metaRes.data);
};


export const getTableData = async ({ dbLink, tableName }) => {
    try {
        const res = await nodeInstance.post("/db/postgres", { 
            connectionString:dbLink ,
            tableName:tableName
        });
        return await fetchAIAnalysis(res.data);
    } catch (error) {
        console.error("Postgres Connection Error:", error.response?.data || error.message);
        throw error;
    }
};


export const getMongoData = async ({ dbLink, dbName, collectionName }) => {
    try {
        const res = await nodeInstance.post("/db/mongo", { 
            uri: dbLink,
            dbName: dbName,
            collectionName: collectionName
        });
        return await fetchAIAnalysis(res.data);
    } catch (error) {
        console.error("Mongo Connection Error:", error.response?.data || error.message);
        throw error;
    }
};


export const apiData = async ({ apiUrl }) => {
    try {
        const res = await nodeInstance.post("/source", { 
            apiUrl:apiUrl
        });
        return await fetchAIAnalysis(res.data);
    } catch (error) {
        console.error("API Connection Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Standard chat with the Auditor.
 */
export const chatWithAI = async ({ auditContext, messages, userInput }) => {
    try {
        const res = await aiInstance.post("/chat", {
            audit_context: auditContext,
            messages: messages,
            user_input: userInput
        });
        return res.data;
    } catch (error) {
        console.error("Chat Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Streaming chat with the Auditor. 
 * Uses fetch directly since axios doesn't support streams well out-of-the-box.
 */
export const chatWithAIStream = async ({ auditContext, messages, userInput, onChunk }) => {
    const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:8000";
    const response = await fetch(`${AI_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            audit_context: auditContext,
            messages: messages,
            user_input: userInput
        })
    });

    if (!response.ok) throw new Error("Stream request failed");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") return;
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) onChunk(parsed.content);
                } catch (e) {
                    console.error("Error parsing stream chunk", e);
                }
            }
        }
    }
};

/**
 * Exports the remediation report as Markdown.
 */
export const exportReport = async (analysis) => {
    try {
        const res = await aiInstance.post("/export-report", analysis);
        return res.data.markdown;
    } catch (error) {
        console.error("Export Error:", error.response?.data || error.message);
        throw error;
    }
};