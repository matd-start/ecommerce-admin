interface LockIconProps {
  isOpen: boolean;
}

const LockIcon: React.FC<LockIconProps> = ({ isOpen }) => {
  return (
    <div className="relative w-35 h-50 bg-blue-600 rounded-lg flex items-end justify-center overflow-hidden">
      {/* Arco del candado */}
      <div
        className={`absolute left-1/2 w-20 h-20 border-4 border-white rounded-t-full border-b-0 transition-all duration-500 ${
          isOpen ? "rotate-[-45deg] -translate-x-5" : "-translate-x-1/2"
        }`}
        style={{
          top: isOpen ? "18px" : "0px", 
          transformOrigin: "bottom left",
          borderBottomColor: "transparent",
        }}
      ></div>

      {/* Cuerpo del candado */}
      <div className="w-24 h-28 bg-white rounded-b-lg relative flex items-center justify-center border-4 border-blue-600 border-t-0 z-10">
        {/* Silueta de la cerradura */}
        <div
          className={`w-8 h-12 border-4 border-blue-600 rounded-lg transition-all duration-500 ${
            isOpen ? "bg-blue-600 border-transparent" : "bg-white"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default LockIcon;