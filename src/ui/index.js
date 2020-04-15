const { createTab } = require('./tabs');

const addTabButton = document.getElementById('add-tab-button');

(async () => {
  addTabButton.onclick = () => {
    createTab();
  };

  createTab();
})();