import { useState } from "react";
import { Bell, Star, Download, Upload } from "lucide-react";


export default function ArtGenerationWebAppContainer() {
  const [generatedImage, setGeneratedImage] = useState({
    id: 1,
    title: "Abstract Landscape",
    image: "https://picsum.photos/id/1015/800/600",
    date: "12 Jul 2023"
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleImageUpload = () => {
    console.log("Upload button clicked");
    // 比如模拟触发隐藏 input 的点击
    document.getElementById("fileInput")?.click();
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would be the response from an AI service
      setGeneratedImage({
        id: Date.now(),
        title: prompt,
        image: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/800/600`,
        date: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      });
    }, 1500);
  };

  const handleDownload = () => {
    console.log(`Downloading image: ${generatedImage.title}`);
    // In a real app, this would trigger the download
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
    />
  );
}
// Define the types for the props
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
  }
  const ArtGenerationWebApp: React.FC<ArtGenerationWebAppProps> = ({
    generatedImage,
    isGenerating,
    prompt,
    setPrompt,
    onImageUpload,
    onGenerate,
    onDownload
  }) =>{
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-[#9c2200] py-6">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Art Generator</h1>
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

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Input area */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Create Your Art</h2>
            
            {/* Prompt input */}
            <div className="bg-[#c24e2a] rounded-xl p-6 mb-6">
              <textarea 
                className="w-full bg-transparent outline-none resize-none text-lg" 
                rows={5}
                placeholder="Type your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Upload button */}
              <button 
                className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-3 px-6 rounded-xl transition-colors"
                onClick={onImageUpload}
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload Reference</span>
              </button>
              
              {/* Generate button */}
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
          
          {/* Right column - Generated image */}
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
                    className="w-full aspect-[4/3] object-cover"
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
              <p>All generated images are licensed under Creative Commons</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-[#1a1a1a] border-t border-gray-800 py-6 mt-10">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-400">
          <p>© 2023 AI Art Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}