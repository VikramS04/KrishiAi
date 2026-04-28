import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is Krishi AI and how does it help farmers?",
    answer:
      "Krishi AI is an AI-powered platform that assists farmers with soil analysis, crop disease detection, weather forecasting, and access to a farming community. It helps improve productivity and make informed decisions.",
  },
  {
    question: "Is Krishi AI free to use, or does it require a subscription?",
    answer:
      "Krishi AI offers core features for free. Some premium features may require a subscription, but basic tools like disease detection and weather updates are available to all users.",
  },
  {
    question: "How does the soil analysis feature work?",
    answer:
      "You can upload images of your soil or input details manually. Krishi AI analyzes the data using AI models to assess fertility and nutrient levels.",
  },
  {
    question: "How does Krishi AI detect crop diseases?",
    answer:
      "By uploading a clear photo of the affected crop, Krishi AI uses machine learning to identify diseases and suggest possible treatments.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-gray-400 text-white py-20 px-6" id="section-2">
      <h2 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openIndex === i && <p className="mt-2 text-gray-300">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
