import React, { useState } from "react";
import {
  Button,
  Modal,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIButton = ({ symptoms, diagnosis, prescription }) => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAiAnalysis = async () => {
    // Prepare the prompt for the API
    const prompt = `
Hi! Welcome to Byte Doctor :)
Here's the analysis based on the symptoms and preliminary diagnosis you provided:

1. I’ll list the most likely conditions and my confidence in each.
2. I’ll evaluate how accurate the doctor’s diagnosis might be.
3. I’ll evaluate the medications the doctor prescribed and give my thoughts and provide quick recommendations for the next steps if needed.

Your Details:
- Symptoms: ${symptoms}
- Preliminary Diagnosis: ${diagnosis}
- Prescribed Medication: ${prescription}

Please keep the analysis concise and easy to understand, no more than 10 lines and address the patient directly as "you".
`;

    setLoading(true);
    setAiModalOpen(true);

    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(
        "AIzaSyBcWacgQfyANGLMbEAXf21g2uxGkW12ON8"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Send the prompt to the API
      const result = await model.generateContent(prompt);
      setAiAnalysis(result.response.text()); // Update the modal with the API response
    } catch (error) {
      console.error("Error during AI analysis:", error);
      setAiAnalysis("An error occurred while processing the analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAiAnalysis}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontSize: "0.9rem",
        }}
      >
        Analyze with AI
      </Button>
      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "400px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <Typography
            id="ai-modal-title"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            AI Analysis
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography id="ai-modal-description">{aiAnalysis}</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAiModalOpen(false)}
            sx={{ mt: 3, borderRadius: "20px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AIButton;
