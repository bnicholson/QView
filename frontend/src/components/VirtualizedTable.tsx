import React from 'react';
import MuiTableCell from '@mui/material/TableCell';
import {
  AutoSizer,
  Column,
  Index,
  Table,
  TableCellRenderer,
  TableHeaderProps
} from 'react-virtualized';
import { TableContainer, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';

const TableCell: React.FC = ({ children }) => {
  return (
    <MuiTableCell
      component="div"
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        cursor: 'initial',
        height: ROW_HEIGHT
      }}
      variant="body"
    >
      {children}
    </MuiTableCell>
  );
};

const ROW_HEIGHT = 48;
const NUMBER_OF_ROWS = 2;

const VirtualizedTable: React.FC = () => {
  const [rows, setRows] = React.useState<any[]>(() =>
    Array.apply(null, Array(NUMBER_OF_ROWS)).map((_elem, i) => ({
      id: `id-${i}`,
      col1: `col1 row${i}`,
      col2: `col2 row${i}`
    }))
  );

  const startEdit = (rowId: string) => {
    const newRows = rows.map((row) => (row.id === rowId ? { ...row, isEdit: true } : { ...row }));
    setRows(newRows);
  };

  const handleEditCell = (e: any, rowId: string, dataKey: string) => {
    const newRows = rows.map((row) =>
      row.id === rowId ? { ...row, [dataKey]: e.target.value } : { ...row }
    );
    setRows(newRows);
  };

  const simpleCellRenderer: TableCellRenderer = ({ dataKey, cellData, rowData }) => {
    return (
      <TableCell>
        {dataKey === 'actions' ? (
          <Edit sx={{ cursor: 'pointer' }} onClick={() => startEdit(rowData.id)} />
        ) : (
          cellData
        )}
      </TableCell>
    );
  };

  const editableCellRenderer: TableCellRenderer = ({ dataKey, cellData, rowData }) => {
    return (
      <TableCell>
        {rowData.isEdit ? (
          <TextField
            size="small"
            variant="standard"
            InputProps={{ disableUnderline: true, style: { fontSize: 'inherit' } }}
            value={cellData}
            onChange={(e) => handleEditCell(e, rowData.id, dataKey)}
          />
        ) : (
          cellData
        )}
      </TableCell>
    );
  };

  const columns = [
    {
      dataKey: 'id',
      label: 'ID',
      width: 90,
      cellRenderer: simpleCellRenderer
    },
    {
      dataKey: 'col1',
      label: 'Col 1',
      width: 100,
      cellRenderer: editableCellRenderer
    },
    {
      dataKey: 'col2',
      label: 'Col 2',
      width: 100,
      cellRenderer: editableCellRenderer
    },
    {
      dataKey: 'actions',
      label: 'Actions',
      width: 100,
      cellRenderer: simpleCellRenderer
    }
  ];

  const headerRenderer = ({ label }: TableHeaderProps) => <TableCell>{label}</TableCell>;

  const getRowStyles = ({ index }: Index): React.CSSProperties => {
    const isEdit = Boolean(rows[index]?.isEdit);

    return {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      boxShadow: isEdit
        ? '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
        : 'none'
    };
  };

  return (
    <TableContainer sx={{ height: '90vh' }}>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={ROW_HEIGHT!}
            headerHeight={ROW_HEIGHT!}
            rowClassName="row"
            rowStyle={getRowStyles}
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
          >
            {columns.map(({ dataKey, cellRenderer, ...other }) => {
              return (
                <Column
                  style={{ display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}
                  key={dataKey}
                  headerRenderer={headerRenderer}
                  cellRenderer={cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    </TableContainer>
  );
};

export default VirtualizedTable;