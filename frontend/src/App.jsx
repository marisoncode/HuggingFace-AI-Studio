import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinancialSentiment from './pages/FinancialSentiment';
import TextSummarization from './pages/TextSummarization';
import NamedEntityRecognition from './pages/NamedEntityRecognition';
import QuestionAnswering from './pages/QuestionAnswering';
import Translation from './pages/Translation';
import ImageClassification from './pages/ImageClassification';
import ImageCaptioning from './pages/ImageCaptioning';
import SpeechToText from './pages/SpeechToText';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sentiment" element={<FinancialSentiment />} />
        <Route path="/summarization" element={<TextSummarization />} />
        <Route path="/ner" element={<NamedEntityRecognition />} />
        <Route path="/qa" element={<QuestionAnswering />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/image-classification" element={<ImageClassification />} />
        <Route path="/image-captioning" element={<ImageCaptioning />} />
        <Route path="/speech-to-text" element={<SpeechToText />} />
      </Routes>
    </Layout>
  );
}
