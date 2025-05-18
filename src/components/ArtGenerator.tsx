import { useState } from "react";
import { Bell, Star, Download, Upload, CodeSquare } from "lucide-react";

export default function ArtGenerationWebAppContainer() {
  const [generatedImage, setGeneratedImage] = useState({
    id: 1,
    title: "Abstract Landscape",
    image: "https://picsum.photos/id/1015/800/600",
    date: "20 May 2025"
  });

  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");

  const handleImageUpload = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setUploadMessage("✅ Upload successful!");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !file) return;

    setIsGenerating(true);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", file);
    formData.append("aspectRatio", aspectRatio);

    try {
      const res = await fetch("http://localhost:5001/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Returned:", data);
      if (data?.url) {
        setGeneratedImage({
          id: Date.now(),
          title: prompt,
          image: `${data.url}?t=${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
      }
    } catch (err) {
      console.error("Generation error", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImage.image);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${generatedImage.title.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <ArtGenerationWebApp
      generatedImage={generatedImage}
      isGenerating={isGenerating}
      prompt={prompt}
      setPrompt={setPrompt}
      onImageUpload={handleImageUpload}
      onGenerate={handleGenerate}
      onDownload={handleDownload}
      onFileChange={handleFileChange}
      uploadMessage={uploadMessage}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
    />
  );
}

interface ArtGenerationWebAppProps {
  generatedImage: {
    id: number;
    title: string;
    image: string;
    date: string;
  };
  isGenerating: boolean;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onImageUpload: () => void;
  onGenerate: () => void;
  onDownload: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadMessage: string;
  aspectRatio: string;
  setAspectRatio: React.Dispatch<React.SetStateAction<string>>;
}

const ArtGenerationWebApp: React.FC<ArtGenerationWebAppProps> = ({
  generatedImage,
  isGenerating,
  prompt,
  setPrompt,
  onImageUpload,
  onGenerate,
  onDownload,
  onFileChange,
  uploadMessage,
  aspectRatio,
  setAspectRatio,
}) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-[#9c2200] py-6">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Harry's AI Art Generator</h1>
          <div className="flex items-center gap-6">
            <Bell className="w-6 h-6 cursor-pointer hover:text-gray-200" />
            <div className="flex items-center gap-4">
              <div className="bg-[#c24e2a] px-4 py-2 rounded-full flex items-center">
                <Star className="w-5 h-5 mr-2" fill="white" stroke="white" />
                <span className="font-medium">Pro</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://picsum.photos/id/1012/100/100"
                    alt="Profile picture of Harry"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium">Harry</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full bg-black text-white px-4 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Create Your Art</h2>
            <div className="bg-[#c24e2a] rounded-xl p-6 mb-6">
              <textarea
                className="w-full bg-transparent outline-none resize-none text-lg"
                rows={5}
                placeholder="Type your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <button
                className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-3 px-6 rounded-xl transition-colors"
                onClick={onImageUpload}
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload Reference</span>
              </button>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
              <button
                className={`flex-1 flex items-center justify-center gap-2 bg-[#ff5722] hover:bg-[#e64a19] text-white py-3 px-6 rounded-xl transition-colors ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={onGenerate}
                disabled={isGenerating}
              >
                <span className="font-medium">
                  {isGenerating ? "Generating..." : "Generate Image"}
                </span>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="bg-[#2a2a2a] text-white px-4 py-2 rounded w-full"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:5">4:5 (Portrait)</option>
                <option value="9:16">9:16 (Story)</option>
              </select>
            </div>

            {uploadMessage && (
              <div className="text-green-400 font-medium text-sm mb-4">
                {uploadMessage}
              </div>
            )}

            <div className="bg-[#2a2a2a] rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4">Tips for Better Results</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Be specific about art style (e.g., oil painting, digital art)</li>
                <li>Include details about lighting and mood</li>
                <li>Specify color schemes for more control</li>
                <li>Reference artists for stylistic influence</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Generated Image</h2>
              <span className="text-gray-400">{generatedImage.date}</span>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl overflow-hidden">
              <div className="relative">
                {isGenerating ? (
                  <div className="aspect-[4/3] flex items-center justify-center bg-[#1a1a1a]">
                    <div className="w-12 h-12 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img
                    src={generatedImage.image}
                    alt={generatedImage.title}
                    className="w-full object-contain"
                  />
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">{generatedImage.title}</h3>
                  <button
                    className="flex items-center gap-2 bg-[#ff5722] hover:bg-[#e64a19] text-white py-2 px-4 rounded-lg transition-colors"
                    onClick={onDownload}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-gray-400">
              <p>All generated images are licensed under Harry Chen</p>
            </div>
          </div>
        </div>

        <footer className="bg-[#1a1a1a] border-t border-gray-800 py-6 mt-10">
          <div className="max-w-7xl mx-auto px-8 text-center text-gray-400">
            <p>© 2025 Harry's AI Art Generator. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};
