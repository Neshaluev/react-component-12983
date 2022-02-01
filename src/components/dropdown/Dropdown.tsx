//@ts-nocheck
import React from "react";
import keyboardKey from "keyboard-key";
import cn from "classnames";

import DropdownItem from "./DropdownItem";
import DropdownMenu from "./DropdownMenu";
import DropdownText from "./DropdownText";
import DropdownSearchInput from "./DropdownSearchInput";
import DropdownLabel from "./DropdownLabel";

import { getMenuOptions } from "./utils/getMenuOptions";

import "./dropdown.style.scss";

export const Dropdown = (props: any) => {
  let searchRef = React.useRef();
  let sizerRef = React.useRef();
  let dropdownRef = React.useRef();

  const [state, setState] = React.useState({
    selectedLabel: null,
    value: null,
    searchQuery: "",
    minCharacters: 1,
    selectedIndex: -1,
    open: false,
    upward: false,
    labels: [],
  });

  const setOpenDirection = () => {
    let menu = dropdownRef?.current?.querySelector(
      ".dropdown-menu.dropdown-menu-visible"
    );

    if (!menu) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const menuHeight = menu.clientHeight;

    const spaceAtTheBottom =
      document.documentElement.clientHeight -
      dropdownRect.top -
      dropdownRect.height -
      menuHeight;
    const spaceAtTheTop = dropdownRect.top - menuHeight;

    const upward = spaceAtTheBottom < 0 && spaceAtTheTop > spaceAtTheBottom;

    if (!upward !== !state.upward) {
      setState({ ...state, upward });
    }
  };
  const closeOnDocumentClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      close();
    }
  };
  React.useEffect(() => {
    setOpenDirection();

    document.addEventListener("mousedown", closeOnDocumentClick);
    return () =>
      document.removeEventListener("mousedown", closeOnDocumentClick);
  }, [props, state]);

  const open = (e = null, triggerSetState = true) => {
    const { disabled, search } = props;

    if (disabled) return;

    if (triggerSetState) {
      setState((prevState) => ({ ...prevState, open: true }));
    }
  };

  const close = (e) => {
    const { open } = state;
    if (open) {
      setState((prevState) => ({ ...prevState, open: false }));
    }
  };
  const toggle = (e) => (state.open ? close(e) : open(e));

  const handleClick = (e) => {
    const { search } = props;
    const { searchQuery, minCharacters } = state;

    e.stopPropagation();

    if (!search) return toggle(e);

    if ((!open && searchQuery.length >= minCharacters) || minCharacters === 1) {
      open(e);
      return;
    }
  };
  const clearSearchQuery = () => {
    const { searchQuery } = state;
    if (searchQuery === undefined || searchQuery === "") return;
    setState((prev) => ({ ...prev, searchQuery: "" }));
  };
  const hasLabelValue = (data: any, item) => {
    return item.value in Object.values(data);
  };
  const handleItemClick = (e: any, item: any) => {
    const { multiple, search } = props;
    const { value: currentValue } = state;
    const { value } = { ...item };
    e.stopPropagation();

    let newValue = multiple ? item : value;
    let valueHasChanged = multiple
      ? !hasLabelValue(props.options, newValue)
      : newValue !== currentValue;

    if (valueHasChanged) {
      if (multiple) {
        setState((prev) => {
          return {
            ...prev,
            value: newValue.value,
            labels: [...prev.labels, newValue],
          };
        });
      } else {
        setState((prev) => ({ ...prev, value: newValue }));
      }
    }

    clearSearchQuery();

    if (multiple) return;

    close();
  };
  const handleSearchChange = (e, value) => {
    e.stopPropagation();

    const { open: openMenu, minCharacters, searchQuery } = state;
    const newQuery = value;

    setState({ ...state, searchQuery: newQuery, selectedIndex: 0 });

    if (!openMenu && newQuery.length >= minCharacters) {
      open();
      return;
    }

    if (openMenu && minCharacters !== 1 && newQuery.length < minCharacters)
      this.close();
  };

  const computeSearchInputTabIndex = () => {
    const { disabled, tabIndex } = props;

    if (tabIndex) return tabIndex;

    return disabled ? -1 : 0;
  };

  const handleDeleteLabels = (item) => {
    const { labels } = state;
    const filtredLabels = labels.filter((l) => l.value != item.value);
    setState((prev) => ({
      ...prev,
      labels: filtredLabels,
    }));
  };

  const hasValueFn = () => {
    const { value } = state;

    return value != null && value !== "";
  };

  const getItemByValue = (value) => {
    const { options } = props;

    return options.find((opt) => opt.value === value);
  };

  const getSelectedItem = (selectedIndex) => {
    const options = getMenuOptions({
      options: props.options,
      value: state.value,
      searchQuery: state.searchQuery,
      labels: state.labels,

      multiple: props.multiple,
      search: props.search,
    });

    return options.find((item, idx) => idx === selectedIndex);
  };

  const makeSelectedItemActive = (e, selectedIndex) => {
    const item = getSelectedItem(selectedIndex);
    if (!item) return;

    let newValue = item.value;

    if (true) {
      setState((prev) => ({ ...prev, value: newValue }));
    }
  };

  const moveSelectionOnKeyDown = (e) => {
    const moves = {
      [keyboardKey.ArrowDown]: 1,
      [keyboardKey.ArrowUp]: -1,
    };

    const move = moves[keyboardKey.getCode(e)];

    if (move === undefined) return;

    e.preventDefault();

    const nextIndex = getSelectedIndexAfterMove(move);

    makeSelectedItemActive(e, nextIndex);
    setState((prev) => ({ ...prev, selectedIndex: nextIndex }));
  };

  const getSelectedIndexAfterMove = (
    offset,
    startIndex = state.selectedIndex
  ) => {
    const options = getMenuOptions({
      options: props.options,
      value: state.value,
      searchQuery: state.searchQuery,
      labels: state.labels,

      multiple: props.multiple,
      search: props.search,
    });

    const lastIndex = options.length - 1;
    const { wrapSelection } = props;
    let nextIndex = startIndex + offset;

    if (!wrapSelection && (nextIndex > lastIndex || nextIndex < 0)) {
      nextIndex = startIndex;
    } else if (nextIndex > lastIndex) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = lastIndex;
    }

    return nextIndex;
  };
  const handleKeyDown = (e) => {
    moveSelectionOnKeyDown(e);
  };

  function renderItemContent(item) {
    const { flag, image, text } = item;

    return (
      <>
        {/* {Flag}
          {Image} */}
        {text}
      </>
    );
  }
  const renderText = () => {
    const { placeholder, search, text } = props;
    const { searchQuery, value } = state;

    let hasValue = hasValueFn();
    let _text = placeholder;
    let selectedItem;

    if (text) {
      _text = text;
    }

    if (hasValue) {
      selectedItem = getItemByValue(value);
    }

    const prefixCls = "driver-text";
    const classess = cn(prefixCls, {
      ["default"]: placeholder && !hasValue,
      ["filtred"]: search && searchQuery,
    });
    return (
      <DropdownText
        content={selectedItem ? renderItemContent(selectedItem) : _text}
        className={classess}
      />
    );
  };

  const renderSearchSizer = () => {
    const { search, multiple } = props;

    return search && multiple && <span className="sizer" ref={sizerRef} />;
  };

  const renderLebels = () => {
    const { labels } = state;

    if (labels.length === 0) return;

    return (
      <>
        <div className="list-labels">
          {labels.map((l) => (
            <DropdownLabel item={l} handleDeleteLabels={handleDeleteLabels} />
          ))}
        </div>
      </>
    );
  };

  const renderSearchInput = () => {
    const { search } = props;
    const { searchQuery } = state;

    const searchProps = search
      ? {
          tabIndex: computeSearchInputTabIndex,
          ref: searchRef,
          value: searchQuery,
          onChange: handleSearchChange,
        }
      : {
          readonly: "readonly",
        };

    return <DropdownSearchInput {...searchProps} />;
  };

  const renderOptions = () => {
    const { multiple, search, noResultsMessage } = props;
    const { value, labels } = state;
    const options = getMenuOptions({
      options: props.options,
      value: state.value,
      searchQuery: state.searchQuery,
      labels: state.labels,

      multiple: props.multiple,
      search: props.search,
    });

    if (noResultsMessage !== null && search && options.length === 0) {
      if (multiple && props.options.length === labels.length) return;

      return <div className="message">{noResultsMessage}</div>;
    }

    const isActive = (optValue: string) => optValue === value;

    return options.map((opt, i) => (
      <DropdownItem
        onClick={handleItemClick}
        {...opt}
        active={isActive(opt.value)}
        key={`${opt.value}-${i}`}
      />
    ));
  };
  const renderMenu = () => {
    const { multiple } = props;
    const { open, upward } = state;
    return (
      <DropdownMenu open={open} upward={upward} multiple={multiple}>
        {renderOptions()}
      </DropdownMenu>
    );
  };

  // dropdown
  const { className } = props;

  const prefixCls = "dropdown";
  const classess = cn(
    prefixCls,
    {
      [`${prefixCls}-open`]: state.open,
    },
    className
  );

  return (
    <div
      className={classess}
      ref={dropdownRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {renderLebels()}
      <div className="dropdown-content">
        {renderSearchInput()}
        {renderSearchSizer()}
        {renderText()}
      </div>
      {renderMenu()}
    </div>
  );
};

