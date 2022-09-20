import React, { useEffect, useState } from 'react'

const TournamentAPI = {
    all: async () =>
        await (await fetch(`/api/tournaments`)).json(),
    create: async (formData: FormData) =>
        await fetch('/api/tournaments', {
            method: 'POST',
            body: formData,
        }),
    delete: async (id: number) =>
        await fetch(`/api/tournaments/${id}`, { method: 'DELETE' })
}

export const TournamentPage = () => {
    const [files, setFiles] = useState<FileInfo[]>([])
    const [processing, setProcessing] = useState<boolean>(false)

    const createFile = async (form: FormData) => {
        setProcessing(true)
        await TournamentAPI.create(form)
        setFiles(await TournamentAPI.all())
        const el = document.getElementById("file")! as HTMLInputElement
        el.value = ''
        setProcessing(false)
    }

    const deleteFile = async (file: FileInfo) => {
        setProcessing(true)
        await TournamentAPI.delete(file.id)
        setFiles(await TournamentAPI.all())
        setProcessing(false)
    }

    useEffect(() => {
        setProcessing(true)
        TournamentAPI.all().then((files) => {
            setFiles(files)
            setProcessing(false)
        })
    }, [])

    return (
        <div><h3 color="black">Boo tournament hoo</h3></div>
    )
}

/*
        <div style={{ display: 'flex', flexFlow: 'column', textAlign: 'left' }}>
            <h1>Files</h1>
            {files.map((file, index) =>
                (
                    <div className="Form">
                        <div style={{ flex: 1 }}>
                            #{index + 1}. {file.name} ({file.url})
                        </div>
                        <div>
                            <a href={file.url} className="App-link">
                                download
                            </a>
                            &nbsp;
                            <a href="#" className="App-link" onClick={() => deleteFile(file)}>
                                delete
                            </a>
                        </div>
                    </div>
                )
            )}
            {files.length === 0 && "No files, upload some!"}

            <div className="Form">
                <div style={{ display: 'flex' }}>
                    <input
                        style={{ flex: 1 }}
                        id="file"
                        type="file"
                        placeholder="New todo..."
                        multiple={false}
                    />
                    <button
                        disabled={processing}
                        style={{ height: '40px' }}
                        onClick={() => {
                            const form = new FormData()
                            const el = document.getElementById("file")! as HTMLInputElement
                            form.append("file", el.files![0])
                            createFile(form)
                        }}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    )
}*/