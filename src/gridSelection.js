import { Flex, Grid } from 'smbls';

export const GridCell = {

  props: (el, state) => ({
    isActive: state.isActive,
    backgroundColor: state.isActive ? '#3b82f6' : '#e9eff6',
    borderRadius: '4px',
    cursor: 'pointer',
    height: '26px',
    transition: 'background 0.15s',
    width: '26px',
  }),
  on: {
    click: (_event, element, state) => {
      const [rowClicked, colClicked] = state.key.split('-').map(Number)
      const newGridData = element.parent.state.gridData;

      let activeCount = 0;

      for (let r = 0; r < element.parent.state.rows; r++) {
        for (let c = 0; c < element.parent.state.cols; c++) {
          let active = r <= rowClicked - 1 && c <= colClicked - 1;
          if (active) activeCount++

          newGridData[r][c].isActive = r <= rowClicked - 1 && c <= colClicked - 1;
        }
      }
      state.root.update({
        selectedCoords: `${colClicked}, ${rowClicked}`,
        gridData: newGridData,
        totalSelected: activeCount,
      })
    }
  },
}

export const DynamicGrid = {
  extend: Grid,

  props: (_, state) => ({
    columns: `repeat(${state.cols}, 26px)`,
    rows: `repeat(${state.row}, 26px)`,
    gap: '4px',
  }),
  children: (el, state) => state.gridData.flat(),
  childrenAs: 'state',
  childExtends: GridCell,
  childProps: (el, state) => ({
    id: state.key,
  }),
}

export const GridContainer = {
  extend: Flex,

  props: {
    background: 'rgba(255, 255, 255, 1)',
    borderRadius: 'A',
    marginBlock: '26px',
    padding: '8px',
    width: 'fit-content',
  },
  DynamicGrid,
}

export const GridSelection = {
  define: {
    rows: param => parseInt(param),
    cols: param => parseInt(param),
  },
  props: {
    backgroundColor: '#E5E5E5',
    borderRadius: 'A',
    boxShadow: '0px 5px 35px -10px rgba(255, 0, 0, 0.35)',
    padding: 'B A',
    minWidth: '360px',
    width: 'fit-content',
  },
  state: (el) => ({
    cols: el.props.cols || 16,
    rows: el.props.rows || 8,
    gridData: Array.from({ length: el.props.rows }).map((_, rowIndex) =>
      Array.from({ length: el.props.cols }).map((_, colIndex) => {
        const cellKey = `${rowIndex + 1}-${colIndex + 1}`;
        return { key: cellKey, isActive: false }
      })
    ),
    selectedCoords: null,
    totalSelected: 0,
  }),
  Label: {
    text: 'Grid Selection',
    color: 'black',
    fontFamily: 'Europa',
    fontWeight: 'bold',
  },
  GridContainer,
  Box: {
    attr: { id: 'info-container'},
    props: {
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '.75em',
      width: '100%',
      display: 'flex'
    },
    Flex_1: {
      extends: Flex,
      attr: { id: 'selected-cords' },
      props: {
        width: 'auto',
      },
      Label: {
        props: {
          color: '#909090',
          fontFamily: 'Europa',
          fontSize: '.75em',
          text: 'Selection coordinates: '
        }
      },
      Text: {
        fontFamily: 'Europa',
        fontSize: '.75em',
        color: 'black',
        fontWeight: 'bold',
        marginInlineStart: '4px',
        text: (_, state) => state.root.selectedCoords || 'Empty',
      },
    },
    Flex_2: {
      extends: Flex,
      attr: { id: 'cells-selected' },
      props: {
        justifyContent: 'flex-end',
        width: 'auto',
      },
      Label: {
        props: {
          fontFamily: 'Europa',
          fontSize: '.75em',
          color: '#909090',
          text: 'Total cells selected: '
        }
      },
      Text: {
        fontFamily: 'Europa',
        fontSize: '.75em',
        color: 'black',
        fontWeight: 'bold',
        marginInlineStart: '4px',
        text: (_, state) => state.root.totalSelected | 0,
      }
    }
  },
}
