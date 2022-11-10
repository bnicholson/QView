import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { Breadcrumbs, Link } from '@mui/material'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column_rip {
  id: 'tournament' | 'division' | 'room' | 'round' | 'question' | 'team1' | 'score1' | 'team2' | 'score2' | 'team3' | 'score3' ;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns_rip: readonly Column_rip[] = [

  { id: 'division', label: 'Division', minWidth: 100 },
  { id: 'room', label: 'Room',  minWidth: 100 },
  { id: 'round', label: 'Round', minWidth: 100 },
  {
    id: 'question',
    label: 'Question',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'team1', label: 'Team #1', minWidth: 100 },
  {
    id: 'score1',
    label: 'Score',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'team2', label: 'Team #2', minWidth: 100 },
  {
    id: 'score2',
    label: 'Score',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
  { id: 'team3', label: 'Team #3', minWidth: 100 },
  { 
    id: 'score3',
    label: 'Score',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

interface Data_rip {
  tournament: string;
  division: string;
  room: string;
  round: string;
  question: number;
  team1: string;
  score1: number;
  team2: string;
  score2: number;
  team3: string;
  score3: number;
}

var rownum = 0;

function createData_rip(
  tournament: string,
  division: string,
  room: string,
  round: string,
  question: number,
  team1: string,
  score1: number,
  team2: string,
  score2: number,
  team3: string,
  score3: number,
): Data_rip {
  return { tournament, division, room, round, question, team1, score1, team2, score2, team3, score3 };
}

const rows_rip = [
  createData_rip('Q2022', 'District Novice', "Jester 102", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 103", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 104", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 105", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 106", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 107", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 108", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 109", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 110", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 111", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),

  createData_rip('Q2022', 'District Novice', "Jester 112", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 113", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 114", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 115", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 116", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 117", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 118", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 119", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 120", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),
  createData_rip('Q2022', 'District Novice', "Jester 121", "Tue-07b", 3, "Team #1", 120, "Team #2", 180, "Team #3", 20),  
];

export const RoundsInProgress = () => {
  const navigate = useNavigate();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box>
        <Breadcrumbs aria-label="breadcrumb" >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/t/q2022">
            Q2022
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/t/q2022/district%20novice"
          >
            District Novice
          </Link>
          <Typography color="text.primary" onClick={() => navigate("/tdeditor")} >Teams</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h5">Rounds In Progress</Typography>
      {RoundsInProgressTable()}
    </div >
  )
}

export const RoundsInProgressTable = () => {  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns_rip.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows_rip
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns_rip.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, 500]}
        component="div"
        count={rows_rip.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
