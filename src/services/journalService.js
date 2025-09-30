const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/journal`

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        })
        return res.json()
    } catch (err) {
        console.log(err)
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
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'},
            body: JSON.stringify(journalFormData)
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

const deleteJournal = async (hootId) => {
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

export {
    index,
    show,
    create,
    deleteJournal,
}