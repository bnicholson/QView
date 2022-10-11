import React, { useEffect, useState } from 'react'

const ScoreeventsAPI = {
  get: async (page: number, size: number) =>
    await (await fetch(`/api/scoreevents`)).json(),
  create: async (tournament: string) =>
    await (
      await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: tournament }),
      })
    ).json(),
  delete: async (id: number) =>
    await fetch(`/api/tournaments/${id}`, { method: 'DELETE' }),
  update: async (id: number, tournament: string) =>
    await fetch(`/api/tournaments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: tournament }),
    }),
}

export const Tournaments = () => {
  const [text, setText] = useState<string>('')
  const [selectedTournament, editTournament] = useState<Tournament | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const pageSize = 5
  const [page, setPage] = useState<number>(0)
  const [numPages, setPages] = useState<number>(1)
  const [processing, setProcessing] = useState<boolean>(false)

  const createTournament = async (tournament: string) => {
    setProcessing(true)
    await TournamentAPI.create(tournament)
    setTournaments(await TournamentAPI.get(page, pageSize))
    setText('')
    setProcessing(false)
  }

  const updateTournament = async (tournament: Tournament) => {
    setProcessing(true)
    await TournamentAPI.update(tournament.id, text)
    setTournaments(await TournamentAPI.get(page, pageSize))
    setText('')
    editTournament(null)
    setProcessing(false)
  }

  const deleteTournament = async (tournament: Tournament) => {
    setProcessing(true)
    await TournamentAPI.delete(tournament.id)
    setTournaments(await TournamentAPI.get(page, pageSize))
    setProcessing(false)
  }

  useEffect(() => {
    setText(selectedTournament?.tournament || '')
  }, [selectedTournament])

  useEffect(() => {
    setProcessing(true)
    TournamentAPI.get(page, pageSize).then((tournaments) => {
      setTournaments(tournaments)
      setProcessing(false)
    })
  }, [page])

  useEffect(() => {
    const numPages = Math.ceil(tournaments.length / pageSize)
    setPages(numPages)
    if (page < 0 || page > numPages) setPage(0)
  }, [tournaments, page])

  return (
    <div style={{ display: 'flex', flexFlow: 'column', textAlign: 'left' }}>
      <h1>Tournaments</h1>
      {tournaments.map((tournament, index) =>
        tournament.id === selectedTournament?.id ? (
          <div className="Form">
            <div style={{ display: 'flex' }}>
              <input
                style={{ flex: 1 }}
                value={tournament.organization + tournament.tournament + tournament.fromdate}
                onChange={(e) => setText(e.target.value)}
              />
              <input>
                {tournament.organization + tournament.tournament + tournament.fromdate}
              </input>
              <button
                disabled={processing}
                style={{ height: '40px' }}
                onClick={() => updateTournament(tournament)}
              >
                Save
              </button>
              <button
                disabled={processing}
                style={{ height: '40px' }}
                onClick={() => editTournament(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="Form">
            <div style={{ flex: 1 }}>
              ID: {tournament.id} Org: {tournament.organization} Tournament: {tournament.tournament} 
              Dates: {tournament.fromdate} - {tournament.todate} 
              At: {tournament.venue} {tournament.city},{tournament.region},{tournament.country}
              Contacts: {tournament.contact} {tournament.contactemail} 
              Hide: {tournament.hide}
              More Info: {tournament.info}
            </div>
            <div>
              <a href="#" className="App-link" onClick={() => editTournament(tournament)}>
                edit
              </a>
              &nbsp;
              <a href="#" className="App-link" onClick={() => deleteTournament(tournament)}>
                delete
              </a>
            </div>
          </div>
        )
      )}
      {selectedTournament === null && (
        <div className="Form">
          <div style={{ display: 'flex' }}>
            <input
              style={{ flex: 1 }}
              placeholder="New tournament..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createTournament(text)
                }
              }}
            />
            <button
              disabled={processing}
              style={{ height: '40px' }}
              onClick={() => createTournament(text)}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="Form">
        <div style={{ display: 'flex' }}>
          <button onClick={() => setPage(page - 1)}>{`<<`}</button>
          <span style={{ flex: 1, textAlign: 'center' }}>
            Page {page + 1} of {numPages}
          </span>
          <button
            disabled={processing}
            onClick={() => setPage(page + 1)}
          >{`>>`}</button>
        </div>
      </div>
    </div>
  )
}
