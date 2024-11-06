import { useState } from "react";
import ProviderSideBar from "../components/ProviderSideBar";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        Explore web APIs
      </button>
      <ProviderSideBar
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default Home;