export const DropdownSandox = () => {
  const options = [
    {
      key: "Jenny Hess",
      text: "Jenny Hess",
      value: "Jenny Hess",
      image: { avatar: true, src: "/images/avatar/small/jenny.jpg" },
    },
    {
      key: "Elliot Fu",
      text: "Elliot Fu",
      value: "Elliot Fu",
      image: { avatar: true, src: "/images/avatar/small/elliot.jpg" },
    },
    {
      key: "Stevie Feliciano",
      text: "Stevie Feliciano",
      value: "Stevie Feliciano",
      image: { avatar: true, src: "/images/avatar/small/stevie.jpg" },
    },
    {
      key: "Christian",
      text: "Christian",
      value: "Christian",
      image: { avatar: true, src: "/images/avatar/small/christian.jpg" },
    },
    {
      key: "Matt",
      text: "Matt",
      value: "Matt",
      image: { avatar: true, src: "/images/avatar/small/matt.jpg" },
    },
    {
      key: "Justen Kitsune",
      text: "Justen Kitsune",
      value: "Justen Kitsune",
      image: { avatar: true, src: "/images/avatar/small/justen.jpg" },
    },
  ];

  return (
    <>
      <h3>Drop down</h3>
      <div className="block">
        <Dropdown
          placeholder={"Placeholder Select Filed"}
          options={options}
          selection
        />
      </div>
      <div className="block">
        <Dropdown
          placeholder={"Search Filed"}
          options={options}
          selection
          search
        />
      </div>
      <div className="block" style={{ width: "400px" }}>
        <Dropdown
          placeholder={"Multiple Search  Filed"}
          options={options}
          selection
          multiple
          search
        />
      </div>
    </>
  );
};

export default Dropdown;
