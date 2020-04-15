const { ipcRenderer } = require('electron');

const tabbarElement = document.getElementById("tabbar");
const addTabButton = document.getElementById("add-tab-button");

const tabs = [];
let nextTabId = 1;
let selectedTabId = -1;

const getTabById = (id) => tabs.find((x) => x.id === id);

const getSelectedTab = () => {
  return getTabById(selectedTabId);
};

const selectTab = (id) => {
  const currentTab = getSelectedTab();

  if (currentTab) {
    currentTab.tabElement.classList.remove("selected");
  }

  selectedTabId = id;

  const tab = getSelectedTab();

  if (tab) {
    tab.tabElement.classList.add("selected");
  }
};

const createElement = (name, props = null, ...children) => {
  const element = document.createElement(name);

  for (const child of children) {
    if (typeof child === "string" || typeof child === "number") {
      const text = document.createTextNode(child.toString());
      element.appendChild(text);
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (child instanceof Array) {
      for (const c of child) {
        if (typeof c === "string" || typeof c === "number") {
          element.textContent = c.toString();
        } else {
          element.appendChild(c);
        }
      }
    }
  }

  if (props) {
    for (const key in props) {
      if (key.startsWith("on")) {
        element[key.toLowerCase()] = props[key];
      } else {
        element.setAttribute(key, props[key]);
      }
    }
  }

  return element;
};

const addTabElement = (id, title) => {
  const tabElement = createElement(
    "div",
    { class: "tab", id: `tab-${id}` },
    createElement("div", { class: "tab-title" }, title),
    createElement("div", {
      class: "tab-close close-icon",
      onmousedown: (e) => e.stopPropagation(),
      onclick: () => closeTab(id),
    })
  );

  tabbarElement.insertBefore(tabElement, addTabButton);

  tabElement.onmousedown = () => {
    selectTab(id);
  };

  return tabElement;
};

const closeTab = (id) => {
  const tab = getTabById(id);
  const index = tabs.findIndex(x => x.id === id);
  let newIndex = index + 1;

  if (index + 1 < tabs.length) {
    newIndex = index + 1;
  } else if (index - 1 > 0) {
    newIndex = index - 1;
  } else if (tabs.length > 1) {
    newIndex = 0;
  } else {
    ipcRenderer.send('close-window');
  }

  selectTab(tabs[newIndex].id);

  tabs.splice(index, 1);
  tab.tabElement.remove();
};

const createTab = () => {
  const id = nextTabId++;
  const title = "New tab";

  const tabElement = addTabElement(id, title);

  const tab = {
    id,
    tabElement,
    title,
  };

  tabs.push(tab);

  selectTab(id);
};

module.exports = {
  createTab,
};
