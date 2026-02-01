import { useState, useEffect, useRef } from "react";
import {
  Github,
  Mail,
  ExternalLink,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Globe,
  Database,
  Play,
  RotateCcw,
  Menu,
  X,
  MoveLeft,
  MoveRight,
  ArrowRight,
} from "lucide-react";

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fullText = "A blooming developer, Jiyean Lee";

  // Slider State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Mini Games State
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpScore, setJumpScore] = useState(0);
  const [isGameOverJump, setIsGameOverJump] = useState(false);
  const [basketPos, setBasketPos] = useState(50);
  const [items, setItems] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [catchScore, setCatchScore] = useState(0);
  const [isGameOverCatch, setIsGameOverCatch] = useState(false);

  const obstacleRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any }) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    const typingInterval = setInterval(() => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
        if (i === fullText.length) {
          isDeleting = true;
          setTimeout(() => {}, 2000);
        }
      } else {
        setDisplayText(fullText.substring(0, i - 1));
        i--;
        if (i === 0) isDeleting = false;
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Slider Logic
  const handleMouseDown = (e: { pageX: number }) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMoveSlider = (e: {
    preventDefault: () => void;
    pageX: number;
  }) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // --- Game 1 Logic: Jump ---
  const handleJump = () => {
    if (!isJumping && !isGameOverJump) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  };

  useEffect(() => {
    let jumpInterval: number | undefined;
    if (activeGame === "jump" && !isGameOverJump) {
      jumpInterval = setInterval(() => {
        setJumpScore((s) => s + 1);
        if (obstacleRef.current && playerRef.current) {
          const pRect = playerRef.current.getBoundingClientRect();
          const oRect = obstacleRef.current.getBoundingClientRect();
          if (
            pRect.right > oRect.left + 5 &&
            pRect.left < oRect.right - 5 &&
            pRect.bottom > oRect.top + 5
          ) {
            setIsGameOverJump(true);
          }
        }
      }, 100);
    }
    return () => clearInterval(jumpInterval);
  }, [activeGame, isGameOverJump]);

  // --- Game 2 Logic: Catch ---
  useEffect(() => {
    let catchInterval: number | undefined;
    if (activeGame === "catch" && !isGameOverCatch) {
      catchInterval = setInterval(() => {
        setItems((prev) => [
          ...prev,
          { id: Math.random(), x: Math.random() * 90, y: -10 },
        ]);
      }, 1000);
    }
    return () => clearInterval(catchInterval);
  }, [activeGame, isGameOverCatch]);

  useEffect(() => {
    let moveInterval: number | undefined;
    if (activeGame === "catch" && !isGameOverCatch) {
      moveInterval = setInterval(() => {
        setItems((prev) => {
          const next = prev.map((item) => ({ ...item, y: item.y + 3 }));
          const caught = next.filter(
            (item) =>
              item.y > 80 && item.y < 95 && Math.abs(item.x - basketPos) < 15,
          );
          const missed = next.some((item) => item.y > 100);
          if (caught.length > 0) setCatchScore((s) => s + caught.length);
          if (missed) setIsGameOverCatch(true);
          return next.filter((item) => item.y < 100 && !caught.includes(item));
        });
      }, 30);
    }
    return () => clearInterval(moveInterval);
  }, [activeGame, isGameOverCatch, basketPos]);

  const heroIcons = [
    {
      name: "JS",
      color: "#F7DF1E",
      top: "35%",
      left: "32%",
      size: "text-lg",
      opacity: "0.4",
    },
    {
      name: "React",
      color: "#61DAFB",
      top: "30%",
      left: "68%",
      size: "text-xl",
      opacity: "0.4",
    },
    {
      name: "TS",
      color: "#3178C6",
      top: "60%",
      left: "38%",
      size: "text-base",
      opacity: "0.4",
    },
    {
      name: "Java",
      color: "#ED8B00",
      top: "65%",
      left: "62%",
      size: "text-lg",
      opacity: "0.4",
    },
    {
      name: "Vue",
      color: "#4FC08D",
      top: "20%",
      left: "20%",
      size: "text-2xl",
      opacity: "0.8",
    },
    {
      name: "Figma",
      color: "#F24E1E",
      top: "15%",
      left: "80%",
      size: "text-2xl",
      opacity: "0.9",
    },
    {
      name: "Docker",
      color: "#2496ED",
      top: "75%",
      left: "15%",
      size: "text-xl",
      opacity: "0.8",
    },
    {
      name: "IntelliJ",
      color: "#FE315D",
      top: "80%",
      left: "85%",
      size: "text-2xl",
      opacity: "1",
    },
    {
      name: "VS Code",
      color: "#007ACC",
      top: "45%",
      left: "10%",
      size: "text-xl",
      opacity: "0.7",
    },
    {
      name: "Spring",
      color: "#6DB33F",
      top: "45%",
      left: "90%",
      size: "text-xl",
      opacity: "0.7",
    },
  ];

  const PixelHouse = () => (
    <svg
      width="120"
      height="120"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      <rect
        x="8"
        y="16"
        width="24"
        height="20"
        fill={isDarkMode ? "#A0522D" : "#D2691E"}
      />
      <rect x="8" y="14" width="24" height="2" fill="#5D2E17" />
      <path d="M4 16L20 4L36 16H4Z" fill="#4B2515" />
      <rect x="18" y="26" width="6" height="10" fill="#2D150B" />
      <rect
        x="12"
        y="20"
        width="4"
        height="4"
        fill="#FFE4B5"
        className="animate-pulse"
      />
      <rect
        x="24"
        y="20"
        width="4"
        height="4"
        fill="#FFE4B5"
        className="animate-pulse"
      />
    </svg>
  );

  const PixelTree = () => (
    <svg
      width="60"
      height="80"
      viewBox="0 0 20 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="20" width="4" height="10" fill="#4B2515" />
      <circle cx="10" cy="10" r="8" fill={isDarkMode ? "#064e3b" : "#166534"} />
      <circle cx="6" cy="8" r="4" fill={isDarkMode ? "#065f46" : "#15803d"} />
      <circle cx="14" cy="12" r="4" fill={isDarkMode ? "#065f46" : "#15803d"} />
    </svg>
  );

  const PixelCloud = () => (
    <svg
      width="80"
      height="40"
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-60"
    >
      <rect x="10" y="4" width="20" height="10" fill="white" />
      <rect x="6" y="8" width="28" height="8" fill="white" />
      <rect x="14" y="2" width="12" height="12" fill="white" />
    </svg>
  );

  const projects = [
    {
      title: "NexGen Solution",
      category: "Frontend Development",
      tech: ["React", "TypeScript", "Tailwind"],
      desc: "엔씨소프트웨어 인턴십 기간 중 제작한 기업용 대시보드 솔루션입니다. 데이터 시각화와 실시간 모니터링에 집중했습니다.",
      icon: <Monitor className="w-12 h-12" />,
      github: "https://github.com",
      demo: "https://demo.com",
      accent: "from-yellow-400 to-pink-500",
    },
    {
      title: "Diamond Age",
      category: "Fullstack / Design",
      tech: ["Spring Boot", "MariaDB", "Figma"],
      desc: "새로운 형태의 주거 시스템을 제안하는 픽셀 아트 스타일의 인터렉티브 웹 서비스입니다.",
      icon: <Smartphone className="w-12 h-12" />,
      github: "https://github.com",
      demo: "https://demo.com",
      accent: "from-blue-400 to-green-400",
    },
    {
      title: "Global Link",
      category: "Web Platform",
      tech: ["Next.js", "GraphQL", "Prisma"],
      desc: "전 세계 개발자들을 잇는 매칭 서비스로, 실시간 채팅 및 협업 툴 연동 기능을 제공합니다.",
      icon: <Globe className="w-12 h-12" />,
      github: "https://github.com",
      demo: "https://demo.com",
      accent: "from-purple-400 to-blue-400",
    },
    {
      title: "Data Core",
      category: "Backend System",
      tech: ["Java", "Spring Batch", "Redis"],
      desc: "대규모 트래픽 처리를 위한 데이터 파이프라인 시스템입니다. 초당 1만 건 이상의 로그를 안정적으로 처리합니다.",
      icon: <Database className="w-12 h-12" />,
      github: "https://github.com",
      demo: "https://demo.com",
      accent: "from-green-400 to-yellow-400",
    },
  ];

  const colors = {
    bg: isDarkMode ? "bg-[#111111]" : "bg-[#fcfcfc]",
    text: isDarkMode ? "text-white" : "text-black",
    subBg: isDarkMode ? "bg-white/[0.05]" : "bg-black/[0.05]",
    border: isDarkMode ? "border-white/10" : "border-black/10",
    navBg: isDarkMode ? "bg-black/80" : "bg-white/80",
    aboutBg: isDarkMode ? "bg-[#111111]" : "bg-[#fcfcfc]",
    projectCard: isDarkMode ? "bg-[#151515]" : "bg-white",
    footerBg: isDarkMode ? "bg-[#080808]" : "bg-[#f8f8f8]",
  };

  const currentRotateX = 65 + scrollY * 0.015;
  const currentTranslateY = -(scrollY * 0.04);

  // Parallax constants for 3D section
  const cloud1Y = scrollY * 0.15;
  const cloud2Y = scrollY * 0.25;
  const objectShiftY = scrollY * 0.02;

  return (
    <div
      className={`min-h-screen font-mono selection:bg-yellow-400 selection:text-black cursor-none transition-colors duration-500 ${colors.bg} ${colors.text}`}
    >
      {/* Pixel Cursor */}
      <div
        className={`fixed top-0 left-0 w-6 h-6 border-2 z-[9999] pointer-events-none transition-transform duration-75 ease-out flex items-center justify-center
          ${isDarkMode ? "border-yellow-400 bg-yellow-400/20" : "border-blue-600 bg-blue-600/20"}
          ${isHovering ? "scale-150 rotate-45" : "scale-100"}
        `}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        }}
      >
        <div
          className={`w-1 h-1 ${isDarkMode ? "bg-yellow-400" : "bg-blue-600"}`}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 p-6 flex justify-between items-center transition-all ${scrollY > 50 ? `${colors.navBg} backdrop-blur-md border-b ${colors.border}` : "bg-transparent"}`}
      >
        <div className="w-10 h-3 bg-yellow-400 shadow-[2px_2px_0_rgba(0,0,0,0.5)]"></div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-[11px] font-black uppercase tracking-[0.2em]">
          {["About", "Experience", "Projects", "MiniGame", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-yellow-400 transition-colors"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 bg-yellow-400 text-black active:scale-90 transition-transform"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-current"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} md:hidden`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {["About", "Experience", "Projects", "MiniGame", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-4xl font-black italic text-yellow-400 uppercase tracking-tighter"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${isDarkMode ? "white" : "black"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {heroIcons.map((icon, idx) => (
          <div
            key={idx}
            className="absolute hidden md:block transition-transform duration-500 ease-out pointer-events-none"
            style={{
              top: icon.top,
              left: icon.left,
              opacity: icon.opacity,
              transform: `translate(${(mousePos.x - window.innerWidth / 2) * (idx % 2 ? 0.04 : -0.04)}px, ${(mousePos.y - window.innerHeight / 2) * (idx % 2 ? 0.04 : -0.04)}px)`,
            }}
          >
            <div
              className={`px-4 py-2 border-2 border-current font-black ${icon.size} uppercase tracking-tighter bg-black/40 backdrop-blur-sm shadow-[4px_4px_0_rgba(0,0,0,0.5)]`}
              style={{ color: icon.color }}
            >
              {icon.name}
            </div>
          </div>
        ))}

        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-[120px] font-black mb-6 tracking-tighter uppercase text-yellow-400 drop-shadow-[6px_6px_0_rgba(0,0,0,0.8)] leading-none">
            Jiyean
            <br />
            Portfolio
          </h1>
          <div className="inline-block border-r-4 border-current pr-2 mb-4">
            <p className="text-sm md:text-xl font-bold opacity-80 uppercase tracking-widest min-h-[1.5em]">
              &gt; {displayText}
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section
        id="about"
        className={`py-40 px-6 relative overflow-hidden transition-colors ${colors.aboutBg}`}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="flex flex-col items-start mb-24">
            <h2
              className={`text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-4 ${colors.text}`}
            >
              About Me <span className="text-4xl not-italic">🏃‍♀️🚲🤸‍♀️</span>
            </h2>
          </div>

          {/* About Layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Info (7/12) */}
            <div className="lg:col-span-7 space-y-16">
              {/* My Keyword */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-5 bg-blue-400"></div>
                  <h3
                    className={`text-lg font-bold uppercase tracking-tight ${colors.text}`}
                  >
                    My Keyword
                  </h3>
                </div>
                <div className="pl-5 space-y-4">
                  <p
                    className={`text-base font-medium opacity-90 leading-relaxed ${colors.subBg} inline-block px-2 py-0.5 ${colors.text}`}
                  >
                    ‘좋았다면 추억이고 나빴다면 경험이다.’
                  </p>
                  <p
                    className={`text-base opacity-80 leading-relaxed ${colors.text}`}
                  >
                    문제라는 부정적 자세가 아닌 해결해야 할 상황으로 받아들이는{" "}
                    <span className={`${colors.subBg} px-1 py-0.5`}>
                      긍정의 에너지
                    </span>
                    를 갖췄습니다.
                  </p>
                  <ul
                    className={`space-y-3 text-base opacity-90 ${colors.text}`}
                  >
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-3">•</span> 책임감
                      있는 태도
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-3">•</span> 빠른
                      수긍과 존중
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-3">•</span> 자전거
                      타기를 좋아합니다!
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-5 bg-green-400"></div>
                  <h3
                    className={`text-lg font-bold uppercase tracking-tight ${colors.text}`}
                  >
                    Tech Stack
                  </h3>
                </div>
                <div
                  className={`pl-5 grid grid-cols-1 sm:grid-cols-2 gap-8 ${colors.text}`}
                >
                  {[
                    {
                      category: "Frontend",
                      stack: "React, TypeScript, Vite, Tailwind CSS",
                    },
                    {
                      category: "Backend",
                      stack: "Spring Boot, JPA, MariaDB, Security",
                    },
                    {
                      category: "Mobile & Etc",
                      stack: "React Native, Figma, Docker",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        {item.category}
                      </h4>
                      <p className="text-sm font-bold opacity-90 leading-tight">
                        {item.stack}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-5 bg-orange-400"></div>
                  <h3
                    className={`text-lg font-bold uppercase tracking-tight ${colors.text}`}
                  >
                    Certificate
                  </h3>
                </div>
                <div
                  className={`pl-5 space-y-3 text-base opacity-90 ${colors.text}`}
                >
                  <p>2022.12 : 웹디자인 기능사</p>
                  <p>2022.10 : Gtq 1급</p>
                  <p>2022.09 : Gtq-i 1급</p>
                  <p>2020.12 : 운전면허 2종 보통</p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Scroll Perspective */}
            <div
              className={`lg:col-span-5 h-[600px] border ${colors.border} rounded-3xl overflow-hidden perspective-container bg-gradient-to-b from-transparent to-black/30 relative`}
            >
              {/* Cloud Parallax (Adjusted cloud2Y top position to be higher) */}
              <div
                className="absolute top-10 right-10 transition-transform duration-75"
                style={{ transform: `translateY(${cloud1Y}px)` }}
              >
                <PixelCloud />
              </div>
              <div
                className="absolute top-12 left-8 opacity-30 transition-transform duration-75"
                style={{ transform: `translateY(${cloud2Y}px)` }}
              >
                <PixelCloud />
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ perspective: "1200px" }}
              >
                <div
                  className="absolute w-full h-full origin-bottom"
                  style={{
                    transform: `rotateX(${currentRotateX}deg) translateY(${currentTranslateY}px)`,
                  }}
                >
                  <div
                    className="absolute bottom-[-200px] left-[-50%] w-[200%] h-[1200px] pixel-ground origin-bottom"
                    style={{
                      backgroundColor: isDarkMode ? "#1a1a1a" : "#e5e5e5",
                    }}
                  >
                    <div
                      className="w-full h-full opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(${isDarkMode ? "#fff" : "#000"} 2px, transparent 2px), linear-gradient(90deg, ${isDarkMode ? "#fff" : "#000"} 2px, transparent 2px)`,
                        backgroundSize: "80px 80px",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute inset-0 w-full h-full">
                  {/* Object Parallax (Slightly downward movement on scroll) */}
                  <div
                    className="absolute bottom-[140px] right-[20%] z-20 opacity-90 transition-transform duration-100"
                    style={{ transform: `translateY(${objectShiftY}px)` }}
                  >
                    <PixelHouse />
                  </div>
                  <div
                    className="absolute bottom-[160px] left-[15%] flex space-x-16 z-20 opacity-80 transition-transform duration-100"
                    style={{ transform: `translateY(${objectShiftY * 0.8}px)` }}
                  >
                    <PixelTree />
                    <div className="mt-8">
                      <PixelTree />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-[60px] z-30 pixel-cycle-move transition-transform duration-100"
                    style={{ transform: `translateY(${objectShiftY * 1.2}px)` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-5xl">👧</div>
                      <div className="text-5xl -mt-5">🚲</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 w-full text-center">
                <div className="inline-flex items-center space-x-4 px-5 py-2 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
                    3D Perspective Scroll
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-24">
            Experience
          </h2>

          <div className="space-y-24">
            <div className="relative pl-12 border-l-2 border-yellow-400/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-yellow-400 rotate-45" />
              <p className="text-[11px] font-black uppercase text-yellow-400 mb-2 tracking-widest">
                2023.03 - 2025.08
              </p>
              <h3 className="text-3xl font-black mb-6 flex items-center">
                (주)잼퍼블릭{" "}
                <ExternalLink
                  size={18}
                  className="ml-3 opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
                />
              </h3>
              <div className="space-y-4">
                <ul className="space-y-4 text-base opacity-80 font-medium">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-4 font-bold">•</span>
                    <span>
                      <span
                        className={`${colors.subBg} px-1.5 py-0.5 rounded text-yellow-400 mr-2`}
                      >
                        승부사온라인
                      </span>{" "}
                      프론트엔드 개발 및 유지보수
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-4 font-bold">•</span>
                    <span>
                      <span
                        className={`${colors.subBg} px-1.5 py-0.5 rounded text-yellow-400 mr-2`}
                      >
                        챔프포커
                      </span>{" "}
                      인게임 웹뷰 퍼블리싱 및 인터렉션 구현
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-4 font-bold">•</span>
                    <span>
                      <span
                        className={`${colors.subBg} px-1.5 py-0.5 rounded text-yellow-400 mr-2`}
                      >
                        사내 대시보드
                      </span>{" "}
                      매출 통계 및 데이터 시각화 페이지 개발
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-4 font-bold">•</span>
                    <span>
                      React Native 프로젝트 프로토타입 개발 및 하이브리드 앱
                      구조 설계 참여
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative pl-12 border-l-2 border-yellow-400/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-yellow-400/50 rotate-45" />
              <p className="text-[11px] font-black uppercase text-yellow-400/70 mb-2 tracking-widest">
                2023.03 - 2023.08
              </p>
              <h3 className="text-3xl font-black mb-6">
                (주)엔씨소프트웨어 / 인턴
              </h3>
              <div className="space-y-4">
                <ul className="space-y-4 text-base opacity-80 font-medium">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-4 font-bold">•</span>
                    <span>
                      온라인 서비스 프론트 개발 지원 및 사내 UI/UX 컴포넌트
                      가이드 수립
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className={`py-40 px-6 transition-colors ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f4f4f4]"} relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDarkMode ? "white" : "black"} 2px, transparent 2px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
                Portfolio Case Studies
              </p>
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
                Selected
                <br />
                Works
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
              <MoveLeft size={16} /> Drag to explore <MoveRight size={16} />
            </div>
          </div>
          <div
            ref={sliderRef}
            className="flex gap-8 overflow-x-hidden cursor-grab active:cursor-grabbing pb-20 -mx-4 px-4 transition-transform duration-500 ease-out select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMoveSlider}
          >
            {projects.map((proj, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[85vw] md:w-[600px] h-[700px] relative group ${colors.projectCard} border ${colors.border} rounded-2xl overflow-hidden`}
              >
                {/* Visual Identity Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${proj.accent} opacity-40 group-hover:opacity-60 transition-opacity duration-700`}
                />

                {/* 배경 SVG 패턴 */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                  }}
                />

                {/* 큰 숫자 div - 주석 해제 적용 */}
                <div className="absolute bottom-[-40px] right-[-20px] text-[200px] font-black italic opacity-3 select-none group-hover:opacity-8 group-hover:-translate-x-10 transition-all duration-700">
                  {i + 1}
                </div>

                <div className="relative h-full p-12 flex flex-col justify-between">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-yellow-400 group-hover:rotate-12 transition-transform duration-500">
                      {proj.icon}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                      {proj.category}
                    </span>
                    <div className="flex gap-2">
                      {proj.tech.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[8px] border border-current px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Main Info */}
                  <div className="space-y-8 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                      {proj.title}
                    </h3>
                    <p className="text-sm opacity-60 leading-relaxed max-w-md line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                      {proj.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    <a
                      href={proj.demo}
                      className="flex items-center gap-3 bg-yellow-400 text-black px-6 py-3 font-black text-xs uppercase tracking-widest rounded-full hover:scale-110 active:scale-95 transition-all"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      Launch Demo <ArrowRight size={16} />
                    </a>
                    <a href={proj.github}>
                      <Github
                        size={20}
                        className="opacity-70 hover:opacity-100"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Game Section */}
      <section
        id="minigame"
        className="py-40 px-6 border-t border-white/5 bg-black/20"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-yellow-400">
            Pixel Play Zone
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-16 italic">
            잠시 쉬어가는 픽셀 게임 타임!
          </p>
          <div className="grid md:grid-cols-2 gap-8 h-[450px]">
            <div
              className={`relative border-4 ${colors.border} bg-black/40 overflow-hidden group`}
            >
              <div className="absolute top-4 left-4 z-20 text-[10px] font-black text-yellow-400">
                PIXEL JUMP / SCORE: {jumpScore}
              </div>
              {!activeGame || activeGame !== "jump" ? (
                <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center p-6">
                  <Play
                    size={40}
                    className="text-yellow-400 mb-4 cursor-pointer"
                    onClick={() => {
                      setActiveGame("jump");
                      setIsGameOverJump(false);
                      setJumpScore(0);
                    }}
                  />
                  <p className="text-xs font-black uppercase">
                    Click Play to Jump over Obstacles
                  </p>
                </div>
              ) : null}
              {isGameOverJump && (
                <div className="absolute inset-0 z-40 bg-red-900/90 flex flex-col items-center justify-center p-6">
                  <p className="text-2xl font-black mb-2 uppercase">
                    Game Over
                  </p>
                  <p className="text-sm mb-6 uppercase">
                    Final Score: {jumpScore}
                  </p>
                  <RotateCcw
                    className="cursor-pointer hover:rotate-180 transition-transform"
                    onClick={() => {
                      setIsGameOverJump(false);
                      setJumpScore(0);
                    }}
                  />
                </div>
              )}
              <div className="absolute bottom-0 w-full h-1/4 bg-white/5 border-t-2 border-white/10" />
              <div
                ref={playerRef}
                className="absolute left-10 bottom-1/4 w-10 h-10 flex items-center justify-center transition-all duration-500"
                style={{
                  transform: `translateY(${isJumping ? "-80px" : "0"})`,
                }}
              >
                <div className="text-3xl">👧</div>
              </div>
              {activeGame === "jump" && !isGameOverJump && (
                <div
                  ref={obstacleRef}
                  className="absolute bottom-1/4 right-0 w-8 h-8 flex items-center justify-center animate-pixel-obstacle"
                >
                  <div className="text-2xl">🌵</div>
                </div>
              )}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={handleJump}
              />
            </div>
            <div
              className={`relative border-4 ${colors.border} bg-black/40 overflow-hidden`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setBasketPos(Math.min(Math.max(x, 5), 95));
              }}
            >
              <div className="absolute top-4 left-4 z-20 text-[10px] font-black text-blue-400">
                COLOR CATCH / SCORE: {catchScore}
              </div>
              {!activeGame || activeGame !== "catch" ? (
                <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center p-6">
                  <Play
                    size={40}
                    className="text-blue-400 mb-4 cursor-pointer"
                    onClick={() => {
                      setActiveGame("catch");
                      setIsGameOverCatch(false);
                      setCatchScore(0);
                      setItems([]);
                    }}
                  />
                  <p className="text-xs font-black uppercase">
                    Catch Falling Pixels with Mouse
                  </p>
                </div>
              ) : null}
              {isGameOverCatch && (
                <div className="absolute inset-0 z-40 bg-blue-900/90 flex flex-col items-center justify-center p-6">
                  <p className="text-2xl font-black mb-2 uppercase">
                    Missed One!
                  </p>
                  <p className="text-sm mb-6 uppercase">
                    Final Score: {catchScore}
                  </p>
                  <RotateCcw
                    className="cursor-pointer hover:rotate-180 transition-transform"
                    onClick={() => {
                      setIsGameOverCatch(false);
                      setCatchScore(0);
                      setItems([]);
                    }}
                  />
                </div>
              )}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="absolute w-4 h-4 bg-yellow-400 shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                />
              ))}
              <div
                className="absolute bottom-4 w-16 h-4 bg-blue-500 border-2 border-white/20 transition-all duration-75"
                style={{ left: `${basketPos}%`, transform: "translateX(-50%)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className={`py-40 text-center transition-colors border-t ${colors.border} ${colors.footerBg}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className={`text-6xl md:text-9xl font-black italic uppercase tracking-tighter mb-20 leading-none ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}
          >
            Let's
            <br />
            Talk!
          </h2>
          <div className="flex justify-center space-x-12 mb-20">
            {[
              { icon: <Mail size={32} />, label: "Email" },
              { icon: <Github size={32} />, label: "Github" },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div
                  className={`w-20 h-20 flex items-center justify-center border-2 ${colors.border} group-hover:bg-yellow-400 group-hover:text-black transition-all rotate-45 mb-6 mx-auto`}
                >
                  <div className="-rotate-45">{item.icon}</div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[1em] opacity-20">
            Jiyean Lee © 2024 Portfolio
          </p>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #fbbf24; }

        @keyframes pixelCycle {
          0% { left: 0%; }
          50% { left: 80%; transform: scaleX(1); }
          51% { transform: scaleX(-1); }
          100% { left: 0%; transform: scaleX(-1); }
        }
        @keyframes pixelObstacle {
          from { right: -50px; }
          to { right: 110%; }
        }
        .animate-pixel-obstacle { animation: pixelObstacle 2s linear infinite; }
        .perspective-container { perspective: 1200px; }
        .pixel-ground {
          box-shadow: 0 -30px 120px rgba(0,0,0,0.9);
          clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
        }
        .pixel-cycle-move {
          position: absolute;
          animation: pixelCycle 14s steps(60) infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
