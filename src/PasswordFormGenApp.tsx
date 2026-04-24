import React from "react";
import { useState } from "react";
import "./styles/form.css";
import { Copy } from "lucide-react";

interface FormPayload {
  username: string;
  passwordOptions: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  passwordLength: number;
  fanOf: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  generatedPassword?: string;
  data?: unknown;
}

export function PasswordFormGenApp() {
  const [username, setUsername] = useState("");
  const [passwordLength, setPasswordLength] = useState(8);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedFan, setSelectedFan] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [options, setOptions] = useState({
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownload = () => {
    if (!generatedPassword) {
      alert("Generate a password first before downloading.");
      return;
    }
    if (!selectedFormat) {
      alert("Please select a download format (CSV or TXT).");
      return;
    }

    let content = "";
    let mimeType = "";
    let fileName = "";

    if (selectedFormat === "csv") {
      content = `username,password\n"${username}","${generatedPassword}"`;
      mimeType = "text/csv";
      fileName = "credentials.csv";
    } else if (selectedFormat === "txt") {
      content = `Username: ${username}\nPassword: ${generatedPassword}`;
      mimeType = "text/plain";
      fileName = "credentials.txt";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload: FormPayload = {
      username,
      passwordOptions: { ...options },
      passwordLength,
      fanOf: selectedFan,
    };

    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (data.generatedPassword) {
        setGeneratedPassword(data.generatedPassword);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="credentials-form">
      <h3>Credentials Generator</h3>
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="section-label">Password Options</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={() => toggleOption("uppercase")}
              />
              <span>Uppercase Letters (A-Z)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={() => toggleOption("lowercase")}
              />
              <span>Lowercase Letters (a-z)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={() => toggleOption("numbers")}
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={() => toggleOption("symbols")}
              />
              <span>Symbols (!@#$%...)</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="section-label">Which of this are you a fan?</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="radio"
                name="fan"
                value="harry-potter"
                checked={selectedFan === "harry-potter"}
                onChange={(e) => setSelectedFan(e.target.value)}
              />
              <span>Harry Potter</span>
            </label>
            <label className="checkbox-label">
              <input
                type="radio"
                name="fan"
                value="lord-of-the-rings"
                checked={selectedFan === "lord-of-the-rings"}
                onChange={(e) => setSelectedFan(e.target.value)}
              />
              <span>Lord of the rings</span>
            </label>
            <label className="checkbox-label">
              <input
                type="radio"
                name="fan"
                value="star-wars"
                checked={selectedFan === "star-wars"}
                onChange={(e) => setSelectedFan(e.target.value)}
              />
              <span>Star Wars</span>
            </label>
            <label className="checkbox-label">
              <input
                type="radio"
                name="fan"
                value="star-trek"
                checked={selectedFan === "star-trek"}
                onChange={(e) => setSelectedFan(e.target.value)}
              />
              <span>Star Trek</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="section-label">
            Password Length:
            <span className="length-value">{passwordLength}</span>
          </label>
          <input
            type="range"
            min={8}
            max={32}
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            className="range-slider"
          />
          <div className="range-labels">
            <span>8</span>
            <span>32</span>
          </div>
        </div>

        <button type="submit" className="generate-btn" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Password"}
        </button>

        <div className="form-group generated-group">
          <label className="section-label">Generated Password</label>
          <div className="input-copy">
            <input type="text" readOnly value={generatedPassword} />
            <button type="button" onClick={handleCopy} className="copy-btn">
              <Copy size={16} />
            </button>
          </div>
          {copied && <span className="copied-msg">Password copied!</span>}
        </div>

        {apiError && (
          <div className="form-group">
            <span
              style={{
                color: "#f87171",
                fontSize: "13px",
                background: "#2e0f0f",
                padding: "8px 12px",
                borderRadius: "6px",
                display: "block",
              }}
            >
              ⚠ API Error: {apiError}
            </span>
          </div>
        )}

        <div className="form-group">
          <label className="section-label">Download Format</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={selectedFormat === "csv"}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />
              <span>CSV</span>
            </label>
            <label className="checkbox-label">
              <input
                type="radio"
                name="format"
                value="txt"
                checked={selectedFormat === "txt"}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />
              <span>TXT</span>
            </label>
          </div>
        </div>

        <button type="button" className="generate-btn" onClick={handleDownload}>
          Download
        </button>
      </form>
    </div>
  );
}
