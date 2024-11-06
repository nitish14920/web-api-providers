import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { APIItem } from "../types/apiTypes";
import ProviderSideBar from "../components/ProviderSideBar";
import { fetchAPIsByProvider } from "../services/apiServices";

const PageContainer = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  color: white;
  background: #3f5f7a;
  height: 100vh;
  width: 100%;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
  border-radius: 8px;
  background-color: white;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const ContentDescription = styled.div`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;

  code {
    background-color: #1e2a38;
    padding: 2px 4px;
    border-radius: 3px;
  }

  pre {
    background-color: #1e2a38;
    padding: 10px;
    border-radius: 5px;
    overflow: auto;
  }

  a {
    color: #00bfff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InfoBlock = styled.div`
  margin-bottom: 20px;
`;

const InfoTitle = styled.strong`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
`;

const ExternalLink = styled.a`
  color: #00bfff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #00bfff;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #008fcc;
  }
`;

const ProviderDetails: React.FC = () => {
  const { provider, apiName } = useParams<{
    provider: string;
    apiName?: string;
  }>();

  const [apiDetails, setApiDetails] = useState<APIItem | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (provider) {
      fetchAPIsByProvider(provider)
        .then((data) => {
          setApiDetails(data);
        })
        .catch((error) => console.error(error));
    }
  }, [provider]);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const selectedAPI = apiDetails
    ? apiName
      ? apiDetails[`${provider}:${apiName}`]
      : apiDetails[provider ?? ""]
    : null;

  if (!selectedAPI) {
    return <PageContainer>Loading...</PageContainer>;
  }

  return (
    <PageContainer>
      <ProviderSideBar isOpen={isDrawerVisible} onClose={closeDrawer} />
      <HeaderSection>
        <LogoImage
          src={selectedAPI.info["x-logo"].url}
          alt={selectedAPI.info.title}
        />
        <PageTitle>{selectedAPI.info.title}</PageTitle>
      </HeaderSection>

      <ContentDescription>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {selectedAPI.info.description}
        </ReactMarkdown>
      </ContentDescription>

      <InfoBlock>
        <InfoTitle>Swagger:</InfoTitle>
        <ExternalLink
          href={selectedAPI.swaggerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {selectedAPI.swaggerUrl}
        </ExternalLink>
      </InfoBlock>

      {selectedAPI.info?.contact && (
        <InfoBlock>
          <InfoTitle>Contact:</InfoTitle>
          <p>
            <strong>Name:</strong> {selectedAPI?.info?.contact?.name ?? "-"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <ExternalLink
              href={`mailto:${selectedAPI?.info?.contact?.email ?? "-"}`}
            >
              {selectedAPI.info.contact.email}
            </ExternalLink>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <ExternalLink
              href={selectedAPI.info.contact.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedAPI.info.contact.url}
            </ExternalLink>
          </p>
        </InfoBlock>
      )}

      <ActionButton onClick={openDrawer}>Explore more APIs</ActionButton>
    </PageContainer>
  );
};

export default ProviderDetails;
