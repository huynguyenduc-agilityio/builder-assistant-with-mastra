export const OnlineDot = () => (
  <span className="relative flex items-center justify-center w-[7px] h-[7px]">
    <span
      className="absolute inset-0 rounded-full bg-green-400 animate-ping"
      style={{ animationDuration: '1.8s' }}
    />
    <span className="relative rounded-full w-[7px] h-[7px] bg-green-400" />
  </span>
);
