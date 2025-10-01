const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/journal`

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.err || 'Failed to fetch journals')
        return Array.isArray(data) ? data: []
    } catch (err) {
        console.log(err)
        return []
    }
}

const show = async (journalId) => {
    try {
        const res = await fetch(`${BASE_URL}/${journalId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

const create = async (journalFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/new`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'},
            body: JSON.stringify(journalFormData)
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.err || 'Failed to create journal')
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

const deleteJournal = async (journalId) => {
  try {
    const res = await fetch(`${BASE_URL}/${journalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

async function update(journalId, journalFormData) {
  try {
    const res = await fetch(`${BASE_URL}/${journalId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(journalFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export {
    index,
    show,
    create,
    deleteJournal,
    update 
}