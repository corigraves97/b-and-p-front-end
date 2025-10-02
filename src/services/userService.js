const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const index = async () => {
  try {
    const token = localStorage.getItem('token'); // 👈 grab token
    
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`, // 👈 attach token
      },
    });

    const data = await res.json();
    console.log(data, '<<< data in userService index');

    
    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || err);
  }
};



export {
  index,
  
}