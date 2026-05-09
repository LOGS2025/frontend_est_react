export const flask_POST = async (data : string)=>{
  try {
    const response = await fetch('https://flaskbackendestwebpage-production.up.railway.app/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Returned ", responseData);
      return responseData;
    }
    else {
      const error = await response.text();
      console.error("Returned error:", error);
      throw new Error(`Request failed: ${response.status}`);
    }
  } catch(error) {
    console.error("Network error:", error);
    throw error;
  }
};

