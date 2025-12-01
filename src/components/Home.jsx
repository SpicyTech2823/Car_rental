import { useRef, useEffect, useState } from "react";
import video from "../assets/Videos/video1.mp4";
import car from "../assets/Images/car-insurance.png";
import schedule from "../assets/Images/schedule.png";
import customer_support from "../assets/Images/customer-support.png";
const Home = () => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Optional: Add video play/pause on visibility
    const handleVisibilityChange = () => {
      if (videoRef.current) {
        if (document.hidden) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(console.error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <div className="relative w-full h-full rounded-lg">
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-105 transition-transform duration-7000 ease-out hover:scale-100"
            src={video}
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-purple-900/30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Animated Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Main Heading with Staggered Animation */}
            <div className="overflow-hidden">
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-all duration-1000 ease-out ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                  background:
                    "linear-gradient(45deg, #ffffff, #e2e8f0, #cbd5e1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Welcome to
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Our Carent Service
                </span>
              </h1>
            </div>

            {/* Subheading with Delay */}
            <div className="overflow-hidden">
              <p
                className={`text-xl md:text-2xl lg:text-3xl font-light max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                Experience innovation like never before. Where creativity meets
                technology.
              </p>
            </div>

            {/* Animated CTA Button */}
            <div className="overflow-hidden pt-8">
              <div
                className={`inline-flex gap-4 transition-all duration-1000 delay-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <span className="relative z-10 font-semibold text-lg">
                    Get Started
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button className="group px-8 py-4 border border-white/30 rounded-full hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <span className="font-semibold text-lg">Learn More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="animate-bounce flex flex-col items-center space-y-2">
              <span className="text-sm font-light tracking-widest">SCROLL</span>
              <div className="w-px h-8 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-cyan-400/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-purple-500/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-20 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-500" />
      </div>
      {/* Additional content can go here */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-gray-50">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-center max-w-3xl text-gray-800">
          Enjoy flexibility and unbeatable rates <br /> with our city car rentals
        </h1>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">
          {/* Feature 1 */}
          <div>
            <div className="flex justify-center mb-4">
              <img src={car} alt="Car Icon" className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-medium mb-2 ">
              Well maintained vehicles
            </h3>
            <p className="text-gray-600">
              All our cars are well-maintained and regularly serviced, ensuring
              safe and smooth driving.
            </p>
          </div>
          {/* Feature 2 */}
          <div>
            <div className="flex justify-center mb-4">
              <img src={schedule} alt="schedule" className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Easy online booking
            </h3>
            <p className="text-gray-600">
              Book your car in minutes with our user-friendly online platform. Fast, simple, and convenient!
            </p>
          </div>
          {/* Feature 3 */}
          <div>
            <div className="flex justify-center mb-4">
              <img src={customer_support} alt="customer_support" className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Support 24/7
            </h3>
            <p className="text-gray-600 ">
              We’re here to assist you anytime, anywhere. Drive with peace of mind knowing help is just a call away.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
