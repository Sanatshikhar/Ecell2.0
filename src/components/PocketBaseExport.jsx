import React, { useMemo, useState } from 'react';

const PRODUCT_COUNT = 25;

const PocketBaseExport = () => {
  const [votes, setVotes] = useState(() =>
    Array.from({ length: PRODUCT_COUNT }, () => 0)
  );
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = useMemo(
    () =>
      Array.from({ length: PRODUCT_COUNT }, (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        description: `Product ${index + 1} showcase card`,
      })),
    []
  );

  const handleVote = (index) => {
    setSelectedProduct(index);
    setVotes((currentVotes) =>
      currentVotes.map((vote, voteIndex) => (voteIndex === index ? vote + 1 : vote))
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Rajdhani:wght@300;400;600;700&display=swap');
        body { font-family: 'Rajdhani', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-spacemono { font-family: 'Space Mono', monospace; }
        @keyframes slideDownFade { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes slideRight { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        .animate-slideDownFade { animation: slideDownFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; }
        .animate-slideUpFade { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; }
        .animate-shimmer { animation: shimmer 3s infinite 1s; }
        .animate-slideRight { animation: slideRight 1s ease-out forwards; }
        .tag-clip { clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%); }
      `}</style>

      <div className="relative min-h-screen bg-black text-gray-200 overflow-x-hidden">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(200, 255, 0, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 255, 0, 0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-16 lg:py-20">
          <div className="mb-14 animate-slideDownFade">
            <div className="inline-block mb-5 relative overflow-hidden tag-clip bg-lime-400 bg-opacity-8 border border-lime-400 border-opacity-30 px-4 py-2">
              <span className="block font-spacemono text-xs text-lime-400 tracking-widest uppercase">
                Product Vote Board
              </span>
              <div
                className="absolute top-0 left-0 w-full h-full animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(200, 255, 0, 0.2), transparent)',
                }}
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-4 font-bebas leading-none">
              Vote for <span className="block text-lime-400">Your Product</span>
            </h1>

            <p className="font-spacemono text-xs text-gray-500 leading-relaxed tracking-wide border-l-2 border-lime-400 pl-4">
              Twenty-five product boxes with a vote action at the bottom of each card
            </p>
          </div>

          <div className="animate-slideUpFade">
            <div className="bg-gray-900 border border-gray-800 relative p-6 md:p-8 shadow-2xl">
              <div
                className="absolute top-0 left-0 right-0 h-0.5 animate-slideRight"
                style={{
                  background: 'linear-gradient(90deg, #c8ff00, #ff6b00, transparent)',
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 relative z-10">
                {products.map((product, index) => {
                  const isSelected = selectedProduct === index;
                  return (
                    <div
                      key={product.id}
                      className={`group relative min-h-[220px] border transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? 'bg-lime-400 bg-opacity-10 border-lime-400 shadow-[0_0_25px_rgba(200,255,0,0.18)]'
                          : 'bg-gray-800 border-gray-700 hover:border-lime-400 hover:-translate-y-1'
                      }`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(200,255,0,0.08),transparent)]" />

                      <div className="relative z-10 h-full flex flex-col p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 flex items-center justify-center border border-lime-400 text-lime-400 font-spacemono text-xs font-bold tag-clip bg-lime-400 bg-opacity-10">
                            {product.id}
                          </div>
                          <div className="text-right font-spacemono text-[10px] text-gray-500 uppercase tracking-widest">
                            Product
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <h2 className="font-bebas text-3xl tracking-wide mb-2 text-gray-100">
                            {product.name}
                          </h2>
                          <p className="font-spacemono text-[11px] text-gray-500 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleVote(index)}
                          className={`mt-4 w-full py-2 text-xs font-spacemono uppercase tracking-[0.3em] border transition-all duration-300 ${
                            isSelected
                              ? 'bg-lime-400 text-black border-lime-400'
                              : 'bg-black text-lime-400 border-gray-700 hover:border-lime-400 hover:bg-lime-400 hover:text-black'
                          }`}
                        >
                          Vote
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 font-spacemono text-xs text-gray-500">
            Selected: {selectedProduct !== null ? `Product ${selectedProduct + 1}` : 'None'}
          </div>
        </div>
      </div>
    </>
  );
};

export default PocketBaseExport;
