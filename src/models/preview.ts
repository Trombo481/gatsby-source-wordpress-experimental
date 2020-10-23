// `node` here is a Gatsby node
type OnPageCreatedCallback = (node: any) => void

interface IPreviewState {
  nodePageCreatedCallbacks: {
    [nodeId: string]: OnPageCreatedCallback
  }
  nodeIdsToCreatedPages: {
    [nodeId: string]: {
      // gatsby node page type
      page: any
    }
  }
  pagePathToNodeDependencyId: {
    [pageId: string]: {
      nodeId: string
    }
  }
}

type PreviewReducers = {
  subscribeToPagesCreatedFromNodeById: (
    state: IPreviewState,
    payload: {
      nodeId: string
      onPageCreatedCallback: OnPageCreatedCallback
      modified: string
    }
  ) => IPreviewState
  unSubscribeToPagesCreatedFromNodeById: (
    state: IPreviewState,
    payload: {
      nodeId: string
    }
  ) => IPreviewState
  saveNodePageState: (
    state: IPreviewState,
    payload: { nodeId: string; page: any }
  ) => IPreviewState
}

interface IPreviewStore {
  state: IPreviewState
  reducers: PreviewReducers
}

const previewStore: IPreviewStore = {
  state: {
    nodePageCreatedCallbacks: {},
    nodeIdsToCreatedPages: {},
    pagePathToNodeDependencyId: {},
  },

  reducers: {
    unSubscribeToPagesCreatedFromNodeById(state, { nodeId }) {
      if (state.nodePageCreatedCallbacks?.[nodeId]) {
        delete state.nodePageCreatedCallbacks[nodeId]
      }

      return state
    },

    subscribeToPagesCreatedFromNodeById(
      state,
      { nodeId, onPageCreatedCallback }
    ) {
      // save the callback for this nodeId
      // when a page is created from a node that has this id,
      // the callback will be invoked
      state.nodePageCreatedCallbacks[nodeId] = onPageCreatedCallback

      return state
    },

    saveNodePageState(state, { page, nodeId }) {
      state.nodeIdsToCreatedPages[nodeId] = {
        page,
      }

      state.pagePathToNodeDependencyId[page.path] = {
        nodeId,
      }

      return state
    },
  },
}

export default previewStore
