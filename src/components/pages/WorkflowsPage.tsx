import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IconButton, InputBox, SwitchInput } from "grindery-ui";
import DataBox from "../shared/DataBox";
import useAppContext from "../../hooks/useAppContext";
import { ICONS, SCREEN } from "../../constants";
import { Workflow } from "../../types/Workflow";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 24px 20px;
  gap: 20px;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
  }

  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }

  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 5px;

  .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    .MuiIconButton-root {
      margin-left: auto;
    }
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;

  & .MuiBox-root {
    margin-bottom: 0;
  }
  & .MuiOutlinedInput-root {
    margin-top: 0;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    flex: 0.5;
  }
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.span`
  position: relative;
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  color: #0b0d17;
  display: inline-block;
  padding-right: 24px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0);
  cursor: text;

  &:hover {
    border-bottom: 1px dashed #898989;
  }
  &:hover:after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    position: absolute;
    right: 1px;
    background-image: url(/images/icons/pencil.svg);
    background-position: center center;
    background-repeat: no-repeat;
    top: 5px;
  }
`;

const ItemAppsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4px;
`;

const ItemAppWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
`;

const ItemAppIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

const ItemActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const TitleInput = styled.input`
  background: none;
  border: none;
  border-bottom: 1px dashed #898989;
  display: inline-block;
  font-weight: 400;
  font-size: var(--text-size-list-item-label);
  line-height: 150%;
  padding: 0;
  color: #0b0d17;
  outline: none;
  width: auto;
  max-width: 200px;
  font-family: Roboto;
  @media (min-width: ${SCREEN.TABLET}) {
    max-width: 450px;
  }
  @media (min-width: ${SCREEN.TABLET_XL}) {
    max-width: 500px;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 650px;
  }
`;

type Props = {};

const WorkflowsPage = (props: Props) => {
  const { workflows } = useAppContext();
  const items = workflows || [];
  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();

  const filteredItems = searchTerm
    ? items.filter(
        (item) =>
          item.title &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  const handleSearchChange = (e: string) => {
    setSearchTerm(e);
  };

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchInputWrapper>
          <InputBox
            placeholder={"Workflows"}
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            icon="search"
            type="search"
          />
        </SearchInputWrapper>
        <IconButton
          color=""
          onClick={() => {
            navigate("/workflows/new");
          }}
          icon={ICONS.PLUS}
        />
      </SearchWrapper>
      <ItemsWrapper>
        {filteredItems.map((item) => (
          <WorkflowRow key={item.key + item.title + item.state} item={item} />
        ))}
      </ItemsWrapper>
    </Wrapper>
  );
};

type WorkflowRowProps = {
  item: any;
};

const WorkflowRow = ({ item }: WorkflowRowProps) => {
  const { connectors, editWorkflow } = useAppContext();
  const [title, setTitle] = useState(item.title || "");
  const [editTitle, setEditTitle] = useState(false);
  const [enabled, setEnabled] = useState(item.state === "on");
  const [width, setWidth] = useState(0);
  const inputEl = useRef<HTMLInputElement>(null);
  const titleEl = useRef<HTMLSpanElement>(null);

  const triggerIcon =
    connectors.find((t) => t.key === item.trigger.connector)?.icon || null;

  const triggerAppName =
    connectors.find((t) => t.key === item.trigger.connector)?.name || null;

  const actionsIcons = item.actions
    .map(
      (action: any) => connectors.find((a) => a.key === action.connector)?.icon
    )
    .filter((a: any) => a);

  const actionsAppName = item.actions
    .map(
      (action: any) => connectors.find((a) => a.key === action.connector)?.name
    )
    .filter((a: any) => a);

  const handleTitleClick = () => {
    setEditTitle(true);
  };

  const handleTitleBlur = () => {
    setEditTitle(false);
    if (title !== item.title) {
      const wf = { ...item, title };
      delete wf.signature;
      editWorkflow({
        ...wf,
        signature: JSON.stringify(wf),
      });
    }
  };

  const handleStateChange = () => {
    setEnabled(item.state === "on" ? false : true);
    const wf = { ...item, state: item.state === "off" ? "on" : "off" };
    delete wf.signature;
    editWorkflow({
      ...wf,
      signature: JSON.stringify(wf),
    });
  };

  useEffect(() => {
    if (editTitle && inputEl.current) {
      inputEl.current.select();
    }
  }, [editTitle]);

  useEffect(() => {
    if (titleEl.current) {
      setWidth(titleEl.current.offsetWidth - 22);
    }
  }, [title]);

  return (
    <DataBox
      key={item.key}
      size="small"
      LeftComponent={
        <ItemTitleWrapper>
          <ItemAppsWrapper>
            {triggerIcon && (
              <ItemAppWrapper>
                <ItemAppIcon
                  src={triggerIcon}
                  alt="trigger app icon"
                  title={triggerAppName || ""}
                />
              </ItemAppWrapper>
            )}

            {actionsIcons.length > 0 &&
              actionsIcons.map((icon: any, i2: number) => (
                <ItemAppWrapper key={item.key + i2}>
                  <ItemAppIcon
                    src={icon}
                    alt="action app icon"
                    title={actionsAppName[i2] || ""}
                  />
                </ItemAppWrapper>
              ))}
          </ItemAppsWrapper>

          <Title
            ref={titleEl}
            style={{
              position: !editTitle ? "relative" : "absolute",
              opacity: !editTitle ? 1 : 0,
            }}
            onClick={handleTitleClick}
          >
            {title}
          </Title>
          {editTitle && (
            <TitleInput
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value || "New workflow");
              }}
              onBlur={handleTitleBlur}
              ref={inputEl}
              style={{ width }}
            />
          )}
        </ItemTitleWrapper>
      }
      RightComponent={
        <ItemActionsWrapper>
          <SwitchInput value={enabled} onChange={handleStateChange} />
        </ItemActionsWrapper>
      }
    />
  );
};

export default WorkflowsPage;
