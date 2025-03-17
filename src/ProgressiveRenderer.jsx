import { useState, useEffect } from "react";
import "./App.css"; // Import the CSS

const ProgressiveRenderer = ({ text, delay = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log(text)
    const tokens = text.length > 0 ? text.split("") : 'Enter your text';

    const interval = setInterval(() => {
      if (index < tokens.length) {
        setDisplayedText((prev) => prev + tokens[index]);
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [index, text, delay]);

  return (
    <div >
<p className={`fade-in ${displayedText && "fade-in-visible"}`}>{displayedText}</p>
</div>
  );
};

export default ProgressiveRenderer