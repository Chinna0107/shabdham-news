import { FaRegClock, FaMapMarkerAlt, FaBell } from 'react-icons/fa';
const today = new Date();

const formattedDate = today.toLocaleDateString("te-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

const TopBar = () => {
  return (
    <div className="bg-[#1a237e] text-white text-[13px] py-1.5 w-full">
      <div className="w-full px-4 lg:px-8 xl:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-4 md:space-x-6">
         <div className="flex items-center space-x-2">
  <FaRegClock />
  <span>{formattedDate}</span>
</div>
          <div className="hidden md:flex items-center space-x-2">
            <FaMapMarkerAlt />
            <span>తెలంగాణ</span>
          </div>
        </div>
        
        {/* Right side: Notifications & Language Toggle */}
        <div className="hidden md:flex items-center space-x-5">
          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-[#ff3333] transition-colors">
            <FaBell size={14} /> 
            <span className="font-semibold tracking-wide">Notifications</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 rounded px-2 py-0.5 text-xs font-bold">
            <button className="text-white hover:text-gray-200 transition-colors">ENG</button>
            <span className="text-gray-400">|</span>
            <button className="text-gray-400 hover:text-white transition-colors">తెలు</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
