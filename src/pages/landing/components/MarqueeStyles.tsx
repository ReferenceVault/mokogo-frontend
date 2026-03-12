const MarqueeStyles = () => {
  return (
    <style>{`
      @keyframes marquee-left {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .featured-marquee-track {
        animation: marquee-left 16s linear infinite;
      }
      .testimonial-marquee-track {
        animation: marquee-left 20s linear infinite;
      }
      .marquee-container:hover .featured-marquee-track,
      .marquee-container:hover .testimonial-marquee-track {
        animation-play-state: paused;
      }
    `}</style>
  )
}

export default MarqueeStyles
