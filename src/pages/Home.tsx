import { useState } from "react";
import ProviderSideBar from "../components/ProviderSideBar";
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const Button = styled.button`
  padding: 10px 20px; /* Vertical and horizontal padding */
  background-color: #007bff; /* Primary color */
  color: white; /* Text color */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  font-size: 16px; /* Font size */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */

  &:hover {
    background-color: #0056b3; /* Darker shade on hover */
    transform: scale(1.05); /* Slightly enlarge on hover */
  }

  &:active {
    transform: scale(0.95); /* Slightly shrink on click */
  }
`;

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PageContainer>
      <Button onClick={() => setIsOpen((prev) => !prev)}>
        Explore web APIs
      </Button>
      <ProviderSideBar
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </PageContainer>
  );
};

export default Home;
