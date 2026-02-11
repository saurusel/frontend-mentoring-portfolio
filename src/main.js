import "./styles/app.css";
import { createRenderer } from "./app/render";
import { createActions } from "./app/actions";
import { createEventRegistrar } from "./app/events";

const appElement = document.querySelector("#app");

const state = {
    tasks: [],
    filterMode: "all",
    searchQuery: "",
    pendingDeletes: [],
    stats: {
        addedAllTime: 0,
        deletedAllTime: 0,
    },
    modal: {
        isOpen: false,
        mode: "create",
        editingId: null,
        value: "",
    },
};

const renderApp = createRenderer({ appElement, state });
const actions = createActions({ state, renderApp });
const registerEventListeners = createEventRegistrar({
    appElement,
    state,
    renderApp,
    actions,
});

actions.initApp();
registerEventListeners();