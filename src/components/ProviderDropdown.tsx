import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { fetchAPIsByProvider } from "../services/apiServices"; // Updated function name
import { useNavigate } from "react-router-dom";

const AccordionWrapper = styled.div<{ isOpen: boolean }>`
  background-color: ${({ isOpen }) => (isOpen ? "#131924" : "transparent")};
  border-radius: ${({ isOpen }) => (isOpen ? "8px" : "0")};
`;

const AccordionHeader = styled.div<{ isOpen: boolean }>`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? "#1e2a38" : "transparent")};
  border-radius: ${({ isOpen }) => (isOpen ? "8px" : "0")};
  transition: background-color 0.3s ease, border-radius 0.3s ease;
`;

const ProviderLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
`;

const ToggleIcon = styled.span<{ isOpen: boolean }>`
  transition: transform 0.3s ease;
  transform: rotate(${({ isOpen }) => (isOpen ? "90deg" : "0deg")});
`;

const APIListWrapper = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  padding: ${({ isOpen }) => (isOpen ? "10px 20px" : "0")};
  margin: 0;
  max-height: ${({ isOpen }) => (isOpen ? "500px" : "0")};
  overflow: auto;
  transition: max-height 0.3s ease, padding 0.3s ease;
`;

const APIItem = styled.li`
  padding: 8px 0;
  cursor: pointer;
  color: #ffffff;

  &:hover {
    color: #007bff;
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.p`
  font-style: italic;
`;

const ErrorMessage = styled.p`
  color: red;
  font-style: italic;
`;

interface ProviderAccordionProps {
  providerName: string; // Changed to be more descriptive
  onCloseAccordion: () => void; // Changed to be more descriptive
}

interface API {
  title: string;
  providerName: string;
  serviceName: string;
}

const transformApiResponse = (apiData: Record<string, any>): API[] => {
  return Object.entries(apiData).map(([key, value]) => {
    const [providerName, serviceName] = key.split(":");
    return {
      title: value.info.title,
      providerName,
      serviceName,
    };
  });
};

const ProviderAccordion: React.FC<ProviderAccordionProps> = React.memo(
  ({ providerName, onCloseAccordion }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [apiList, setApiList] = useState<API[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const toggleAccordion = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    useEffect(() => {
      if (isOpen && apiList.length === 0 && !isLoading && !errorMessage) {
        setIsLoading(true);
        fetchAPIsByProvider(providerName) // Updated function name
          .then((apiData) => {
            const transformedList = transformApiResponse(apiData);
            setApiList(transformedList);
          })
          .catch((err) => {
            console.error(
              `Error fetching APIs for provider ${providerName}:`,
              err
            );
            setErrorMessage("Failed to load APIs. Please try again later.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [isOpen, apiList.length, providerName, isLoading, errorMessage]);

    const handleAPIClick = useCallback(
      (providerName: string, serviceName?: string) => {
        if (providerName && serviceName) {
          navigate(`/api/${providerName}/${serviceName}`);
        } else {
          navigate(`/api/${providerName}`);
        }
        onCloseAccordion();
      },
      [navigate]
    );

    return (
      <AccordionWrapper isOpen={isOpen}>
        <AccordionHeader
          onClick={toggleAccordion}
          isOpen={isOpen}
          aria-expanded={isOpen}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleAccordion();
            }
          }}
        >
          <ProviderLabel>{providerName}</ProviderLabel>
          <ToggleIcon isOpen={isOpen}>▶</ToggleIcon>
        </AccordionHeader>
        {isOpen && (
          <>
            {isLoading ? (
              <LoadingMessage>Loading APIs...</LoadingMessage>
            ) : errorMessage ? (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            ) : apiList.length > 0 ? (
              <APIListWrapper isOpen={isOpen}>
                {apiList.map(({ title, providerName, serviceName }, index) => (
                  <APIItem
                    key={index}
                    onClick={() => handleAPIClick(providerName, serviceName)}
                  >
                    {title}
                  </APIItem>
                ))}
              </APIListWrapper>
            ) : (
              <LoadingMessage>No APIs available.</LoadingMessage>
            )}
          </>
        )}
      </AccordionWrapper>
    );
  }
);

export default ProviderAccordion;
