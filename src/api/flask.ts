export const flask_POST = async (data : string)=>{
  try {
    const response = await fetch('http://localhost:5000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Returned ",data);
      return data;
    }
    else {
      const error = await response.text();
      // FLASK RETURNS AN ERROR FROM THE FUNCTION BUT STILL RETURNS DATA
      console.error("Returned ",error);
      throw new Error('Failed');
    }
  } catch(error) {
    console.error("Error",error);
    throw error;
  }
};

